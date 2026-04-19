'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/store/resume-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const addSection = useResumeStore((s) => s.addSection);

  const AVAILABLE_SECTIONS = ['certifications', 'languages', 'custom'] as const;
  const existingTypes = sections.map((s) => s.type);
  const addable = AVAILABLE_SECTIONS.filter((t) => !existingTypes.includes(t));

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

      <div className="mt-2 px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-[10px] text-gray-400 hover:text-gray-700 py-2 flex items-center gap-1">
              <span>+</span> Add section
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {addable.length === 0 ? (
              <DropdownMenuItem disabled>All optional sections added</DropdownMenuItem>
            ) : (
              addable.map((type) => (
                <DropdownMenuItem key={type} onClick={() => addSection(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
