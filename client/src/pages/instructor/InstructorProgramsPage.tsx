import { Presentation } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function InstructorProgramsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs
        items={[{ label: 'Instructor', href: '/instructor' }, { label: 'Programs' }]}
      />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Programs</h1>
      <p className="mt-2 text-slate-600">
        Plan and sequence programs that group courses into learning journeys.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Presentation className="size-10" />}
        title="No programs yet"
        description="Program authoring tools arrive in a later phase. Until then, this area is reserved for your program management."
      />
    </div>
  );
}