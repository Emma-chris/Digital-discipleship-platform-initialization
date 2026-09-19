import { useQuery } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import type { AdminStats } from '@church/shared';
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Presentation,
  Route,
  Shield,
  Users,
} from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { adminService } from '@/services/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/feedback';

const statCards: { key: keyof AdminStats; label: string; icon: LucideIcon }[] = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'organizations', label: 'Organizations', icon: Building2 },
  { key: 'programs', label: 'Programs', icon: Presentation },
  { key: 'courses', label: 'Courses', icon: GraduationCap },
  { key: 'pathways', label: 'Pathways', icon: Route },
  { key: 'assessments', label: 'Assessments', icon: ClipboardList },
  { key: 'mentors', label: 'Mentors', icon: Shield },
  { key: 'instructors', label: 'Instructors', icon: BookOpen },
];

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => (await adminService.stats()).data,
  });

  return (
    <AdminPanel
      title="Admin Overview"
      description="Live platform statistics across users, content and roles."
    >
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <Alert variant="danger" title="Unable to load statistics">
          There was a problem loading platform statistics. Please try again shortly.
        </Alert>
      )}

      {data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <Card key={item.key} className="p-5">
              <CardContent className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-navy-900">{data[item.key]}</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-navy-900">
          <BarChart3 className="size-4 text-brand-600" aria-hidden="true" />
          Platform analytics
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Trend visualisations and deeper analytics arrive in a later phase of the platform.
        </p>
      </div>
    </AdminPanel>
  );
}