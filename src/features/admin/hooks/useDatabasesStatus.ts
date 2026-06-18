import { useQuery } from '@tanstack/react-query';
import { getDatabasesStatus } from '../services/admin.service';

export const DATABASES_STATUS_KEY = ['admin', 'system', 'databases'] as const;

export function useDatabasesStatus() {
  return useQuery({
    queryKey: DATABASES_STATUS_KEY,
    queryFn: getDatabasesStatus,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
