'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingBubble } from './TypingBubble';
import type { InterviewMessage, RetryAction } from './types';

interface UploadCardProps {
  file: File | null;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  onStartInterview: () => void;
}

interface ChatWindowProps {
  messages: InterviewMessage[];
  isPending: boolean;
  uploadCardProps: UploadCardProps;
  onRetry: (retryAction: RetryAction) => void;
  onStartNewInterview: () => void;
}

export function ChatWindow({
  messages,
  isPending,
  uploadCardProps,
  onRetry,
  onStartNewInterview,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollFab, setShowScrollFab] = useState(false);

  const hasUploadPrompt = useMemo(
    () => messages.some((message) => message.type === 'upload-prompt'),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isPending]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }

    const onScroll = () => {
      const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
      setShowScrollFab(distance > 180);
    };

    node.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      node.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="h-full overflow-y-auto px-4 pb-[132px] pt-6 sm:px-6"
      >
        <div className="mx-auto w-full max-w-[720px]">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              uploadCardProps={message.type === 'upload-prompt' ? uploadCardProps : undefined}
              onRetry={onRetry}
              onStartNewInterview={onStartNewInterview}
            />
          ))}

          {isPending && !hasUploadPrompt && <TypingBubble />}

          <div ref={bottomRef} />
        </div>
      </div>

      {showScrollFab && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          aria-label="Scroll to newest message"
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
          className="absolute bottom-[130px] right-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-600 bg-slate-900/90 text-slate-100 shadow-lg shadow-slate-950/30 backdrop-blur hover:border-teal-300"
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </div>
  );
}
