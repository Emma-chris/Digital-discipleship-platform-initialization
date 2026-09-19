import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { RoleCode } from '@church/shared';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/feedback';

/**
 * Guards a route for users holding at least one of the given roles.
 * Unauthenticated users are sent to login; authenticated users without the
 * required role see the 403 page rather than being silently dropped.
 * The backend remains authoritative — this guard only protects the UI.
 */
export function RoleRoute({ roles }: { roles: readonly RoleCode[] }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.some((role) => hasRole(role))) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}