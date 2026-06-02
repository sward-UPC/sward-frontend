import { Badge } from '../ui/badge';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { StudentInteractionRecord } from '@core/types';

interface StudentInteractionsListProps {
  interactions: StudentInteractionRecord[];
}

export function StudentInteractionsList({ interactions }: StudentInteractionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Historial de Interacciones Recientes</CardTitle>
        <CardDescription>Últimas 10 actividades del estudiante</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-start gap-3 p-3 border rounded-[12px] hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1">
                {interaction.result === 'Completado' ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{interaction.resource}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {interaction.concept}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {interaction.time}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{interaction.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
