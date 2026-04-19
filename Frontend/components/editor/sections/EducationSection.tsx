'use client';

import { EducationEntry, ResumeSection } from '@/types/resume';
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

  const updateEntry = (id: string, field: keyof EducationEntry, value: string) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    updateSectionData(section.id, { type: 'education', entries: updated });
  };

  const addEntry = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      degree: 'Degree',
      institution: 'Institution',
      location: 'City',
      graduationDate: 'Month Year',
    };
    updateSectionData(section.id, {
      type: 'education',
      entries: [...entries, newEntry],
    });
  };

  const removeEntry = (id: string) => {
    updateSectionData(section.id, {
      type: 'education',
      entries: entries.filter((entry) => entry.id !== id),
    });
  };

  return (
    <div>
      <SectionTitle>Education</SectionTitle>
      {entries.map((entry) => (
        <div key={entry.id} className="group relative" style={{ marginBottom: '10px' }}>
          <button
            onClick={() => removeEntry(entry.id)}
            className="absolute -right-5 -top-1 text-gray-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100"
            title="Remove education"
          >
            x
          </button>
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
      <button
        onClick={addEntry}
        className="text-[9pt] text-blue-400 hover:text-blue-600 mt-2 flex items-center gap-1"
      >
        <span>+</span> Add Education
      </button>
    </div>
  );
}
