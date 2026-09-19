import { CalendarClock } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/feedback';

export default function MentorSessionsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Mentor', href: '/mentor' }, { label: 'Sessions' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Sessions</h1>
      <p className="mt-2 text-slate-600">Schedule, attend and record mentoring sessions.</p>

      <EmptyState
        className="mt-8"
        icon={<CalendarClock className="size-10" />}
        title="No sessions scheduled"
        description="When sessions are scheduled with your students, they will appear here with dates, notes and follow-ups."
      />
    </div>
  );
}