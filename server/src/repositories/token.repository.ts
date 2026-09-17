import type { Pool, PoolClient } from 'pg';
import type { UserTokenKind } from '@church/shared';

export interface TokenRecord {
  id: string;
  userId: string;
  kind: string;
  tokenHash: string;
}

export async function insertToken(
  client: PoolClient,
  input: { userId: string; kind: UserTokenKind; tokenHash: string; expiresAt: Date },
): Promise<void> {
  await client.query(
    `INSERT INTO user_tokens (user_id, kind, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [input.userId, input.kind, input.tokenHash, input.expiresAt],
  );
}

/**
 * Atomically claim an unused, unexpired token. Returns the owner user id when
 * the token is valid, otherwise null.
 */
export async function consumeToken(
  pool: Pool,
  input: { kind: UserTokenKind; tokenHash: string },
): Promise<TokenRecord | null> {
  const { rows } = await pool.query<TokenRecord>(
    `UPDATE user_tokens
     SET used_at = now()
     WHERE kind = $1
       AND token_hash = $2
       AND used_at IS NULL
       AND expires_at > now()
     RETURNING id, user_id, kind, token_hash`,
    [input.kind, input.tokenHash],
  );
  return rows[0] ?? null;
}

export async function invalidateUnusedTokensForUser(
  client: PoolClient,
  userId: string,
  kind: UserTokenKind,
): Promise<void> {
  await client.query(
    `UPDATE user_tokens SET used_at = now()
     WHERE user_id = $1 AND kind = $2 AND used_at IS NULL`,
    [userId, kind],
  );
}