import { useQuery } from '@tanstack/react-query';
import { GraduationCap } from 'lucide-react';
import { contentService } from '@/services/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';

export default function MyCoursesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await contentService.enrollments();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Courses' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Courses</h1>
      <p className="mt-2 text-slate-600">Every course you have enrolled in.</p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load enrollments" className="mt-6">
          There was a problem loading your courses. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<GraduationCap className="size-10" />}
          title="You have not enrolled in any courses yet"
          description="Enroll in a course to begin learning and track your progress."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.map((course) => (
            <Card key={course.courseId} className="flex items-center justify-between p-5">
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium text-navy-900">{course.title}</p>
                <p className="text-xs text-slate-500">
                  Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                  {course.completedAt
                    ? ` · Completed ${new Date(course.completedAt).toLocaleDateString()}`
                    : ''}
                </p>
              </div>
              <Badge
                variant={
                  course.status === 'completed'
                    ? 'success'
                    : course.status === 'dropped'
                      ? 'danger'
                      : 'default'
                }
              >
                {course.status}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}