import { FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function InstructorAssessmentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs
        items={[{ label: 'Instructor', href: '/instructor' }, { label: 'Assessments' }]}
      />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Assessments</h1>
      <p className="mt-2 text-slate-600">Design quizzes, exams and knowledge checks.</p>

      <EmptyState
        className="mt-8"
        icon={<FileText className="size-10" />}
        title="No assessments yet"
        description="Assessment authoring tools arrive in a later phase. Until then, this area is reserved for your assessment management."
      />
    </div>
  );
}