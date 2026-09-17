import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorCode } from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

function errorBody(status: number, code: ErrorCode, message: string, details?: unknown) {
  const body: Record<string, unknown> = { success: false, code, message };
  if (details !== undefined) body.details = details;
  return { status, body };
}

export function notFoundHandler(req: Request, res: Response): void {
  const { status, body } = errorBody(
    404,
    ErrorCode.NOT_FOUND,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
  res.status(status).json(body);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    if (!err.expose) {
      logger.error({ err, url: req.originalUrl }, 'api error (not exposed)');
    }
    const { status, body } = errorBody(err.status, err.code, err.message, err.details);
    res.status(status).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const { status, body } = errorBody(
      400,
      ErrorCode.VALIDATION_ERROR,
      'Request validation failed',
      err.flatten(),
    );
    res.status(status).json(body);
    return;
  }

  const bodyParserError = err as { type?: string; status?: number; message?: string };
  if (bodyParserError.type === 'entity.too.large') {
    const { status, body } = errorBody(
      413,
      ErrorCode.PAYLOAD_TOO_LARGE,
      'Request payload too large',
    );
    res.status(status).json(body);
    return;
  }
  if (bodyParserError.type === 'entity.parse.failed') {
    const { status, body } = errorBody(
      400,
      ErrorCode.VALIDATION_ERROR,
      'Request body is not valid JSON',
    );
    res.status(status).json(body);
    return;
  }

  logger.error({ err, url: req.originalUrl }, 'unhandled error');
  const message = env.isProd ? 'Internal server error' : String(err instanceof Error ? err.message : err);
  const { status, body } = errorBody(500, ErrorCode.INTERNAL_ERROR, message);
  res.status(status).json(body);
}