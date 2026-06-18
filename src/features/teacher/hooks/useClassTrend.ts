import { useQuery } from '@tanstack/react-query';
import { getClassTrendReal } from '../services/teacher.service';

/** Tendencia semanal histórica de la clase (ms-trazabilidad). */
export function useClassTrend(courseId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', 'trend', courseId],
    queryFn: () => getClassTrendReal(courseId as string),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 3,
  });
}
