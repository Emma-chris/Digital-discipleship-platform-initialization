import { Trophy } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';
import { Card, CardContent } from '@/components/ui/Card';

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Certificates' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Certificates</h1>
      <p className="mt-2 text-slate-600">
        A record of every course and pathway you have completed.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Trophy className="size-10" />}
        title="No certificates yet"
        description="Complete a course to earn your first certificate. "
      />

      <Card className="mt-8">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">
            Certificate design and issuance is planned for a later phase of the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}