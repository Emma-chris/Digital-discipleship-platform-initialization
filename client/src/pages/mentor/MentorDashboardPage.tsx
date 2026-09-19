import { Link } from 'react-router-dom';
import { CalendarClock, Compass, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';

const sections = [
  {
    href: '/mentor/students',
    title: 'My Students',
    description: 'Manage your mentee roster, relationships and details.',
    icon: Users,
  },
  {
    href: '/mentor/progress',
    title: 'Student progress',
    description: 'Review individual, course and pathway progress.',
    icon: Compass,
  },
  {
    href: '/mentor/sessions',
    title: 'Sessions',
    description: 'Schedule and record mentoring sessions.',
    icon: CalendarClock,
  },
];

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName ?? user?.fullName ?? 'Mentor';

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Mentor' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Welcome, {displayName}</h1>
      <p className="mt-2 text-slate-600">
        Your mentorship dashboard — students, progress and sessions at a glance.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {sections.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <item.icon className="size-6 text-brand-600" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-navy-900">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-brand-600">Open about →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}