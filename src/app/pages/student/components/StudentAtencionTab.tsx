import type { StudentTabProps } from '@features/student/useStudentContext';

/** Tab "Mapa de Atención" del panel del estudiante. Implementación real en progreso. */
export function StudentAtencionTab(_props: StudentTabProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 rounded-[12px] bg-muted/50" />
      <div className="h-80 rounded-[12px] bg-muted/50" />
    </div>
  );
}
