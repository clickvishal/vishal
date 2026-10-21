import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  inspectPdf,
  slicePdfPages,
  extractMcqsFromPdfChunk,
  validateAndDeduplicateQuestions,
  MAX_PDF_FILE_SIZE_BYTES,
} from './src/server/pdfExtractor';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support large payloads for PDF base64 data
app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ extended: true, limit: '70mb' }));

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

/**
 * POST /api/pdf/inspect
 * Validates PDF file integrity, magic bytes, and returns page count
 */
app.post('/api/pdf/inspect', async (req, res) => {
  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid pdfBase64 payload.' });
    }

    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const result = await inspectPdf(buffer);
    if (!result.isValid) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/pdf/inspect:', err);
    return res.status(500).json({
      isValid: false,
      error: `Server failed to inspect PDF: ${err.message || 'Unknown error'}`,
    });
  }
});

/**
 * POST /api/pdf/extract-chunk
 * Extracts MCQs from a specified page range of the PDF
 */
app.post('/api/pdf/extract-chunk', async (req, res) => {
  try {
    const { pdfBase64, startPage, endPage } = req.body;

    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing pdfBase64 payload.' });
    }

    const start = parseInt(startPage, 10);
    const end = parseInt(endPage, 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      return res.status(400).json({ error: 'Invalid startPage or endPage parameters.' });
    }

    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const fullBuffer = Buffer.from(cleanBase64, 'base64');

    if (fullBuffer.length > MAX_PDF_FILE_SIZE_BYTES) {
      return res.status(413).json({
        error: `File size exceeds the ${(MAX_PDF_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB limit.`,
      });
    }

    // Slice specific page range into a lightweight chunk buffer
    const chunkBuffer = await slicePdfPages(fullBuffer, start, end);

    // Call Gemini multimodal extraction
    const questions = await extractMcqsFromPdfChunk(chunkBuffer, start, end);

    return res.json({
      success: true,
      startPage: start,
      endPage: end,
      count: questions.length,
      questions,
    });
  } catch (err: any) {
    console.error('Error in /api/pdf/extract-chunk:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to extract MCQs from PDF chunk.',
    });
  }
});

/**
 * POST /api/pdf/validate-duplicates
 * Validates questions and detects duplicates
 */
app.post('/api/pdf/validate-duplicates', (req, res) => {
  try {
    const { questions, existingQuestions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'questions must be an array.' });
    }

    const result = validateAndDeduplicateQuestions(
      questions,
      Array.isArray(existingQuestions) ? existingQuestions : []
    );

    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/pdf/validate-duplicates:', err);
    return res.status(500).json({ error: err.message || 'Validation failed.' });
  }
});

// Setup dev server with Vite middleware or static production serve
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CivilMates Server] Full-stack application running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CivilMates Server] Failed to initialize server:', err);
  process.exit(1);
});
