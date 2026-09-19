import { AuthenticatedLayout } from './AuthenticatedLayout';
import { mentorNav } from './navConfig';

export function MentorLayout() {
  return <AuthenticatedLayout nav={mentorNav} section="Mentor Area" />;
}