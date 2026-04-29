'use client';

import { cn } from '@/lib/utils';
import { Loader2, Lock, SendHorizonal } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

interface InputBarProps {
  disabled: boolean;
  isPending: boolean;
  onSend: (value: string) => void;
}

export function InputBar({ disabled, isPending, onSend }: InputBarProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-3 shadow-xl shadow-slate-950/40 backdrop-blur">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Type your interview answer"
          placeholder={isPending ? 'Waiting for AI response...' : 'Type your answer here...'}
          className={cn(
            'max-h-[140px] min-h-10 flex-1 resize-none rounded-xl border border-transparent bg-slate-950/70 px-3 py-2 text-[15px] leading-relaxed text-slate-100 outline-none transition placeholder:text-slate-500 focus-visible:border-teal-300/70 focus-visible:shadow-[0_0_0_2px_rgba(45,212,191,0.3)]',
            disabled && 'cursor-not-allowed opacity-80'
          )}
        />

        <button
          type="button"
          onClick={submit}
          aria-label="Send answer"
          disabled={disabled || !value.trim()}
          className={cn(
            'mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition active:scale-95',
            value.trim() && !disabled
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 hover:brightness-110'
              : 'cursor-not-allowed bg-slate-700 text-slate-400'
          )}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <SendHorizonal className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
        <p className="text-slate-400">Be detailed. Aim for 3-5 sentences.</p>
        {disabled && (
          <span className="inline-flex items-center gap-1 text-amber-300" aria-label="Input locked while waiting for AI response">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Input Locked
          </span>
        )}
      </div>
    </div>
  );
}
