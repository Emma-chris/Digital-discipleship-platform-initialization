import { Settings as SettingsIcon } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
      <div className="mt-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-navy-900">
          <SettingsIcon className="size-7 text-brand-600" aria-hidden="true" />
          Settings
        </h1>
        <p className="mt-2 text-slate-600">
          Platform and account preferences managed here.
        </p>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Notification and preference settings will appear here in a future phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            This section is being prepared. Check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}