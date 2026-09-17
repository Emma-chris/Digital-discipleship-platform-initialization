import { loadEnvFileFromRepo } from '../config/loadEnv.js';

async function main(): Promise<void> {
  loadEnvFileFromRepo();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run database migrations.');
  }

  const { getPool, closePool } = await import('../db/pool.js');
  const { resolveMigrationsDir, runUp, runDown, status } = await import('./migrate.js');

  const command = process.argv[2] ?? 'up';
  const dir = resolveMigrationsDir();
  const pool = getPool();

  switch (command) {
    case 'up': {
      const { applied } = await runUp(pool, dir);
      if (applied.length === 0) console.log('Database is up to date.');
      else console.log(`Applied ${applied.length} migration(s).`);
      break;
    }
    case 'down': {
      const { reverted } = await runDown(pool, dir);
      console.log(reverted ? `Reverted ${reverted}` : 'No migrations to revert.');
      break;
    }
    case 'status':
      await status(pool, dir);
      break;
    default:
      throw new Error(`Unknown command "${command}". Expected: up | down | status`);
  }

  await closePool();
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[migrate] ${message}`);
  process.exitCode = 1;
});