/**
 * Mock data extraída de TeacherDashboard.tsx.
 * Usar mientras los endpoints reales de EP005 no estén disponibles.
 */
import type {
  StudentProgress,
  Alert,
  ClassTrendDataPoint,
  EngagementDataPoint,
  TeacherProfile,
  StudentProgressPoint,
  ConceptMasteryPoint,
  StudentInteractionRecord,
  AttentionInteractionRecord,
  StudentDomainPoint,
} from '@core/types';

export const mockStudents: StudentProgress[] = [
  { id: 1, name: 'Ana García Pérez', email: 'ana.garcia@sward.edu.pe', riskLevel: 'high', avgMastery: 42, conceptsAtRisk: 4, lastActivity: 'Hace 2 días', engagement: 35 },
  { id: 2, name: 'Carlos Méndez Torres', email: 'carlos.mendez@sward.edu.pe', riskLevel: 'medium', avgMastery: 68, conceptsAtRisk: 2, lastActivity: 'Hace 5 horas', engagement: 72 },
  { id: 3, name: 'María López Suárez', email: 'maria.lopez@sward.edu.pe', riskLevel: 'low', avgMastery: 87, conceptsAtRisk: 0, lastActivity: 'Hace 1 hora', engagement: 91 },
  { id: 4, name: 'José Ramírez Castro', email: 'jose.ramirez@sward.edu.pe', riskLevel: 'high', avgMastery: 51, conceptsAtRisk: 3, lastActivity: 'Hace 4 días', engagement: 28 },
  { id: 5, name: 'Laura Fernández Díaz', email: 'laura.fernandez@sward.edu.pe', riskLevel: 'medium', avgMastery: 73, conceptsAtRisk: 1, lastActivity: 'Hace 3 horas', engagement: 78 },
  { id: 6, name: 'Pedro Vásquez Rojas', email: 'pedro.vasquez@sward.edu.pe', riskLevel: 'low', avgMastery: 92, conceptsAtRisk: 0, lastActivity: 'Hace 30 min', engagement: 95 },
];

export const mockTeacherAlerts: Alert[] = [
  { id: 1, type: 'warning', title: 'Estudiante en Riesgo Alto', message: 'Ana García Pérez lleva 2 días sin actividad y su dominio bajó a 42%.', studentId: 1, studentName: 'Ana García Pérez', time: 'Hace 10 min', read: false },
  { id: 2, type: 'warning', title: 'Nuevo Estudiante en Riesgo', message: 'José Ramírez Castro acaba de clasificarse como riesgo alto. Requiere intervención.', studentId: 4, studentName: 'José Ramírez Castro', time: 'Hace 30 min', read: false },
  { id: 3, type: 'info', title: 'Reporte Semanal Disponible', message: 'El reporte de progreso de la semana 3 está listo para descargar.', time: 'Hace 2 horas', read: true },
  { id: 4, type: 'success', title: 'Mejora de Estudiante', message: 'Pedro Vásquez Rojas mejoró su dominio a 92%. ¡Excelente progreso!', studentId: 6, studentName: 'Pedro Vásquez Rojas', time: 'Hace 3 horas', read: true },
];

export const mockTrendData: ClassTrendDataPoint[] = [
  { week: 'Sem 1', promedio: 61, riesgoAlto: 3 },
  { week: 'Sem 2', promedio: 64, riesgoAlto: 3 },
  { week: 'Sem 3', promedio: 67, riesgoAlto: 2 },
  { week: 'Sem 4', promedio: 69, riesgoAlto: 2 },
];

export const mockEngagementData: EngagementDataPoint[] = mockStudents.map((s) => ({
  name: s.name.split(' ')[0],
  engagement: s.engagement,
  dominio: s.avgMastery,
}));

export const mockTeacher: TeacherProfile = {
  name: 'Prof. María Docente',
  email: 'docente@sward.edu.pe',
  role: 'Docente',
  department: 'Ciencias de la Computación',
  avatar: 'D',
  courses: 'IA, Machine Learning',
};

/* ── StudentDetailView mock data ── */

export const mockStudentProgressPoints: StudentProgressPoint[] = [
  { week: 'S1', mastery: 45 },
  { week: 'S2', mastery: 48 },
  { week: 'S3', mastery: 42 },
  { week: 'S4', mastery: 50 },
  { week: 'S5', mastery: 52 },
];

export const mockConceptMasteryPoints: ConceptMasteryPoint[] = [
  { concept: 'Intro IA', mastery: 75 },
  { concept: 'Redes N.', mastery: 35 },
  { concept: 'Deep L.', mastery: 40 },
  { concept: 'KT', mastery: 60 },
  { concept: 'Python', mastery: 55 },
];

export const mockStudentInteractions: StudentInteractionRecord[] = [
  { id: 1, date: '15/05/26 10:30', resource: 'Video: Fundamentos de Redes Neuronales', concept: 'Redes Neuronales', result: 'Completado', time: '15 min' },
  { id: 2, date: '14/05/26 16:45', resource: 'Ejercicio: Deep Learning Básico', concept: 'Deep Learning', result: 'Incorrecto', time: '25 min' },
  { id: 3, date: '14/05/26 14:20', resource: 'Lectura: Introducción a Knowledge Tracing', concept: 'Knowledge Tracing', result: 'Completado', time: '18 min' },
  { id: 4, date: '13/05/26 11:00', resource: 'Ejercicio: Perceptrón Simple', concept: 'Redes Neuronales', result: 'Incorrecto', time: '30 min' },
];

export const mockAttentionInteractions: AttentionInteractionRecord[] = [
  { id: 1, concept: 'Intro a IA', timestamp: '15/05/26 10:30', isCorrect: true, attention: 75 },
  { id: 2, concept: 'Deep Learning', timestamp: '14/05/26 16:45', isCorrect: false, attention: 40 },
  { id: 3, concept: 'Redes Neuronales', timestamp: '14/05/26 14:20', isCorrect: false, attention: 35 },
  { id: 4, concept: 'Knowledge Tracing', timestamp: '13/05/26 11:00', isCorrect: true, attention: 60 },
];

export const mockStudentDomainPoints: StudentDomainPoint[] = [
  { subject: 'Intro IA', value: 75, fullMark: 100 },
  { subject: 'Deep Learning', value: 40, fullMark: 100 },
  { subject: 'Redes Neur.', value: 35, fullMark: 100 },
  { subject: 'Python', value: 55, fullMark: 100 },
  { subject: 'Know. Tracing', value: 60, fullMark: 100 },
];

/** Notificaciones del panel superior (subconjunto de alertas sin studentId requerido). */
export const mockTeacherNotifications: Alert[] = [
  { id: 1, type: 'warning', title: 'Estudiante en Riesgo Alto', message: 'Ana García Pérez lleva 2 días sin actividad y su dominio bajó a 42%.', time: 'Hace 10 min', read: false },
  { id: 2, type: 'warning', title: 'Nuevo Estudiante en Riesgo', message: 'José Ramírez Castro acaba de clasificarse como riesgo alto. Requiere intervención.', time: 'Hace 30 min', read: false },
  { id: 3, type: 'info', title: 'Reporte Semanal Disponible', message: 'El reporte de progreso de la semana 3 está listo para descargar.', time: 'Hace 2 horas', read: true },
  { id: 4, type: 'success', title: 'Mejora de Estudiante', message: 'Pedro Vásquez Rojas mejoró su dominio a 92%. ¡Excelente progreso!', time: 'Hace 3 horas', read: true },
];
