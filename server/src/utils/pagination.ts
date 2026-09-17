import type { PaginationInput } from '@church/shared';
import type { PaginationMeta } from '@church/shared';

export interface Paginated<T> {
  items: T;
  meta: PaginationMeta;
}

export function buildPaginationMeta(
  input: PaginationInput,
  total: number,
): PaginationMeta {
  return {
    page: input.page,
    pageSize: input.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
  };
}

export function offset(pagination: PaginationInput): number {
  return (pagination.page - 1) * pagination.pageSize;
}