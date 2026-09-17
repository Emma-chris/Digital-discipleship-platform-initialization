import rateLimit from 'express-rate-limit';
import { ErrorCode } from '@church/shared';
import { env } from '../config/env.js';
import type { Request, Response } from 'express';

function buildRateLimiter(options: { windowMs: number; max: number }) {
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        code: ErrorCode.RATE_LIMITED,
        message: 'Too many requests. Please try again later.',
      });
    },
  });
}

/** Applied to all /api traffic. */
export const apiRateLimiter = buildRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
});

/** Stricter limiter for authentication endpoints. */
export const authRateLimiter = buildRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
});