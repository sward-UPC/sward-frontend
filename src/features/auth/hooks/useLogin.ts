import { useMutation } from '@tanstack/react-query';
import { login } from '../services/auth.service';
import { useAuth } from '@core/auth/useAuth';
import type { LoginRequest } from '@core/types';

/** Mutación de login: persiste la sesión en AuthContext al completarse. */
export function useLogin() {
  const { login: setAuth } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}
