import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../auth/passwords.js';

describe('password hashing (scrypt)', () => {
  it('hashes and verifies a password round-trip', () => {
    const hash = hashPassword('correct horse battery staple');
    expect(hash).not.toContain('correct horse');
    expect(verifyPassword('correct horse battery staple', hash)).toBe(true);
  });

  it('rejects a wrong password', () => {
    const hash = hashPassword('correct horse battery staple');
    expect(verifyPassword('wrong password', hash)).toBe(false);
  });

  it('produces unique salts per hash', () => {
    const a = hashPassword('same-password');
    const b = hashPassword('same-password');
    expect(a).not.toBe(b);
    expect(verifyPassword('same-password', a)).toBe(true);
    expect(verifyPassword('same-password', b)).toBe(true);
  });

  it('rejects malformed stored hashes without throwing', () => {
    expect(verifyPassword('x', 'not-a-valid-hash')).toBe(false);
    expect(verifyPassword('x', '')).toBe(false);
  });
});