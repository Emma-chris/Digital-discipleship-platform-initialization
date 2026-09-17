import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { env } from '../config/env.js';
import { getPool } from '../db/pool.js';

const PgSession = connectPgSimple(session);

/**
 * Server-side sessions persisted in PostgreSQL (session table). The cookie is
 * httpOnly + SameSite=Lax; it becomes Secure in production.
 */
export const sessionMiddleware = session({
  store: new PgSession({
    pool: getPool(),
    tableName: 'session',
    createTableIfMissing: false,
    pruneSessionInterval: 60 * 60,
  }),
  name: 'sid',
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});