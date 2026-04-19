export const INTERPREP_BASE = 'https://interprep-production.up.railway.app';

export const API_MAP = {
  endpoints: {
    createSession: '/upload_cv',
    sendMessage: '/answer',
    endSession: () => '/answer',
  },
  requestFields: {
    resumeFile: 'file',
    resumeText: 'resume_text',
    message: 'answer',
    answer: 'answer',
    sessionId: 'session_id',
  },
  responseFields: {
    sessionId: 'session_id',
    firstMessage: 'first_question',
    totalQuestions: 'total_questions',
    message: 'next_question',
    questionNumber: 'question_number',
    isComplete: 'is_complete',
    feedback: 'feedback',
    summary: 'summary',
    score: 'score',
    strengths: 'strengths',
    improvements: 'improvements',
  },
} as const;

export async function createInterviewSession(data: {
  resumeText: string;
}): Promise<{ sessionId: string; firstMessage: string; totalQuestions: number }> {
  const res = await fetch('/api/interview/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { error?: string }));
    throw new Error(err.error ?? 'Failed to create session');
  }

  return res.json();
}

export async function sendMessage(data: {
  sessionId?: string;
  message: string;
}): Promise<{
  message: string;
  questionNumber: number;
  totalQuestions: number;
  isComplete: boolean;
  feedback?: string;
  summary?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}> {
  const res = await fetch('/api/interview/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { error?: string }));
    throw new Error(err.error ?? 'Failed to send message');
  }

  return res.json();
}
