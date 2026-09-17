import { MessageSquare } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Community' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Community</h1>
      <p className="mt-2 text-slate-600">
        Discussions, prayer groups and fellowship spaces for the community.
      </p>

      <EmptyState
        className="mt-8"
        icon={<MessageSquare className="size-10" />}
        title="Community spaces are being prepared"
        description="Discussion groups and community features will be available in a future phase of the platform."
      />
    </div>
  );
}