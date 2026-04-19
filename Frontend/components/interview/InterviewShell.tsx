'use client';

import { useEffect } from 'react';
import { useInterviewStore } from '@/store/interview-store';
import { ChatInterface } from './ChatInterface';
import { InterviewHeader } from './InterviewHeader';
import { ResultsSummary } from './ResultsSummary';
import { ResumeUploadStep } from './ResumeUploadStep';

export function InterviewShell() {
  const stage = useInterviewStore((state) => state.stage);
  const messagesLength = useInterviewStore((state) => state.messages.length);
  const reset = useInterviewStore((state) => state.reset);

  useEffect(() => {
    if (stage === 'chat' && messagesLength === 0) {
      reset();
    }
  }, [stage, messagesLength, reset]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8f9fb]">
      <InterviewHeader />
      <main className="flex flex-1 flex-col overflow-hidden">
        {stage === 'upload' && <ResumeUploadStep />}
        {stage === 'chat' && <ChatInterface />}
        {stage === 'results' && <ResultsSummary />}
      </main>
    </div>
  );
}
