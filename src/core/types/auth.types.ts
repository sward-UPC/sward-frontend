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
  avatarUrl?: string;
  createdAt: string;
}

/** Payload de login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Respuesta del endpoint /auth/login. */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

/** Payload de registro. */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institution: string;
}

/** Respuesta del endpoint /auth/register. */
export interface RegisterResponse {
  user: User;
  message: string;
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
