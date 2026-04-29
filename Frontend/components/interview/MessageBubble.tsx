'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, RotateCcw, User2 } from 'lucide-react';
import { CompletionCard } from './CompletionCard';
import { FileUploadCard } from './FileUploadCard';
import type { InterviewMessage, RetryAction } from './types';

interface UploadCardProps {
  file: File | null;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  onStartInterview: () => void;
}

interface MessageBubbleProps {
  message: InterviewMessage;
  uploadCardProps?: UploadCardProps;
  onRetry: (retryAction: RetryAction) => void;
  onStartNewInterview: () => void;
}

export function MessageBubble({
  message,
  uploadCardProps,
  onRetry,
  onStartNewInterview,
}: MessageBubbleProps) {
  if (message.type === 'upload-prompt' && uploadCardProps) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="mb-5 flex"
      >
        <FileUploadCard {...uploadCardProps} />
      </motion.div>
    );
  }

  if (message.type === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="mb-5 flex"
      >
        <div className="w-full">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400/20 text-teal-200">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </span>
            AI Interview Coach
          </div>
          <p className="mb-3 max-w-xl text-sm italic text-slate-300">{message.content}</p>
          <CompletionCard summary={message.summary ?? null} onStartNewInterview={onStartNewInterview} />
        </div>
      </motion.div>
    );
  }

  const isAI = message.type === 'ai' || message.type === 'system' || message.type === 'error';
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const isSystem = message.type === 'system';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn('mb-4 flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('flex max-w-[88%] gap-2 sm:max-w-[80%]', isUser && 'flex-row-reverse')}>
        <span
          className={cn(
            'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
            isUser
              ? 'border-blue-400/50 bg-blue-500 text-white'
              : isError
                ? 'border-red-300/40 bg-red-500/20 text-red-200'
                : 'border-slate-700 bg-slate-800 text-teal-200'
          )}
          aria-hidden="true"
        >
          {isUser ? <User2 className="h-4 w-4" /> : isError ? <AlertTriangle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </span>

        <div
          className={cn(
            'rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm',
            isUser &&
              'rounded-tr-[4px] border-transparent bg-gradient-to-r from-teal-400 to-blue-500 text-white',
            isAI &&
              !isError &&
              !isSystem &&
              'rounded-tl-[4px] border-slate-700 bg-slate-900/80 text-slate-100',
            isSystem &&
              'rounded-tl-[4px] border-slate-700 bg-slate-900/70 text-[14px] italic text-slate-300',
            isError && 'rounded-tl-[4px] border-red-300/30 bg-red-500/15 text-red-100'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.retryAction && (
            <button
              type="button"
              onClick={() => onRetry(message.retryAction as RetryAction)}
              aria-label="Retry failed request"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300/40 bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-50 transition hover:bg-red-600/35"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
