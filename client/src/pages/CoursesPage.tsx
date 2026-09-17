import { useQuery } from '@tanstack/react-query';
import { GraduationCap } from 'lucide-react';
import { contentService } from '@/services/services';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function CoursesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', 'courses'],
    queryFn: async () => {
      const res = await contentService.courses();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Courses' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Courses</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Explore available courses across every program and stage of learning.
      </p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load courses" className="mt-6">
          There was a problem loading courses. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<GraduationCap className="size-10" />}
          title="No courses available yet"
          description="Courses will appear here once administrators publish them."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{course.title}</CardTitle>
                  {course.level && (
                    <Badge variant="neutral">{course.level}</Badge>
                  )}
                </div>
                {course.description && (
                  <CardDescription>{course.description}</CardDescription>
                )}
              </CardHeader>
              {course.estimatedMinutes != null && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-slate-500">
                    ≈ {Math.round(course.estimatedMinutes / 60 * 10) / 10}h estimated
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}