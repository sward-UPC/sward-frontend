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
                <div className="mt-0.5 shrink-0">
                  {interaction.result === 'Completado' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Fila superior: recurso + fecha (la fecha ya incluye la hora) */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate min-w-0">{interaction.resource}</p>
                    <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1.5 whitespace-nowrap">
                      {interaction.date}
                      {interaction.url && <ExternalLink className="w-3.5 h-3.5 text-primary" />}
                    </span>
                  </div>
                  {/* Fila inferior: concepto (trunca) + hora; envuelve si no cabe */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs max-w-full">
                      <span className="truncate">{interaction.concept}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {interaction.time}
                    </span>
                  </div>
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
