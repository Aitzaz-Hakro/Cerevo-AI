'use client';

import Link from 'next/link';
import { useInterviewStore } from '@/store/interview-store';

export function ResultsSummary() {
  const result = useInterviewStore((state) => state.result);
  const reset = useInterviewStore((state) => state.reset);

  if (!result) {
    return null;
  }

  const scoreColor =
    result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-500';

  const scoreLabel =
    result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Work';

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto p-6">
      <div className="w-full max-w-xl py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-gray-100 bg-white shadow-sm">
            <span className={`text-3xl font-bold ${scoreColor}`}>{result.score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
          <h2 className="mb-1 text-xl font-bold text-gray-900">Interview Complete</h2>
          <p className={`text-sm font-medium ${scoreColor}`}>{scoreLabel} Performance</p>
        </div>

        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Overall Summary
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{result.summary}</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-600">
              <span>+</span> Strengths
            </h3>
            {result.strengths.length > 0 ? (
              <ul className="space-y-2">
                {result.strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-green-800">
                    <span className="mt-0.5 text-green-400">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-green-600">Great overall performance.</p>
            )}
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-orange-600">
              <span>^</span> To Improve
            </h3>
            {result.improvements.length > 0 ? (
              <ul className="space-y-2">
                {result.improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-orange-800">
                    <span className="mt-0.5 text-orange-400">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-orange-600">Keep practicing.</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:scale-[0.98]"
          >
            Practice Again
          </button>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
