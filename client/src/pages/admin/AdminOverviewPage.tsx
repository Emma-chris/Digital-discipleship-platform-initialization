import { AdminPanel } from './AdminPanel';

export default function AdminOverviewPage() {
  return (
    <AdminPanel
      title="Admin Overview"
      description="Platform administration, configuration and management."
    >
      <p className="text-sm text-slate-500">
        Summary statistics and management tools arrive in a later phase of the platform.
      </p>
    </AdminPanel>
  );
}