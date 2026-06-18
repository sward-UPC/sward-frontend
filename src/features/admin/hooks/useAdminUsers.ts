import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/admin.service';

export const ADMIN_USERS_KEY = ['admin', 'users'] as const;

export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 2,
  });
}
