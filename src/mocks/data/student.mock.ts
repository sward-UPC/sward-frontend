/**
 * Mock data extraída de StudentDashboard.tsx.
 * Usar mientras los endpoints reales no estén disponibles.
 * Reemplazar importaciones por hooks de @features/student cuando el API esté listo.
 */
import type {
  Interaction,
  HistoricalDataPoint,
  KnowledgeState,
  DomainRadarData,
  Recommendation,
  LearningPathStep,
  StudentNotification,
  StudentUser,
  XAIAnalysis,
} from '@core/types';

export const mockInteractions: Interaction[] = [
  { id: 1, concept: 'Knowledge Tracing', conceptId: 'kt-001', timestamp: '15/05/26 10:30', isCorrect: true, attention: 92 },
  { id: 2, concept: 'Introducción a IA', conceptId: 'ia-001', timestamp: '15/05/26 09:15', isCorrect: true, attention: 85 },
  { id: 3, concept: 'Python Básico', conceptId: 'py-001', timestamp: '14/05/26 16:45', isCorrect: true, attention: 78 },
  { id: 4, concept: 'Deep Learning', conceptId: 'dl-001', timestamp: '14/05/26 14:20', isCorrect: false, attention: 65 },
  { id: 5, concept: 'Redes Neuronales', conceptId: 'rn-001', timestamp: '13/05/26 11:00', isCorrect: false, attention: 45 },
  { id: 6, concept: 'Redes Neuronales', conceptId: 'rn-001', timestamp: '12/05/26 15:30', isCorrect: false, attention: 38 },
];

export const mockHistoricalData: HistoricalDataPoint[] = [
  { session: 'S1', mastery: 45, concepts: 2 },
  { session: 'S2', mastery: 52, concepts: 3 },
  { session: 'S3', mastery: 58, concepts: 4 },
  { session: 'S4', mastery: 65, concepts: 5 },
  { session: 'S5', mastery: 68, concepts: 6 },
];

export const mockCurrentConcepts: KnowledgeState[] = [
  { conceptId: 'kt-001', conceptName: 'Knowledge Tracing', mastery: 90, trend: 'up', lastUpdated: '2026-05-15' },
  { conceptId: 'ia-001', conceptName: 'Introducción a IA', mastery: 85, trend: 'up', lastUpdated: '2026-05-15' },
  { conceptId: 'py-001', conceptName: 'Python Básico', mastery: 75, trend: 'stable', lastUpdated: '2026-05-14' },
  { conceptId: 'dl-001', conceptName: 'Deep Learning', mastery: 65, trend: 'up', lastUpdated: '2026-05-14' },
  { conceptId: 'rn-001', conceptName: 'Redes Neuronales', mastery: 45, trend: 'down', lastUpdated: '2026-05-13' },
];

export const mockDomainData: DomainRadarData[] = [
  { subject: 'Algoritmos', value: 90, fullMark: 100 },
  { subject: 'Python', value: 75, fullMark: 100 },
  { subject: 'Deep Learning', value: 65, fullMark: 100 },
  { subject: 'Redes Neur.', value: 45, fullMark: 100 },
  { subject: 'Know. Tracing', value: 90, fullMark: 100 },
];

export const mockSideRecommendations: Recommendation[] = [
  {
    id: 101,
    title: 'Normalización de Bases de Datos - Formas Normales',
    type: 'video',
    duration: '18 min',
    reason: 'Tu dominio en este concepto es del 55%. Este recurso refuerza los fundamentos de normalización.',
    content: 'Contenido del video sobre normalización de bases de datos...',
    concept: 'Bases de Datos',
    conceptId: 'bd-001',
    confidence: 92,
    improvement: 8,
  },
  {
    id: 102,
    title: 'Ejercicios Prácticos de Deep Learning',
    type: 'exercise',
    duration: '30 min',
    reason: 'Reforzar concepto con dominio medio (65%). La práctica te ayudará a consolidar el conocimiento.',
    content: '¿Cuál es la función de activación más común en redes neuronales profundas?\n\nSelecciona la respuesta correcta:',
    concept: 'Deep Learning',
    conceptId: 'dl-001',
    confidence: 87,
    improvement: 6,
  },
  {
    id: 103,
    title: 'Lectura: Arquitecturas de Atención',
    type: 'reading',
    duration: '20 min',
    reason: 'Tienes un buen dominio (90%) en Knowledge Tracing. Este tema es el siguiente paso natural.',
    content: 'Las arquitecturas de atención son mecanismos que permiten a los modelos enfocarse en partes específicas de la entrada.',
    concept: 'Knowledge Tracing',
    conceptId: 'kt-001',
    confidence: 91,
    improvement: 5,
  },
];

export const mockLearningPath: LearningPathStep[] = [
  { id: 1, label: 'Fundamentos IA', done: true },
  { id: 2, label: 'Python ML', done: true },
  { id: 3, label: 'Redes Neur.', done: false, current: true },
  { id: 4, label: 'Deep Learning', done: false },
  { id: 5, label: 'Know. Tracing', done: false },
];

export const mockNotifications: StudentNotification[] = [
  { id: 1, type: 'warning', title: 'Alerta de Aprendizaje', message: 'Bajo rendimiento detectado en Redes Neuronales (45%). Revisa los recursos recomendados.', time: 'Hace 5 min', read: false },
  { id: 2, type: 'info', title: 'Nueva Recomendación', message: 'Se añadió un nuevo recurso personalizado para reforzar Deep Learning.', time: 'Hace 1 hora', read: false },
  { id: 3, type: 'success', title: 'Logro Desbloqueado', message: '¡Completaste 12 recursos! Estás en el top 20% de tu clase.', time: 'Hace 2 horas', read: true },
];

export const mockUser: StudentUser = {
  name: 'Estudiante Demo',
  email: 'demo@sward.edu.pe',
  role: 'Estudiante',
  institution: 'Universidad Nacional Mayor',
  avatar: 'E',
  memberSince: 'Enero 2026',
};

export const mockXAIAnalysis: XAIAnalysis = {
  strongConcepts: ['Knowledge Tracing', 'Introducción a IA'],
  weakConcepts: ['Redes Neuronales', 'Deep Learning'],
  recommendation: 'Te sugerimos reforzar los conceptos fundamentales de Redes Neuronales antes de avanzar a temas más complejos.',
  reasoning: `El análisis de tus últimas 50 interacciones muestra:\n\n• Excelente desempeño en Knowledge Tracing (90% de dominio)\n• Solidez en conceptos introductorios de IA (85% de dominio)\n• Dificultades consistentes en Redes Neuronales (3 intentos incorrectos consecutivos)\n• El peso de atención más alto (92%) corresponde a tu última interacción correcta en Knowledge Tracing\n\nEl modelo SAKT identifica que tu comprensión de conceptos avanzados se ve limitada por las brechas en fundamentos de redes neuronales.`,
  confidence: 87,
};
