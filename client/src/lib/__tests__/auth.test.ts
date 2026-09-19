import { describe, expect, it } from 'vitest';
import { Permission, RoleCode } from '@church/shared';
import { hasPermission, hasRole, homePathForRoles } from '../auth';

describe('hasRole', () => {
  it('returns true when the role is present', () => {
    expect(hasRole(['student', 'mentor'], RoleCode.MENTOR)).toBe(true);
  });

  it('returns false when the role is absent', () => {
    expect(hasRole(['student'], RoleCode.ADMIN)).toBe(false);
  });
});

describe('hasPermission', () => {
  it('grants mentor-only permissions to mentors', () => {
    expect(hasPermission([RoleCode.MENTOR], [Permission.MENTORSHIP_VIEW])).toBe(true);
  });

  it('denies admin analytics to students', () => {
    expect(hasPermission([RoleCode.STUDENT], [Permission.ANALYTICS_VIEW])).toBe(false);
  });

  it('treats roles as additive', () => {
    expect(
      hasPermission(
        [RoleCode.MENTOR, RoleCode.INSTRUCTOR],
        [Permission.MENTORSHIP_VIEW, Permission.COURSES_CREATE],
      ),
    ).toBe(true);
  });
});

describe('homePathForRoles', () => {
  it('ranks admin above instructor', () => {
    expect(homePathForRoles([RoleCode.STUDENT, RoleCode.ADMIN])).toBe('/admin');
  });

  it('ranks instructor above mentor', () => {
    expect(homePathForRoles([RoleCode.STUDENT, RoleCode.INSTRUCTOR])).toBe('/instructor');
  });

  it('ranks mentor above student', () => {
    expect(homePathForRoles([RoleCode.STUDENT, RoleCode.MENTOR])).toBe('/mentor');
  });

  it('defaults to the student dashboard', () => {
    expect(homePathForRoles([RoleCode.STUDENT])).toBe('/dashboard');
    expect(homePathForRoles([])).toBe('/dashboard');
  });
});