import { Link } from 'react-router-dom';
import { GraduationCap, Presentation, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';

const sections = [
  {
    href: '/instructor/courses',
    title: 'Courses',
    description: 'Create and manage courses, modules and lessons.',
    icon: GraduationCap,
  },
  {
    href: '/instructor/programs',
    title: 'Programs',
    description: 'Draft curriculum sequences and program structure.',
    icon: Presentation,
  },
  {
    href: '/instructor/assessments',
    title: 'Assessments',
    description: 'Design quizzes, exams and knowledge checks.',
    icon: FileText,
  },
];

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName ?? user?.fullName ?? 'Instructor';

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Instructor' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Welcome, {displayName}</h1>
      <p className="mt-2 text-slate-600">
        Your content studio — build and refine the learning experience.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {sections.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <item.icon className="size-6 text-brand-600" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-navy-900">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-brand-600">Open studio →</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}