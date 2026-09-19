import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

/**
 * Reusable authenticated user menu. Reads the real session user — never a
 * hardcoded name — and offers Profile, Settings and Logout.
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  if (!user) return null;

  const displayName = user.displayName ?? user.fullName ?? user.email;

  const itemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
          {displayName.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-navy-900">{displayName}</span>
          <span className="block truncate text-xs text-slate-500">{user.email}</span>
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute bottom-full left-2 z-50 mb-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-card"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-navy-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <Badge key={role} variant="brand">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <Link to="/profile" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            <UserIcon className="size-4" aria-hidden="true" />
            Profile
          </Link>
          <Link to="/settings" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </Link>
          <div className="my-1 h-px bg-slate-100" />
          <button type="button" role="menuitem" className={itemClass} onClick={() => void logout()}>
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}