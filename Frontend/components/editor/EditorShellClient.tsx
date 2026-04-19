'use client';

import dynamic from 'next/dynamic';

const EditorShell = dynamic(
  () => import('./EditorShell').then((m) => m.EditorShell),
  {
    ssr: false,
  }
);

interface Props {
  resumeId: string;
}

export function EditorShellClient({ resumeId }: Props) {
  return <EditorShell resumeId={resumeId} />;
}
