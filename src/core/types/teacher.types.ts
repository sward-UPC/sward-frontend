/** Niveles de riesgo académico del estudiante (EP005). */
export type RiskLevel = 'high' | 'medium' | 'low';

/** Tipo de alerta generada por el sistema (EP005). */
export type AlertType = 'warning' | 'info' | 'success';

/** Resumen de progreso de un estudiante visible para el docente (EP005). */
export interface StudentProgress {
  id: number;
  name: string;
  email: string;
  riskLevel: RiskLevel;
  avgMastery: number;       // 0-100
  conceptsAtRisk: number;
  lastActivity: string;
  engagement: number;       // 0-100, índice de participación
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
