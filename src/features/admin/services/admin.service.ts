import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { User } from '@core/types';

export interface AdminMetrics {
  totalUsers: number;
  activeStudents: number;
  activeCourses: number;
  avgMastery: number;
  systemUptime: number;
}

export interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  saktModel: 'healthy' | 'degraded' | 'down';
  moodleSync: 'healthy' | 'degraded' | 'down';
}

/** Retorna la lista completa de usuarios del sistema. */
export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>(ENDPOINTS.admin.users);
  return data;
}

/** Actualiza el estado de un usuario (active, inactive, suspended). */
export async function updateUserStatus(userId: string, status: string): Promise<User> {
  const { data } = await apiClient.patch<User>(ENDPOINTS.users.updateStatus(userId), { status });
  return data;
}

/** Retorna las métricas globales del sistema. */
export async function getMetrics(): Promise<AdminMetrics> {
  const { data } = await apiClient.get<AdminMetrics>(ENDPOINTS.admin.metrics);
  return data;
}

/** Retorna el estado de salud de los servicios del sistema. */
export async function getSystemStatus(): Promise<SystemStatus> {
  const { data } = await apiClient.get<SystemStatus>(ENDPOINTS.admin.systemStatus);
  return data;
}
