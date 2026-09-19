import { Building2 } from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { EmptyState } from '@/components/ui/feedback';

export default function AdminOrganizationsPage() {
  return (
    <AdminPanel
      title="Organizations"
      description="Manage the churches and organizations connected to the platform."
    >
      <EmptyState
        className="mt-4"
        icon={<Building2 className="size-10" />}
        title="No organizations yet"
        description="Organization management — church profiles, admins and member billing — arrives in a later phase of the platform."
      />
    </AdminPanel>
  );
}