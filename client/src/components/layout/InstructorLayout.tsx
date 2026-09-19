import { AuthenticatedLayout } from './AuthenticatedLayout';
import { instructorNav } from './navConfig';

export function InstructorLayout() {
  return <AuthenticatedLayout nav={instructorNav} section="Instructor Area" />;
}