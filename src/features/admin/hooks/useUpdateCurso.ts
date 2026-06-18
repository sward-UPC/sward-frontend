import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurso, type UpdateCursoPayload } from '../services/admin.service';
import { ADMIN_COURSES_KEY } from './useAdminCourses';

export function useUpdateCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCursoPayload }) =>
      updateCurso(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_KEY });
    },
  });
}
