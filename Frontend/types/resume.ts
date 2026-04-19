export type SectionType =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface SkillsData {
  technical: string[];
  interpersonal: string[];
}

export type SectionData =
  | { type: 'header'; name: string; jobTitle: string; contact: ContactInfo }
  | { type: 'summary'; content: string }
  | { type: 'experience'; entries: ExperienceEntry[] }
  | { type: 'education'; entries: EducationEntry[] }
  | { type: 'skills'; data: SkillsData }
  | { type: 'projects'; entries: ProjectEntry[] }
  | { type: 'certifications'; entries: CertificationEntry[] }
  | { type: 'languages'; items: { language: string; level: string }[] }
  | { type: 'custom'; title: string; content: string };

export interface ResumeSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  data: SectionData;
}

export interface ResumeData {
  id: string;
  templateId: string;
  title: string;
  sections: ResumeSection[];
  lastModified: string;
}
