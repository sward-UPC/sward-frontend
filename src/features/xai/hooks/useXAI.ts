import { useQuery } from '@tanstack/react-query';
import { getAttentionHeatmap, getExplanation } from '../services/xai.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para el mapa de atención XAI del estudiante. */
export function useAttentionHeatmap() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['xai', 'attention-heatmap', user?.id],
    queryFn: getAttentionHeatmap,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

/** React Query hook para la explicación XAI en lenguaje natural. */
export function useXAIExplanation() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['xai', 'explanation', user?.id],
    queryFn: getExplanation,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}
