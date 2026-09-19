import { Users } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function MentorStudentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Mentor', href: '/mentor' }, { label: 'My Students' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Students</h1>
      <p className="mt-2 text-slate-600">
        The students you mentor, their relationships and contact details.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Users className="size-10" />}
        title="No students assigned yet"
        description="When students are assigned to you, their names, progress overview and contact details will appear here."
      />
    </div>
  );
}