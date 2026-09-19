import type { ErrorCode } from '../constants/errors.js';
import type { RoleCode } from '../constants/roles.js';

/** Successful API response envelope. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

/** Error API response envelope — matches the documented error shape. */
export interface ApiErrorResponse {
  success: false;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Authenticated principal exposed from session/JWT. */
export interface AuthPrincipal {
  userId: string;
  organizationId: string | null;
  roles: RoleCode[];
}

/** Minimal self-describing user payload returned to the client. */
export interface CurrentUser {
  id: string;
  email: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  roles: RoleCode[];
  emailVerified: boolean;
  status: string;
  createdAt: Date;
}

/**
 * Platform-wide aggregate counts for the admin overview. All values are real
 * database totals — never fabricated analytics. Zero is a legitimate count.
 */
export interface AdminStats {
  users: number;
  organizations: number;
  programs: number;
  courses: number;
  pathways: number;
  assessments: number;
  mentors: number;
  instructors: number;
}