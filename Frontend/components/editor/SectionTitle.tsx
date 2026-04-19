'use client';

import { useTemplateContext } from './templates/TemplateContext';

export function SectionTitle({ children }: { children: string }) {
  const { sectionTitleRenderer } = useTemplateContext();
  return <>{sectionTitleRenderer(children)}</>;
}
