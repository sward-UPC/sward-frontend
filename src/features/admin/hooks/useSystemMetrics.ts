import { useQuery } from '@tanstack/react-query';
import { getSystemMetrics } from '../services/admin.service';

export const SYSTEM_METRICS_KEY = ['admin', 'system', 'metrics'] as const;

export function useSystemMetrics() {
  return useQuery({
    queryKey: SYSTEM_METRICS_KEY,
    queryFn: getSystemMetrics,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
  });
}
