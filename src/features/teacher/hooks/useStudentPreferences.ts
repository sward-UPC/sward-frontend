import { useQuery } from '@tanstack/react-query';
import { getStudentPreferences } from '../services/teacher.service';

/**
 * Preferencia de formato del estudiante (en qué tipo de recurso rinde mejor).
 * Alimenta el motor de recomendación personalizada de recursos.
 */
export function useStudentPreferences(studentId: string | undefined, courseId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', 'student-preferences', studentId, courseId],
    queryFn: () => getStudentPreferences(studentId as string, courseId as string),
    enabled: !!studentId && !!courseId,
    staleTime: 1000 * 60 * 5,
  });
}
