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

const SIDEBAR_BG = '#1e293b';
const SIDEBAR_TEXT = '#cbd5e1';
const SIDEBAR_MUTED = '#64748b';

interface Props {
  resume: ResumeData;
}

export function SidebarProTemplate({ resume }: Props) {
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const updateSectionData = useResumeStore((s) => s.updateSectionData);

  const allSections = [...resume.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
  const header = allSections.find((s) => s.type === 'header');
  const hData = header?.data.type === 'header' ? header.data : null;
  const skillsSection = allSections.find((s) => s.type === 'skills');
  const mainSections = allSections.filter(
    (s) => s.type !== 'header' && s.type !== 'skills'
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = allSections.findIndex((s) => s.id === active.id);
    const newIndex = allSections.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderSections(oldIndex, newIndex);
  };

  const rightSectionTitle = (label: string) => (
    <div
      style={{
        fontSize: '9.5pt',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#1e293b',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '3px',
        marginBottom: '10px',
      }}
    >
      {label}
    </div>
  );

  const sidebarSectionTitle = (label: string) => (
    <div
      style={{
        fontSize: '7pt',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: SIDEBAR_MUTED,
        borderBottom: '0.5px solid #334155',
        paddingBottom: '4px',
        marginBottom: '8px',
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '10pt',
        color: '#1a1a1a',
        lineHeight: '1.5',
        display: 'flex',
        minHeight: '100%',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <div
        style={{
          width: '200px',
          flexShrink: 0,
          background: SIDEBAR_BG,
          padding: '28px 18px',
          color: SIDEBAR_TEXT,
        }}
      >
        {hData && header && (
          <div style={{ marginBottom: '24px' }}>
            <InlineField
              value={hData.name}
              onChange={(v) =>
                updateSectionData(header.id, { ...hData, name: v })
              }
              className="block text-[16pt] font-bold text-white leading-tight"
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
              className="block text-[8.5pt] uppercase tracking-wider mt-2"
              style={{ color: '#94a3b8' }}
              placeholder="Job Title"
            />
          </div>
        )}

        {hData && header && (
          <div style={{ marginBottom: '20px' }}>
            {sidebarSectionTitle('Contact')}
            {[
              { icon: '@', field: 'email', val: hData.contact.email },
              { icon: 'T', field: 'phone', val: hData.contact.phone },
              { icon: 'L', field: 'location', val: hData.contact.location },
              { icon: 'in', field: 'linkedin', val: hData.contact.linkedin },
              { icon: 'gh', field: 'github', val: hData.contact.github },
            ]
              .filter((c) => c.val)
              .map((c) => (
                <div
                  key={c.field}
                  style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'flex-start',
                    marginBottom: '5px',
                    fontSize: '8.5pt',
                    color: SIDEBAR_TEXT,
                    lineHeight: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      marginTop: '1px',
                      flexShrink: 0,
                      opacity: 0.8,
                    }}
                  >
                    {c.icon}
                  </span>
                  <InlineField
                    value={c.val ?? ''}
                    onChange={(v) =>
                      updateSectionData(header.id, {
                        ...hData,
                        contact: { ...hData.contact, [c.field]: v },
                      })
                    }
                    className="text-[8.5pt] break-all"
                    style={{ color: SIDEBAR_TEXT }}
                    placeholder={c.field}
                  />
                </div>
              ))}
          </div>
        )}

        {skillsSection && skillsSection.data.type === 'skills' && (
          <div>
            {sidebarSectionTitle('Skills')}
            <div style={{ marginBottom: '8px' }}>
              <div
                style={{
                  fontSize: '7.5pt',
                  color: SIDEBAR_MUTED,
                  marginBottom: '4px',
                  fontWeight: '600',
                }}
              >
                Technical
              </div>
              {skillsSection.data.data.technical.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '8.5pt',
                    color: SIDEBAR_TEXT,
                    marginBottom: '3px',
                    paddingLeft: '6px',
                    borderLeft: '2px solid #334155',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: '7.5pt',
                  color: SIDEBAR_MUTED,
                  marginBottom: '4px',
                  fontWeight: '600',
                  marginTop: '8px',
                }}
              >
                Interpersonal
              </div>
              {skillsSection.data.data.interpersonal.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '8.5pt',
                    color: SIDEBAR_TEXT,
                    marginBottom: '3px',
                    paddingLeft: '6px',
                    borderLeft: '2px solid #334155',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TemplateProvider
        value={{
          templateId: 'sidebar-pro',
          accentColor: '#1e293b',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          sectionTitleRenderer: rightSectionTitle,
        }}
      >
        <div style={{ flex: 1, padding: '28px' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={mainSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {mainSections.map((section) => (
                <SortableSection key={section.id} section={section}>
                  {renderSection(section)}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </TemplateProvider>
    </div>
  );
}
