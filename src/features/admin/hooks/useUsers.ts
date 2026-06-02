import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/admin.service';

/** React Query hook para la lista de todos los usuarios del sistema. */
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });
}
