import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { Interaction, KnowledgeState, HistoricalDataPoint } from '@core/types';

/** Retorna las últimas interacciones del estudiante. */
export async function getInteractions(): Promise<Interaction[]> {
  const { data } = await apiClient.get<Interaction[]>(ENDPOINTS.student.interactions);
  return data;
}

/** Retorna el estado de conocimiento actual de todos los conceptos del estudiante. */
export async function getKnowledgeState(): Promise<KnowledgeState[]> {
  const { data } = await apiClient.get<KnowledgeState[]>(ENDPOINTS.student.knowledgeState);
  return data;
}

/** Retorna el historial de dominio por sesión para las gráficas de progreso. */
export async function getHistoricalProgress(): Promise<HistoricalDataPoint[]> {
  const { data } = await apiClient.get<HistoricalDataPoint[]>(`${ENDPOINTS.student.knowledgeState}/history`);
  return data;
}
