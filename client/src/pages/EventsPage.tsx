import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Events</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Upcoming gatherings, workshops and learning events for the community.
      </p>
      <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center">
        <p className="text-base font-semibold text-navy-900">No upcoming events</p>
        <p className="mt-2 text-sm text-slate-500">
          Events will appear here once they are published by your ministry or organization.
        </p>
      </div>
    </div>
  );
}