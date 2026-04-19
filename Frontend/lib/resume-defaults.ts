import { ResumeData } from '@/types/resume';
import { v4 as uuid } from 'uuid';

export function createDefaultResume(templateId = 'classic'): ResumeData {
  return {
    id: uuid(),
    templateId,
    title: 'My Resume',
    lastModified: new Date().toISOString(),
    sections: [
      {
        id: uuid(),
        type: 'header',
        order: 0,
        visible: true,
        data: {
          type: 'header',
          name: 'Your Name',
          jobTitle: 'Your Job Title',
          contact: {
            email: 'email@example.com',
            phone: '+1 555 000 0000',
            location: 'City, Country',
            linkedin: '',
            github: '',
          },
        },
      },
      {
        id: uuid(),
        type: 'summary',
        order: 1,
        visible: true,
        data: {
          type: 'summary',
          content: 'Write a 2–3 sentence professional summary here.',
        },
      },
      {
        id: uuid(),
        type: 'experience',
        order: 2,
        visible: true,
        data: {
          type: 'experience',
          entries: [
            {
              id: uuid(),
              jobTitle: 'Job Title',
              company: 'Company Name',
              location: 'City, Country',
              startDate: 'Jan 2023',
              endDate: 'Present',
              bullets: [
                'Describe your key achievement with a metric here.',
                'Second accomplishment with impact.',
              ],
            },
          ],
        },
      },
      {
        id: uuid(),
        type: 'education',
        order: 3,
        visible: true,
        data: {
          type: 'education',
          entries: [
            {
              id: uuid(),
              degree: 'Bachelor of Science in Computer Science',
              institution: 'University Name',
              location: 'City, Country',
              graduationDate: 'May 2024',
            },
          ],
        },
      },
      {
        id: uuid(),
        type: 'skills',
        order: 4,
        visible: true,
        data: {
          type: 'skills',
          data: {
            technical: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
            interpersonal: ['Communication', 'Problem Solving', 'Leadership'],
          },
        },
      },
      {
        id: uuid(),
        type: 'projects',
        order: 5,
        visible: true,
        data: {
          type: 'projects',
          entries: [
            {
              id: uuid(),
              name: 'Project Name',
              description: 'Brief description of the project and its impact.',
            },
          ],
        },
      },
    ],
  };
}
