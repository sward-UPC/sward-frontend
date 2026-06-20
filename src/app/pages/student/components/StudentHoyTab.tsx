import type { StudentTabProps } from '@features/student/useStudentContext';

/** Tab "Hoy" del panel del estudiante. Implementación real en progreso. */
export function StudentHoyTab(_props: StudentTabProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-[12px] bg-muted/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-44 rounded-[12px] bg-muted/50" />
        <div className="h-44 rounded-[12px] bg-muted/50" />
      </div>
    </div>
  );
}
