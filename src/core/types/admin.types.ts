/** Tipos de datos para el módulo de administración de SWARD. */

export type AdminTab = "resumen" | "usuarios" | "cursos" | "sistema" | "logs";
export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole2 = "student" | "teacher" | "admin";
export type NotificationType = "info" | "warning" | "error";
export type LogLevel = "info" | "warning" | "error";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole2;
  status: UserStatus;
  institution: string;
  lastLogin: string;
  joinDate: string;
  courses: number;
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
