import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AdminRoute() {
  const { roles, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes('admin')) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}