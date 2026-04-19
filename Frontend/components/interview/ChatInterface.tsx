'use client';

import { useEffect, useRef } from 'react';
import { sendMessage } from '@/lib/interview-api';
import { useInterviewStore } from '@/store/interview-store';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

export function ChatInterface() {
  const messages = useInterviewStore((state) => state.messages);
  const session = useInterviewStore((state) => state.session);
  const isLoading = useInterviewStore((state) => state.isLoading);
  const error = useInterviewStore((state) => state.error);
  const addMessage = useInterviewStore((state) => state.addMessage);
  const setLoading = useInterviewStore((state) => state.setLoading);
  const setError = useInterviewStore((state) => state.setError);
  const updateSession = useInterviewStore((state) => state.updateSession);
  const setStage = useInterviewStore((state) => state.setStage);
  const setResult = useInterviewStore((state) => state.setResult);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!session || isLoading) {
      return;
    }

    addMessage({ role: 'user', content: text });
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage({
        sessionId: session.sessionId,
        message: text,
      });

      if (response.feedback) {
        addMessage({ role: 'feedback', content: response.feedback });
      }

      if (response.isComplete) {
        updateSession({ isComplete: true, status: 'complete' });

        if (response.message) {
          addMessage({ role: 'ai', content: response.message });
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        setResult({
          summary: response.summary ?? response.message ?? 'Interview complete.',
          score: response.score ?? 0,
          strengths: response.strengths ?? [],
          improvements: response.improvements ?? [],
        });
        setStage('results');
      } else {
        addMessage({
          role: 'ai',
          content: response.message,
          questionNumber: response.questionNumber,
        });

        updateSession({
          questionNumber: response.questionNumber,
          totalQuestions: response.totalQuestions,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      addMessage({
        role: 'system',
        content: 'Something went wrong while contacting the interview service. Please retry.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4">
      <div className="flex-1 overflow-y-auto py-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 py-4">
        {error && (
          <p className="mb-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
        <ChatInput
          onSend={handleSend}
          disabled={isLoading || !session}
          placeholder={
            isLoading
              ? 'AI is responding...'
              : 'Type your answer... (Enter to send, Shift+Enter for new line)'
          }
        />
        <p className="mt-2 text-center text-[11px] text-gray-300">
          Press Enter to send and Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
