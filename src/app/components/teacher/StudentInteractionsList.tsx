import { Badge } from '../ui/badge';
import { Clock, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
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
        <CardDescription>Últimas actividades del estudiante (clic para abrir en Moodle)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions.map((interaction) => {
            const inner = (
              <>
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
                <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1.5">
                  {interaction.date}
                  {interaction.url && <ExternalLink className="w-3.5 h-3.5 text-primary" />}
                </div>
              </>
            );
            const base =
              'flex items-start gap-3 p-3 border rounded-[12px] transition-colors';
            return interaction.url ? (
              <a
                key={interaction.id}
                href={interaction.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${base} hover:bg-primary/5 hover:border-primary/40 cursor-pointer`}
                title="Abrir en Moodle"
              >
                {inner}
              </a>
            ) : (
              <div key={interaction.id} className={`${base} hover:bg-muted/50`}>
                {inner}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
