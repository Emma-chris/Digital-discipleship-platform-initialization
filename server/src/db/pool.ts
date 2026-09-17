import { Pool } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.isProd ? 20 : 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      maxUses: 7500,
    });
    pool.on('error', (err) => {
      logger.error({ err }, 'unexpected error from idle database client');
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}