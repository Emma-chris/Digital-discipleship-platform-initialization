import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-sm text-slate-500', className)}>
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent"
      />
      {label}
    </span>
  );
}

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-1 items-center justify-center p-12', className)}>
      <Spinner label="Loading…" />
    </div>
  );
}

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center',
        className,
      )}
      {...props}
    >
      {icon && <div className="text-slate-400">{icon}</div>}
      <p className="text-base font-semibold text-navy-900">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} aria-hidden="true" />;
}