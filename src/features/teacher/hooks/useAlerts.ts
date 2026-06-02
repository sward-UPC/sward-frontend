import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../services/teacher.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para las alertas académicas activas del docente. */
export function useAlerts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher', 'alerts', user?.id],
    queryFn: getAlerts,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000 * 60 * 2, // polling cada 2 minutos
  });
}
