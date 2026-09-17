import { Link, Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const publicNav = [
  { to: '/programs', label: 'Programs' },
  { to: '/courses', label: 'Courses' },
  { to: '/pathways', label: 'Pathways' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/resources', label: 'Resources' },
  { to: '/events', label: 'Events' },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="DisciplePath home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
        <BookOpen className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-navy-900">DisciplePath</span>
    </Link>
  );
}

export function PublicLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-navy-100 text-navy-900'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {isLoading ? null : isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Get started</Button>
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-navy-900 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {publicNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 flex gap-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3">
            <Brand />
            <p className="text-sm text-slate-400">
              A digital discipleship and Christian education platform: discover, learn, practice,
              connect, get mentored, serve, lead and multiply.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-slate-400 hover:text-white" to="/programs">Programs</Link></li>
              <li><Link className="text-slate-400 hover:text-white" to="/courses">Courses</Link></li>
              <li><Link className="text-slate-400 hover:text-white" to="/pathways">Pathways</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Grow</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-slate-400 hover:text-white" to="/mentorship">Mentorship</Link></li>
              <li><Link className="text-slate-400 hover:text-white" to="/community">Community</Link></li>
              <li><Link className="text-slate-400 hover:text-white" to="/certificates">Certificates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-slate-400 hover:text-white" to="/login">Log in</Link></li>
              <li><Link className="text-slate-400 hover:text-white" to="/register">Create account</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-800 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DisciplePath. Built for discipleship.
        </div>
      </footer>
    </div>
  );
}