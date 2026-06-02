import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@core/types';

/** Autentica al usuario y retorna tokens JWT + perfil. */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.auth.login, payload);
  return data;
}

/** Registra un nuevo usuario en el sistema. */
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(ENDPOINTS.auth.register, payload);
  return data;
}

/** Invalida el refresh token en el servidor. */
export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem('sward_refresh_token');
  await apiClient.post(ENDPOINTS.auth.logout, { refresh: refreshToken });
}

/** Retorna el perfil del usuario autenticado. */
export async function me(): Promise<User> {
  const { data } = await apiClient.get<User>(ENDPOINTS.auth.me);
  return data;
}
