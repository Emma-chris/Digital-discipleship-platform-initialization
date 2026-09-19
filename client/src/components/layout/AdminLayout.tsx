import { AuthenticatedLayout } from './AuthenticatedLayout';
import { adminNav } from './navConfig';

export function AdminLayout() {
  return <AuthenticatedLayout nav={adminNav} section="Admin Area" />;
}