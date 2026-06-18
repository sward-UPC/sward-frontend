import { useQuery } from '@tanstack/react-query';
import { getLogs } from '../services/admin.service';

export const ADMIN_LOGS_KEY = (limit: number) => ['admin', 'logs', limit] as const;

export function useAdminLogs(limit = 50) {
  return useQuery({
    queryKey: ADMIN_LOGS_KEY(limit),
    queryFn: () => getLogs(limit),
    staleTime: 1000 * 30,
  });
}
