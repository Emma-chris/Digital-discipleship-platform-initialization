import { Users } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function MyMentorshipPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Mentorship' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Mentorship</h1>
      <p className="mt-2 text-slate-600">
        Your mentor relationship, sessions and development notes.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Users className="size-10" />}
        title="No mentor assigned yet"
        description="When a mentor is assigned to you, their details, session history and guidance will appear here."
      />
    </div>
  );
}