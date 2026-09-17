import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
}

export function Progress({ value, label, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label ?? 'Progress'}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-brand-600 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}