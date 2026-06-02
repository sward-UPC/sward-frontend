import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { StudentProgress, Alert, TeacherFeedback, ClassTrendDataPoint } from '@core/types';

/** Retorna la lista de estudiantes del docente con su estado de riesgo. */
export async function getStudentList(): Promise<StudentProgress[]> {
  const { data } = await apiClient.get<StudentProgress[]>(ENDPOINTS.teacher.students);
  return data;
}

/** Retorna el detalle de un estudiante específico. */
export async function getStudentById(id: string): Promise<StudentProgress> {
  const { data } = await apiClient.get<StudentProgress>(ENDPOINTS.teacher.studentById(id));
  return data;
}

/** Retorna las alertas activas del docente. */
export async function getAlerts(): Promise<Alert[]> {
  const { data } = await apiClient.get<Alert[]>(ENDPOINTS.teacher.alerts);
  return data;
}

/** Descarta una alerta por ID. */
export async function dismissAlert(id: string): Promise<void> {
  await apiClient.post(ENDPOINTS.teacher.dismissAlert(id));
}

/** Envía retroalimentación del docente a un estudiante. */
export async function sendFeedback(payload: Omit<TeacherFeedback, 'id' | 'createdAt'>): Promise<TeacherFeedback> {
  const { data } = await apiClient.post<TeacherFeedback>(ENDPOINTS.teacher.feedback, payload);
  return data;
}

/** Retorna la tendencia de progreso semanal de la clase. */
export async function getClassTrend(): Promise<ClassTrendDataPoint[]> {
  const { data } = await apiClient.get<ClassTrendDataPoint[]>(ENDPOINTS.teacher.classProgress);
  return data;
}

/** Solicita la exportación del reporte PDF de la clase. Retorna URL de descarga. */
export async function exportClassReport(): Promise<{ url: string }> {
  const { data } = await apiClient.post<{ url: string }>(ENDPOINTS.teacher.exportReport);
  return data;
}
