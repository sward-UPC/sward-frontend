import type { StudentTabProps } from '@features/student/useStudentContext';

/** Tab "Progreso" del panel del estudiante. Implementación real en progreso. */
export function StudentProgresoTab(_props: StudentTabProps) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[12px] bg-muted/50" />
        ))}
      </div>
      <div className="h-64 rounded-[12px] bg-muted/50" />
    </div>
  );
}
