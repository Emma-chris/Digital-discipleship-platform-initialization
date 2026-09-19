import { AuthenticatedLayout } from './AuthenticatedLayout';
import { studentNav } from './navConfig';

export function StudentLayout() {
  return <AuthenticatedLayout nav={studentNav} section="Student Area" />;
}