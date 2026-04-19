'use client';

import Link from 'next/link';
import { useInterviewStore } from '@/store/interview-store';
import { ProgressBar } from './ProgressBar';

export function InterviewHeader() {
  const stage = useInterviewStore((state) => state.stage);
  const session = useInterviewStore((state) => state.session);
  const reset = useInterviewStore((state) => state.reset);

  return (
    <header className="z-10 flex h-14 shrink-0 items-center border-b border-gray-100 bg-white px-6">
      <div className="flex flex-1 items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
        >
          Back
        </Link>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">Interview Prep</span>
        </div>
      </div>

      {stage === 'chat' && session && (
        <div className="mx-auto flex-1 max-w-sm">
          <ProgressBar current={session.questionNumber} total={session.totalQuestions} />
        </div>
      )}

      <div className="flex flex-1 justify-end">
        {stage === 'chat' && (
          <button
            onClick={() => {
              if (confirm('End this interview? Your progress will be lost.')) {
                reset();
              }
            }}
            className="text-xs text-gray-400 transition-colors hover:text-red-500"
          >
            End Interview
          </button>
        )}
      </div>
    </header>
  );
}
