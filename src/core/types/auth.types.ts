/** Roles de usuario del sistema SWARD (EP001). */
export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

/** Perfil de usuario autenticado. */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institution: string;
  /** Imagen de perfil como data URL base64 (gestionada en "Mi Perfil"). */
  avatarUrl?: string;
  /** Color de fondo del avatar cuando no hay imagen (hex). */
  avatarColor?: string;
  createdAt: string;
}

/** Payload de login (contrato real del backend). */
export interface LoginRequest {
  correo: string;
  password: string;
}

/** Respuesta del endpoint /auth/login (contrato real del backend). */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/** Payload de registro (contrato real del backend). */
export interface RegisterRequest {
  correo: string;
  password: string;
}

/** Respuesta del endpoint /auth/register (contrato real del backend). */
export interface RegisterResponse {
  id: string;
  correo: string;
  estado: string;
}

/** Payload de recuperación de contraseña. */
export interface PasswordRecoveryRequest {
  email: string;
}

/** Estado del contexto de autenticación. */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
