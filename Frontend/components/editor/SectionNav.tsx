'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/store/resume-store';

const SECTION_LABELS: Record<string, string> = {
  header: 'Header',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  custom: 'Custom',
};

export function SectionNav() {
  const sections = useResumeStore((s) => s.resume.sections);
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="w-36 shrink-0 border-r bg-gray-50 flex flex-col py-3 overflow-y-auto">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
        Sections
      </p>
      {sortedSections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="text-left text-xs text-gray-600 px-3 py-2 hover:bg-white hover:text-gray-900 border-l-2 border-transparent hover:border-gray-900 transition-none"
        >
          {SECTION_LABELS[section.type] ?? section.type}
        </button>
      ))}
    </div>
  );
}
