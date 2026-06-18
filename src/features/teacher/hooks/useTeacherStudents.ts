import { useQuery } from '@tanstack/react-query';
import { getCourseStudentsProgress } from '../services/teacher.service';

/**
 * Progreso real de los estudiantes de un curso (dashboard docente).
 * Solo se ejecuta cuando hay un `courseId` definido.
 */
export function useTeacherStudents(courseId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', 'students-progress', courseId],
    queryFn: () => getCourseStudentsProgress(courseId as string),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2,
  });
}
