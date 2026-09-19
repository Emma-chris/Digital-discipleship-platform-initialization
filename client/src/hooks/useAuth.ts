import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CurrentUser, Permission, RoleCode } from '@church/shared';
import { authService } from '@/services/services';
import { ApiClientError } from '@/services/api';
import {
  hasPermission as userHasPermission,
  hasRole as userHasRole,
  homePathForRoles,
} from '@/lib/auth';

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const result = await authService.me();
      return result.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.setQueryData<CurrentUser | null>(['auth', 'me'], null);
      queryClient.clear();
    }
  }, [queryClient]);

  const roles = query.data?.roles ?? [];

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(query.data),
    status: query.data?.status ?? null,
    roles,
    hasRole: (role: RoleCode) => userHasRole(roles, role),
    hasPermission: (permissions: readonly Permission[]) =>
      userHasPermission(roles, permissions),
    homePath: homePathForRoles(roles),
    logout,
  };
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 401;
}