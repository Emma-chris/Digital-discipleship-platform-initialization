import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { contentService } from '@/services/services';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ProgramsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', 'programs'],
    queryFn: async () => {
      const res = await contentService.programs();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Programs</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Structured learning programs that guide you through every stage of spiritual growth.
      </p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load programs" className="mt-6">
          There was a problem loading programs. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<BookOpen className="size-10" />}
          title="No programs available yet"
          description="Programs will appear here once administrators publish them."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
                {program.description && (
                  <CardDescription>{program.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}