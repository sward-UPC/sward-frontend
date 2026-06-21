/** Secciones de navegación del dashboard del estudiante. */
export type NavItem = 'hoy' | 'aprendizaje' | 'atencion' | 'progreso' | 'recursos';

/** Tipo de notificación. */
export type NotificationType = 'warning' | 'info' | 'success';

/** Notificación del sistema para el estudiante. */
export interface StudentNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/** Datos del usuario estudiante mostrados en el dashboard. */
export interface StudentUser {
  name: string;
  email: string;
  role: string;
  institution: string;
  avatar: string;
  memberSince: string;
  /** Color de avatar persistido (fondo del círculo / anillo). */
  avatarColor?: string;
  /** Foto de perfil persistida (data URL). */
  avatarUrl?: string;
}

/** Análisis XAI generado por SAKT para el estudiante. */
export interface XAIAnalysis {
  strongConcepts: string[];
  weakConcepts: string[];
  recommendation: string;
  reasoning: string;
  confidence: number;
}

/** Tipos de recurso de aprendizaje (EP003). */
export type ResourceType = 'video' | 'reading' | 'exercise' | 'quiz';

/** Tendencia de dominio de un concepto. */
export type MasteryTrend = 'up' | 'down' | 'stable';

/** Estado de conocimiento de un concepto según SAKT (EP003). */
export interface KnowledgeState {
  conceptId: string;
  conceptName: string;
  mastery: number;         // 0-100
  trend: MasteryTrend;
  lastUpdated: string;
}

/** Registro de una interacción del estudiante con un recurso (EP003). */
export interface Interaction {
  id: number;
  concept: string;
  conceptId: string;
  timestamp: string;
  isCorrect: boolean;
  attention: number;       // 0-100, peso de atención del modelo SAKT
  resourceId?: string;
}

/** Recomendación personalizada generada por SAKT (EP003). */
export interface Recommendation {
  id: number;
  title: string;
  type: ResourceType;
  duration: string;
  reason: string;          // explicación en lenguaje natural
  content: string;
  concept: string;
  conceptId: string;
  confidence: number;      // 0-100, confianza del modelo
  improvement: number;     // puntos de dominio estimados al completarlo
}

/** Brecha de aprendizaje identificada por SAKT (EP003). */
export interface LearningGap {
  conceptId: string;
  conceptName: string;
  currentMastery: number;
  targetMastery: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

/** Punto de datos para gráfica histórica de progreso. */
export interface HistoricalDataPoint {
  session: string;
  mastery: number;
  concepts: number;
}

/** Dato para el radar de dominio por área. */
export interface DomainRadarData {
  subject: string;
  value: number;
  fullMark: number;
}

/** Etapa en la ruta de aprendizaje. */
export interface LearningPathStep {
  id: number;
  label: string;
  done: boolean;
  current?: boolean;
}
