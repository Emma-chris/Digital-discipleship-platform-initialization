import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AccessTokenPayload {
  sub: string;
  org: string | null;
  roles: string[];
}

export interface VerifiedTokenPayload extends AccessTokenPayload {
  iat: number;
  exp: number;
}

const ACCESS_TOKEN_TTL = '15m';

/** Issue a short-lived JWT carrying the principal (for API / mobile clients). */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string): VerifiedTokenPayload {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as VerifiedTokenPayload;
}

// One-time, DB-backed tokens (email verification / password reset) ----------

export function generateRandomToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function tokenLifespanHours(): number {
  return 24;
}