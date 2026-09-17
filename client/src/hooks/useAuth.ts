import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from '@church/shared';
import { authService } from '@/services/services';
import { ApiClientError } from '@/services/api';

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

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(query.data),
    status: query.data?.status ?? null,
    roles: query.data?.roles ?? [],
    logout,
  };
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 401;
}