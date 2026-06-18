import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import type { StudentProgress } from '@core/types';

interface AlertsPanelProps {
  highRiskStudents: StudentProgress[];
  onViewStudent: (id: number) => void;
  onFeedback: (student: { id: number; name: string; estudianteId?: string }) => void;
}

export function AlertsPanel({ highRiskStudents, onViewStudent, onFeedback }: AlertsPanelProps) {
  if (highRiskStudents.length === 0) return null;

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4" /> Estudiantes que requieren atención inmediata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {highRiskStudents.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 bg-card rounded-[10px] border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  Dominio: {s.avgMastery}% · Última actividad: {s.lastActivity}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onViewStudent(s.id)}>
                <Eye className="w-3.5 h-3.5 mr-1" /> Ver
              </Button>
              <Button size="sm" variant="outline" onClick={() => onFeedback({ id: s.id, name: s.name, estudianteId: s.estudianteId })}>
                <MessageSquare className="w-3.5 h-3.5 mr-1" /> Mensaje
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
