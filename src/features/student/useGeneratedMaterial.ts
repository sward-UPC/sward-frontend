import { useQuery } from '@tanstack/react-query';
import { generarMaterial } from './material.service';

/**
 * Material de estudio generado por LLM para el concepto débil del alumno (Fase 4).
 * Best-effort: si no hay clave o falla, `disponible` viene en false.
 */
export function useGeneratedMaterial(estudianteId: string | undefined, courseId: string | undefined) {
  return useQuery({
    queryKey: ['generated-material', estudianteId, courseId],
    queryFn: () => generarMaterial(estudianteId as string, courseId as string),
    enabled: !!estudianteId && !!courseId,
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}
