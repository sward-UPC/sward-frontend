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

const ROLE_MAP: Record<string, UserRole> = {
  estudiante: 'student' as UserRole,
  docente: 'teacher' as UserRole,
  administrador: 'admin' as UserRole,
};

interface MeResponse {
  id: string;
  correo: string;
  estado: string;
  nombre: string | null;
  apellido: string | null;
  moodle_user_id: number | null;
  rol: string | null;
  permisos: string[];
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

/** Retorna el perfil completo del usuario autenticado usando GET /users/me. */
export async function me(): Promise<User> {
  const { data } = await apiClient.get<MeResponse>(ENDPOINTS.users.profile);
  const backendRol = data.rol ?? 'estudiante';
  return {
    id: data.id,
    email: data.correo,
    firstName: data.nombre ?? data.correo.split('@')[0],
    lastName: data.apellido ?? '',
    role: ROLE_MAP[backendRol] ?? ('student' as UserRole),
    institution: '',
    createdAt: new Date().toISOString(),
  };
}
