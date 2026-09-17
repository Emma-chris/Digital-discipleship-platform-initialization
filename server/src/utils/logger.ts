import pino from 'pino';

/**
 * Structured application logger. Redacts anything that could be a secret so
 * credentials never reach the log output.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.secret',
      'password_hash',
      'token_hash',
    ],
    censor: '[REDACTED]',
  },
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;