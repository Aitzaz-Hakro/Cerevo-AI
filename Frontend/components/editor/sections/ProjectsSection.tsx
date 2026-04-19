'use client';

import { ResumeSection } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { SectionTitle } from '../SectionTitle';

interface Props {
  section: ResumeSection;
}

export function ProjectsSection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);
  if (section.data.type !== 'projects') return null;
  const { entries } = section.data;

  const updateEntry = (id: string, field: string, value: string) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    updateSectionData(section.id, { type: 'projects', entries: updated });
  };

  return (
    <div>
      <SectionTitle>Projects</SectionTitle>
      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: '10px' }}>
          <InlineField
            value={entry.name}
            onChange={(value) => updateEntry(entry.id, 'name', value)}
            className="text-[10.5pt] font-bold"
            placeholder="Project Name"
          />
          <InlineField
            value={entry.description}
            onChange={(value) => updateEntry(entry.id, 'description', value)}
            multiline
            className="text-[10pt] text-gray-700 leading-relaxed mt-0.5"
            placeholder="Describe the project and its impact..."
          />
        </div>
      ))}
    </div>
  );
}
