import { Shield } from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { EmptyState } from '@/components/ui/feedback';

export default function AdminInstructorsPage() {
  return (
    <AdminPanel
      title="Instructors"
      description="Review and manage platform instructors and their content responsibilities."
    >
      <EmptyState
        className="mt-4"
        icon={<Shield className="size-10" />}
        title="No instructors yet"
        description="Instructor management — assignments, certification and content oversight — arrives in a later phase of the platform."
      />
    </AdminPanel>
  );
}