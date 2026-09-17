import type { HTMLAttributes, ReactNode } from 'react';
import { TriangleAlert, Info, CircleCheck, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
}

const variantStyles: Record<Variant, { box: string; icon: ReactNode }> = {
  info: {
    box: 'border-brand-200 bg-brand-50 text-brand-900',
    icon: <Info className="size-4 text-brand-600" aria-hidden="true" />,
  },
  success: {
    box: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: <CircleCheck className="size-4 text-emerald-600" aria-hidden="true" />,
  },
  warning: {
    box: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: <TriangleAlert className="size-4 text-amber-600" aria-hidden="true" />,
  },
  danger: {
    box: 'border-red-200 bg-red-50 text-red-900',
    icon: <CircleX className="size-4 text-red-600" aria-hidden="true" />,
  },
};

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const style = variantStyles[variant];
  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-lg border p-4 text-sm', style.box, className)}
      {...props}
    >
      <span className="mt-0.5 shrink-0">{style.icon}</span>
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}