import { useQuery } from '@tanstack/react-query';
import { getSystemStatus } from '../services/admin.service';

export const SYSTEM_STATUS_KEY = ['admin', 'system', 'status'] as const;

export function useSystemStatus() {
  return useQuery({
    queryKey: SYSTEM_STATUS_KEY,
    queryFn: getSystemStatus,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
