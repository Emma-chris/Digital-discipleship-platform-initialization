import { loadEnvFileFromRepo } from './config/loadEnv.js';

async function bootstrap(): Promise<void> {
  loadEnvFileFromRepo();

  const [{ env }, { createApp }, { checkDatabase, closePool }, { logger }] = await Promise.all([
    import('./config/env.js'),
    import('./app.js'),
    import('./db/pool.js'),
    import('./utils/logger.js'),
  ]);

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'server listening');
  });

  const dbUp = await checkDatabase();
  logger.info({ dbUp }, 'database connectivity');

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'shutting down');
    server.close(() => {
      void closePool().then(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[server] failed to start: ${message}`);
  process.exitCode = 1;
});