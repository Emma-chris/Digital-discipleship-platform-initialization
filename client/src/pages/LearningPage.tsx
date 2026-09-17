import { Link } from 'react-router-dom';
import { BookOpen, Compass, GraduationCap } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LearningPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Learning' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Learning</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Your active learning, progress and what to do next.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/my-courses">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <GraduationCap className="mb-3 size-7 text-brand-600" aria-hidden="true" />
              <CardTitle className="text-base">My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Courses you have enrolled in, with their status.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/my-progress">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <Compass className="mb-3 size-7 text-brand-600" aria-hidden="true" />
              <CardTitle className="text-base">My Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Detailed progress across every course.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/pathways">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <BookOpen className="mb-3 size-7 text-brand-600" aria-hidden="true" />
              <CardTitle className="text-base">Explore Pathways</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Find the learning route meant for your stage.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}