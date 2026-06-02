import { useMutation } from '@tanstack/react-query';
import { register } from '../services/auth.service';
import type { RegisterRequest } from '@core/types';

/** Mutación de registro de nuevo usuario. */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  });
}
