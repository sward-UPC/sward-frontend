import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AlertTriangle, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import type { StudentProgress } from '@core/types';

interface AlertsPanelProps {
  highRiskStudents: StudentProgress[];
  onViewStudent: (id: number) => void;
  onFeedback: (student: { id: number; name: string; estudianteId?: string }) => void;
  /** Salta a la tab Estudiantes con el filtro de riesgo alto aplicado. */
  onViewAll: () => void;
}

/** Cuántos mostrar como resumen antes de mandar a la lista completa. */
const LIMITE = 5;

export function AlertsPanel({ highRiskStudents, onViewStudent, onFeedback, onViewAll }: AlertsPanelProps) {
  if (highRiskStudents.length === 0) return null;

  // Más críticos primero: menor dominio y, a igualdad, más conceptos en riesgo.
  const ordenados = [...highRiskStudents].sort(
    (a, b) => a.avgMastery - b.avgMastery || b.conceptsAtRisk - a.conceptsAtRisk,
  );
  const visibles = ordenados.slice(0, LIMITE);
  const restantes = ordenados.length - visibles.length;

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="min-w-0">Estudiantes que requieren atención inmediata</span>
          <Badge variant="destructive" className="ml-auto shrink-0 tabular-nums">
            {highRiskStudents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibles.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 p-3 bg-card rounded-[10px] border border-border"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Dominio: {s.avgMastery}% · Última actividad: {s.lastActivity}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" aria-label={`Ver detalle de ${s.name}`} onClick={() => onViewStudent(s.id)}>
                <Eye className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Ver</span>
              </Button>
              <Button size="sm" variant="outline" aria-label={`Enviar mensaje a ${s.name}`} onClick={() => onFeedback({ id: s.id, name: s.name, estudianteId: s.estudianteId })}>
                <MessageSquare className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Mensaje</span>
              </Button>
            </div>
          </div>
        ))}

        {restantes > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Ver los {restantes} estudiante{restantes !== 1 ? 's' : ''} en riesgo restante{restantes !== 1 ? 's' : ''}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
