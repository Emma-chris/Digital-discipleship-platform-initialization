import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Compass, GraduationCap, Trophy } from 'lucide-react';
import { contentService } from '@/services/services';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState, PageLoader } from '@/components/ui/feedback';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await contentService.enrollments();
      return res.data.items;
    },
    enabled: Boolean(user),
  });

  const firstName = (user?.displayName ?? user?.fullName ?? user?.email ?? 'there').split(' ')[0];

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-slate-500">
            Continue your discipleship journey where you left off.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {user?.roles.map((role) => (
            <Badge key={role} variant="brand">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/my-courses" className="group">
          <Card className="transition-shadow group-hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-5 text-brand-600" aria-hidden="true" />
                My Courses
              </CardTitle>
              <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                {isLoading
                  ? 'Loading…'
                  : `${enrollments?.length ?? 0} enrolled course${(enrollments?.length ?? 0) === 1 ? '' : 's'}`}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/my-progress" className="group">
          <Card className="transition-shadow group-hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="size-5 text-brand-600" aria-hidden="true" />
                My Progress
              </CardTitle>
              <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Track completion and next steps</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/learning" className="group">
          <Card className="transition-shadow group-hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-5 text-brand-600" aria-hidden="true" />
                Learning
              </CardTitle>
              <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Pick up where you left off</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900">Your courses</h2>
          <Link to="/courses" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Browse all courses
          </Link>
        </div>
        <div className="mt-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center py-10">
                <PageLoader />
              </CardContent>
            </Card>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.courseId} className="flex items-center justify-between p-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">{enrollment.title}</p>
                    <p className="text-xs text-slate-500">
                      Enrolled{' '}
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={enrollment.status === 'completed' ? 'success' : 'default'}>
                    {enrollment.status}
                  </Badge>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<GraduationCap className="size-10" />}
              title="No courses yet"
              description="Enroll in a course to begin learning."
              action={
                <Link to="/courses">
                  <Button size="sm">Browse courses</Button>
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="mt-10 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900">Certificates</h2>
          <Link to="/certificates" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        <Card className="mt-4">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Trophy className="size-6 text-amber-500" aria-hidden="true" />
              <span className="text-sm text-slate-600">
                Certificates are earned when you complete a course.
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}