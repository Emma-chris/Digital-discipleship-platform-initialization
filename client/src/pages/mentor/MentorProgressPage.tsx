import { Compass } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function MentorProgressPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Mentor', href: '/mentor' }, { label: 'Progress' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Student Progress</h1>
      <p className="mt-2 text-slate-600">
        Track each student's progress across individual courses and pathways.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Compass className="size-10" />}
        title="No progress data yet"
        description="Once students are enrolled and working through content, their progress and completion rates will appear here."
      />
    </div>
  );
}