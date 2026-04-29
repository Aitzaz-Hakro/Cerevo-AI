'use client';

import { createInterviewSession, sendMessage } from '@/lib/interview-api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu, Settings2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { InputBar } from './InputBar';
import { InterviewSidebar } from './InterviewSidebar';
import type {
  InterviewMessage,
  InterviewPhase,
  InterviewStateSnapshot,
  InterviewSummary,
  RetryAction,
  SessionHistoryItem,
} from './types';

const STORAGE_KEY = 'cerevo:interview:session:v2';

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const defaultSessionHistory = (): SessionHistoryItem[] => {
  const now = Date.now();
  return [
    { id: 'sample-1', title: 'Session 8f43a91c', createdAt: now - 1000 * 60 * 40, isPlaceholder: true },
    { id: 'sample-2', title: 'Session d03bb6a2', createdAt: now - 1000 * 60 * 140, isPlaceholder: true },
    { id: 'sample-3', title: 'Session a9c3be78', createdAt: now - 1000 * 60 * 380, isPlaceholder: true },
  ];
};

const createInitialMessages = (): InterviewMessage[] => [
  {
    id: createId(),
    type: 'system',
    content:
      "Hi! I'm your AI Interview Coach. Upload your CV or resume to get started, and I'll tailor your mock interview to your experience.",
    timestamp: Date.now(),
  },
  {
    id: createId(),
    type: 'upload-prompt',
    content: 'Upload your resume to begin.',
    timestamp: Date.now(),
  },
];

export function InterviewShell() {
  const [phase, setPhase] = useState<InterviewPhase>('welcome');
  const [messages, setMessages] = useState<InterviewMessage[]>(createInitialMessages);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>(defaultSessionHistory);

  const uploadAbortRef = useRef<AbortController | null>(null);
  const answerAbortRef = useRef<AbortController | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushMessage = useCallback((message: Omit<InterviewMessage, 'id' | 'timestamp'>) => {
    setMessages((previous) => [
      ...previous,
      {
        ...message,
        id: createId(),
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const pushError = useCallback(
    (content: string, retryAction?: RetryAction) => {
      pushMessage({ type: 'error', content, retryAction });
    },
    [pushMessage]
  );

  const abortActiveRequests = useCallback(() => {
    uploadAbortRef.current?.abort();
    answerAbortRef.current?.abort();

    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  }, []);

  const streamAiMessage = useCallback(async (text: string, type: 'ai' | 'system' = 'ai') => {
    const normalized = text.trim();
    if (!normalized) {
      return;
    }

    const id = createId();
    setMessages((previous) => [
      ...previous,
      {
        id,
        type,
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      },
    ]);

    const chunks = normalized.split(/\s+/);

    await new Promise<void>((resolve) => {
      let index = 0;

      streamTimerRef.current = setInterval(() => {
        index += 1;

        const nextText = chunks.slice(0, index).join(' ');

        setMessages((previous) =>
          previous.map((message) =>
            message.id === id
              ? {
                  ...message,
                  content: nextText,
                  isStreaming: index < chunks.length,
                }
              : message
          )
        );

        if (index >= chunks.length) {
          if (streamTimerRef.current) {
            clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
          }
          resolve();
        }
      }, 50);
    });
  }, []);

  const resetInterview = useCallback(() => {
    abortActiveRequests();
    setPhase('welcome');
    setSessionId(null);
    setSummary(null);
    setSelectedFile(null);
    setIsUploading(false);
    setIsPending(false);
    setMobileSidebarOpen(false);
    setMessages(createInitialMessages());
  }, [abortActiveRequests]);

  const handleUploadRetry = useCallback(() => {
    if (!selectedFile || isPending) {
      return;
    }

    const startUpload = async () => {
      setIsUploading(true);
      setIsPending(true);
      setPhase('uploading');

      pushMessage({ type: 'system', content: 'Analyzing your CV...' });

      uploadAbortRef.current?.abort();
      uploadAbortRef.current = new AbortController();

      try {
        const response = await createInterviewSession(
          { file: selectedFile },
          { signal: uploadAbortRef.current.signal }
        );

        const activeSessionId = response.sessionId;
        const firstQuestion =
          response.question ?? response.firstMessage ?? 'Tell me about yourself.';

        setSessionId(activeSessionId);
        setPhase('interview');
        setSelectedFile(null);

        setSessionHistory((previous) => {
          const title = `Session ${activeSessionId.slice(0, 8)}`;
          const next: SessionHistoryItem = {
            id: activeSessionId,
            title,
            createdAt: Date.now(),
          };

          const filtered = previous.filter((session) => session.id !== activeSessionId);
          return [next, ...filtered].slice(0, 8);
        });

        setMessages((previous) => previous.filter((message) => message.type !== 'upload-prompt'));
        await streamAiMessage(firstQuestion, 'ai');
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        pushError(
          'Something went wrong uploading your CV. Please retry.',
          { type: 'upload' }
        );
        setPhase('welcome');
      } finally {
        setIsUploading(false);
        setIsPending(false);
      }
    };

    void startUpload();
  }, [isPending, pushMessage, pushError, selectedFile, streamAiMessage]);

  const submitAnswer = useCallback(
    async (answer: string, options?: { optimisticUser?: boolean }) => {
      if (!sessionId || isPending) {
        return;
      }

      const optimisticUser = options?.optimisticUser ?? true;

      if (optimisticUser) {
        pushMessage({ type: 'user', content: answer });
      }

      setIsPending(true);

      answerAbortRef.current?.abort();
      answerAbortRef.current = new AbortController();

      try {
        const response = await sendMessage(
          {
            sessionId,
            answer,
          },
          { signal: answerAbortRef.current.signal }
        );

        const done = Boolean(response.done ?? response.isComplete);
        const nextQuestion = response.question ?? response.message ?? '';

        if (!done && nextQuestion) {
          await streamAiMessage(nextQuestion);
          return;
        }

        const nextSummary: InterviewSummary = {
          score: response.score,
          feedback:
            response.feedback ??
            response.summary ??
            "Great work completing your mock interview. You've built strong momentum.",
          strengths: response.strengths,
          improvements: response.improvements,
        };

        setSummary(nextSummary);
        setPhase('complete');

        pushMessage({
          type: 'complete',
          content: "Great job! You've completed your mock interview. Here's a summary of your session.",
          summary: nextSummary,
        });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        pushError("I couldn't process your answer. Please retry.", {
          type: 'answer',
          answer,
        });
      } finally {
        setIsPending(false);
      }
    },
    [isPending, pushMessage, pushError, sessionId, streamAiMessage]
  );

  const handleRetry = useCallback(
    (retryAction: RetryAction) => {
      if (retryAction.type === 'upload') {
        handleUploadRetry();
        return;
      }

      if (retryAction.type === 'answer' && retryAction.answer) {
        void submitAnswer(retryAction.answer, { optimisticUser: false });
      }
    },
    [handleUploadRetry, submitAnswer]
  );

  useEffect(() => {
    const updateOnlineState = () => {
      setIsOffline(!navigator.onLine);
    };

    updateOnlineState();
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);

    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  useEffect(() => {
    const serialized = window.sessionStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return;
    }

    try {
      const parsed = JSON.parse(serialized) as InterviewStateSnapshot;

      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }

      if (parsed.phase) {
        setPhase(parsed.phase);
      }

      setSessionId(parsed.sessionId ?? null);
      setSummary(parsed.summary ?? null);

      if (Array.isArray(parsed.sessionHistory) && parsed.sessionHistory.length > 0) {
        setSessionHistory(parsed.sessionHistory);
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const snapshot: InterviewStateSnapshot = {
      phase,
      sessionId,
      messages,
      summary,
      sessionHistory,
    };

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [messages, phase, sessionHistory, sessionId, summary]);

  useEffect(() => {
    return () => {
      abortActiveRequests();
    };
  }, [abortActiveRequests]);

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      {isOffline && (
        <div className="mb-3 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
          You appear to be offline. Reconnecting...
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -right-14 top-8 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-6 left-1/3 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="flex h-[calc(100vh-10rem)] min-h-[620px] overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/85 shadow-2xl shadow-slate-950/60 backdrop-blur">
        <InterviewSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          activeSessionId={sessionId}
          sessions={sessionHistory}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onNewInterview={resetInterview}
        />

        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
          className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex h-14 items-center justify-between border-b border-slate-800 px-3 sm:px-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open interview sidebar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 lg:hidden"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-100">Mock Interview Session</p>
                <p className="text-xs text-slate-400">
                  {sessionId ? `Session ${sessionId.slice(0, 8)}` : 'Awaiting resume upload'}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Interview settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ChatWindow
            messages={messages}
            isPending={isPending}
            uploadCardProps={{
              file: selectedFile,
              isUploading,
              onFileSelected: (file) => {
                if (file.size > 10 * 1024 * 1024) {
                  pushError('That file is too large. Please upload a CV under 10MB.');
                  return;
                }

                const validMime =
                  file.type === 'application/pdf' ||
                  file.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                const validExtension = /\.(pdf|docx)$/i.test(file.name);

                if (!validMime && !validExtension) {
                  pushError('Please upload a PDF or DOCX file.');
                  return;
                }

                setSelectedFile(file);
              },
              onRemoveFile: () => setSelectedFile(null),
              onStartInterview: handleUploadRetry,
            }}
            onRetry={handleRetry}
            onStartNewInterview={resetInterview}
          />

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:px-6',
              phase !== 'interview' && 'hidden'
            )}
          >
            <div className="pointer-events-auto mx-auto w-full max-w-[720px]">
              <InputBar
                disabled={isPending || phase === 'complete'}
                isPending={isPending}
                onSend={(answer) => {
                  void submitAnswer(answer, { optimisticUser: true });
                }}
              />
            </div>
          </div>
        </motion.main>
      </div>
    </section>
  );
}
