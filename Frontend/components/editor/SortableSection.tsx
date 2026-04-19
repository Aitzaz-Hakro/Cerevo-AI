'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResumeSection } from '@/types/resume';
import { ReactNode } from 'react';

interface Props {
  section: ResumeSection;
  children: ReactNode;
}

export function SortableSection({ section, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    marginBottom: '16px',
  };

  return (
    <div ref={setNodeRef} style={style} id={`section-${section.id}`} className="group">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-7 top-1 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
        title="Drag to reorder"
      >
        ⠿
      </div>
      <div>{children}</div>
    </div>
  );
}
