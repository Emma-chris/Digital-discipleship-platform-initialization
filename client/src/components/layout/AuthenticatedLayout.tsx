import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './UserMenu';
import type { NavItem } from './navConfig';

interface AuthenticatedLayoutProps {
  nav: readonly NavItem[];
  /** Section label shown in the header for context. */
  section: string;
}

/**
 * Shared shell for every authenticated area (student, mentor, instructor,
 * admin). Role-specific layouts are thin wrappers that supply a nav config —
 * the layout logic lives here once, and the backend remains authoritative for
 * actual authorization.
 */
export function AuthenticatedLayout({ nav, section }: AuthenticatedLayoutProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const navList = (
    <nav className="flex flex-1 flex-col gap-1" aria-label={section}>
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-600/10 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
            )
          }
        >
          <item.icon className="size-4 shrink-0" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-slate-50">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link to="/" className="flex items-center gap-2.5" aria-label="DisciplePath home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BookOpen className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold text-navy-900">DisciplePath</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-navy-900 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4 pb-0">{navList}</div>
        <div className="border-t border-slate-200 p-3">
          <UserMenu />
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-navy-900 lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center text-sm text-slate-500">{section}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}