import type { StudentTabProps } from '@features/student/useStudentContext';

/** Tab "Recursos" del panel del estudiante (Recomendado para ti). Implementación real en progreso. */
export function StudentRecursosTab(_props: StudentTabProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 rounded-[12px] bg-muted/50" />
      <div className="h-56 rounded-[12px] bg-muted/50" />
    </div>
  );
}
