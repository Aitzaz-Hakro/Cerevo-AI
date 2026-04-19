'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResumeSection } from '@/types/resume';
import { ReactNode, useState } from 'react';
import { useResumeStore } from '@/store/resume-store';

interface Props {
  section: ResumeSection;
  children: ReactNode;
}

export function SortableSection({ section, children }: Props) {
  const [hovered, setHovered] = useState(false);
  const toggleVisibility = useResumeStore((s) => s.toggleSectionVisibility);
  const removeSection = useResumeStore((s) => s.removeSection);

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
    <div
      ref={setNodeRef}
      style={style}
      id={`section-${section.id}`}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && section.type !== 'header' && (
        <div
          style={{
            position: 'absolute',
            top: '-22px',
            right: 0,
            display: 'flex',
            gap: '2px',
            background: 'white',
            border: '0.5px solid #e5e7eb',
            borderRadius: '4px',
            padding: '2px 4px',
            zIndex: 50,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <button
            {...attributes}
            {...listeners}
            title="Drag to reorder"
            style={{
              cursor: 'grab',
              padding: '0 4px',
              fontSize: '12px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
            }}
          >
            ⠿
          </button>
          <button
            onClick={() => toggleVisibility(section.id)}
            title="Toggle visibility"
            style={{
              padding: '0 4px',
              fontSize: '11px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {section.visible ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Remove ${section.type} section?`)) {
                removeSection(section.id);
              }
            }}
            title="Delete section"
            style={{
              padding: '0 4px',
              fontSize: '11px',
              color: '#ef4444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Del
          </button>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
