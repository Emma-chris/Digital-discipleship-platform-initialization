import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Permission } from '@church/shared';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/feedback';

/**
 * Guards a route for users whose roles grant every listed permission.
 * Unauthenticated users are sent to login; users without the permission see
 * the 403 page. The backend remains authoritative.
 */
export function PermissionRoute({ permissions }: { permissions: readonly Permission[] }) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
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

  if (!hasPermission(permissions)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}