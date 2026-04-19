export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'modern' | 'executive' | 'creative';
  previewColor: string;
  atsScore: number;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description:
      'Traditional serif layout. Highest ATS score. Best for finance, law, and corporate roles.',
    category: 'minimal',
    previewColor: '#1a1a1a',
    atsScore: 99,
  },
  {
    id: 'sharp',
    name: 'Sharp Modern',
    description:
      'Clean sans-serif with a bold name block. Ideal for tech, product, and startups.',
    category: 'modern',
    previewColor: '#1e40af',
    atsScore: 97,
  },
  {
    id: 'executive',
    name: 'Executive',
    description:
      'Wide left rule accent and generous spacing. Suited for senior roles and management.',
    category: 'executive',
    previewColor: '#0f4c3a',
    atsScore: 98,
  },
  {
    id: 'minimal-line',
    name: 'Minimal Line',
    description:
      'Ultra-light lines and open whitespace. Great for design, UX, and creative fields.',
    category: 'creative',
    previewColor: '#6b7280',
    atsScore: 95,
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    description:
      'Two-column layout with a dark left sidebar for contact and skills.',
    category: 'modern',
    previewColor: '#1e293b',
    atsScore: 93,
  },
];
