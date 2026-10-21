import {
  ExtractedQuestion,
  PdfImportMetadata,
  PdfProcessingStats,
} from '../types/pdfImport';
import { db } from '../firebase/config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export interface ProgressCallback {
  (stage: string, progress: number, message: string): void;
}

export interface ChunkResult {
  chunkIndex: number;
  totalChunks: number;
  startPage: number;
  endPage: number;
  questions: ExtractedQuestion[];
}

/**
 * Converts a File or Blob into base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and inspects a PDF file via server inspection
 */
export async function inspectPdfFile(
  file: File,
  signal?: AbortSignal
): Promise<{ isValid: boolean; pageCount: number; fileSizeBytes: number; error?: string }> {
  // 1. Client-side sanity checks
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes: file.size,
      error: 'The selected file is not a PDF document (.pdf).',
    };
  }

  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes: file.size,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB maximum limit.`,
    };
  }

  const base64Data = await fileToBase64(file);

  const response = await fetch('/api/pdf/inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdfBase64: base64Data }),
    signal,
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    return {
      isValid: false,
      pageCount: 0,
      fileSizeBytes: file.size,
      error: errorJson.error || `Server rejected document inspection (${response.status}).`,
    };
  }

  return await response.json();
}

/**
 * Process entire PDF in chunked batches with progress reporting and cancellation support
 */
export async function processPdfInChunks(
  file: File,
  totalPages: number,
  existingQuestionTexts: { quizTitle: string; questionText: string }[],
  chunkSize: number = 4,
  onProgress?: ProgressCallback,
  signal?: AbortSignal,
  importJobId?: string
): Promise<{
  questions: ExtractedQuestion[];
  stats: PdfProcessingStats;
}> {
  const base64Data = await fileToBase64(file);
  const totalChunks = Math.ceil(totalPages / chunkSize);
  const allExtracted: ExtractedQuestion[] = [];

  // Update initial Firestore import record if jobId provided
  if (importJobId) {
    try {
      await setDoc(doc(db, 'pdf_imports', importJobId), {
        id: importJobId,
        fileName: file.name,
        fileSize: file.size,
        pageCount: totalPages,
        status: 'extracting',
        progress: 5,
        totalExtracted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not write import record to Firestore:', e);
    }
  }

  // Iterate over each chunk
  for (let c = 0; c < totalChunks; c++) {
    if (signal?.aborted) {
      throw new DOMException('Import cancelled by administrator.', 'AbortError');
    }

    const startPage = c * chunkSize + 1;
    const endPage = Math.min((c + 1) * chunkSize, totalPages);

    const progressPct = Math.round(10 + (c / totalChunks) * 75);
    onProgress?.(
      'extracting',
      progressPct,
      `Analyzing pages ${startPage}–${endPage} of ${totalPages} (${c + 1}/${totalChunks} batches)...`
    );

    try {
      const response = await fetch('/api/pdf/extract-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: base64Data,
          startPage,
          endPage,
        }),
        signal,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Failed chunk ${startPage}–${endPage} (Status ${response.status})`);
      }

      const data = await response.json();
      if (Array.isArray(data.questions)) {
        allExtracted.push(...data.questions);
      }

      // Update Firestore job progress
      if (importJobId) {
        try {
          await updateDoc(doc(db, 'pdf_imports', importJobId), {
            progress: progressPct,
            totalExtracted: allExtracted.length,
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.error(`Chunk extraction error (pages ${startPage}–${endPage}):`, err);
      throw new Error(`Failed extracting pages ${startPage}–${endPage}: ${err.message || 'Network error'}`);
    }
  }

  // Validation & Deduplication Stage
  onProgress?.('validating', 90, 'Running cross-question duplicate detection and answer integrity checks...');

  const validateResponse = await fetch('/api/pdf/validate-duplicates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questions: allExtracted,
      existingQuestions: existingQuestionTexts,
    }),
    signal,
  });

  if (!validateResponse.ok) {
    const errorJson = await validateResponse.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Question validation stage failed.');
  }

  const { processedQuestions, stats } = await validateResponse.json();

  onProgress?.('ready', 100, `Completed! Successfully processed ${processedQuestions.length} questions.`);

  if (importJobId) {
    try {
      await updateDoc(doc(db, 'pdf_imports', importJobId), {
        status: 'ready',
        progress: 100,
        totalExtracted: processedQuestions.length,
        validCount: stats.valid,
        invalidCount: stats.invalid,
        reviewCount: stats.reviewRequired,
        duplicateCount: stats.duplicates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      // ignore
    }
  }

  return { questions: processedQuestions, stats };
}
