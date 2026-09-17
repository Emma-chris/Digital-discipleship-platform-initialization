import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from './ApiError.js';

/**
 * Validates a request body against a zod schema. On success the parsed value
 * replaces `req.body`; on failure a VALIDATION_ERROR is produced.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(ApiError.validation('Request body is invalid', result.error.flatten()));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(ApiError.validation('Query parameters are invalid', result.error.flatten()));
      return;
    }
    res.locals.query = result.data;
    next();
  };
}