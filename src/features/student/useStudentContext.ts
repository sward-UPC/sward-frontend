import { useSearchParams } from 'react-router';
import { useAuth } from '@core/auth/useAuth';
import { useTeacherCourses } from '@features/teacher/hooks/useTeacherCourses';

/**
 * Props reales que recibe cada tab del panel del estudiante. El `estudianteId`
 * es el id del usuario logueado (== estudiante_id en trazabilidad, ya que el id
 * SWARD se deriva determinísticamente del id de Moodle).
 */
export interface StudentTabProps {
  estudianteId: string;
  courseId?: string;
  moodleCourseId?: string;
  courseName?: string;
}

/**
 * Contexto del estudiante logueado: su id (para pedir SU propia data real),
 * la lista de cursos y el curso activo (persistido en la URL ?curso=).
 */
export function useStudentContext() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useTeacherCourses(); // GET /courses (cualquier JWT)
  const [params, setParams] = useSearchParams();

  const estudianteId = user?.id ?? '';
  const list = courses ?? [];
  const activeCourseId = params.get('curso') ?? list[0]?.id;
  const setActiveCourseId = (id: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('curso', id);
      return next;
    });
  };
  const active = list.find((c) => c.id === activeCourseId);

  return {
    estudianteId,
    courses: list,
    isLoadingCourses: isLoading,
    activeCourseId,
    setActiveCourseId,
    courseId: activeCourseId,
    moodleCourseId: active?.moodleCourseId,
    courseName: active?.nombre,
  };
}
