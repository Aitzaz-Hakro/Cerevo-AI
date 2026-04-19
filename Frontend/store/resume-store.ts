import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ResumeData, ResumeSection, SectionData } from '@/types/resume';
import { createDefaultResume } from '@/lib/resume-defaults';
import { arrayMove } from '@dnd-kit/sortable';

interface ResumeStore {
  resume: ResumeData;
  activeBlockId: string | null;
  isSaving: boolean;

  initResume: (data?: ResumeData) => void;
  updateSectionData: (sectionId: string, data: Partial<SectionData>) => void;
  reorderSections: (oldIndex: number, newIndex: number) => void;
  addSection: (type: ResumeSection['type']) => void;
  removeSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveBlock: (id: string | null) => void;
  setTemplate: (templateId: string) => void;
  markSaved: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  immer((set) => ({
    resume: createDefaultResume(),
    activeBlockId: null,
    isSaving: false,

    initResume: (data) =>
      set((state) => {
        state.resume = data ?? createDefaultResume();
      }),

    updateSectionData: (sectionId, newData) =>
      set((state) => {
        const section = state.resume.sections.find((s) => s.id === sectionId);
        if (section) {
          Object.assign(section.data, newData);
          state.resume.lastModified = new Date().toISOString();
        }
      }),

    reorderSections: (oldIndex, newIndex) =>
      set((state) => {
        state.resume.sections = arrayMove(state.resume.sections, oldIndex, newIndex);
        state.resume.sections.forEach((s, i) => {
          s.order = i;
        });
      }),

    addSection: (type) =>
      set((state) => {
        const newSection: ResumeSection = {
          id: crypto.randomUUID(),
          type,
          order: state.resume.sections.length,
          visible: true,
          data: { type } as SectionData,
        };
        state.resume.sections.push(newSection);
      }),

    removeSection: (sectionId) =>
      set((state) => {
        state.resume.sections = state.resume.sections.filter((s) => s.id !== sectionId);
      }),

    toggleSectionVisibility: (sectionId) =>
      set((state) => {
        const section = state.resume.sections.find((s) => s.id === sectionId);
        if (section) section.visible = !section.visible;
      }),

    setActiveBlock: (id) =>
      set((state) => {
        state.activeBlockId = id;
      }),

    setTemplate: (templateId) =>
      set((state) => {
        state.resume.templateId = templateId;
      }),

    markSaved: () =>
      set((state) => {
        state.isSaving = false;
      }),
  }))
);
