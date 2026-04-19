'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/store/resume-store';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { renderSection } from './sections';

export function ResumeCanvas() {
  const sections = useResumeStore((s) => s.resume.sections);
  const visibleSections = useMemo(
    () =>
      [...sections]
        .filter((section) => section.visible)
        .sort((a, b) => a.order - b.order),
    [sections]
  );
  const reorderSections = useResumeStore((s) => s.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = visibleSections.findIndex((section) => section.id === active.id);
    const newIndex = visibleSections.findIndex((section) => section.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#e8e8e8] flex justify-center py-8 px-4">
      <div
        className="bg-white shadow-md"
        style={{
          width: '794px',
          minHeight: '1123px',
          padding: '48px 54px',
          fontFamily: "'Georgia', serif",
          fontSize: '10.5pt',
          color: '#1a1a1a',
          lineHeight: '1.45',
          position: 'relative',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleSections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {visibleSections.map((section) => (
              <SortableSection key={section.id} section={section}>
                {renderSection(section)}
              </SortableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
