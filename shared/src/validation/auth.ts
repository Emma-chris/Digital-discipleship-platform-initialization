import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('A valid email address is required')
  .max(255);

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const registerSchema = z.object({
  email,
  password,
  fullName: z.string().trim().min(1, 'Full name is required').max(120).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required').max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  displayName: z.string().trim().min(1).max(80).optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  language: z.string().trim().min(2).max(8).nullable().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const emailVerificationSchema = z.object({
  token: z.string().min(20, 'Invalid token'),
});

export const requestPasswordResetSchema = z.object({
  email: email.max(255),
});
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(20, 'Invalid token'),
  password,
});
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>;