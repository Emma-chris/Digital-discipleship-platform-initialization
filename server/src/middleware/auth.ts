import type { NextFunction, Request, Response } from 'express';
import type { AuthPrincipal, Permission } from '@church/shared';
import { ErrorCode, RoleCode, rolesHaveAllPermissions } from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../auth/tokens.js';
import { getRolesForUser } from '../repositories/user.repository.js';
import { getPool } from '../db/pool.js';
import { logger } from '../utils/logger.js';

function extractBearer(header: string | undefined): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

/**
 * Authenticates the request. The server is authoritative — roles are fetched
 * from the database for session users, or taken from a server-signed, short
 * lived JWT for API clients. Never trusts client-supplied role claims.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const principal = await resolvePrincipal(req);
    if (!principal) {
      next(ApiError.unauthorized());
      return;
    }
    req.principal = principal;
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      next(err);
      return;
    }
    logger.error({ err }, 'authentication failed unexpectedly');
    next(new ApiError(500, 'Authentication service unavailable', { code: ErrorCode.INTERNAL_ERROR }));
  }
}

async function resolvePrincipal(req: Request): Promise<AuthPrincipal | null> {
  const sessionUserId = req.session?.userId;
  if (sessionUserId) {
    let roles: RoleCode[];
    try {
      roles = await getRolesForUser(getPool(), sessionUserId);
    } catch (err) {
      logger.error({ err }, 'failed to load roles for session user');
      throw new ApiError(500, 'Unable to authorize request', { code: ErrorCode.INTERNAL_ERROR });
    }
    if (roles.length === 0) return null;
    return { userId: sessionUserId, organizationId: null, roles };
  }

  const bearerToken = extractBearer(req.get('authorization'));
  if (bearerToken) {
    try {
      const payload = verifyAccessToken(bearerToken);
      if (!payload.sub) return null;
      const roles = Array.isArray(payload.roles)
        ? (payload.roles as string[]).filter(
            (r): r is RoleCode => (RoleCode as Record<string, string>)[r] !== undefined,
          )
        : [];
      return { userId: payload.sub, organizationId: payload.org ?? null, roles };
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Role gate. `admin` always passes. Runs after requireAuth.
 */
export function requireRole(...codes: RoleCode[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const principal = req.principal;
    if (!principal) {
      next(ApiError.unauthorized());
      return;
    }
    const allowed =
      principal.roles.includes(RoleCode.ADMIN) ||
      codes.some((code) => principal.roles.includes(code));
    if (!allowed) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}

/**
 * Permission gate. Derives the caller's effective permissions from their
 * current roles via the shared catalog and requires every listed permission.
 * `admin` always passes. Runs after requireAuth.
 */
export function requirePermission(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const principal = req.principal;
    if (!principal) {
      next(ApiError.unauthorized());
      return;
    }
    if (!rolesHaveAllPermissions(principal.roles, permissions)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}