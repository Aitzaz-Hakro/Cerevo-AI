import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resume-store';

const DEBOUNCE_MS = 1500;

export function useAutoSave(resumeId: string) {
  const resume = useResumeStore((s) => s.resume);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/resume/${resumeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData: resume }),
        });
        console.log('Auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resume, resumeId]);
}
