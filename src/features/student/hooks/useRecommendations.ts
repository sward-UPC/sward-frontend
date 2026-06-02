import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../services/recommendations.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para recomendaciones personalizadas del estudiante. */
export function useRecommendations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: getRecommendations,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
