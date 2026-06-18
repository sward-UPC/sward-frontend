import { useQuery } from '@tanstack/react-query';
import { getTeacherCourses } from '../services/teacher.service';
import { useAuth } from '@core/auth/useAuth';

/** Cursos disponibles para el docente autenticado. */
export function useTeacherCourses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teacher', 'courses', user?.id],
    queryFn: getTeacherCourses,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}
