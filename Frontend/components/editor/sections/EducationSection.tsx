'use client';

import { ResumeSection } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { SectionTitle } from '../SectionTitle';

interface Props {
  section: ResumeSection;
}

export function EducationSection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);
  if (section.data.type !== 'education') return null;
  const { entries } = section.data;

  const updateEntry = (id: string, field: string, value: string) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    updateSectionData(section.id, { type: 'education', entries: updated });
  };

  return (
    <div>
      <SectionTitle>Education</SectionTitle>
      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <InlineField
              value={entry.degree}
              onChange={(value) => updateEntry(entry.id, 'degree', value)}
              className="text-[10.5pt] font-bold"
              placeholder="Degree"
            />
            <InlineField
              value={entry.graduationDate}
              onChange={(value) => updateEntry(entry.id, 'graduationDate', value)}
              className="text-[9.5pt] text-gray-500"
              placeholder="Graduation Date"
            />
          </div>
          <InlineField
            value={entry.institution}
            onChange={(value) => updateEntry(entry.id, 'institution', value)}
            className="text-[10pt] text-gray-600 font-semibold"
            placeholder="Institution"
          />
        </div>
      ))}
    </div>
  );
}
