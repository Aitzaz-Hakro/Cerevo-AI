'use client';

import { ResumeSection, ExperienceEntry } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { SectionTitle } from '../SectionTitle';

interface Props {
  section: ResumeSection;
}

export function ExperienceSection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);
  if (section.data.type !== 'experience') return null;

  const { entries } = section.data;

  const updateEntry = (
    entryId: string,
    field: keyof ExperienceEntry,
    value: string
  ) => {
    const updated = entries.map((entry) =>
      entry.id === entryId ? { ...entry, [field]: value } : entry
    );
    updateSectionData(section.id, { type: 'experience', entries: updated });
  };

  const updateBullet = (entryId: string, bulletIndex: number, value: string) => {
    const updated = entries.map((entry) => {
      if (entry.id !== entryId) return entry;
      const newBullets = [...entry.bullets];
      newBullets[bulletIndex] = value;
      return { ...entry, bullets: newBullets };
    });
    updateSectionData(section.id, { type: 'experience', entries: updated });
  };

  const addBullet = (entryId: string) => {
    const updated = entries.map((entry) =>
      entry.id === entryId
        ? { ...entry, bullets: [...entry.bullets, 'New achievement here'] }
        : entry
    );
    updateSectionData(section.id, { type: 'experience', entries: updated });
  };

  const removeBullet = (entryId: string, bulletIndex: number) => {
    const updated = entries.map((entry) => {
      if (entry.id !== entryId) return entry;
      const newBullets = entry.bullets.filter((_, index) => index !== bulletIndex);
      return { ...entry, bullets: newBullets };
    });
    updateSectionData(section.id, { type: 'experience', entries: updated });
  };

  return (
    <div>
      <SectionTitle>Work Experience</SectionTitle>
      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <InlineField
              value={entry.jobTitle}
              onChange={(value) => updateEntry(entry.id, 'jobTitle', value)}
              className="text-[10.5pt] font-bold"
              placeholder="Job Title"
            />
            <div style={{ display: 'flex', gap: '4px', fontSize: '9.5pt', color: '#555' }}>
              <InlineField
                value={entry.startDate}
                onChange={(value) => updateEntry(entry.id, 'startDate', value)}
                placeholder="Start"
                className="text-[9.5pt]"
              />
              <span>-</span>
              <InlineField
                value={entry.endDate}
                onChange={(value) => updateEntry(entry.id, 'endDate', value)}
                placeholder="End"
                className="text-[9.5pt]"
              />
            </div>
          </div>
          <InlineField
            value={`${entry.company}${entry.location ? ` — ${entry.location}` : ''}`}
            onChange={(value) => updateEntry(entry.id, 'company', value)}
            className="text-[10pt] text-gray-600 font-semibold mt-0.5 mb-1"
            placeholder="Company — Location"
          />
          <ul style={{ paddingLeft: '17px', listStyle: 'disc' }}>
            {entry.bullets.map((bullet, index) => (
              <li
                key={index}
                className="group"
                style={{
                  fontSize: '10pt',
                  color: '#2d2d2d',
                  marginBottom: '3px',
                  lineHeight: '1.45',
                  position: 'relative',
                }}
              >
                <InlineField
                  value={bullet}
                  onChange={(value) => updateBullet(entry.id, index, value)}
                  multiline
                  placeholder="Describe your achievement with a metric..."
                />
                <button
                  onClick={() => removeBullet(entry.id, index)}
                  className="absolute -right-5 top-0 text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100"
                  title="Remove bullet"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => addBullet(entry.id)}
            className="text-[9pt] text-blue-400 hover:text-blue-600 mt-1 ml-4"
          >
            + Add bullet
          </button>
        </div>
      ))}
    </div>
  );
}
