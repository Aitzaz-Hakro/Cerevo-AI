'use client';

import ContentEditable from 'react-contenteditable';
import { CSSProperties, KeyboardEvent, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
  tagName?: string;
  multiline?: boolean;
}

export function InlineField({
  value,
  onChange,
  className,
  style,
  placeholder = 'Click to edit...',
  tagName = 'div',
  multiline = false,
}: Props) {
  const ref = useRef(value);

  useEffect(() => {
    if (value !== ref.current) {
      ref.current = value;
    }
  }, [value]);

  const handleChange = (e: { target: { value: string } }) => {
    ref.current = e.target.value;
    onChange(e.target.value);
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
      style={style}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  );
}
