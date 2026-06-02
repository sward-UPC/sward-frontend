import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { KnowledgeGraph } from '../../../components/xai/KnowledgeGraph';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import { Brain } from 'lucide-react';
import type { KnowledgeState, HistoricalDataPoint, DomainRadarData } from '@core/types';

interface StudentProgresoTabProps {
  completedCount: number;
  totalResources: number;
  historicalData: HistoricalDataPoint[];
  currentConcepts: KnowledgeState[];
  domainData: DomainRadarData[];
}

export function StudentProgresoTab({
  completedCount,
  totalResources,
  historicalData,
  currentConcepts,
  domainData,
}: StudentProgresoTabProps) {
  return (
    <div className="space-y-4">
      {/* AI narrative summary */}
      <Card
        className="border-primary/20"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(124,58,237,0.05))' }}
      >
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold flex items-center gap-2">
                Resumen de SAKT
                <Badge variant="outline" className="text-xs">IA · Confianza 87%</Badge>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Esta semana <strong className="text-success">mejoraste en Algoritmos (+8%)</strong> y consolidaste Knowledge Tracing. Sin embargo,{' '}
                <strong className="text-destructive">Redes Neuronales bajó 12%</strong> — tuviste 3 respuestas incorrectas consecutivas que el modelo detecta como brecha crítica. Se recomienda dedicar al menos{' '}
                <strong className="text-foreground">20 minutos hoy</strong> al recurso de fundamentos antes de avanzar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Recursos completados', value: `${completedCount}/${totalResources}`, pct: (completedCount / totalResources) * 100, color: 'bg-primary' },
          { label: 'Tiempo de estudio', value: '8.5 hrs', pct: 85, color: 'bg-success' },
          { label: 'Conceptos dominados', value: '4/7', pct: 57, color: 'bg-warning' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="font-bold text-lg mb-2">{s.value}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <KnowledgeGraph historicalData={historicalData} currentConcepts={currentConcepts} />
      <DomainRadar data={domainData} title="Radar de Dominio por Área" />
    </div>
  );
}
