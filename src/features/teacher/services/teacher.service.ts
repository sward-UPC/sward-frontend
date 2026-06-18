import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { StudentProgress, Alert, TeacherFeedback, ClassTrendDataPoint, RiskLevel } from '@core/types';

// ───────────────────────────────────────────────────────────────────────────
// Endpoint REAL del dashboard docente (ms-trazabilidad).
// ───────────────────────────────────────────────────────────────────────────

/** Forma de la respuesta del backend (ms-trazabilidad). */
interface ApiEstudianteProgress {
  estudiante_id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nivel_riesgo: 'critico' | 'alto' | 'medio' | 'bajo';
  puntaje_promedio: number;
  total_interacciones: number;
  recursos_completados: number;
}

/** Mapea los 4 niveles del backend a los 3 del UI (crítico y alto → high). */
function mapNivelRiesgo(nivel: ApiEstudianteProgress['nivel_riesgo']): RiskLevel {
  if (nivel === 'critico' || nivel === 'alto') return 'high';
  if (nivel === 'medio') return 'medium';
  return 'low';
}

/**
 * Progreso real de los estudiantes de un curso, mapeado al modelo del UI.
 *
 * `id` numérico es un índice sintético para la selección en el UI; el UUID real
 * viaja en `estudianteId`. Campos no provistos aún por el backend
 * (conceptsAtRisk, lastActivity, engagement) usan valores por defecto — ver
 * PENDIENTES-PANEL-DOCENTE.md.
 */
export async function getCourseStudentsProgress(courseId: string): Promise<StudentProgress[]> {
  const { data } = await apiClient.get<ApiEstudianteProgress[]>(
    ENDPOINTS.teacher.studentsProgress(courseId),
  );
  return data.map((e, i) => ({
    id: i + 1,
    estudianteId: e.estudiante_id,
    name: [e.nombre, e.apellido].filter(Boolean).join(' ') || e.correo,
    email: e.correo,
    riskLevel: mapNivelRiesgo(e.nivel_riesgo),
    avgMastery: Math.round(e.puntaje_promedio),
    conceptsAtRisk: 0, // TODO backend no lo expone aún
    lastActivity: '', // TODO backend no lo expone en este endpoint aún
    engagement: 0, // TODO backend no lo expone aún
  }));
}

/** Curso simplificado para el selector del docente. */
export interface TeacherCourse {
  id: string;
  nombre: string;
  moodleCourseId: string;
}

interface ApiCurso {
  id: string;
  nombre: string;
  moodle_course_id: string;
  docente_id: string | null;
}

/** Cursos disponibles para el docente (ms-cursos-recursos). */
export async function getTeacherCourses(): Promise<TeacherCourse[]> {
  const { data } = await apiClient.get<ApiCurso[]>(ENDPOINTS.admin.courses);
  return data.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    moodleCourseId: c.moodle_course_id,
  }));
}

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
