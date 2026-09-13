/** Datos de una interacción individual del estudiante con un concepto (uso en componentes XAI). */
export interface InteractionData {
  id: number;
  concept: string;
  timestamp: string;
  isCorrect: boolean;
  attention: number;
  /**
   * True si la verificación comprobó que esta interacción basta para llegar a la
   * predicción. Solo llega en true con suficiencia verificada en el backend.
   */
  sufficient?: boolean;
}

/** Por qué la explicación quedó verificada o no (ms-recomendacion). */
export type VerificationReason =
  | 'fiel'
  | 'no_supera_azar'
  | 'pocas_interacciones'
  | 'verificacion_desactivada'
  | 'error_verificacion';

/** Qué pasaría si la interacción más atendida hubiera salido al revés. */
export interface ExplanationCounterfactual {
  concept: string;
  originallyCorrect: boolean;
  /** Probabilidad [0, 1] con el historial real. */
  probabilityBefore: number;
  /** Probabilidad [0, 1] invirtiendo esa respuesta. */
  probabilityAfter: number;
}

/**
 * Veredicto de fidelidad de la explicación por atención.
 *
 * La atención de SAKT, medida con ERASER, resultó suficiente pero no necesaria:
 * lo más atendido basta para llegar a la predicción, pero no la causa. La interfaz
 * solo puede afirmar lo que este veredicto respalda.
 */
export interface ExplanationVerification {
  criterion: 'suficiencia' | 'exhaustividad';
  verified: boolean;
  reason: VerificationReason;
  /** Fracción [0, 1] de comparaciones al azar que la atención superó. */
  confidence: number;
  comparisons: number;
  sufficientConcepts: string[];
  /** Si además se comprobó que quitar esas interacciones cambia la predicción. */
  isNecessary: boolean;
  counterfactual: ExplanationCounterfactual | null;
}

/** Análisis de estado de conocimiento generado por SAKT (para componentes XAI). */
export interface ExplanationData {
  strongConcepts: string[];
  weakConcepts: string[];
  recommendation: string;
  reasoning: string;
  confidence: number;
}

/** Nodo de concepto con tendencia (uso en KnowledgeGraph). */
export interface ConceptNode {
  name: string;
  mastery: number;
  trend: "up" | "down" | "stable";
}
