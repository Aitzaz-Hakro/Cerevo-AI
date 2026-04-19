'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResumeStore } from '@/store/resume-store';
import { TEMPLATES } from '@/lib/templates/registry';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TemplateSwitcher({ open, onClose }: Props) {
  const currentTemplateId = useResumeStore((s) => s.resume.templateId);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  const handleSelect = (id: string) => {
    setTemplate(id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={cn(
                'border rounded-lg p-3 text-left hover:border-gray-400 transition-all',
                currentTemplateId === t.id
                  ? 'border-2 border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              )}
            >
              <div
                className="w-full h-24 rounded mb-2 flex items-end p-2"
                style={{
                  background: '#f8f8f8',
                  borderLeft: `4px solid ${t.previewColor}`,
                }}
              >
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      height: '6px',
                      background: t.previewColor,
                      borderRadius: '2px',
                      width: '60%',
                      marginBottom: '4px',
                    }}
                  />
                  <div
                    style={{
                      height: '3px',
                      background: '#e5e7eb',
                      borderRadius: '2px',
                      width: '80%',
                      marginBottom: '3px',
                    }}
                  />
                  <div
                    style={{
                      height: '3px',
                      background: '#e5e7eb',
                      borderRadius: '2px',
                      width: '70%',
                    }}
                  />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800">{t.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                {t.description}
              </div>
              <div className="text-xs text-green-600 font-medium mt-1">
                ATS {t.atsScore}/100
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
