'use client';

import { Bot } from 'lucide-react';

export function TypingBubble() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="flex max-w-[80%] gap-2">
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-teal-200" aria-hidden="true">
          <Bot className="h-4 w-4" />
        </span>

        <div
          aria-label="AI is typing"
          className="rounded-2xl rounded-tl-[4px] border border-slate-700 bg-slate-900/80 px-4 py-3"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-[interviewDot_1.2s_ease-in-out_infinite] rounded-full bg-slate-300" />
            <span className="h-2 w-2 animate-[interviewDot_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-slate-300" />
            <span className="h-2 w-2 animate-[interviewDot_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
