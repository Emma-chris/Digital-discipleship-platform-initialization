import { useQuery } from '@tanstack/react-query';
import { Compass } from 'lucide-react';
import { contentService } from '@/services/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';

export default function MyProgressPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await contentService.progress();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Progress' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Progress</h1>
      <p className="mt-2 text-slate-600">Your completion status across all courses.</p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load progress" className="mt-6">
          There was a problem loading your progress. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<Compass className="size-10" />}
          title="No progress yet"
          description="Start a course and your progress will be tracked here."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 space-y-4">
          {data.map((item) => (
            <Card key={item.courseId} className="p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="truncate font-medium text-navy-900">Course progress</p>
                <Badge
                  variant={
                    item.status === 'completed'
                      ? 'success'
                      : item.status === 'in_progress'
                        ? 'brand'
                        : 'neutral'
                  }
                >
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={item.progressPercent} className="flex-1" />
                <span className="w-12 shrink-0 text-right text-sm font-semibold text-navy-900">
                  {item.progressPercent}%
                </span>
              </div>
              {item.completedAt && (
                <p className="mt-3 text-xs text-slate-500">
                  Completed {new Date(item.completedAt).toLocaleDateString()}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}