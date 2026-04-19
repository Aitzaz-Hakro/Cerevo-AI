'use client';

import { ResumeSection } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { SectionTitle } from '../SectionTitle';

interface Props {
  section: ResumeSection;
}

export function SummarySection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);
  if (section.data.type !== 'summary') return null;

  return (
    <div>
      <SectionTitle>Summary</SectionTitle>
      <InlineField
        value={section.data.content}
        onChange={(value) =>
          updateSectionData(section.id, { type: 'summary', content: value })
        }
        multiline
        className="text-[10pt] text-gray-700 leading-relaxed w-full"
        placeholder="Write your professional summary here..."
      />
    </div>
  );
}
