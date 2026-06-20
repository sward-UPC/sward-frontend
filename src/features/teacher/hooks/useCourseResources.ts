import { useQuery } from '@tanstack/react-query';
import { getCourseResources } from '../services/teacher.service';

/**
 * Recursos del curso por sección (en vivo desde Moodle). Se usan para sugerir
 * lecturas/material concreto en las recomendaciones de intervención.
 */
export function useCourseResources(moodleCourseId: string | undefined) {
  return useQuery({
    queryKey: ['teacher', 'course-resources', moodleCourseId],
    queryFn: () => getCourseResources(moodleCourseId as string),
    enabled: !!moodleCourseId,
    staleTime: 1000 * 60 * 10,
  });
}
