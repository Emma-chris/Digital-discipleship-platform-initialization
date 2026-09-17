import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

const adminNav = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/programs', label: 'Programs' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/pathways', label: 'Pathways' },
  { to: '/admin/mentors', label: 'Mentors' },
  { to: '/admin/assessments', label: 'Assessments' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>

      <nav
        aria-label="Admin sections"
        className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xs"
      >
        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-navy-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        {children ?? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">
                This admin section is implemented in a later phase.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function AdminPending({ message }: { message?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">
          {message ?? 'This admin section is implemented in a later phase.'}
        </p>
      </CardContent>
    </Card>
  );
}