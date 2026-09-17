import { getPool } from '../db/pool.js';
import { logger } from './logger.js';

export interface AuditEntry {
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  details?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Fire-and-forget audit log writer. Failures must never break the request
 * they originated from, so errors are swallowed and logged.
 */
export function writeAuditLog(entry: AuditEntry): void {
  void getPool()
    .query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entry.userId ?? null,
        entry.action,
        entry.entityType ?? null,
        entry.entityId ?? null,
        entry.details === undefined ? null : JSON.stringify(entry.details),
        entry.ip ?? null,
        entry.userAgent ?? null,
      ],
    )
    .catch((err: unknown) => {
      logger.error({ err }, 'audit log write failed');
    });
}