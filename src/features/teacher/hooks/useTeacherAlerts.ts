import { useQuery } from '@tanstack/react-query';
import { getCourseAlerts } from '../services/teacher.service';

/** Alertas de riesgo del curso (ms-xai). Solo corre con courseId definido. */
export function useTeacherAlerts(courseId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', 'alerts', courseId],
    queryFn: () => getCourseAlerts(courseId as string),
    enabled: !!courseId,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
  });
}
