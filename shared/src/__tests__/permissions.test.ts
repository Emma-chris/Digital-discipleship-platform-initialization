import { describe, expect, it } from 'vitest';
import { RoleCode } from '../constants/roles.js';
import {
  ALL_PERMISSIONS,
  Permission,
  ROLE_PERMISSIONS,
  rolesHaveAllPermissions,
} from '../constants/permissions.js';

describe('permission catalog', () => {
  it('defines a consistent, non-empty catalog', () => {
    expect(ALL_PERMISSIONS.length).toBeGreaterThan(0);
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length);
  });

  it('maps every role to a permission list', () => {
    for (const role of Object.values(RoleCode)) {
      expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
    }
  });

  it('grants admin every permission in the catalog', () => {
    expect(rolesHaveAllPermissions([RoleCode.ADMIN], ALL_PERMISSIONS)).toBe(true);
  });

  it('does not grant admin-only permissions to non-admin roles', () => {
    const adminOnly: readonly (typeof Permission)[keyof typeof Permission][] = [
      Permission.USERS_MANAGE,
      Permission.ORGANIZATIONS_MANAGE,
      Permission.ANALYTICS_VIEW,
    ];
    for (const role of [RoleCode.STUDENT, RoleCode.MENTOR, RoleCode.INSTRUCTOR]) {
      for (const permission of adminOnly) {
        expect(
          rolesHaveAllPermissions([role], [permission]),
          `${role} must not have ${permission}`,
        ).toBe(false);
      }
    }
  });

  it('grants instructors content authoring permissions', () => {
    expect(
      rolesHaveAllPermissions(
        [RoleCode.INSTRUCTOR],
        [Permission.COURSES_VIEW, Permission.COURSES_CREATE, Permission.COURSES_PUBLISH],
      ),
    ).toBe(true);
  });

  it('grants mentors mentorship visibility', () => {
    expect(rolesHaveAllPermissions([RoleCode.MENTOR], [Permission.MENTORSHIP_VIEW])).toBe(true);
  });

  it('agrees that multiple roles are additive', () => {
    // mentor + instructor covers both domains.
    expect(
      rolesHaveAllPermissions(
        [RoleCode.MENTOR, RoleCode.INSTRUCTOR],
        [Permission.MENTORSHIP_VIEW, Permission.COURSES_CREATE],
      ),
    ).toBe(true);
  });

  it('denies unknown required permission for any role set', () => {
    // A required permission outside the catalog is never satisfiable.
    expect(
      rolesHaveAllPermissions([RoleCode.STUDENT, RoleCode.MENTOR], [Permission.ANALYTICS_VIEW]),
    ).toBe(false);
  });
});