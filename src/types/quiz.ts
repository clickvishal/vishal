export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type CategoryType =
  | 'General Knowledge'
  | 'Science'
  | 'Technology'
  | 'History'
  | 'Geography'
  | 'Sports'
  | 'Movies'
  | 'Personality';

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  difficulty: Difficulty;
  questionCount: number;
  estimatedTime: string; // e.g. "5 min"
  questions: Question[];
  featured?: boolean;
  popular?: boolean;
  isDaily?: boolean;
  isPersonality?: boolean;
  createdAt: string;
  published: boolean;
  coverImage?: string;
  badge?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  category: CategoryType;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  completedAt: string;
  timeSpentSeconds: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  completedQuizzesCount: number;
  totalScore: number;
  averageScore: number;
  recentAttempts: QuizAttempt[];
}

export interface CategoryInfo {
  name: CategoryType;
  description: string;
  icon: string;
  quizCount: number;
  accentColor: string;
}
