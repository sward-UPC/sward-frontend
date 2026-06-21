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
  avatar_color: string | null;
  avatar_url: string | null;
  rol: string | null;
  permisos: string[];
}

function mapMeResponse(data: MeResponse): User {
  const backendRol = data.rol ?? 'estudiante';
  return {
    id: data.id,
    email: data.correo,
    firstName: data.nombre ?? data.correo.split('@')[0],
    lastName: data.apellido ?? '',
    role: ROLE_MAP[backendRol] ?? ('student' as UserRole),
    institution: '',
    avatarUrl: data.avatar_url ?? undefined,
    avatarColor: data.avatar_color ?? undefined,
    createdAt: new Date().toISOString(),
  };
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

/**
 * Renueva el access token usando el refresh token guardado.
 * El backend devuelve solo un nuevo access_token (el refresh no rota).
 */
export async function refresh(): Promise<string> {
  const refreshToken = localStorage.getItem('sward_refresh_token');
  if (!refreshToken) throw new Error('Sin refresh token');
  const { data } = await apiClient.post<{ access_token: string }>(
    ENDPOINTS.auth.refresh,
    { refresh_token: refreshToken },
  );
  localStorage.setItem('sward_access_token', data.access_token);
  return data.access_token;
}

/**
 * Revoca la sesión en el servidor: blacklistea el access token actual en Redis.
 * Usa el Bearer del header (el backend toma el jti del JWT); el endpoint no
 * recibe body. Best-effort: si el token ya venció, igual limpiamos local.
 */
export async function logout(): Promise<void> {
  await apiClient.post(ENDPOINTS.auth.logout);
}

/** Retorna el perfil completo del usuario autenticado usando GET /users/me. */
export async function me(): Promise<User> {
  const { data } = await apiClient.get<MeResponse>(ENDPOINTS.users.profile);
  return mapMeResponse(data);
}

/**
 * Actualiza los campos personalizables del perfil (avatar). Nombre, correo,
 * institución y rol son de solo lectura (provienen de Moodle) y no se envían.
 */
export async function updateProfile(payload: {
  avatar_color?: string | null;
  avatar_url?: string | null;
}): Promise<User> {
  const { data } = await apiClient.put<MeResponse>(ENDPOINTS.users.updateProfile, payload);
  return mapMeResponse(data);
}

/**
 * Cambia la contraseña del usuario autenticado. Tras el éxito el backend
 * invalida todas las sesiones (logout en todos los dispositivos).
 */
export async function changePassword(payload: {
  password_actual: string;
  password_nueva: string;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.auth.changePassword, payload);
}
