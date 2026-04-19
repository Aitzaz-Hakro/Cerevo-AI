'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = 'Type your answer...',
}: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
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
      handleSend();
    }
  };

  const handleInput = () => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  };

  return (
    <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-colors focus-within:border-gray-400">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className={cn(
          'min-h-6 max-h-[140px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-300',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all',
          value.trim() && !disabled
            ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
            : 'cursor-not-allowed bg-gray-100 text-gray-300'
        )}
        title="Send (Enter)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M13 7L1 1l3 6-3 6 12-6z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
