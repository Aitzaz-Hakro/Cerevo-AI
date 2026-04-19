'use client';

import { ResumeSection } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';

interface Props {
  section: ResumeSection;
}

export function HeaderSection({ section }: Props) {
  const updateSectionData = useResumeStore((s) => s.updateSectionData);

  if (section.data.type !== 'header') return null;
  const { name, jobTitle, contact } = section.data;

  const update = (field: string, value: string) => {
    if (field === 'name' || field === 'jobTitle') {
      updateSectionData(section.id, {
        type: 'header',
        name,
        jobTitle,
        contact,
        [field]: value,
      });
    } else {
      updateSectionData(section.id, {
        type: 'header',
        name,
        jobTitle,
        contact: { ...contact, [field]: value },
      });
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        borderBottom: '2px solid #1a1a1a',
        paddingBottom: '14px',
        marginBottom: '16px',
      }}
    >
      <InlineField
        value={name}
        onChange={(value) => update('name', value)}
        className="text-[26pt] font-bold tracking-tight"
        placeholder="Your Name"
      />
      <InlineField
        value={jobTitle}
        onChange={(value) => update('jobTitle', value)}
        className="text-[11pt] font-semibold text-gray-500 uppercase tracking-widest mt-1"
        placeholder="Job Title"
      />
      <div
        style={{
          marginTop: '8px',
          fontSize: '9.5pt',
          color: '#333',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '4px 12px',
        }}
      >
        <InlineField
          value={contact.email}
          onChange={(value) => update('email', value)}
          placeholder="email@example.com"
          className="text-[9.5pt]"
        />
        <span style={{ color: '#ccc' }}>|</span>
        <InlineField
          value={contact.phone}
          onChange={(value) => update('phone', value)}
          placeholder="+1 555 000 0000"
          className="text-[9.5pt]"
        />
        <span style={{ color: '#ccc' }}>|</span>
        <InlineField
          value={contact.location}
          onChange={(value) => update('location', value)}
          placeholder="City, Country"
          className="text-[9.5pt]"
        />
        {contact.linkedin !== undefined && (
          <>
            <span style={{ color: '#ccc' }}>|</span>
            <InlineField
              value={contact.linkedin ?? ''}
              onChange={(value) => update('linkedin', value)}
              placeholder="LinkedIn URL"
              className="text-[9.5pt]"
            />
          </>
        )}
        {contact.github !== undefined && (
          <>
            <span style={{ color: '#ccc' }}>|</span>
            <InlineField
              value={contact.github ?? ''}
              onChange={(value) => update('github', value)}
              placeholder="GitHub URL"
              className="text-[9.5pt]"
            />
          </>
        )}
      </div>
    </div>
  );
}
