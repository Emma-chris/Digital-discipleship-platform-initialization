import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { contentService } from '@/services/services';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function MentorshipPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', 'mentors'],
    queryFn: async () => {
      const res = await contentService.mentors();
      return res.data.items;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Mentorship' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Mentorship</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Connect with experienced mentors who will walk alongside you in your spiritual growth.
      </p>

      {isLoading && <PageLoader className="mt-8" />}

      {error && (
        <Alert variant="danger" title="Unable to load mentors" className="mt-6">
          There was a problem loading mentor information. Please try again shortly.
        </Alert>
      )}

      {data && data.length === 0 && (
        <EmptyState
          className="mt-8"
          icon={<Users className="size-10" />}
          title="No mentors listed yet"
          description="Mentor profiles will appear here once they are onboarded to the platform."
        />
      )}

      {data && data.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {(mentor.displayName ?? 'M').slice(0, 1).toUpperCase()}
                  </div>
                  <CardTitle className="text-base">{mentor.displayName ?? 'Mentor'}</CardTitle>
                </div>
                {mentor.bio && <CardDescription>{mentor.bio}</CardDescription>}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}