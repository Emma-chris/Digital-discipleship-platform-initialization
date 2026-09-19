import { Link } from 'react-router-dom';
import { Route } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/feedback';

export default function MyPathwayPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Pathway' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">My Pathway</h1>
      <p className="mt-2 text-slate-600">
        Your discipleship journey — the pathway you're on and what comes next.
      </p>

      <EmptyState
        className="mt-8"
        icon={<Route className="size-10" />}
        title="No pathway selected yet"
        description="Choose a pathway to begin a guided discipleship journey tailored to your goals."
        action={
          <Link to="/pathways">
            <Button size="sm">Explore pathways</Button>
          </Link>
        }
      />
    </div>
  );
}