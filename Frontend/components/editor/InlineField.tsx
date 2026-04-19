'use client';

import ContentEditable from 'react-contenteditable';
import { KeyboardEvent, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  tagName?: string;
  multiline?: boolean;
}

export function InlineField({
  value,
  onChange,
  className,
  placeholder = 'Click to edit...',
  tagName = 'div',
  multiline = false,
}: Props) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  const handleChange = (e: { target: { value: string } }) => {
    const raw = e.target.value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    ref.current = raw;
    onChange(raw);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <ContentEditable
      tagName={tagName}
      html={ref.current}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        'outline-none border border-transparent rounded cursor-text',
        'hover:border-blue-300 focus:border-blue-500 focus:bg-blue-50/30',
        'transition-colors duration-100 px-0.5 -mx-0.5',
        'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300',
        className
      )}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  );
}
