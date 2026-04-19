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
import { SortableSection } from '../SortableSection';
import { InlineField } from '../InlineField';
import { TemplateProvider } from './TemplateContext';
import { renderSection } from '../sections';

interface Props {
  resume: ResumeData;
}

export function SharpTemplate({ resume }: Props) {
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const updateSectionData = useResumeStore((s) => s.updateSectionData);

  const sections = [...resume.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
  const header = sections.find((s) => s.type === 'header');
  const bodySections = sections.filter((s) => s.type !== 'header');

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

  const hData = header?.data.type === 'header' ? header.data : null;

  const sharpSectionTitle = (label: string) => (
    <div style={{ marginBottom: '10px' }}>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '8.5pt',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#1e40af',
          background: '#dbeafe',
          padding: '2px 8px',
          borderRadius: '2px',
          display: 'inline-block',
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <TemplateProvider
      value={{
        templateId: 'sharp',
        accentColor: '#1e40af',
        fontFamily: 'Inter, sans-serif',
        sectionTitleRenderer: sharpSectionTitle,
      }}
    >
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10.5pt',
          color: '#1a1a1a',
          lineHeight: '1.45',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

        {hData && header && (
          <div
            style={{
              borderLeft: '3px solid #1e40af',
              paddingLeft: '12px',
              marginBottom: '20px',
            }}
          >
            <InlineField
              value={hData.name}
              onChange={(v) =>
                updateSectionData(header.id, { ...hData, name: v })
              }
              className="block text-[32pt] font-extrabold text-[#0f172a] leading-tight"
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
              className="block text-[11pt] font-semibold text-[#1e40af] mt-1"
              placeholder="Job Title"
            />
            <div
              style={{
                marginTop: '8px',
                fontSize: '9pt',
                color: '#6b7280',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px 10px',
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
                placeholder="email"
                className="text-[9pt]"
              />
              <span style={{ color: '#d1d5db' }}>|</span>
              <InlineField
                value={hData.contact.phone}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    contact: { ...hData.contact, phone: v },
                  })
                }
                placeholder="phone"
                className="text-[9pt]"
              />
              <span style={{ color: '#d1d5db' }}>|</span>
              <InlineField
                value={hData.contact.location}
                onChange={(v) =>
                  updateSectionData(header.id, {
                    ...hData,
                    contact: { ...hData.contact, location: v },
                  })
                }
                placeholder="location"
                className="text-[9pt]"
              />
              {hData.contact.linkedin && (
                <>
                  <span style={{ color: '#d1d5db' }}>|</span>
                  <InlineField
                    value={hData.contact.linkedin}
                    onChange={(v) =>
                      updateSectionData(header.id, {
                        ...hData,
                        contact: { ...hData.contact, linkedin: v },
                      })
                    }
                    placeholder="linkedin"
                    className="text-[9pt]"
                  />
                </>
              )}
              {hData.contact.github && (
                <>
                  <span style={{ color: '#d1d5db' }}>|</span>
                  <InlineField
                    value={hData.contact.github}
                    onChange={(v) =>
                      updateSectionData(header.id, {
                        ...hData,
                        contact: { ...hData.contact, github: v },
                      })
                    }
                    placeholder="github"
                    className="text-[9pt]"
                  />
                </>
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
