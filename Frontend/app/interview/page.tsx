import { InterviewShell } from '@/components/interview/InterviewShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Prep - Cerevo AI',
  description: 'Practice your interview with AI-powered questions tailored to your resume.',
};

export default function InterviewPage() {
  return <InterviewShell />;
}
