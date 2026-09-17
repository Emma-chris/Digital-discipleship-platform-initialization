import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger.js';

export interface Resolution {
  migrationsDir: string;
}

export function resolveMigrationsDir(): string {
  // CLI runs from server/src via tsx; `MIGRATIONS_PATH` overrides for flexibility.
  const override = process.env.MIGRATIONS_PATH;
  if (override) return override;
  return path.resolve(import.meta.dirname, '../../../migrations');
}

interface MigrationDefinition {
  version: string;
  name: string;
  upSql: string;
  downSql: string | null;
  checksum: string;
}

const UP_PATTERN = /^(\d+)_(.+)\.up\.sql$/;
const DOWN_PATTERN = /^(\d+)_(.+)\.down\.sql$/;

export function loadMigrations(dir: string): MigrationDefinition[] {
  const files = readdirSync(dir);
  const up = new Map<string, { name: string; sql: string }>();
  const down = new Map<string, string>();

  for (const file of files) {
    const upMatch = file.match(UP_PATTERN);
    const downMatch = file.match(DOWN_PATTERN);
    if (upMatch) {
      const [, version, name] = upMatch;
      if (!version || !name) continue;
      up.set(version, { name, sql: readFileSync(path.join(dir, file), 'utf8') });
    } else if (downMatch) {
      const [, version] = downMatch;
      if (!version) continue;
      down.set(version, readFileSync(path.join(dir, file), 'utf8'));
    }
  }

  return [...up.entries()]
    .map(([version, entry]) => {
      const checksum = createHash('sha256').update(entry.sql, 'utf8').digest('hex');
      return {
        version,
        name: entry.name,
        upSql: entry.sql,
        downSql: down.get(version) ?? null,
        checksum,
      };
    })
    .sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }));
}

export async function ensureSchemaMigrationsTable(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    text PRIMARY KEY,
      name       text NOT NULL,
      checksum   text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

interface AppliedMigration {
  version: string;
  checksum: string;
}

export async function listApplied(client: PoolClient): Promise<AppliedMigration[]> {
  const { rows } = await client.query<AppliedMigration>(
    'SELECT version, checksum FROM schema_migrations ORDER BY applied_at',
  );
  return rows;
}

function toMigrationFile(version: string, name: string): string {
  return `${version}_${name}.up.sql`;
}

export async function runUp(pool: Pool, dir: string): Promise<{ applied: string[] }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensureSchemaMigrationsTable(client);
    const applied = await listApplied(client);
    const appliedVersions = new Set(applied.map((m) => m.version));
    const migrations = loadMigrations(dir);

    // Integrity: refuse to run if an already-applied migration was edited.
    for (const record of applied) {
      const migration = migrations.find((m) => m.version === record.version);
      if (migration && migration.checksum !== record.checksum) {
        throw new Error(
          `Migration "${toMigrationFile(migration.version, migration.name)}" was applied with a different checksum and has been modified. ` +
            'Resolve the drift before applying new migrations.',
        );
      }
    }

    const appliedNow: string[] = [];
    for (const migration of migrations) {
      if (appliedVersions.has(migration.version)) continue;
      await client.query(migration.upSql);
      await client.query(
        'INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)',
        [migration.version, migration.name, migration.checksum],
      );
      appliedNow.push(toMigrationFile(migration.version, migration.name));
      logger.info({ migration: toMigrationFile(migration.version, migration.name) }, 'migration applied');
    }

    await client.query('COMMIT');
    return { applied: appliedNow };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function runDown(pool: Pool, dir: string): Promise<{ reverted: string | null }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensureSchemaMigrationsTable(client);
    const applied = await listApplied(client);
    const last = applied.at(-1);
    if (!last) return { reverted: null };

    const migrations = loadMigrations(dir);
    const migration = migrations.find((m) => m.version === last.version);
    if (!migration || !migration.downSql) {
      throw new Error(
        `No down migration exists for version "${last.version}". Write ${last.version}_*.down.sql to revert it.`,
      );
    }

    await client.query(migration.downSql);
    await client.query('DELETE FROM schema_migrations WHERE version = $1', [migration.version]);
    await client.query('COMMIT');
    logger.info({ migration: toMigrationFile(migration.version, migration.name) }, 'migration reverted');
    return { reverted: toMigrationFile(migration.version, migration.name) };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function status(pool: Pool, dir: string): Promise<void> {
  const client = await pool.connect();
  try {
    await ensureSchemaMigrationsTable(client);
    const applied = await listApplied(client);
    const migrations = loadMigrations(dir);
    const appliedVersions = new Set(applied.map((m) => m.version));

    for (const migration of migrations) {
      const isApplied = appliedVersions.has(migration.version);
      const record = applied.find((m) => m.version === migration.version);
      const drift = record && record.checksum !== migration.checksum;
      logger.info(
        {
          migration: toMigrationFile(migration.version, migration.name),
          status: isApplied ? (drift ? 'APPLIED (CHECKSUM MISMATCH)' : 'APPLIED') : 'PENDING',
        },
        'migration status',
      );
    }
  } finally {
    client.release();
  }
}