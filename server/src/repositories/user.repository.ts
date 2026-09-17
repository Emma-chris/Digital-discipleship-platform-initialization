import type { RoleCode } from '@church/shared';
import type { Pool, PoolClient } from 'pg';

export interface UserRecord {
  id: string;
  organizationId: string | null;
  email: string;
  fullName: string | null;
  passwordHash: string;
  status: string;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface ProfileRecord {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  language: string | null;
}

export async function findUserByEmail(
  pool: Pool,
  email: string,
): Promise<UserRecord | null> {
  const { rows } = await pool.query<{
    id: string;
    organization_id: string | null;
    email: string;
    full_name: string | null;
    password_hash: string;
    status: string;
    email_verified_at: Date | null;
    last_login_at: Date | null;
    created_at: Date;
  }>(
    `SELECT id, organization_id, email, full_name, password_hash, status,
            email_verified_at, last_login_at, created_at
     FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] ? toUserRecord(rows[0]) : null;
}

export async function findUserById(pool: Pool, id: string): Promise<UserRecord | null> {
  const { rows } = await pool.query<{
    id: string;
    organization_id: string | null;
    email: string;
    full_name: string | null;
    password_hash: string;
    status: string;
    email_verified_at: Date | null;
    last_login_at: Date | null;
    created_at: Date;
  }>(
    `SELECT id, organization_id, email, full_name, password_hash, status,
            email_verified_at, last_login_at, created_at
     FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ? toUserRecord(rows[0]) : null;
}

interface UserInsertResult {
  id: string;
  email: string;
  organization_id: string | null;
  full_name: string | null;
  created_at: Date;
}

export async function createUser(
  client: PoolClient,
  input: { email: string; passwordHash: string; fullName: string | null },
): Promise<UserInsertResult> {
  const { rows } = await client.query<UserInsertResult>(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, organization_id, full_name, created_at`,
    [input.email, input.passwordHash, input.fullName],
  );
  return rows[0] as UserInsertResult;
}

export async function createProfile(
  client: PoolClient,
  input: { userId: string; displayName: string | null },
): Promise<void> {
  await client.query(
    `INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name`,
    [input.userId, input.displayName],
  );
}

export async function setEmailVerified(client: PoolClient, userId: string): Promise<void> {
  await client.query(`UPDATE users SET email_verified_at = now() WHERE id = $1`, [userId]);
}

export async function replacePassword(
  client: PoolClient,
  userId: string,
  passwordHash: string,
): Promise<void> {
  await client.query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [userId, passwordHash]);
}

export async function updateLastLogin(pool: Pool, userId: string): Promise<void> {
  await pool.query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [userId]);
}

export async function getProfileByUserId(
  pool: Pool,
  userId: string,
): Promise<ProfileRecord | null> {
  const { rows } = await pool.query<{
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    language: string | null;
  }>(
    `SELECT user_id, display_name, avatar_url, bio, phone, language
     FROM profiles WHERE user_id = $1`,
    [userId],
  );
  return rows[0] ? {
    userId: rows[0].user_id,
    displayName: rows[0].display_name,
    avatarUrl: rows[0].avatar_url,
    bio: rows[0].bio,
    phone: rows[0].phone,
    language: rows[0].language,
  } : null;
}

export async function getRolesForUser(pool: Pool, userId: string): Promise<RoleCode[]> {
  const { rows } = await pool.query<{ code: string }>(
    `SELECT r.code
     FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId],
  );
  return rows.map((r) => r.code as RoleCode);
}

export async function updateProfileForUser(
  pool: Pool,
  userId: string,
  fields: Partial<{
    fullName: string | null;
    displayName: string | null;
    bio: string | null;
    phone: string | null;
    language: string | null;
  }>,
): Promise<void> {
  if (fields.fullName !== undefined) {
    await pool.query(
      `UPDATE users SET full_name = $2 WHERE id = $1`,
      [userId, fields.fullName],
    );
  }
  const profile = fields.displayName ?? fields.bio ?? fields.phone ?? fields.language;
  if (profile !== undefined) {
    await pool.query(
      `INSERT INTO profiles (user_id, display_name, bio, phone, language)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
         bio = COALESCE(EXCLUDED.bio, profiles.bio),
         phone = COALESCE(EXCLUDED.phone, profiles.phone),
         language = COALESCE(EXCLUDED.language, profiles.language)`,
      [
        userId,
        fields.displayName ?? null,
        fields.bio ?? null,
        fields.phone ?? null,
        fields.language ?? null,
      ],
    );
  }
}

function toUserRecord(row: {
  id: string;
  organization_id: string | null;
  email: string;
  full_name: string | null;
  password_hash: string;
  status: string;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
}): UserRecord {
  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    fullName: row.full_name,
    passwordHash: row.password_hash,
    status: row.status,
    emailVerifiedAt: row.email_verified_at,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  };
}

