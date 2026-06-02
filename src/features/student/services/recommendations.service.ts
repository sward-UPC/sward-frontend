import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';
import type { Recommendation, LearningGap } from '@core/types';

/** Retorna las recomendaciones personalizadas del estudiante autenticado. */
export async function getRecommendations(): Promise<Recommendation[]> {
  const { data } = await apiClient.get<Recommendation[]>(ENDPOINTS.student.recommendations);
  return data;
}

/** Retorna las brechas de aprendizaje detectadas por SAKT. */
export async function getLearningGaps(): Promise<LearningGap[]> {
  const { data } = await apiClient.get<LearningGap[]>(ENDPOINTS.student.learningGaps);
  return data;
}

/** Marca un recurso como completado. */
export async function completeResource(resourceId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.student.completeResource(resourceId));
}
