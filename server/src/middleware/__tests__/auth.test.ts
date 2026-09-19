import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import type { AuthPrincipal, RoleCode } from '@church/shared';
import { Permission } from '@church/shared';
import { requireAuth, requirePermission, requireRole } from '../auth.js';
import { ApiError } from '../../utils/ApiError.js';

function principal(roles: RoleCode[], userId = 'user-1'): AuthPrincipal {
  return { userId, organizationId: null, roles };
}

function fakeContext() {
  const req = { get: () => undefined } as unknown as Request;
  const res = {} as Response;
  const next = vi.fn();
  return { req, res, next };
}

describe('requireAuth', () => {
  it('rejects requests without credentials (401)', async () => {
    const { req, res, next } = fakeContext();
    await requireAuth(req, res, next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]?.[0];
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
  });
});

describe('requireRole', () => {
  it('rejects requests without a principal (401)', () => {
    const { req, res, next } = fakeContext();
    requireRole('admin')(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(401);
  });

  it('rejects a caller with an unrelated role (403)', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['student']);
    requireRole('mentor')(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(403);
  });

  it('allows a caller with the required role', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['mentor']);
    requireRole('mentor')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('allows admin regardless of the requested role', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['admin']);
    requireRole('instructor')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('requirePermission', () => {
  it('rejects requests without a principal (401)', () => {
    const { req, res, next } = fakeContext();
    requirePermission(Permission.ANALYTICS_VIEW)(req, res, next);
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(401);
  });

  it('rejects a student requesting admin analytics (403)', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['student']);
    requirePermission(Permission.ANALYTICS_VIEW)(req, res, next);
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(403);
  });

  it('rejects a mentor requesting instructor authoring permissions (403)', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['mentor']);
    requirePermission(Permission.COURSES_CREATE)(req, res, next);
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(403);
  });

  it('allows an instructor who holds the authoring permission', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['instructor']);
    requirePermission(Permission.COURSES_CREATE, Permission.COURSES_PUBLISH)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('allows a mentor to view mentorship data', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['mentor']);
    requirePermission(Permission.MENTORSHIP_VIEW)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('allows admin regardless of the requested permission', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['admin']);
    requirePermission(Permission.ANALYTICS_VIEW)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('requires every listed permission when roles are additive', () => {
    const { req, res, next } = fakeContext();
    req.principal = principal(['mentor', 'student']);
    requirePermission(Permission.MENTORSHIP_VIEW, Permission.ANALYTICS_VIEW)(req, res, next);
    expect((next.mock.calls[0]?.[0] as ApiError).status).toBe(403);
  });
});