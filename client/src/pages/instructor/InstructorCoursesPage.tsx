import { GraduationCap } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function InstructorCoursesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs
        items={[{ label: 'Instructor', href: '/instructor' }, { label: 'Courses' }]}
      />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Courses</h1>
      <p className="mt-2 text-slate-600">
        Courses, modules and lessons you are authoring for the platform.
      </p>

      <EmptyState
        className="mt-8"
        icon={<GraduationCap className="size-10" />}
        title="No courses yet"
        description="Course authoring tools arrive in a later phase. Until then, this area is reserved for your course management."
      />
    </div>
  );
}