'use client';

import { ResumeData } from '@/types/resume';
import { ClassicTemplate } from './ClassicTemplate';
import { SharpTemplate } from './SharpTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalLineTemplate } from './MinimalLineTemplate';
import { SidebarProTemplate } from './SidebarProTemplate';

interface Props {
  resume: ResumeData;
}

export function TemplateRenderer({ resume }: Props) {
  switch (resume.templateId) {
    case 'sharp':
      return <SharpTemplate resume={resume} />;
    case 'executive':
      return <ExecutiveTemplate resume={resume} />;
    case 'minimal-line':
      return <MinimalLineTemplate resume={resume} />;
    case 'sidebar-pro':
      return <SidebarProTemplate resume={resume} />;
    case 'classic':
    default:
      return <ClassicTemplate resume={resume} />;
  }
}
