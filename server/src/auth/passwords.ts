import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { Buffer } from 'node:buffer';

// scrypt parameters, per OWASP recommendations (N = 2^14). Tuned for Node's
// synchronous implementation with an explicit memory ceiling.
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEMORY = 64 * 1024 * 1024; // 64 MiB

const VERSION = 'scrypt';

/**
 * Hash a password using scrypt with a per-user random salt.
 * Format: scrypt$N$r$p$saltB64url$hashB64url
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: MAX_MEMORY,
  });
  return [
    VERSION,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString('base64url'),
    hash.toString('base64url'),
  ].join('$');
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== VERSION) return false;
  const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
  const n = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  const expected = Buffer.from(hashB64 ?? '', 'base64url');
  const salt = Buffer.from(saltB64 ?? '', 'base64url');
  const actual = scryptSync(password, salt, KEY_LENGTH, { N: n, r, p, maxmem: MAX_MEMORY });

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}