import { useQuery } from '@tanstack/react-query';
import { getInteractions } from '../services/interactions.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para el historial de interacciones del estudiante. */
export function useInteractions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['interactions', user?.id],
    queryFn: getInteractions,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });
}
