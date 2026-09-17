import { createContext, useContext, useId, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, className, children, ...props }: TabsProps) {
  const baseId = useId();
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue, baseId }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: selected, setValue, baseId } = useTabsContext();
  const selectedState = selected === value;
  return (
    <button
      id={`${baseId}-tab-${value}`}
      role="tab"
      aria-selected={selectedState}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selectedState ? 0 : -1}
      onClick={() => setValue(value)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        selectedState
          ? 'bg-white text-navy-900 shadow-sm'
          : 'text-slate-600 hover:text-navy-900',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: selected, baseId } = useTabsContext();
  if (selected !== value) return null;
  return (
    <div
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}