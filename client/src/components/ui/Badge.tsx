import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-navy-100 text-navy-800',
  brand: 'bg-brand-100 text-brand-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}