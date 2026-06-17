import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  UserRole,
} from '@core/types';

/** Extrae el UUID del campo sub del JWT sin dependencias externas. */
function getUuidFromToken(token: string): string {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.sub as string;
}

/** Autentica al usuario y persiste los tokens JWT en localStorage. */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.auth.login, payload);
  localStorage.setItem('sward_access_token', data.access_token);
  localStorage.setItem('sward_refresh_token', data.refresh_token);
  return data;
}

/** Registra un nuevo usuario en el sistema. Solo envía correo y password. */
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(ENDPOINTS.auth.register, payload);
  return data;
}

/** Invalida el refresh token en el servidor. */
export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem('sward_refresh_token');
  await apiClient.post(ENDPOINTS.auth.logout, { token: refreshToken });
}

/** Retorna el perfil del usuario autenticado usando GET /users/{uuid}. */
export async function me(): Promise<User> {
  const accessToken = localStorage.getItem('sward_access_token');
  if (!accessToken) throw new Error('No hay token de acceso');

  const uuid = getUuidFromToken(accessToken);
  const { data } = await apiClient.get<{ id: string; correo: string; estado: string; role?: UserRole }>(
    `/users/${uuid}`
  );

  return {
    id: data.id,
    email: data.correo,
    firstName: data.correo.split('@')[0],
    lastName: '',
    role: data.role ?? ('student' as UserRole),
    institution: '',
    createdAt: new Date().toISOString(),
  };
}
