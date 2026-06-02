import { useQuery } from '@tanstack/react-query';
import { getStudentList } from '../services/teacher.service';
import { useAuth } from '@core/auth/useAuth';

/** React Query hook para la lista de estudiantes con riesgo académico. */
export function useStudentList() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher', 'students', user?.id],
    queryFn: getStudentList,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 3,
  });
}
