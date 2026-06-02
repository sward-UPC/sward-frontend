import { useQuery } from '@tanstack/react-query';
import { getKnowledgeState } from '../services/interactions.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para el estado de conocimiento SAKT del estudiante. */
export function useKnowledgeState() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['knowledge-state', user?.id],
    queryFn: getKnowledgeState,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
