import { useQuery } from '@tanstack/react-query';
import { Compass } from 'lucide-react';
import { contentService } from '@/services/services';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function PathwaysPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', 'pathways'],
    queryFn: async () => {
      const res = await contentService.pathways();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Pathways' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Pathways</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Progressive learning routes that guide you from foundation to maturity and leadership.
      </p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load pathways" className="mt-6">
          There was a problem loading pathways. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<Compass className="size-10" />}
          title="No pathways available yet"
          description="Pathways will appear here once administrators publish them."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((pathway) => (
            <Card key={pathway.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pathway.title}</CardTitle>
                {pathway.description && (
                  <CardDescription>{pathway.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}