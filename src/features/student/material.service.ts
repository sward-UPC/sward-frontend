import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

/** Pregunta de práctica generada por el LLM. */
export interface PreguntaPractica {
  pregunta: string;
  respuesta: string;
}

/** Material de estudio generado por LLM para reforzar el concepto débil. */
export interface MaterialGenerado {
  disponible: boolean;
  concepto: string;
  resumen: string;
  puntos_clave: string[];
  preguntas: PreguntaPractica[];
}

/**
 * Genera material de estudio nuevo (resumen + puntos clave + preguntas) con un
 * LLM, a partir de los recursos del curso, para reforzar el concepto débil.
 */
export async function generarMaterial(
  estudianteId: string,
  cursoId: string,
): Promise<MaterialGenerado> {
  const { data } = await apiClient.post<MaterialGenerado>(ENDPOINTS.teacher.generateMaterial, {
    estudianteId,
    cursoId,
  });
  return data;
}
