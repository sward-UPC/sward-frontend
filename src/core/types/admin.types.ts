/** Tipos de datos para el módulo de administración de SWARD. */

export type AdminTab = "resumen" | "usuarios" | "cursos" | "sistema" | "logs";
export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole2 = "student" | "teacher" | "admin";
export type NotificationType = "info" | "warning" | "error";
export type LogLevel = "info" | "warning" | "error";

// ---------------------------------------------------------------------------
// API response shapes — snake_case como los devuelve el backend
// ---------------------------------------------------------------------------

export interface ApiAdminUser {
  id: string;
  correo: string;
  nombre: string | null;
  apellido: string | null;
  estado: string;
  rol: string;
  moodle_user_id: number | null;
}

export interface ApiUsersListResponse {
  items: ApiAdminUser[];
  total: number;
}

export interface ApiMetrics {
  total_usuarios: number;
  usuarios_activos: number;
  usuarios_inactivos: number;
  usuarios_por_rol: {
    estudiante: number;
    docente: number;
    administrador: number;
  };
}

export interface ApiAuditLog {
  id: string;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  detalle: string | null;
  admin_id: string | null;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// UI types — camelCase para los componentes
// ---------------------------------------------------------------------------

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole2;
  status: UserStatus;
  lastLogin: string;
  moodleUserId: number | null;
}

export interface AdminCourse {
  id: number;
  name: string;
  teacher: string;
  students: number;
  avgMastery: number;
  status: "active" | "inactive";
  startDate: string;
}

export interface SystemLog {
  id: number;
  level: LogLevel;
  message: string;
  time: string;
  module: string;
}

export interface AdminNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ActivityDataPoint {
  day: string;
  sesiones: number;
  nuevos: number;
}

export interface UserDistDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  institution: string;
  avatar: string;
}
