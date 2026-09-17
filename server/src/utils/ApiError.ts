import { ErrorCode } from '@church/shared';

interface ApiErrorOptions {
  code?: ErrorCode;
  details?: unknown;
  expose?: boolean;
}

/**
 * Domain error carrying an HTTP status and a stable machine-readable code.
 * `expose` controls whether internal detail is surfaced to the client.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(status: number, message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options.code ?? ErrorCode.INTERNAL_ERROR;
    this.details = options.details;
    this.expose = options.expose ?? status < 500;
  }

  static validation(message = 'Validation failed', details?: unknown): ApiError {
    return new ApiError(400, message, { code: ErrorCode.VALIDATION_ERROR, details });
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, message, { code: ErrorCode.UNAUTHORIZED });
  }

  static forbidden(message = 'You do not have permission to perform this action'): ApiError {
    return new ApiError(403, message, { code: ErrorCode.FORBIDDEN });
  }
}