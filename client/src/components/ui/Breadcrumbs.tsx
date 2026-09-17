import type { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
  ...props
}: { items: Crumb[] } & HTMLAttributes<HTMLElement>) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1 text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <>
                  <Link to={item.href} className="transition-colors hover:text-brand-700">
                    {item.label}
                  </Link>
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="font-medium text-navy-900">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}