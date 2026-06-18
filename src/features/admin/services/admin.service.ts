import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type {
  ApiUsersListResponse,
  ApiMetrics,
  ApiAuditLog,
  AdminUser,
  UserStatus,
  UserRole2,
} from '@core/types/admin.types';

// ---------------------------------------------------------------------------
// Mappers backend → UI
// ---------------------------------------------------------------------------

const ESTADO_MAP: Record<string, UserStatus> = {
  activo: 'active',
  inactivo: 'inactive',
  bloqueado: 'suspended',
};

const ROL_MAP: Record<string, UserRole2> = {
  estudiante: 'student',
  docente: 'teacher',
  administrador: 'admin',
};

const STATUS_TO_ESTADO: Record<UserStatus, string> = {
  active: 'activo',
  inactive: 'inactivo',
  suspended: 'bloqueado',
};

const ROLE_TO_ROL: Record<UserRole2, string> = {
  student: 'estudiante',
  teacher: 'docente',
  admin: 'administrador',
};

function mapApiUserToAdminUser(u: ApiUsersListResponse['items'][0]): AdminUser {
  const nombre = [u.nombre, u.apellido].filter(Boolean).join(' ') || u.correo;
  return {
    id: u.id,
    name: nombre,
    email: u.correo,
    role: ROL_MAP[u.rol] ?? 'student',
    status: ESTADO_MAP[u.estado] ?? 'inactive',
    lastLogin: '—',
    moodleUserId: u.moodle_user_id,
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export interface UsersListResult {
  items: AdminUser[];
  total: number;
}

export async function getUsers(
  offset = 0,
  limit = 100,
): Promise<UsersListResult> {
  const { data } = await apiClient.get<ApiUsersListResponse>(ENDPOINTS.admin.users, {
    params: { offset, limit },
  });
  return {
    items: data.items.map(mapApiUserToAdminUser),
    total: data.total,
  };
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus,
): Promise<{ id: string; estado: string }> {
  const { data } = await apiClient.patch<{ id: string; estado: string }>(
    ENDPOINTS.admin.userStatus(userId),
    { estado: STATUS_TO_ESTADO[status] },
  );
  return data;
}

export async function assignUserRole(
  userId: string,
  role: UserRole2,
): Promise<{ id: string; rol: string }> {
  const { data } = await apiClient.post<{ id: string; rol: string }>(
    ENDPOINTS.admin.userRoles(userId),
    { rol: ROLE_TO_ROL[role] },
  );
  return data;
}

export async function getMetrics(): Promise<ApiMetrics> {
  const { data } = await apiClient.get<ApiMetrics>(ENDPOINTS.admin.metrics);
  return data;
}

export async function getLogs(limit = 50): Promise<ApiAuditLog[]> {
  const { data } = await apiClient.get<ApiAuditLog[]>(ENDPOINTS.admin.logs, {
    params: { limit },
  });
  return data;
}

// ---------------------------------------------------------------------------
// Cursos (ms-cursos-recursos)
// ---------------------------------------------------------------------------

export interface ApiCurso {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  moodle_course_id: string;
  estado: string;
  docente_id: string | null;
}

export async function getCursos(): Promise<ApiCurso[]> {
  const { data } = await apiClient.get<ApiCurso[]>(ENDPOINTS.admin.courses);
  return data;
}
