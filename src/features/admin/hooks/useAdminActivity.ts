import { useQuery } from '@tanstack/react-query';
import { getPlatformActivity } from '../services/admin.service';

export const ADMIN_ACTIVITY_KEY = ['admin', 'platform-activity'] as const;

/** Actividad real de la plataforma (interacciones por día, últimos N días). */
export function useAdminActivity(days = 7) {
  return useQuery({
    queryKey: [...ADMIN_ACTIVITY_KEY, days],
    queryFn: () => getPlatformActivity(days),
    staleTime: 1000 * 60 * 5,
  });
}
