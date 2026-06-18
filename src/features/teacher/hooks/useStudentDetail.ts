import { useQuery } from '@tanstack/react-query';
import {
  getStudentDetailProgress,
  getStudentIndicators,
  getStudentInteractions,
} from '../services/teacher.service';

/**
 * Detalle real de un estudiante (progreso, indicadores e historial de
 * interacciones) para `StudentDetailView`. Cada query se ejecuta solo cuando
 * hay `estudianteId` (UUID) y `courseId`; si faltan, el componente cae al mock.
 */
export function useStudentDetail(
  estudianteId: string | undefined,
  courseId: string | undefined,
) {
  const enabled = !!estudianteId && !!courseId;

  const progress = useQuery({
    queryKey: ['teacher', 'student-detail', 'progress', estudianteId, courseId],
    queryFn: () => getStudentDetailProgress(estudianteId as string, courseId as string),
    enabled,
    staleTime: 1000 * 60 * 2,
  });

  const indicators = useQuery({
    queryKey: ['teacher', 'student-detail', 'indicators', estudianteId, courseId],
    queryFn: () => getStudentIndicators(estudianteId as string, courseId as string),
    enabled,
    staleTime: 1000 * 60 * 2,
  });

  const interactions = useQuery({
    queryKey: ['teacher', 'student-detail', 'interactions', estudianteId, courseId],
    queryFn: () => getStudentInteractions(estudianteId as string, courseId as string),
    enabled,
    staleTime: 1000 * 60 * 2,
  });

  return { enabled, progress, indicators, interactions };
}
