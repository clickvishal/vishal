import { validateAndDeduplicateQuestions } from '../../src/server/pdfExtractor';

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
    const { questions, existingQuestions } = JSON.parse(event.body || '{}');

    if (!Array.isArray(questions)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'questions must be an array.' }),
      };
    }

    const result = validateAndDeduplicateQuestions(
      questions,
      Array.isArray(existingQuestions) ? existingQuestions : []
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Validation failed.' }),
    };
  }
};
