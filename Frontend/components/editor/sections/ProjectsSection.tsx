'use client';

import { ProjectEntry, ResumeSection } from '@/types/resume';
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

  const updateEntry = (id: string, field: keyof ProjectEntry, value: string) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    updateSectionData(section.id, { type: 'projects', entries: updated });
  };

  const addProject = () => {
    const newProject: ProjectEntry = {
      id: crypto.randomUUID(),
      name: 'Project Name',
      description: 'Describe this project and its impact.',
      link: '',
    };
    updateSectionData(section.id, {
      type: 'projects',
      entries: [...entries, newProject],
    });
  };

  const removeProject = (id: string) => {
    updateSectionData(section.id, {
      type: 'projects',
      entries: entries.filter((e) => e.id !== id),
    });
  };

  return (
    <div>
      <SectionTitle>Projects</SectionTitle>
      {entries.map((entry) => (
        <div key={entry.id} className="group relative" style={{ marginBottom: '10px' }}>
          <button
            onClick={() => removeProject(entry.id)}
            className="absolute -right-5 -top-1 text-gray-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100"
            title="Remove project"
          >
            x
          </button>
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
          <InlineField
            value={entry.link ?? ''}
            onChange={(value) => updateEntry(entry.id, 'link', value)}
            className="text-[9pt] text-blue-500 mt-0.5"
            placeholder="Project link (optional)"
          />
        </div>
      ))}
      <button
        onClick={addProject}
        className="text-[9pt] text-blue-400 hover:text-blue-600 mt-2 flex items-center gap-1"
      >
        <span>+</span> Add Project
      </button>
    </div>
  );
}
