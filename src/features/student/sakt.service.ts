import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

/** Item recomendado por el modelo SAKT (ms-recomendacion). */
export interface SaktRecItem {
  recurso_id: string;
  titulo: string;
  tipo: string;
  url: string;
  motivo: string;
  score: number;
}

interface SaktRecResponse {
  id: string;
  estado: string;
  items: SaktRecItem[];
}

/**
 * Genera recomendaciones con el modelo SAKT entrenado: la secuencia del alumno
 * predice su dominio y rankea recursos del concepto débil. Es el motor real
 * (no el heurístico del frontend).
 */
export async function generarRecomendacionSakt(
  estudianteId: string,
  cursoId: string,
): Promise<SaktRecItem[]> {
  const { data } = await apiClient.post<SaktRecResponse>(ENDPOINTS.teacher.generateRecommendations, {
    estudianteId,
    cursoId,
  });
  // Solo items con URL (linkeables a Moodle).
  return (data.items ?? []).filter((i) => i.url);
}
