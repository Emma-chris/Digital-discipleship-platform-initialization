import {
  ErrorCode,
  RoleCode,
  UserTokenKind,
  type ProfileUpdateInput,
  type RegisterInput,
} from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { getPool } from '../db/pool.js';
import { hashPassword, verifyPassword } from '../auth/passwords.js';
import { generateRandomToken, hashToken, tokenLifespanHours } from '../auth/tokens.js';
import { env } from '../config/env.js';
import {
  createProfile,
  createUser,
  findUserByEmail,
  findUserById,
  getProfileByUserId,
  getRolesForUser,
  updateProfileForUser,
  setEmailVerified,
  replacePassword,
  updateLastLogin,
} from '../repositories/user.repository.js';
import { assignRole, getRoleIdByCode } from '../repositories/role.repository.js';
import {
  consumeToken,
  insertToken,
  invalidateUnusedTokensForUser,
} from '../repositories/token.repository.js';
import { toCurrentUser, type CurrentUser } from './mapper.js';

export interface RegisterResult {
  user: CurrentUser;
  verificationToken?: string;
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const pool = getPool();
  const client = await pool.connect();
  let issuedVerificationToken: string | undefined;

  let createdUserId: string;
  try {
    await client.query('BEGIN');

    const existing = await findUserByEmail(pool, input.email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists', {
        code: ErrorCode.EMAIL_ALREADY_REGISTERED,
        expose: true,
      });
    }

    const passwordHash = hashPassword(input.password);
    const fullName = input.fullName ?? null;
    const user = await createUser(client, { email: input.email, passwordHash, fullName });
    createdUserId = user.id;
    await createProfile(client, {
      userId: user.id,
      displayName: fullName ?? user.email.split('@')[0] ?? null,
    });

    const studentRoleId = await getRoleIdByCode(client, RoleCode.STUDENT);
    if (studentRoleId) {
      await assignRole(client, user.id, studentRoleId, null);
    }

    const verificationToken = generateRandomToken();
    const expiresAt = new Date(Date.now() + tokenLifespanHours() * 60 * 60 * 1000);
    await insertToken(client, {
      userId: user.id,
      kind: UserTokenKind.EMAIL_VERIFICATION,
      tokenHash: hashToken(verificationToken),
      expiresAt,
    });

    await client.query('COMMIT');

    if (!env.isProd) {
      issuedVerificationToken = verificationToken;
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const [user, profile, roles] = await Promise.all([
    findUserById(pool, createdUserId),
    getProfileByUserId(pool, createdUserId),
    getRolesForUser(pool, createdUserId),
  ]);

  if (!user) throw new ApiError(500, 'Registration could not be verified');

  return {
    user: toCurrentUser(user, profile, roles),
    verificationToken: issuedVerificationToken,
  };
}

export interface LoginResult {
  user: CurrentUser;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const pool = getPool();
  const user = await findUserByEmail(pool, email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new ApiError(401, 'Invalid email or password', {
      code: ErrorCode.INVALID_CREDENTIALS,
      expose: true,
    });
  }

  if (user.status === 'suspended') {
    throw new ApiError(403, 'This account has been suspended', {
      code: ErrorCode.ACCOUNT_SUSPENDED,
      expose: true,
    });
  }

  await updateLastLogin(pool, user.id);
  const [profile, roles] = await Promise.all([
    getProfileByUserId(pool, user.id),
    getRolesForUser(pool, user.id),
  ]);

  return { user: toCurrentUser(user, profile, roles) };
}

export async function getCurrentUser(userId: string): Promise<CurrentUser> {
  const pool = getPool();
  const user = await findUserById(pool, userId);
  if (!user) throw new ApiError(404, 'User not found', { code: ErrorCode.NOT_FOUND });
  const [profile, roles] = await Promise.all([
    getProfileByUserId(pool, userId),
    getRolesForUser(pool, userId),
  ]);
  return toCurrentUser(user, profile, roles);
}

export async function updateOwnProfile(
  userId: string,
  input: ProfileUpdateInput,
): Promise<CurrentUser> {
  const pool = getPool();
  await updateProfileForUser(pool, userId, input);
  return getCurrentUser(userId);
}

export async function verifyEmail(token: string): Promise<void> {
  const pool = getPool();
  const claimed = await consumeToken(pool, {
    kind: UserTokenKind.EMAIL_VERIFICATION,
    tokenHash: hashToken(token),
  });
  if (!claimed) {
    throw new ApiError(400, 'This verification link is invalid or has expired', {
      code: ErrorCode.TOKEN_INVALID,
      expose: true,
    });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setEmailVerified(client, claimed.userId);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export interface RequestResetResult {
  resetToken?: string;
}

export async function requestPasswordReset(email: string): Promise<RequestResetResult> {
  const pool = getPool();
  const user = await findUserByEmail(pool, email);
  let resetToken: string | undefined;

  if (user) {
    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + tokenLifespanHours() * 60 * 60 * 1000);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await invalidateUnusedTokensForUser(client, user.id, UserTokenKind.PASSWORD_RESET);
      await insertToken(client, {
        userId: user.id,
        kind: UserTokenKind.PASSWORD_RESET,
        tokenHash: hashToken(token),
        expiresAt,
      });
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    if (!env.isProd) resetToken = token;
  }

  // Always return success to avoid leaking which emails are registered.
  return { resetToken };
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
  const pool = getPool();
  const claimed = await consumeToken(pool, {
    kind: UserTokenKind.PASSWORD_RESET,
    tokenHash: hashToken(token),
  });
  if (!claimed) {
    throw new ApiError(400, 'This reset link is invalid or has expired', {
      code: ErrorCode.TOKEN_INVALID,
      expose: true,
    });
  }

  const passwordHash = hashPassword(newPassword);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await replacePassword(client, claimed.userId, passwordHash);
    await invalidateUnusedTokensForUser(client, claimed.userId, UserTokenKind.PASSWORD_RESET);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}