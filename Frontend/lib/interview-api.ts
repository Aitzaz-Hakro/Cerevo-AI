export const INTERPREP_BASE = 'https://interprep-production.up.railway.app';

export const API_MAP = {
  endpoints: {
    createSession: '/upload_cv',
    sendMessage: '/answer',
    endSession: () => '/answer',
  },
  requestFields: {
    resumeFile: 'cv',
    resumeText: 'resume_text',
    message: 'answer',
    answer: 'answer',
    sessionId: 'session_id',
  },
  responseFields: {
    sessionId: 'session_id',
    firstMessage: 'question',
    totalQuestions: 'total_questions',
    message: 'question',
    questionNumber: 'question_number',
    isComplete: 'done',
    feedback: 'feedback',
    summary: 'summary',
    score: 'score',
    strengths: 'strengths',
    improvements: 'improvements',
  },
} as const;

export async function createInterviewSession(
  data: {
    file?: File;
    resumeText?: string;
  },
  options?: { signal?: AbortSignal }
): Promise<{
  sessionId: string;
  question?: string;
  firstMessage?: string;
  totalQuestions: number;
  done?: boolean;
}> {
  const payload = new FormData();

  if (data.file) {
    payload.append(API_MAP.requestFields.resumeFile, data.file);
  }

  if (data.resumeText?.trim()) {
    payload.append(API_MAP.requestFields.resumeText, data.resumeText.trim());
  }

  const res = await fetch('/api/interview/session', {
    method: 'POST',
    body: payload,
    signal: options?.signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { error?: string }));
    throw new Error(err.error ?? 'Failed to create session');
  }

  return res.json();
}

export async function sendMessage(
  data: {
    sessionId?: string;
    message?: string;
    answer?: string;
  },
  options?: { signal?: AbortSignal }
): Promise<{
  question?: string;
  message?: string;
  questionNumber?: number;
  totalQuestions?: number;
  done?: boolean;
  isComplete?: boolean;
  feedback?: string;
  summary?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}> {
  const answer = data.answer ?? data.message ?? '';

  const res = await fetch('/api/interview/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: data.sessionId,
      answer,
      message: answer,
    }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { error?: string }));
    throw new Error(err.error ?? 'Failed to send message');
  }

  return res.json();
}
