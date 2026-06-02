/**
 * Mock data para los componentes XAI (EP004).
 * Refleja la estructura de AttentionHeatmapResponse y XAIExplanationResponse.
 */
import type { DomainRadarData } from '@core/types';
import type { AttentionHeatmapResponse, XAIExplanationResponse } from '@features/xai/services/xai.service';

export const mockAttentionHeatmap: AttentionHeatmapResponse = {
  interactions: [
    { id: 1, concept: 'Knowledge Tracing', conceptId: 'kt-001', timestamp: '15/05/26 10:30', isCorrect: true, attention: 92 },
    { id: 2, concept: 'Introducción a IA', conceptId: 'ia-001', timestamp: '15/05/26 09:15', isCorrect: true, attention: 85 },
    { id: 3, concept: 'Python Básico', conceptId: 'py-001', timestamp: '14/05/26 16:45', isCorrect: true, attention: 78 },
    { id: 4, concept: 'Deep Learning', conceptId: 'dl-001', timestamp: '14/05/26 14:20', isCorrect: false, attention: 65 },
    { id: 5, concept: 'Redes Neuronales', conceptId: 'rn-001', timestamp: '13/05/26 11:00', isCorrect: false, attention: 45 },
    { id: 6, concept: 'Redes Neuronales', conceptId: 'rn-001', timestamp: '12/05/26 15:30', isCorrect: false, attention: 38 },
  ],
  currentPrediction:
    'Es probable que tengas dificultades con el próximo ejercicio de Redes Neuronales (probabilidad de éxito: 48%). Se recomienda revisar los fundamentos antes de continuar.',
  modelConfidence: 87,
};

export const mockXAIExplanation: XAIExplanationResponse = {
  strongConcepts: ['Knowledge Tracing', 'Introducción a IA'],
  weakConcepts: ['Redes Neuronales', 'Deep Learning'],
  recommendation:
    'Te sugerimos reforzar los conceptos fundamentales de Redes Neuronales antes de avanzar a temas más complejos.',
  reasoning: `El análisis de tus últimas 50 interacciones muestra:\n\n• Excelente desempeño en Knowledge Tracing (90% de dominio)\n• Solidez en conceptos introductorios de IA (85% de dominio)\n• Dificultades consistentes en Redes Neuronales (3 intentos incorrectos consecutivos)\n• El peso de atención más alto (92%) corresponde a tu última interacción correcta en Knowledge Tracing\n\nEl modelo SAKT identifica que tu comprensión de conceptos avanzados se ve limitada por las brechas en fundamentos de redes neuronales.`,
  confidence: 87,
  domainRadar: [
    { subject: 'Algoritmos', value: 90, fullMark: 100 },
    { subject: 'Python', value: 75, fullMark: 100 },
    { subject: 'Deep Learning', value: 65, fullMark: 100 },
    { subject: 'Redes Neur.', value: 45, fullMark: 100 },
    { subject: 'Know. Tracing', value: 90, fullMark: 100 },
  ] satisfies DomainRadarData[],
};
