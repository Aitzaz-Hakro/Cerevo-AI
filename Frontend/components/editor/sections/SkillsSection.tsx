'use client';

import { ResumeSection } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { SectionTitle } from '../SectionTitle';

interface Props {
  section: ResumeSection;
}

export function SkillsSection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);
  if (section.data.type !== 'skills') return null;
  const { data } = section.data;

  const updateSkills = (field: 'technical' | 'interpersonal', value: string) => {
    const arr = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    updateSectionData(section.id, {
      type: 'skills',
      data: { ...data, [field]: arr },
    });
  };

  return (
    <div>
      <SectionTitle>Skills</SectionTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '10pt',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontWeight: '700', minWidth: '130px', flexShrink: 0 }}>
            Technical Skills:
          </span>
          <InlineField
            value={data.technical.join(', ')}
            onChange={(value) => updateSkills('technical', value)}
            multiline
            className="flex-1 text-[10pt] text-gray-700"
            placeholder="Next.js, TypeScript, React..."
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontWeight: '700', minWidth: '130px', flexShrink: 0 }}>
            Interpersonal:
          </span>
          <InlineField
            value={data.interpersonal.join(', ')}
            onChange={(value) => updateSkills('interpersonal', value)}
            multiline
            className="flex-1 text-[10pt] text-gray-700"
            placeholder="Communication, Leadership..."
          />
        </div>
      </div>
    </div>
  );
}
