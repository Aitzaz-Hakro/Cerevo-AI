'use client';

import type { InterviewSummary } from './types';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

interface CompletionCardProps {
  summary: InterviewSummary | null;
  onStartNewInterview: () => void;
}

export function CompletionCard({ summary, onStartNewInterview }: CompletionCardProps) {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-teal-300/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 shadow-lg shadow-slate-950/40">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Session Complete</p>
          <p className="text-xs text-slate-400">Great job! You finished your mock interview.</p>
        </div>
      </div>

      {!!summary?.feedback && (
        <div className="mb-3 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm leading-relaxed text-slate-200">
          {summary.feedback}
        </div>
      )}

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">Strengths</p>
          {summary?.strengths && summary.strengths.length > 0 ? (
            <ul className="space-y-1 text-xs text-emerald-100">
              {summary.strengths.slice(0, 3).map((strength, index) => (
                <li key={`${strength}-${index}`}>- {strength}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs italic text-emerald-100/90">Clear communication and good structure.</p>
          )}
        </div>

        <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-300">Improve Next</p>
          {summary?.improvements && summary.improvements.length > 0 ? (
            <ul className="space-y-1 text-xs text-amber-100">
              {summary.improvements.slice(0, 3).map((improvement, index) => (
                <li key={`${improvement}-${index}`}>- {improvement}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs italic text-amber-100/90">Add metrics and sharper examples in each answer.</p>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-300">
        Score: <span className="font-semibold text-slate-100">{summary?.score ?? 'N/A'}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          aria-label="Start a new interview"
          onClick={onStartNewInterview}
          className="flex-1 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Start New Interview
        </button>
        <Link
          aria-label="View interview results"
          href="/resume-analyzer"
          className="flex-1 rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-100 transition hover:border-slate-500"
        >
          View Results
        </Link>
      </div>
    </div>
  );
}
