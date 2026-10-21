import {
  slicePdfPages,
  extractMcqsFromPdfChunk,
  MAX_PDF_FILE_SIZE_BYTES,
} from '../../src/server/pdfExtractor';

interface NetlifyEvent {
  httpMethod?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    };
  }

  try {
    const { pdfBase64, startPage, endPage } = JSON.parse(event.body || '{}');

    if (!pdfBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing pdfBase64 payload.' }),
      };
    }

    const start = parseInt(startPage, 10);
    const end = parseInt(endPage, 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid startPage or endPage parameters.' }),
      };
    }

    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const fullBuffer = Buffer.from(cleanBase64, 'base64');

    if (fullBuffer.length > MAX_PDF_FILE_SIZE_BYTES) {
      return {
        statusCode: 413,
        body: JSON.stringify({ error: 'PDF file exceeds size limits.' }),
      };
    }

    const chunkBuffer = await slicePdfPages(fullBuffer, start, end);
    const questions = await extractMcqsFromPdfChunk(chunkBuffer, start, end);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        startPage: start,
        endPage: end,
        count: questions.length,
        questions,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Chunk extraction failed.' }),
    };
  }
};
