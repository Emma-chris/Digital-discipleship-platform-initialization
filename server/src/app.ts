import { existsSync } from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { sessionMiddleware } from './auth/session.js';
import { apiRateLimiter, authRateLimiter } from './middleware/rateLimit.js';
import { csrfCookie, csrfProtection } from './middleware/csrf.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import programsRoutes from './routes/programs.routes.js';
import pathwaysRoutes from './routes/pathways.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import assessmentsRoutes from './routes/assessments.routes.js';
import enrollmentsRoutes from './routes/enrollments.routes.js';
import progressRoutes from './routes/progress.routes.js';
import mentorshipRoutes from './routes/mentorship.routes.js';
import communityRoutes from './routes/community.routes.js';
import adminRoutes from './routes/admin.routes.js';

const allowedOrigins = new Set([env.APP_URL, env.API_URL]);

export function createApp(): Express {
  const app = express();

  if (env.isProd) {
    // Express behind a trusted reverse proxy (Heroku-style app.env in prod).
    app.set('trust proxy', 1);
  }

  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        autoLogging: { ignore: (req) => req.url === '/api/health' },
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              headers: {
                ...req.headers,
                authorization: req.headers.authorization ? '[REDACTED]' : undefined,
                cookie: req.headers.cookie ? '[REDACTED]' : undefined,
              },
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
            };
          },
        },
      }),
    );
  }

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowedOrigins.has(origin)) {
          cb(null, true);
          return;
        }
        cb(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(csrfCookie);
  app.use(sessionMiddleware);

  // Health check sits outside rate limiting and CSRF so uptime probes stay clean.
  app.use('/api/health', healthRoutes);

  const api = express.Router();
  api.use(apiRateLimiter);
  api.use(csrfProtection);

  api.use('/auth', authRateLimiter, authRoutes);
  api.use('/users', usersRoutes);
  api.use('/programs', programsRoutes);
  api.use('/courses', coursesRoutes);
  api.use('/pathways', pathwaysRoutes);
  api.use('/lessons', lessonsRoutes);
  api.use('/assessments', assessmentsRoutes);
  api.use('/enrollments', enrollmentsRoutes);
  api.use('/progress', progressRoutes);
  api.use('/mentorship', mentorshipRoutes);
  api.use('/community', communityRoutes);
  api.use('/admin', adminRoutes);

  app.use('/api', api);

  if (env.isProd) {
    const clientDist = path.resolve(import.meta.dirname, '../../client/dist');
    if (existsSync(clientDist)) {
      app.use(express.static(clientDist));
      app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api')) {
          next();
          return;
        }
        res.sendFile(path.join(clientDist, 'index.html'));
      });
    }
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}