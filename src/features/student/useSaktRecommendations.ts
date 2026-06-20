import { useQuery } from '@tanstack/react-query';
import { generarRecomendacionSakt } from './sakt.service';

/**
 * Recomendaciones del modelo SAKT entrenado para el alumno+curso.
 * Es el motor real (ms-recomendacion); el frontend cae al heurístico si no hay.
 */
export function useSaktRecommendations(estudianteId: string | undefined, courseId: string | undefined) {
  return useQuery({
    queryKey: ['sakt-recommendations', estudianteId, courseId],
    queryFn: () => generarRecomendacionSakt(estudianteId as string, courseId as string),
    enabled: !!estudianteId && !!courseId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
