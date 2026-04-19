'use client';

import { useEffect } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { EditorTopBar } from './EditorTopBar';
import { SectionNav } from './SectionNav';
import { ResumeCanvas } from './ResumeCanvas';
import { ScorePanel } from './ScorePanel';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Props {
  resumeId: string;
}

export function EditorShell({ resumeId }: Props) {
  const initResume = useResumeStore((s) => s.initResume);

  useAutoSave(resumeId);

  useEffect(() => {
    // TODO: fetch resume by resumeId from your Supabase/Prisma backend
    // For now, initialize with defaults
    initResume();
  }, [initResume, resumeId]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <EditorTopBar />
      <div className="flex flex-1 overflow-hidden">
        <SectionNav />
        <ResumeCanvas />
        <ScorePanel />
      </div>
    </div>
  );
}
