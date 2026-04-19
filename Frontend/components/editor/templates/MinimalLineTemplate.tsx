'use client';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ResumeData } from '@/types/resume';
import { useResumeStore } from '@/store/resume-store';
import { InlineField } from '../InlineField';
import { renderSection } from '../sections';
import { SortableSection } from '../SortableSection';
import { TemplateProvider } from './TemplateContext';

interface Props {
  resume: ResumeData;
}

export function MinimalLineTemplate({ resume }: Props) {
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const updateSectionData = useResumeStore((s) => s.updateSectionData);

  const sections = [...resume.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
  const header = sections.find((s) => s.type === 'header');
  const bodySections = sections.filter((s) => s.type !== 'header');
  const hData = header?.data.type === 'header' ? header.data : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderSections(oldIndex, newIndex);
  };

  const minimalSectionTitle = (label: string) => (
    <div
      style={{
        fontSize: '8pt',
        fontWeight: '400',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        color: '#9ca3af',
        borderBottom: '0.5px solid #e5e7eb',
        paddingBottom: '4px',
        marginBottom: '12px',
      }}
    >
      {label}
    </div>
  );

  const contactFields: Array<'email' | 'phone' | 'location' | 'linkedin' | 'github'> = [
    'email',
    'phone',
    'location',
    'linkedin',
    'github',
  ];

  return (
    <TemplateProvider
      value={{
        templateId: 'minimal-line',
        accentColor: '#111',
        fontFamily: 'DM Sans, sans-serif',
        sectionTitleRenderer: minimalSectionTitle,
      }}
    >
      <div
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '10.5pt',
          color: '#1a1a1a',
          lineHeight: '1.5',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

        {hData && header && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '0.5px solid #e5e7eb',
            }}
          >
            <InlineField
              value={hData.name}
              onChange={(v) =>
                updateSectionData(header.id, { ...hData, name: v })
              }
              className="block text-[22pt] font-light tracking-widest uppercase text-[#111]"
              placeholder="YOUR NAME"
            />
            <InlineField
              value={hData.jobTitle}
              onChange={(v) =>
                updateSectionData(header.id, {
                  ...hData,
                  jobTitle: v,
                })
              }
              className="block text-[10pt] text-gray-400 tracking-wide mt-2"
              placeholder="Job Title"
            />
            <div
              style={{
                marginTop: '8px',
                fontSize: '9pt',
                color: '#9ca3af',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '4px 6px',
                alignItems: 'center',
              }}
            >
              {contactFields
                .filter((field) => Boolean(hData.contact[field]))
                .map((field, idx, arr) => (
                  <span
                    key={field}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <InlineField
                      value={hData.contact[field] ?? ''}
                      onChange={(v) =>
                        updateSectionData(header.id, {
                          ...hData,
                          contact: { ...hData.contact, [field]: v },
                        })
                      }
                      className="text-[9pt]"
                    />
                    {idx < arr.length - 1 && (
                      <span style={{ color: '#d1d5db' }}>.</span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={bodySections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {bodySections.map((section) => (
              <SortableSection key={section.id} section={section}>
                {renderSection(section)}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </TemplateProvider>
  );
}
