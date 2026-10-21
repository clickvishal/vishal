import { CategoryType, Difficulty } from './quiz';

export type QuestionStatus = 'valid' | 'invalid' | 'review_required' | 'duplicate';

export interface ExtractedQuestion {
  id: string;
  questionNumber: number;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, 3
  correctAnswerLabel: 'A' | 'B' | 'C' | 'D' | string;
  explanation: string;
  sourcePage: number;
  status: QuestionStatus;
  validationErrors: string[];
  selected: boolean;
  isDuplicate?: boolean;
  duplicateReason?: string;
}

export interface PdfImportMetadata {
  title: string;
  category: CategoryType;
  description: string;
  difficulty: Difficulty;
  estimatedTime?: string;
  autoPublish: boolean;
  coverImage?: string;
}

export type ProcessingStage =
  | 'idle'
  | 'validating_file'
  | 'extracting_pages'
  | 'ai_extraction'
  | 'normalizing'
  | 'deduplicating'
  | 'ready'
  | 'saving'
  | 'completed'
  | 'failed';

export interface PdfProcessingStats {
  total: number;
  valid: number;
  invalid: number;
  reviewRequired: number;
  duplicates: number;
}
