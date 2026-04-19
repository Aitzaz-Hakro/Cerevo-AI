import { EditorShellClient } from '@/components/editor/EditorShellClient';

interface Props {
  params: { resumeId: string };
}

export default function EditorPage({ params }: Props) {
  return <EditorShellClient resumeId={params.resumeId} />;
}
