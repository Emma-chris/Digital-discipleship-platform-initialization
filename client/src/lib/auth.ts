import type { Permission } from '@church/shared';
import { RoleCode, rolesHaveAllPermissions } from '@church/shared';

/**
 * Client-side convenience helpers for rendering navigation and route guards.
 * These are NEVER authoritative: server middleware (requireRole /
 * requirePermission) enforces every access at the API boundary. The client
 * helpers exist only to keep the UI in sync with the authenticated session.
 */
export function hasRole(roles: readonly RoleCode[], role: RoleCode): boolean {
  return roles.includes(role);
}

export function hasPermission(
  roles: readonly RoleCode[],
  required: readonly Permission[],
): boolean {
  return rolesHaveAllPermissions(roles, required);
}

/**
 * Best landing page for an authenticated user, ranked by seniority of role.
 * Used after login and by the public header's "Dashboard" button.
 */
export function homePathForRoles(roles: readonly RoleCode[]): string {
  if (roles.includes(RoleCode.ADMIN)) return '/admin';
  if (roles.includes(RoleCode.INSTRUCTOR)) return '/instructor';
  if (roles.includes(RoleCode.MENTOR)) return '/mentor';
  return '/dashboard';
}