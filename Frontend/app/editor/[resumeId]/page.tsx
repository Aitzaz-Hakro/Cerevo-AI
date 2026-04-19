import dynamic from 'next/dynamic';

const EditorShell = dynamic(() => import('@/components/editor/EditorShell').then((m) => m.EditorShell), {
  ssr: false,
});

interface Props {
  params: { resumeId: string };
}

export default function EditorPage({ params }: Props) {
  return <EditorShell resumeId={params.resumeId} />;
}
