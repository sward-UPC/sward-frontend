/** Datos de una interacción individual del estudiante con un concepto (uso en componentes XAI). */
export interface InteractionData {
  id: number;
  concept: string;
  timestamp: string;
  isCorrect: boolean;
  attention: number;
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
