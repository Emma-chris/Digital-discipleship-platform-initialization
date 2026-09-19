import type { ReactNode } from 'react';

export function AdminPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      <div className="mt-8">
        {children ?? (
          <p className="text-sm text-slate-500">
            This admin section is implemented in a later phase.
          </p>
        )}
      </div>
    </div>
  );
}