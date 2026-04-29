export type InterviewPhase = 'welcome' | 'uploading' | 'interview' | 'complete';

export type InterviewMessageType =
  | 'ai'
  | 'user'
  | 'system'
  | 'error'
  | 'upload-prompt'
  | 'complete';

export type RetryActionType = 'upload' | 'answer';

export interface RetryAction {
  type: RetryActionType;
  answer?: string;
}

export interface InterviewSummary {
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}

export interface InterviewMessage {
  id: string;
  type: InterviewMessageType;
  content: string;
  timestamp: number;
  retryAction?: RetryAction;
  summary?: InterviewSummary;
  isStreaming?: boolean;
}

export interface SessionHistoryItem {
  id: string;
  title: string;
  createdAt: number;
  isPlaceholder?: boolean;
}

export interface InterviewStateSnapshot {
  phase: InterviewPhase;
  sessionId: string | null;
  messages: InterviewMessage[];
  summary: InterviewSummary | null;
  sessionHistory: SessionHistoryItem[];
}
