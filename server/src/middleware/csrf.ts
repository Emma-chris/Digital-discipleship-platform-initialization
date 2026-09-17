import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_COOKIE = 'csrfToken';

/**
 * Sets a readable (non-httpOnly) CSRF token cookie when none is present. The
 * session cookie itself remains httpOnly; this token is read by the client to
 * echo back in the `X-CSRF-Token` header on state-changing requests.
 */
export function csrfCookie(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies?.[CSRF_COOKIE]) {
    const token = randomBytes(24).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: env.isProd,
      path: '/',
    });
    res.locals.csrfToken = token;
  }
  next();
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Double-submit CSRF protection. Only enforced when cookies are in play
 * (session-based clients); stateless bearer/JWT clients are exempt because
 * they are not vulnerable to cookie-carried CSRF.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const hasCookies = Boolean(req.cookies && Object.keys(req.cookies).length > 0);
  if (!hasCookies) {
    next();
    return;
  }

  const cookieToken: string | undefined = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get('X-CSRF-Token');

  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    next(
      new ApiError(403, 'CSRF token mismatch or missing', {
        code: ErrorCode.FORBIDDEN,
      }),
    );
    return;
  }

  next();
}