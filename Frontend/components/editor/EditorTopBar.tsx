'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { TemplateSwitcher } from './TemplateSwitcher';

export function EditorTopBar() {
  const resume = useResumeStore((s) => s.resume);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);

  const handleExport = async () => {
    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData: resume }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-12 border-b flex items-center justify-between px-4 shrink-0 bg-white z-10">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-800">Cerevo AI</span>
        <span className="text-xs text-gray-400">|</span>
        <span className="text-xs text-gray-500">{resume.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setShowTemplateSwitcher(true)}
        >
          Change Template
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          ATS Check
        </Button>
        <Button size="sm" className="text-xs" onClick={handleExport}>
          Download PDF
        </Button>
      </div>
      <TemplateSwitcher
        open={showTemplateSwitcher}
        onClose={() => setShowTemplateSwitcher(false)}
      />
    </div>
  );
}
