export type InterviewStage = 'upload' | 'chat' | 'results';

export type MessageRole = 'ai' | 'user' | 'feedback' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  questionNumber?: number;
}

export interface InterviewSession {
  sessionId: string;
  status: 'active' | 'complete' | 'error';
  questionNumber: number;
  totalQuestions: number;
  isComplete: boolean;
}

export interface InterviewResult {
  summary: string;
  score: number;
  strengths: string[];
  improvements: string[];
  duration?: number;
}

export interface ResumeUploadData {
  file: File | null;
  textContent: string;
  uploadMethod: 'file' | 'text' | 'existing';
}

export interface CreateSessionResponse {
  session_id: string;
  status: string;
  first_message: string;
  total_questions?: number;
}

export interface MessageResponse {
  message: string;
  question_number?: number;
  total_questions?: number;
  is_complete?: boolean;
  feedback?: string;
  summary?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}

export interface EndSessionResponse {
  summary: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}
