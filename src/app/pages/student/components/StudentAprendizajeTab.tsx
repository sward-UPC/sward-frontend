import type { StudentTabProps } from '@features/student/useStudentContext';

/** Tab "Mi Aprendizaje" del panel del estudiante. Implementación real en progreso. */
export function StudentAprendizajeTab(_props: StudentTabProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-72 rounded-[12px] bg-muted/50" />
        <div className="h-72 rounded-[12px] bg-muted/50" />
      </div>
    </div>
  );
}
