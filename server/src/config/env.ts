import { z } from 'zod';

const runningInProduction = process.env.NODE_ENV === 'production';

// Development fallbacks so a fresh clone boots without a .env file. These
// values are never safe for production and are rejected there.
const DEV_FALLBACKS = {
  DATABASE_URL: 'postgres://localhost:5432/disciplepath',
  SESSION_SECRET: 'development-only-session-secret-not-for-production-0000001',
  JWT_SECRET: 'development-only-jwt-secret-not-for-production-0000001',
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('http://localhost:5173'),
  API_URL: z.string().url().default('http://localhost:3000'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine((v) => v.startsWith('postgres'), {
      message: 'DATABASE_URL must be a postgres:// connection string',
    }),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(10),
});

const raw: Record<string, string> = {};
for (const [key, value] of Object.entries(process.env)) {
  if (value !== undefined) raw[key] = value;
}

if (!runningInProduction) {
  for (const [key, fallback] of Object.entries(DEV_FALLBACKS) as [string, string][]) {
    if (raw[key] === undefined || raw[key] === '') raw[key] = fallback;
  }
}

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  const context = runningInProduction
    ? 'The application will not start until the environment is corrected.'
    : 'The application will not start until the environment is corrected.';
  throw new Error(`Invalid environment configuration.\n${issues}\n${context}`);
}

export type Env = {
  NODE_ENV: 'development' | 'test' | 'production';
  APP_URL: string;
  API_URL: string;
  PORT: number;
  DATABASE_URL: string;
  SESSION_SECRET: string;
  JWT_SECRET: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_AUTH_MAX: number;
  isProd: boolean;
};

export const env: Env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
};

export const isProd = env.isProd;