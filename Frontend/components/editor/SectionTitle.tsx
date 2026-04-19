import { ReactNode } from 'react';

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </div>
  );
}
