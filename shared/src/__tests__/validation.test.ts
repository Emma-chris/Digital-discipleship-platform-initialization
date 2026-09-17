import { describe, expect, it } from 'vitest';
import {
  confirmPasswordResetSchema,
  emailVerificationSchema,
  loginSchema,
  paginationSchema,
  registerSchema,
} from '@church/shared';

describe('shared validation schemas', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      email: '  Student@Example.com ',
      password: 'longenough',
      fullName: 'New Believer',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('student@example.com');
    }
  });

  it('rejects a weak password', () => {
    const result = registerSchema.safeParse({
      email: 'student@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('parses pagination query strings', () => {
    const result = paginationSchema.safeParse({ page: '3', pageSize: '25' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.pageSize).toBe(25);
    }
  });

  it('accepts long-enough reset tokens', () => {
    expect(emailVerificationSchema.safeParse({ token: 'x'.repeat(24) }).success).toBe(true);
    expect(confirmPasswordResetSchema.safeParse({ token: 'x'.repeat(24), password: '12345678' }).success).toBe(true);
  });
});