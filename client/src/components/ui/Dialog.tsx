import { useCallback, useEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onClose, title, children, footer, className }: DialogProps) {
  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement as HTMLElement | null;
    previouslyFocused?.focus();
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open, onEscape]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'w-full max-w-lg animate-(--animate-fade-in) rounded-2xl bg-white shadow-xl',
          className,
        )}
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="px-6 pb-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}