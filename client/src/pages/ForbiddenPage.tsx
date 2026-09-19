import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function ForbiddenPage() {
  const { isAuthenticated, homePath } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-slate-50 px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-navy-100 text-navy-900">
        <ShieldX className="size-7" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">403</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">
          You don't have permission to access this page.
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          If you believe this is a mistake, contact your administrator.
        </p>
      </div>
      <Link to={isAuthenticated ? homePath : '/login'}>
        <Button>{isAuthenticated ? 'Back to home' : 'Log in'}</Button>
      </Link>
    </div>
  );
}