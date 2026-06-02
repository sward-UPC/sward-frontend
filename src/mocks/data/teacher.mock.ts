/**
 * Mock data extraída de TeacherDashboard.tsx.
 * Usar mientras los endpoints reales de EP005 no estén disponibles.
 */
import type {
  StudentProgress,
  Alert,
  ClassTrendDataPoint,
  EngagementDataPoint,
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
