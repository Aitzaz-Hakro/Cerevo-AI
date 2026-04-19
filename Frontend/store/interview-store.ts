import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  ChatMessage,
  InterviewResult,
  InterviewSession,
  InterviewStage,
} from '@/types/interview';

interface InterviewStore {
  stage: InterviewStage;
  session: InterviewSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  result: InterviewResult | null;
  setStage: (stage: InterviewStage) => void;
  setSession: (session: InterviewSession) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  setResult: (result: InterviewResult) => void;
  updateSession: (updates: Partial<InterviewSession>) => void;
  reset: () => void;
}

const initialState = {
  stage: 'upload' as InterviewStage,
  session: null,
  messages: [],
  isLoading: false,
  isUploading: false,
  error: null,
  result: null,
};

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useInterviewStore = create<InterviewStore>()(
  immer((set) => ({
    ...initialState,

    setStage: (stage) =>
      set((state) => {
        state.stage = stage;
      }),

    setSession: (session) =>
      set((state) => {
        state.session = session;
      }),

    addMessage: (message) =>
      set((state) => {
        state.messages.push({
          ...message,
          id: createMessageId(),
          timestamp: new Date(),
        });
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setUploading: (uploading) =>
      set((state) => {
        state.isUploading = uploading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    setResult: (result) =>
      set((state) => {
        state.result = result;
      }),

    updateSession: (updates) =>
      set((state) => {
        if (state.session) {
          Object.assign(state.session, updates);
        }
      }),

    reset: () =>
      set(() => ({
        ...initialState,
      })),
  }))
);
