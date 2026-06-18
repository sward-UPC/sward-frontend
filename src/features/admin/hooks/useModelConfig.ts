import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getModelConfig, triggerRetrain } from '../services/admin.service';

export const MODEL_CONFIG_KEY = ['admin', 'model', 'config'] as const;

export function useModelConfig() {
  return useQuery({
    queryKey: MODEL_CONFIG_KEY,
    queryFn: getModelConfig,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTriggerRetrain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerRetrain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODEL_CONFIG_KEY });
    },
  });
}
