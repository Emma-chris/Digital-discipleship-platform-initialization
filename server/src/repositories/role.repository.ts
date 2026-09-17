import type { Pool, PoolClient } from 'pg';
import type { RoleCode } from '@church/shared';

export async function getRoleIdByCode(client: PoolClient, code: RoleCode): Promise<string | null> {
  const { rows } = await client.query<{ id: string }>(
    `SELECT id FROM roles WHERE code = $1`,
    [code],
  );
  return rows[0]?.id ?? null;
}

export async function assignRole(
  client: PoolClient,
  userId: string,
  roleId: string,
  assignedBy: string | null,
): Promise<void> {
  await client.query(
    `INSERT INTO user_roles (user_id, role_id, assigned_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, role_id) DO NOTHING`,
    [userId, roleId, assignedBy],
  );
}

export async function hasRole(pool: Pool, userId: string, code: RoleCode): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 AS found
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1 AND r.code = $2`,
    [userId, code],
  );
  return rows.length > 0;
}