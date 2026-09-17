import type { ErrorCode } from '@church/shared';

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorEnvelope {
  success: false;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export type ApiResult<T> = ApiEnvelope<T> | ApiErrorEnvelope;

export class ApiClientError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, envelope: ApiErrorEnvelope) {
    super(envelope.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = envelope.code;
    this.details = envelope.details;
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  const value = match?.[1];
  return value ? decodeURIComponent(value) : undefined;
}

const CSRF_HEADER = 'X-CSRF-Token';

export async function apiRequest<T>(
  path: string,
  init: { method: string; body?: unknown; token?: string } = { method: 'GET' },
): Promise<ApiEnvelope<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const csrfToken = readCookie('csrfToken');
  if (csrfToken) headers[CSRF_HEADER] = csrfToken;
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  let body: BodyInit | undefined;
  if (init.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(init.body);
  }

  const response = await fetch(`/api${path}`, {
    method: init.method,
    headers,
    credentials: 'include',
    body,
  });

  const envelope = (await response.json().catch(() => null)) as ApiResult<T> | null;

  if (!envelope || !envelope.success) {
    throw new ApiClientError(response.status, {
      success: false,
      code: envelope && 'code' in envelope ? envelope.code : 'INTERNAL_ERROR',
      message: envelope && 'message' in envelope ? envelope.message : `Request failed (${response.status})`,
      details: envelope && 'details' in envelope ? envelope.details : undefined,
    });
  }

  return envelope;
}

export const api = {
  get: <T>(path: string, token?: string) => apiRequest<T>(path, { method: 'GET', token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    apiRequest<T>(path, { method: 'POST', body, token }),
  patch: <T>(path: string, body?: unknown, token?: string) =>
    apiRequest<T>(path, { method: 'PATCH', body, token }),
  delete: <T>(path: string, token?: string) => apiRequest<T>(path, { method: 'DELETE', token }),
};