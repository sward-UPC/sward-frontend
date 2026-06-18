import { useQuery } from '@tanstack/react-query';
import { getCursos } from '../services/admin.service';

export const ADMIN_COURSES_KEY = ['admin', 'courses'] as const;

export function useAdminCourses() {
  return useQuery({
    queryKey: ADMIN_COURSES_KEY,
    queryFn: getCursos,
    staleTime: 1000 * 60 * 5,
  });
}
