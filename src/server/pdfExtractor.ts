import { PDFDocument } from 'pdf-lib';
import { GoogleGenAI, Type } from '@google/genai';
import { ExtractedQuestion, QuestionStatus } from '../types/pdfImport';

// Maximum allowed PDF file size (50MB)
export const MAX_PDF_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const DEFAULT_CHUNK_SIZE_PAGES = 4; // 4 pages per AI chunk for optimal speed and reliability

/**
 * Validates that buffer starts with '%PDF-' magic bytes
 */
export function validatePdfMagicBytes(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 5) return false;
  const header = String.fromCharCode(buffer[0], buffer[1], buffer[2], buffer[3], buffer[4]);
  return header.startsWith('%PDF');
}

/**
 * Inspects a PDF buffer: checks validity, magic bytes, and retrieves page count
 */
export async function inspectPdf(buffer: Buffer | Uint8Array): Promise<{
  isValid: boolean;
  pageCount: number;
  fileSizeBytes: number;
  error?: string;
}> {
  const fileSizeBytes = buffer.length;

  if (fileSizeBytes > MAX_PDF_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes,
      error: `File size exceeds maximum permitted limit (${(MAX_PDF_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB).`,
    };
  }

  if (!validatePdfMagicBytes(buffer)) {
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes,
      error: 'Invalid file signature. The uploaded file is not a valid PDF document.',
    };
  }

  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      return {
        isValid: false,
        pageCount: 0,
        fileSizeBytes,
        error: 'The PDF document contains no pages.',
      };
    }

    return {
      isValid: true,
      pageCount,
      fileSizeBytes,
    };
  } catch (err: any) {
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes,
      error: `Corrupt or unreadable PDF document: ${err.message || 'Parser failure'}`,
    };
  }
}

/**
 * Slices a range of pages from a PDF and returns a new PDF buffer
 */
export async function slicePdfPages(
  sourceBuffer: Buffer | Uint8Array,
  startPage: number, // 1-indexed
  endPage: number // 1-indexed inclusive
): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const totalPages = sourceDoc.getPageCount();

  const safeStart = Math.max(1, startPage);
  const safeEnd = Math.min(totalPages, endPage);

  const subDoc = await PDFDocument.create();
  const pageIndices: number[] = [];
  for (let i = safeStart - 1; i < safeEnd; i++) {
    pageIndices.push(i);
  }

  const copiedPages = await subDoc.copyPages(sourceDoc, pageIndices);
  copiedPages.forEach((page) => subDoc.addPage(page));

  return await subDoc.save();
}

/**
 * Normalizes question answer label into 0, 1, 2, 3
 */
export function normalizeAnswer(
  rawAnswer: string | number | undefined,
  options: [string, string, string, string]
): { index: number; label: string; isValid: boolean; reason?: string } {
  if (rawAnswer === undefined || rawAnswer === null || rawAnswer === '') {
    return { index: -1, label: '?', isValid: false, reason: 'Answer key is missing from source.' };
  }

  const str = String(rawAnswer).trim();
  const upper = str.toUpperCase();

  // Check direct label matches
  if (upper === 'A' || upper === '(A)' || upper === 'OPTION A' || upper === '1' || upper === '(1)') {
    return { index: 0, label: 'A', isValid: true };
  }
  if (upper === 'B' || upper === '(B)' || upper === 'OPTION B' || upper === '2' || upper === '(2)') {
    return { index: 1, label: 'B', isValid: true };
  }
  if (upper === 'C' || upper === '(C)' || upper === 'OPTION C' || upper === '3' || upper === '(3)') {
    return { index: 2, label: 'C', isValid: true };
  }
  if (upper === 'D' || upper === '(D)' || upper === 'OPTION D' || upper === '4' || upper === '(4)') {
    return { index: 3, label: 'D', isValid: true };
  }

  // Check if string is 0, 1, 2, 3 as zero-indexed
  if (str === '0') return { index: 0, label: 'A', isValid: true };
  if (str === '1') return { index: 0, label: 'A', isValid: true }; // Usually 1 is Option A

  // Try matching text of options
  const cleanAns = upper.replace(/^[A-D1-4][.:)\s]+/, '').trim();
  for (let i = 0; i < options.length; i++) {
    const optClean = options[i].toUpperCase().replace(/^[A-D1-4][.:)\s]+/, '').trim();
    if (optClean && (optClean === cleanAns || cleanAns.includes(optClean) || optClean.includes(cleanAns))) {
      const labels = ['A', 'B', 'C', 'D'];
      return { index: i, label: labels[i], isValid: true };
    }
  }

  return {
    index: -1,
    label: str.substring(0, 10),
    isValid: false,
    reason: `Unrecognized or ambiguous answer key: "${str}". Please verify which option is correct.`,
  };
}

/**
 * Cleans option strings by stripping leading labels like "A.", "b)", "(1) ", etc.
 */
export function cleanOptionText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^[\(\[]?[A-Da-d1-4][\)\]\.\:\-]\s*/, '')
    .trim();
}

/**
 * Normalizes question text for duplicate comparison
 */
export function normalizeTextForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calls Gemini to extract MCQs from a chunk of PDF pages
 */
export async function extractMcqsFromPdfChunk(
  chunkBuffer: Buffer | Uint8Array,
  startPage: number,
  endPage: number,
  apiKey?: string
): Promise<ExtractedQuestion[]> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check your environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const base64Pdf = Buffer.from(chunkBuffer).toString('base64');

  const systemPrompt = `You are a specialized examination and quiz data extractor.
Your task is to thoroughly analyze the provided PDF pages (pages ${startPage} to ${endPage} of the document) and extract every Multiple Choice Question (MCQ).

REQUIREMENTS:
1. Extract EVERY multiple choice question found on these pages.
2. For each question:
   - "questionNumber": integer (use the printed question number if available; otherwise use sequential numbering starting from ${startPage * 10}).
   - "text": the complete, unabridged question text or problem statement. Include all mathematical expressions, Hindi or English text, chemical formulas, and tables verbatim. Strip option choices from this text.
   - "options": exactly 4 strings [Option A, Option B, Option C, Option D]. Remove prefixes like "A.", "B.", "(A)", "1." from the option text.
   - "correctAnswer": the correct answer explicitly provided in the document (such as beside the question, in an answer key box, highlighted, or in an explanation). Provide "A", "B", "C", or "D". If no answer key is given or it is ambiguous, output "". DO NOT GUESS.
   - "explanation": the explanation, derivation, or rationalization if present in the document. If none, output "".
   - "sourcePage": the actual page number in the original document where this question begins (${startPage} to ${endPage}).

STRICT ACCURACY RULES:
- Never hallucinate or invent questions that do not exist in the source document.
- Never guess the correct answer if not explicitly indicated.
- Maintain original mathematical notation and Unicode characters.
- Output JSON strictly conforming to the requested schema.`;

  const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const modelName of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Pdf,
              },
            },
            {
              text: systemPrompt,
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  sourcePage: { type: Type.INTEGER },
                },
                required: ['text', 'options', 'correctAnswer'],
              },
            },
            temperature: 0.1,
          },
        });

        const rawJson = response.text?.trim() || '[]';
        let parsedItems: any[] = [];
        try {
          parsedItems = JSON.parse(rawJson);
        } catch (parseErr) {
          const cleaned = rawJson.replace(/^```json/i, '').replace(/```$/i, '').trim();
          parsedItems = JSON.parse(cleaned);
        }

        if (!Array.isArray(parsedItems)) {
          return [];
        }

        const questions: ExtractedQuestion[] = [];

        parsedItems.forEach((item, index) => {
          const qText = (item.text || '').trim();
          const rawOptions: string[] = Array.isArray(item.options) ? item.options : [];

          // Ensure 4 options
          const optA = cleanOptionText(rawOptions[0] || '');
          const optB = cleanOptionText(rawOptions[1] || '');
          const optC = cleanOptionText(rawOptions[2] || '');
          const optD = cleanOptionText(rawOptions[3] || '');
          const fourOptions: [string, string, string, string] = [optA, optB, optC, optD];

          const validationErrors: string[] = [];
          let status: QuestionStatus = 'valid';

          if (!qText) {
            validationErrors.push('Question statement is empty.');
            status = 'invalid';
          }

          if (!optA || !optB || !optC || !optD) {
            validationErrors.push('Question must have all 4 non-empty options.');
            status = 'invalid';
          }

          // Check duplicates among options
          const uniqueOpts = new Set(fourOptions.map((o) => o.toLowerCase().trim()));
          if (uniqueOpts.size < 4 && fourOptions.every((o) => o.length > 0)) {
            validationErrors.push('Multiple options have identical text.');
            if (status === 'valid') status = 'review_required';
          }

          const answerNorm = normalizeAnswer(item.correctAnswer, fourOptions);
          if (!answerNorm.isValid) {
            validationErrors.push(answerNorm.reason || 'Missing or invalid correct answer.');
            if (status === 'valid') {
              status = 'review_required';
            }
          }

          const questionNum = typeof item.questionNumber === 'number' && item.questionNumber > 0
            ? item.questionNumber
            : index + 1;

          const pageNum = typeof item.sourcePage === 'number' && item.sourcePage >= startPage
            ? item.sourcePage
            : startPage;

          questions.push({
            id: `extracted_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            questionNumber: questionNum,
            text: qText,
            options: fourOptions,
            correctAnswer: answerNorm.isValid ? answerNorm.index : 0,
            correctAnswerLabel: answerNorm.label,
            explanation: (item.explanation || '').trim(),
            sourcePage: pageNum,
            status,
            validationErrors,
            selected: status === 'valid',
          });
        });

        return questions;
      } catch (err: any) {
        lastError = err;
        const msg = String(err.message || '');
        if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429')) {
          continue;
        }
        break;
      }
    }
  }

  console.error(`All candidate models failed for pages ${startPage}-${endPage}:`, lastError);
  throw new Error(`AI extraction failed on pages ${startPage}-${endPage}: ${lastError?.message || 'Model service temporarily unavailable'}`);
}

/**
 * Validates a batch of questions, performs duplicate detection within the PDF and against existing questions
 */
export function validateAndDeduplicateQuestions(
  questions: ExtractedQuestion[],
  existingQuizzesQuestionTexts: { quizTitle: string; questionText: string }[] = []
): {
  processedQuestions: ExtractedQuestion[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
    reviewRequired: number;
    duplicates: number;
  };
} {
  const seenInPdf = new Map<string, ExtractedQuestion>();
  const existingNormalizedMap = new Map<string, string>(); // normalizedText -> quizTitle

  existingQuizzesQuestionTexts.forEach((item) => {
    const norm = normalizeTextForComparison(item.questionText);
    if (norm.length > 10) {
      existingNormalizedMap.set(norm, item.quizTitle);
    }
  });

  const processedQuestions = questions.map((q) => {
    const updated = { ...q, validationErrors: [...q.validationErrors] };
    const normText = normalizeTextForComparison(q.text);

    // 1. Basic field checks
    if (!q.text.trim()) {
      if (!updated.validationErrors.includes('Question statement is empty.')) {
        updated.validationErrors.push('Question statement is empty.');
      }
      updated.status = 'invalid';
      updated.selected = false;
    }

    const missingOpts = q.options.filter((o) => !o.trim()).length;
    if (missingOpts > 0) {
      const msg = `Missing ${missingOpts} option(s). Exactly 4 required.`;
      if (!updated.validationErrors.includes(msg)) {
        updated.validationErrors.push(msg);
      }
      updated.status = 'invalid';
      updated.selected = false;
    }

    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      if (!updated.validationErrors.includes('Correct answer must be Option A, B, C, or D.')) {
        updated.validationErrors.push('Correct answer must be Option A, B, C, or D.');
      }
      if (updated.status !== 'invalid') {
        updated.status = 'review_required';
      }
      updated.selected = false;
    }

    // 2. Intra-PDF Duplicate Check
    if (normText.length > 10) {
      if (seenInPdf.has(normText)) {
        const original = seenInPdf.get(normText)!;
        updated.isDuplicate = true;
        updated.duplicateReason = `Duplicate of Question #${original.questionNumber} (Page ${original.sourcePage}) in this PDF.`;
        if (!updated.validationErrors.includes(updated.duplicateReason)) {
          updated.validationErrors.push(updated.duplicateReason);
        }
        updated.status = 'duplicate';
        updated.selected = false;
      } else {
        seenInPdf.set(normText, q);
      }
    }

    // 3. Check against existing quizzes
    if (!updated.isDuplicate && normText.length > 10 && existingNormalizedMap.has(normText)) {
      const existingQuiz = existingNormalizedMap.get(normText);
      updated.isDuplicate = true;
      updated.duplicateReason = `Matches an existing question in published quiz: "${existingQuiz}".`;
      if (!updated.validationErrors.includes(updated.duplicateReason)) {
        updated.validationErrors.push(updated.duplicateReason);
      }
      updated.status = 'duplicate';
      updated.selected = false;
    }

    return updated;
  });

  const stats = {
    total: processedQuestions.length,
    valid: processedQuestions.filter((q) => q.status === 'valid').length,
    invalid: processedQuestions.filter((q) => q.status === 'invalid').length,
    reviewRequired: processedQuestions.filter((q) => q.status === 'review_required').length,
    duplicates: processedQuestions.filter((q) => q.status === 'duplicate').length,
  };

  return { processedQuestions, stats };
}
