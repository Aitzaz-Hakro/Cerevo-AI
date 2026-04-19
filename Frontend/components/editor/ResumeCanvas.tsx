'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { RichTextToolbar } from './RichTextToolbar';

const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

export function ResumeCanvas() {
  const resume = useResumeStore((s) => s.resume);
  const paperRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!paperRef.current) return;

    const observer = new ResizeObserver(() => {
      const height = paperRef.current?.scrollHeight ?? 0;
      setPageCount(Math.max(1, Math.ceil(height / A4_HEIGHT_PX)));
    });

    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="resume-canvas-scroll"
      className="flex-1 overflow-y-auto bg-[#e8e8e8] py-8 px-4 relative"
    >
      <RichTextToolbar />
      <div
        className="relative mx-auto"
        style={{ width: `${A4_WIDTH_PX}px` }}
      >
        <div
          ref={paperRef}
          className="bg-white shadow-md"
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            padding: '48px 54px',
            position: 'relative',
          }}
        >
          <TemplateRenderer resume={resume} />
        </div>

        {pageCount > 1 &&
          Array.from({ length: pageCount - 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${(i + 1) * A4_HEIGHT_PX}px`,
                left: 0,
                right: 0,
                height: '1px',
                background: '#94a3b8',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: '-10px',
                  background: '#e8e8e8',
                  padding: '0 8px',
                  fontSize: '9px',
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                }}
              >
                - Page {i + 2} -
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
