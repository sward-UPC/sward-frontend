import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { useAuth } from '@core/auth/useAuth';
import { useTeacherCourses } from '@features/teacher/hooks/useTeacherCourses';
import { getStudentCourseIds } from '@features/teacher/services/teacher.service';

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

  // El selector mostraba todos los cursos de la plataforma, también los que el
  // estudiante no lleva: los abría y todo salía vacío. Se queda con aquellos en
  // los que tiene historial; si todavía no tiene ninguno —un participante que
  // aún no resuelve nada—, se muestran todos y cada pantalla explica que no hay
  // datos.
  const { data: cursosConHistorial } = useQuery({
    queryKey: ['student', 'cursos-con-historial', estudianteId],
    queryFn: () => getStudentCourseIds(estudianteId),
    enabled: !!estudianteId,
    staleTime: 1000 * 60 * 5,
  });
  const todos = courses ?? [];
  const list =
    cursosConHistorial && cursosConHistorial.length > 0
      ? todos.filter((c) => cursosConHistorial.includes(c.id))
      : todos;
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
