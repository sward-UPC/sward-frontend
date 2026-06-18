import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type {
  StudentProgress,
  Alert,
  TeacherFeedback,
  ClassTrendDataPoint,
  RiskLevel,
  StudentInteractionRecord,
} from '@core/types';

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

/** Tipo de feedback aceptado por el backend (ms-trazabilidad). */
export type FeedbackTipo = 'encouragement' | 'correction' | 'resource' | 'general';

/** Envía retroalimentación del docente a un estudiante (ms-trazabilidad). */
export async function enviarFeedbackReal(payload: {
  estudianteId: string;
  cursoId: string;
  mensaje: string;
  tipo: FeedbackTipo;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.teacher.feedbackReal, {
    estudiante_id: payload.estudianteId,
    curso_id: payload.cursoId,
    mensaje: payload.mensaje,
    tipo: payload.tipo,
  });
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

/**
 * Descarga el reporte PDF real de la clase (ms-trazabilidad) y dispara la
 * descarga en el navegador. El PDF se genera profesionalmente server-side.
 */
export async function downloadClassReport(courseId: string): Promise<void> {
  const { data } = await apiClient.get(ENDPOINTS.teacher.report(courseId), {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_clase_${courseId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ───────────────────────────────────────────────────────────────────────────
// Detalle de un estudiante (ms-trazabilidad) — endpoints REALES:
//   GET /students/{id}/progress?courseId=...
//   GET /students/{id}/indicators?courseId=...
//   GET /students/{id}/interactions?courseId=...
// ───────────────────────────────────────────────────────────────────────────

/** Respuesta real de `GET /students/{id}/progress`. */
interface ApiStudentProgressDetail {
  id?: string;
  porcentaje_avance: number;
  nivel_riesgo: 'critico' | 'alto' | 'medio' | 'bajo';
  total_interacciones: number;
  puntaje_promedio: number;
}

/** Progreso del estudiante mapeado al modelo del UI (detalle). */
export interface StudentDetailProgress {
  porcentajeAvance: number; // 0-100
  riskLevel: RiskLevel;
  totalInteracciones: number;
  puntajePromedio: number; // 0-100
}

/** Progreso real (detalle) de un estudiante en un curso. */
export async function getStudentDetailProgress(
  studentId: string,
  courseId: string,
): Promise<StudentDetailProgress> {
  const { data } = await apiClient.get<ApiStudentProgressDetail>(
    ENDPOINTS.teacher.studentProgress(studentId, courseId),
  );
  return {
    porcentajeAvance: Math.round(data.porcentaje_avance),
    riskLevel: mapNivelRiesgo(data.nivel_riesgo),
    totalInteracciones: data.total_interacciones,
    puntajePromedio: Math.round(data.puntaje_promedio),
  };
}

/** Respuesta real de `GET /students/{id}/indicators`. */
interface ApiIndicator {
  nombre: string;
  valor: number;
  unidad: string;
}

/** Indicador de desempeño mapeado al modelo del UI. */
export interface StudentIndicator {
  nombre: string;
  valor: number;
  unidad: string;
}

/** Indicadores reales de desempeño de un estudiante en un curso. */
export async function getStudentIndicators(
  studentId: string,
  courseId: string,
): Promise<StudentIndicator[]> {
  const { data } = await apiClient.get<ApiIndicator[]>(
    ENDPOINTS.teacher.studentIndicators(studentId, courseId),
  );
  return data.map((i) => ({ nombre: i.nombre, valor: i.valor, unidad: i.unidad }));
}

/** Respuesta real de `GET /students/{id}/interactions`. */
interface ApiInteraction {
  id: string;
  actividad_id: string | null;
  tipo: 'respuesta' | 'vista' | 'descarga' | 'completado';
  fecha: string; // ISO 8601
  curso_id: string;
}

/** Etiqueta legible para el tipo de interacción del backend. */
const TIPO_INTERACCION_LABEL: Record<ApiInteraction['tipo'], string> = {
  respuesta: 'Respuesta a actividad',
  vista: 'Visualización de recurso',
  descarga: 'Descarga de recurso',
  completado: 'Actividad completada',
};

/** Formatea una fecha ISO a `dd/mm/aa hh:mm` y `hh:mm` por separado. */
function splitFecha(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: '' };
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${dd}/${mm}/${yy} ${hh}:${min}`, time: `${hh}:${min}` };
}

/**
 * Historial real de interacciones de un estudiante mapeado al modelo del UI.
 *
 * El backend expone `tipo` (vista/respuesta/descarga/completado) pero NO la
 * corrección de la respuesta en este endpoint. Como ninguno de los tipos indica
 * fallo, `result` se marca siempre como "Completado" para no mostrar el ícono de
 * error de forma engañosa (ver PENDIENTES-PANEL-DOCENTE.md: falta exponer la
 * corrección y resolver `actividad_id` → nombre del recurso/concepto). El `id`
 * numérico es un índice sintético (la lista del UI espera number).
 */
export async function getStudentInteractions(
  studentId: string,
  courseId: string,
): Promise<StudentInteractionRecord[]> {
  const { data } = await apiClient.get<ApiInteraction[]>(
    ENDPOINTS.teacher.studentInteractions(studentId, courseId),
  );
  return data.map((it, i) => {
    const { date, time } = splitFecha(it.fecha);
    return {
      id: i + 1,
      date,
      resource: TIPO_INTERACCION_LABEL[it.tipo] ?? it.tipo,
      concept: it.actividad_id ? `Actividad ${it.actividad_id.slice(0, 8)}` : 'General',
      result: 'Completado',
      time,
    };
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Alertas (ms-xai) y tendencia de clase (ms-trazabilidad) — endpoints REALES.
// ───────────────────────────────────────────────────────────────────────────

interface ApiAlerta {
  id: string;
  estudiante_id: string;
  curso_id: string;
  nivel_riesgo: string;
  mensaje: string;
  creada_en: string;
}

/** Alertas de riesgo del curso (las genera lambda-alertas; las lee ms-xai). */
export async function getCourseAlerts(courseId: string): Promise<Alert[]> {
  const { data } = await apiClient.get<ApiAlerta[]>(ENDPOINTS.teacher.alertsReal(courseId));
  return data.map((a, i) => ({
    id: i + 1,
    type: a.nivel_riesgo === 'critico' || a.nivel_riesgo === 'alto' ? 'warning' : 'info',
    title: `Riesgo ${a.nivel_riesgo}`,
    message: a.mensaje,
    time: new Date(a.creada_en).toLocaleString('es-PE'),
    read: false,
  }));
}

interface ApiTendencia {
  week: string;
  promedio: number;
  riesgoAlto: number;
}

/** Tendencia semanal histórica de la clase (ms-trazabilidad). */
export async function getClassTrendReal(courseId: string): Promise<ClassTrendDataPoint[]> {
  const { data } = await apiClient.get<ApiTendencia[]>(ENDPOINTS.teacher.trend(courseId));
  return data.map((p) => ({ week: p.week, promedio: p.promedio, riesgoAlto: p.riesgoAlto }));
}
