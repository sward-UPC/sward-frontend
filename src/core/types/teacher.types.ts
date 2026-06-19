/** Niveles de riesgo académico del estudiante (EP005). */
export type RiskLevel = 'high' | 'medium' | 'low';

/** Tipo de alerta generada por el sistema (EP005). */
export type AlertType = 'warning' | 'info' | 'success';

/** Resumen de progreso de un estudiante visible para el docente (EP005). */
export interface StudentProgress {
  id: number;
  /** UUID real del estudiante en el backend (para llamar a /students/{id}/...). */
  estudianteId?: string;
  name: string;
  email: string;
  riskLevel: RiskLevel;
  avgMastery: number;       // 0-100
  conceptsAtRisk: number;
  lastActivity: string;
  engagement: number;       // 0-100, índice de participación
  /** False si el estudiante solo existe en Moodle (no se registró en SWARD). */
  registrado?: boolean;
}

/** Alerta académica generada automáticamente por SAKT (EP005). */
export interface Alert {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  studentId?: number;
  studentName?: string;
  time: string;
  read: boolean;
}

/** Retroalimentación del docente hacia un estudiante (EP005). */
export interface TeacherFeedback {
  id?: number;
  studentId: number;
  teacherId: string;
  message: string;
  type: 'encouragement' | 'correction' | 'resource' | 'general';
  createdAt?: string;
}

/** Punto de datos de tendencia semanal de la clase (EP005). */
export interface ClassTrendDataPoint {
  week: string;
  promedio: number;
  riesgoAlto: number;
}

/** Dato de engagement por estudiante para gráficas (EP005). */
export interface EngagementDataPoint {
  name: string;
  engagement: number;
  dominio: number;
}

/** Punto de progreso semanal de un estudiante individual (EP005). */
export interface StudentProgressPoint {
  week: string;
  mastery: number;
}

/** Dominio de un concepto individual para la vista detalle (EP005). */
export interface ConceptMasteryPoint {
  concept: string;
  mastery: number;
}

/** Interacción reciente del estudiante visible para el docente (EP005). */
export interface StudentInteractionRecord {
  id: number;
  date: string;
  resource: string;
  concept: string;
  result: 'Completado' | 'Incorrecto';
  time: string;
}

/** Interacción con atención para el heatmap SAKT (EP005). */
export interface AttentionInteractionRecord {
  id: number;
  concept: string;
  timestamp: string;
  isCorrect: boolean;
  attention: number;
}

/** Dato para el radar de dominio del estudiante (EP005). */
export interface StudentDomainPoint {
  subject: string;
  value: number;
  fullMark: number;
}

/** Perfil del docente mostrado en el dashboard (EP005). */
export interface TeacherProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  courses: string;
}

/** Tabs disponibles en el dashboard docente. */
export type TeacherTab = 'resumen' | 'estudiantes' | 'analisis' | 'reportes';
