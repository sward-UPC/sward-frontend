import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

/** Racha GLOBAL de días consecutivos con actividad (todos los cursos del alumno). */
async function getStudentStreak(estudianteId: string): Promise<number> {
  const { data } = await apiClient.get<{ dias_racha: number }>(
    ENDPOINTS.teacher.studentStreak(estudianteId),
  );
  return data.dias_racha ?? 0;
}

/**
 * Racha de estudio del alumno. Es GLOBAL (no por curso), por eso solo depende del
 * `estudianteId`: el mismo número se ve igual en cualquier curso.
 */
export function useStudentStreak(estudianteId: string | undefined) {
  return useQuery({
    queryKey: ['student-streak', estudianteId],
    queryFn: () => getStudentStreak(estudianteId as string),
    enabled: !!estudianteId,
    staleTime: 1000 * 60 * 5,
  });
}
