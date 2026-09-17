import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const baseFieldClasses =
  'flex w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

function FieldWrapper({
  className,
  error,
  hint,
  children,
}: {
  className?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {children}
      {error ? (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
    <FieldWrapper className={className} error={error} hint={hint}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          baseFieldClasses,
          error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
          'h-10',
        )}
        {...props}
      />
    </FieldWrapper>
  ),
);
Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
    <FieldWrapper className={className} error={error} hint={hint}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(baseFieldClasses, error && 'border-red-400', 'min-h-24 py-2')}
        {...props}
      />
    </FieldWrapper>
  ),
);
Textarea.displayName = 'Textarea';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, error, hint, id, options, children, ...props }, ref) => (
    <FieldWrapper className={className} error={error} hint={hint}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(baseFieldClasses, 'h-10 cursor-pointer')}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </FieldWrapper>
  ),
);
Select.displayName = 'Select';