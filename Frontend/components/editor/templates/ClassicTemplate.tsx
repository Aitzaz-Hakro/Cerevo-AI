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
import { renderSection } from '../sections';
import { SortableSection } from '../SortableSection';
import { useResumeStore } from '@/store/resume-store';
import { TemplateProvider } from './TemplateContext';

interface Props {
  resume: ResumeData;
}

export function ClassicTemplate({ resume }: Props) {
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const sections = [...resume.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

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

  return (
    <TemplateProvider
      value={{
        templateId: 'classic',
        accentColor: '#1a1a1a',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: '10.5pt',
          color: '#1a1a1a',
          lineHeight: '1.45',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
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
