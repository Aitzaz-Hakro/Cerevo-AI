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

const EXEC_COLOR = '#0f4c3a';

interface Props {
  resume: ResumeData;
}

export function ExecutiveTemplate({ resume }: Props) {
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

  const executiveSectionTitle = (label: string) => (
    <div
      style={{
        borderLeft: `3px solid ${EXEC_COLOR}`,
        paddingLeft: '8px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: EXEC_COLOR,
        marginBottom: '8px',
        fontSize: '9.5pt',
      }}
    >
      {label}
    </div>
  );

  return (
    <TemplateProvider
      value={{
        templateId: 'executive',
        accentColor: EXEC_COLOR,
        fontFamily: 'Lora, serif',
        sectionTitleRenderer: executiveSectionTitle,
      }}
    >
      <div
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '10.5pt',
          color: '#1a1a1a',
          lineHeight: '1.6',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');`}</style>

        {hData && header && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: `1px solid ${EXEC_COLOR}`,
              paddingBottom: '14px',
              marginBottom: '18px',
            }}
          >
            <div>
              <InlineField
                value={hData.name}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    name: v,
                  })
                }
                className="block text-[24pt] font-bold"
                style={{ color: EXEC_COLOR }}
                placeholder="Your Name"
              />
              <InlineField
                value={hData.jobTitle}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    jobTitle: v,
                  })
                }
                className="block text-[10.5pt] font-semibold mt-1"
                style={{ color: EXEC_COLOR }}
                placeholder="Job Title"
              />
            </div>
            <div
              style={{
                textAlign: 'right',
                fontSize: '9pt',
                color: '#555',
                lineHeight: '1.8',
              }}
            >
              <InlineField
                value={hData.contact.email}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    contact: { ...hData.contact, email: v },
                  })
                }
                className="block text-right text-[9pt]"
                placeholder="email"
              />
              <InlineField
                value={hData.contact.phone}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    contact: { ...hData.contact, phone: v },
                  })
                }
                className="block text-right text-[9pt]"
                placeholder="phone"
              />
              <InlineField
                value={hData.contact.location}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    contact: { ...hData.contact, location: v },
                  })
                }
                className="block text-right text-[9pt]"
                placeholder="location"
              />
              {hData.contact.linkedin && (
                <InlineField
                  value={hData.contact.linkedin}
                  onChange={(v) =>
                    updateSectionData(header.id, {
                      ...hData,
                      contact: { ...hData.contact, linkedin: v },
                    })
                  }
                  className="block text-right text-[9pt]"
                  placeholder="linkedin"
                />
              )}
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
