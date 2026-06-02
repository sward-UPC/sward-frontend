import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { Interaction, DomainRadarData } from '@core/types';

export interface AttentionHeatmapResponse {
  interactions: Interaction[];
  currentPrediction: string;
  modelConfidence: number;
}

export interface XAIExplanationResponse {
  strongConcepts: string[];
  weakConcepts: string[];
  recommendation: string;
  reasoning: string;
  confidence: number;
  domainRadar: DomainRadarData[];
}

/** Retorna el mapa de atención del modelo SAKT para el estudiante autenticado. */
export async function getAttentionHeatmap(): Promise<AttentionHeatmapResponse> {
  const { data } = await apiClient.get<AttentionHeatmapResponse>(ENDPOINTS.xai.attentionHeatmap);
  return data;
}

/** Retorna la explicación XAI en lenguaje natural del estado de conocimiento actual. */
export async function getExplanation(): Promise<XAIExplanationResponse> {
  const { data } = await apiClient.get<XAIExplanationResponse>(ENDPOINTS.xai.explanation);
  return data;
}

/** Retorna el historial de comparación de progreso entre sesiones. */
export async function getHistoricalComparison(): Promise<DomainRadarData[]> {
  const { data } = await apiClient.get<DomainRadarData[]>(ENDPOINTS.xai.historicalComparison);
  return data;
}
