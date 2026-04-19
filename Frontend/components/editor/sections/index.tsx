import { ResumeSection } from '@/types/resume';
import { HeaderSection } from './HeaderSection';
import { SummarySection } from './SummarySection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';

export function renderSection(section: ResumeSection) {
  switch (section.type) {
    case 'header':
      return <HeaderSection section={section} />;
    case 'summary':
      return <SummarySection section={section} />;
    case 'experience':
      return <ExperienceSection section={section} />;
    case 'education':
      return <EducationSection section={section} />;
    case 'skills':
      return <SkillsSection section={section} />;
    case 'projects':
      return <ProjectsSection section={section} />;
    default:
      return null;
  }
}
