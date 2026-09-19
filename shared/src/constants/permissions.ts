import type { RoleCode } from './roles.js';

/**
 * Application permission catalog. Permissions describe *what* an action
 * operates on (`<domain>.<verb>`), decoupled from concrete role checks so the
 * set of roles can expand without rewriting every guard.
 *
 * The catalog is intentionally focused on the areas that exist today (root
 * product areas + admin management). Additional permissions are added here as
 * features land — no migration required while the model stays role-derived.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',

  USERS_VIEW: 'users.view',
  USERS_MANAGE: 'users.manage',

  ORGANIZATIONS_VIEW: 'organizations.view',
  ORGANIZATIONS_MANAGE: 'organizations.manage',

  PATHWAYS_VIEW: 'pathways.view',
  PATHWAYS_MANAGE: 'pathways.manage',

  PROGRAMS_VIEW: 'programs.view',
  PROGRAMS_MANAGE: 'programs.manage',

  COURSES_VIEW: 'courses.view',
  COURSES_CREATE: 'courses.create',
  COURSES_EDIT: 'courses.edit',
  COURSES_PUBLISH: 'courses.publish',

  ASSESSMENTS_VIEW: 'assessments.view',
  ASSESSMENTS_MANAGE: 'assessments.manage',

  MENTORSHIP_VIEW: 'mentorship.view',
  MENTORSHIP_MANAGE: 'mentorship.manage',

  ANALYTICS_VIEW: 'analytics.view',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/** Every permission defined in the catalog. */
export const ALL_PERMISSIONS: readonly Permission[] = Object.values(Permission);

const ADMIN_PERMISSIONS: Permission[] = [...ALL_PERMISSIONS];
const INSTRUCTOR_PERMISSIONS: Permission[] = [
  Permission.PROGRAMS_VIEW,
  Permission.PROGRAMS_MANAGE,
  Permission.COURSES_VIEW,
  Permission.COURSES_CREATE,
  Permission.COURSES_EDIT,
  Permission.COURSES_PUBLISH,
  Permission.ASSESSMENTS_VIEW,
  Permission.ASSESSMENTS_MANAGE,
];
const MENTOR_PERMISSIONS: Permission[] = [
  Permission.DASHBOARD_VIEW,
  Permission.MENTORSHIP_VIEW,
];
const STUDENT_PERMISSIONS: Permission[] = [
  Permission.DASHBOARD_VIEW,
  Permission.PROGRAMS_VIEW,
  Permission.COURSES_VIEW,
  Permission.PATHWAYS_VIEW,
];

/**
 * Static role → permission mapping. Single source of truth consumed by the
 * server (`requirePermission`) and the client (`hasPermission`). The server
 * remains authoritative — this catalog only derives, never trusts, client
 * input. `admin` is granted every permission by construction.
 */
export const ROLE_PERMISSIONS: Record<RoleCode, readonly Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  instructor: INSTRUCTOR_PERMISSIONS,
  mentor: MENTOR_PERMISSIONS,
  student: STUDENT_PERMISSIONS,
};

/** Whether the given roles collectively grant every listed permission. */
export function rolesHaveAllPermissions(
  roles: readonly RoleCode[],
  required: readonly Permission[],
): boolean {
  const granted = new Set<Permission>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      granted.add(permission);
    }
  }
  return required.every((permission) => granted.has(permission));
}