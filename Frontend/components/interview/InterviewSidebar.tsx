'use client';

import BrandLogo from '@/components/BrandLogo';
import { cn } from '@/lib/utils';
import type { SessionHistoryItem } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Clock3, Plus, X } from 'lucide-react';

interface InterviewSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  activeSessionId: string | null;
  sessions: SessionHistoryItem[];
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
  onNewInterview: () => void;
}

function SessionList({
  sessions,
  activeSessionId,
  collapsed,
}: {
  sessions: SessionHistoryItem[];
  activeSessionId: string | null;
  collapsed: boolean;
}) {
  return (
    <ul className="space-y-2">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;

        return (
          <li key={session.id}>
            <button
              type="button"
              aria-label={`Session ${session.title}`}
              className={cn(
                'group flex w-full items-start gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all',
                isActive
                  ? 'border-teal-300/40 bg-teal-400/15 text-slate-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              )}
            >
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{session.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {new Date(session.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function InterviewSidebar({
  collapsed,
  mobileOpen,
  activeSessionId,
  sessions,
  onToggleCollapsed,
  onCloseMobile,
  onNewInterview,
}: InterviewSidebarProps) {
  return (
    <>
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'relative hidden h-full shrink-0 border-r border-slate-800/80 bg-slate-950/95 lg:flex lg:flex-col',
          collapsed ? 'w-20' : 'w-[260px]'
        )}
      >
        <div className={cn('flex items-center border-b border-slate-800/80 px-4 py-4', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && <BrandLogo width={140} height={48} className="h-9 w-auto" />}
          {collapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
              <span className="bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-lg font-bold text-transparent">
                C
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <button
            type="button"
            onClick={onNewInterview}
            aria-label="Start a new interview"
            className={cn(
              'mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r from-teal-400 to-blue-500 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99]',
              collapsed && 'px-0'
            )}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {!collapsed && 'New Interview'}
          </button>

          <p className={cn('mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500', collapsed && 'text-center')}>
            Sessions
          </p>

          <SessionList sessions={sessions} activeSessionId={activeSessionId} collapsed={collapsed} />
        </div>

        <div className="border-t border-slate-800/80 p-3">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white',
              collapsed ? '' : 'gap-2'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} aria-hidden="true" />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-label="Close sidebar overlay"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -280, opacity: 0.3 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0.3 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[290px] flex-col border-r border-slate-800 bg-slate-950 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                <BrandLogo width={130} height={44} className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close sidebar"
                  className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <button
                  type="button"
                  onClick={onNewInterview}
                  aria-label="Start a new interview"
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r from-teal-400 to-blue-500 px-3 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New Interview
                </button>

                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Sessions
                </p>
                <SessionList sessions={sessions} activeSessionId={activeSessionId} collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
