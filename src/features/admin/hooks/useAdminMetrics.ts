import { useQuery } from '@tanstack/react-query';
import { getMetrics } from '../services/admin.service';

export const ADMIN_METRICS_KEY = ['admin', 'metrics'] as const;

export function useAdminMetrics() {
  return useQuery({
    queryKey: ADMIN_METRICS_KEY,
    queryFn: getMetrics,
    staleTime: 1000 * 60 * 5,
  });
}
