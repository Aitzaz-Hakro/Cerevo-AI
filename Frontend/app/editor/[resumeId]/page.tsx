import { EditorShell } from '@/components/editor/EditorShell';

interface Props {
  params: { resumeId: string };
}

export default function EditorPage({ params }: Props) {
  return <EditorShell resumeId={params.resumeId} />;
}
