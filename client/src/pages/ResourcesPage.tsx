import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
      <h1 className="mt-4 text-3xl font-bold text-navy-900">Resources</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Additional tools, guides and reading materials to support your learning journey.
      </p>
      <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center">
        <p className="text-base font-semibold text-navy-900">Resources coming soon</p>
        <p className="mt-2 text-sm text-slate-500">
          This section is being prepared. Check back for downloadable guides, recommended reading and
          supplementary learning materials.
        </p>
      </div>
    </div>
  );
}