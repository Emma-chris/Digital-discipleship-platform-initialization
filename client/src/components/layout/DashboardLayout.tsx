import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

const studentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/learning', label: 'My Learning', icon: BookOpen },
  { to: '/my-courses', label: 'My Courses', icon: GraduationCap },
  { to: '/my-progress', label: 'My Progress', icon: Compass },
  { to: '/mentorship', label: 'Mentorship', icon: Users },
  { to: '/community', label: 'Community', icon: MessageSquare },
  { to: '/certificates', label: 'Certificates', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export function DashboardLayout() {
  const { user, roles, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = roles.includes('admin');
  const nav = isAdmin ? [...studentNav, { to: '/admin', label: 'Admin', icon: Shield }] : studentNav;

  const navList = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
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

  const sidebarFooter = (
    <div className="border-t border-slate-200 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
          {(user.displayName ?? user.fullName ?? user.email).slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-navy-900">
            {user.displayName ?? user.fullName ?? user.email}
          </p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {user.roles.map((role) => (
          <Badge key={role} variant="brand">
            {role}
          </Badge>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Log out
      </button>
    </div>
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
        <div className="flex flex-1 flex-col overflow-y-auto p-4">{navList}</div>
        {sidebarFooter}
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
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Settings className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Digital Discipleship Platform</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}