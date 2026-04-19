'use client';

import { useCallback, useRef, useState } from 'react';
import { createInterviewSession } from '@/lib/interview-api';
import { cn } from '@/lib/utils';
import { useInterviewStore } from '@/store/interview-store';
import { ResumeSection } from '@/types/resume';

type Tab = 'upload' | 'paste' | 'cerevo';

const TABS: { id: Tab; label: string }[] = [
  { id: 'upload', label: 'Upload PDF' },
  { id: 'paste', label: 'Paste Text' },
  { id: 'cerevo', label: 'Use My Cerevo Resume' },
];

function looksLikeGarbledPdfText(text: string) {
  if (!text) {
    return true;
  }

  const cleaned = text.replace(/\s+/g, '');
  if (cleaned.length < 20) {
    return true;
  }

  const printableMatches = text.match(/[a-zA-Z0-9.,;:!?()\-\n\s]/g) ?? [];
  const printableRatio = printableMatches.length / Math.max(1, text.length);
  return printableRatio < 0.45;
}

function sectionToText(section: ResumeSection): string[] {
  const lines: string[] = [];

  if (!section.visible) {
    return lines;
  }

  if (section.data.type === 'header') {
    lines.push(`${section.data.name} ${section.data.jobTitle}`.trim());
    const c = section.data.contact;
    lines.push([c.email, c.phone, c.location, c.linkedin, c.github, c.website].filter(Boolean).join(' | '));
  }

  if (section.data.type === 'summary') {
    lines.push(`Summary:\n${section.data.content}`);
  }

  if (section.data.type === 'experience') {
    lines.push('Experience:');
    section.data.entries.forEach((entry) => {
      lines.push(`${entry.jobTitle} at ${entry.company} (${entry.startDate} - ${entry.endDate})`);
      entry.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
    });
  }

  if (section.data.type === 'skills') {
    lines.push(`Skills: ${section.data.data.technical.join(', ')}`);
  }

  if (section.data.type === 'projects') {
    lines.push('Projects:');
    section.data.entries.forEach((project) => {
      lines.push(`${project.name}: ${project.description}`);
    });
  }

  if (section.data.type === 'education') {
    lines.push('Education:');
    section.data.entries.forEach((entry) => {
      lines.push(`${entry.degree}, ${entry.institution}`);
    });
  }

  if (section.data.type === 'certifications') {
    lines.push('Certifications:');
    section.data.entries.forEach((entry) => {
      lines.push(`${entry.name} - ${entry.issuer} (${entry.date})`);
    });
  }

  if (section.data.type === 'languages') {
    lines.push('Languages:');
    section.data.items.forEach((item) => {
      lines.push(`${item.language}: ${item.level}`);
    });
  }

  if (section.data.type === 'custom') {
    lines.push(`${section.data.title}:`);
    lines.push(section.data.content);
  }

  return lines;
}

export function ResumeUploadStep() {
  const [tab, setTab] = useState<Tab>('upload');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = useInterviewStore((state) => state.isUploading);
  const setUploading = useInterviewStore((state) => state.setUploading);
  const setLoading = useInterviewStore((state) => state.setLoading);
  const setStage = useInterviewStore((state) => state.setStage);
  const setSession = useInterviewStore((state) => state.setSession);
  const addMessage = useInterviewStore((state) => state.addMessage);
  const setError = useInterviewStore((state) => state.setError);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const dropped = event.dataTransfer.files[0];
    if (!dropped) {
      return;
    }

    const isSupported =
      dropped.type === 'application/pdf' ||
      dropped.type.includes('text') ||
      /\.(pdf|txt|doc|docx)$/i.test(dropped.name);

    if (!isSupported) {
      setLocalError('Please drop a PDF, DOC, or text file.');
      return;
    }

    setFile(dropped);
    setLocalError('');
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      return;
    }

    setFile(selected);
    setLocalError('');
  };

  const extractTextFromFile = async (resumeFile: File): Promise<string> => {
    if (resumeFile.type.includes('text') || /\.(txt|md)$/i.test(resumeFile.name)) {
      return resumeFile.text();
    }

    const raw = await resumeFile.text().catch(() => '');

    if (!raw.trim() || looksLikeGarbledPdfText(raw)) {
      return `Resume file: ${resumeFile.name}`;
    }

    return raw;
  };

  const getCerevoResumeText = async (): Promise<string> => {
    const { useResumeStore } = await import('@/store/resume-store');
    const resume = useResumeStore.getState().resume;

    const lines = resume.sections
      .sort((a, b) => a.order - b.order)
      .flatMap((section) => sectionToText(section));

    return lines.join('\n\n').trim();
  };

  const handleStart = async () => {
    setLocalError('');
    setError(null);

    let resumeText = '';

    if (tab === 'upload') {
      if (!file) {
        setLocalError('Please select a resume file.');
        return;
      }

      setUploading(true);
      try {
        resumeText = await extractTextFromFile(file);
      } catch {
        setLocalError('Could not read the file. Try pasting the resume text instead.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (tab === 'paste') {
      if (!pastedText.trim() || pastedText.trim().length < 50) {
        setLocalError('Please paste at least 50 characters of resume text.');
        return;
      }
      resumeText = pastedText.trim();
    }

    if (tab === 'cerevo') {
      try {
        resumeText = await getCerevoResumeText();
      } catch {
        setLocalError('Could not load your Cerevo resume. Try the paste option instead.');
        return;
      }

      if (!resumeText) {
        setLocalError('No resume found in the builder yet. Create one first, then retry.');
        return;
      }
    }

    if (!resumeText.trim()) {
      setLocalError('Resume content is required to start an interview.');
      return;
    }

    setLoading(true);

    try {
      const session = await createInterviewSession({
        resumeText,
      });

      setSession({
        sessionId: session.sessionId,
        status: 'active',
        questionNumber: 1,
        totalQuestions: session.totalQuestions,
        isComplete: false,
      });

      addMessage({
        role: 'ai',
        content: session.firstMessage,
        questionNumber: 1,
      });

      setStage('chat');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start interview';
      setError(message);
      setLocalError(message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900">
            <span className="text-sm font-semibold text-white">AI</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">AI Interview Practice</h1>
          <p className="text-sm leading-relaxed text-gray-500">
            Upload your resume and get tailored interview questions, feedback, and a final summary.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex border-b border-gray-100">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex-1 py-3 text-xs font-medium transition-colors',
                  tab === item.id
                    ? '-mb-px border-b-2 border-gray-900 bg-white text-gray-900'
                    : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'upload' && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all',
                  dragging
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  file && 'border-green-300 bg-green-50'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB - click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Drop your resume here</p>
                    <p className="mt-1 text-xs text-gray-400">or click to browse PDF, DOC, or TXT files</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'paste' && (
              <textarea
                value={pastedText}
                onChange={(event) => setPastedText(event.target.value)}
                placeholder="Paste your resume content here. Include experience, projects, skills, and education."
                className="h-48 w-full resize-none rounded-xl border border-gray-200 p-4 font-mono text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-300 focus:border-gray-400"
              />
            )}

            {tab === 'cerevo' && (
              <div className="py-6 text-center">
                <p className="mb-1 text-sm font-medium text-gray-800">Use your saved Cerevo resume</p>
                <p className="text-xs leading-relaxed text-gray-400">
                  Resume content will be pulled from the resume builder and sent through the interview proxy.
                </p>
              </div>
            )}

            {localError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                {localError}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={isUploading}
              className={cn(
                'mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-all',
                isUploading
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
              )}
            >
              {isUploading ? 'Processing resume...' : 'Start Interview'}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Typical flow: 8-12 questions in about 15-20 minutes with AI feedback
        </p>
      </div>
    </div>
  );
}
