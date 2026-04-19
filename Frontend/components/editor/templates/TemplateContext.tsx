'use client';

import { ReactNode, createContext, useContext } from 'react';

interface TemplateContextValue {
  templateId: string;
  accentColor: string;
  fontFamily: string;
  sectionTitleRenderer: (label: string) => ReactNode;
}

const defaultContext: TemplateContextValue = {
  templateId: 'classic',
  accentColor: '#1a1a1a',
  fontFamily: 'Georgia, serif',
  sectionTitleRenderer: (label: string) => (
    <div
      style={{
        fontFamily: 'Georgia, serif',
        fontSize: '10.5pt',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#0f0f0f',
        borderBottom: '1px solid #1a1a1a',
        paddingBottom: '3px',
        marginBottom: '10px',
      }}
    >
      {label}
    </div>
  ),
};

export const TemplateContext = createContext<TemplateContextValue>(defaultContext);

export function useTemplateContext() {
  return useContext(TemplateContext);
}

interface Props {
  value: Partial<TemplateContextValue>;
  children: ReactNode;
}

export function TemplateProvider({ value, children }: Props) {
  return (
    <TemplateContext.Provider value={{ ...defaultContext, ...value }}>
      {children}
    </TemplateContext.Provider>
  );
}
