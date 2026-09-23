import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getModelConfig, getSecurityPolicy, triggerRetrain } from '../services/admin.service';

export const MODEL_CONFIG_KEY = ['admin', 'model', 'config'] as const;

export function useModelConfig() {
  return useQuery({
    queryKey: MODEL_CONFIG_KEY,
    queryFn: getModelConfig,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSecurityPolicy() {
  return useQuery({
    queryKey: ['admin', 'system', 'security'],
    queryFn: getSecurityPolicy,
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
