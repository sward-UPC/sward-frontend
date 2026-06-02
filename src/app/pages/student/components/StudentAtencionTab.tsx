import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Info, AlertTriangle, PlayCircle } from 'lucide-react';
import { AttentionHeatmap } from '../../../components/xai/AttentionHeatmap';
import type { mockInteractions, mockSideRecommendations } from '../../../../mocks/data/student.mock';

type Interaction = (typeof mockInteractions)[number];
type SideRecommendation = (typeof mockSideRecommendations)[number];

const LOW_ATTENTION_CONCEPTS = [
  { concept: 'Redes Neuronales', attention: 38, sessions: 'últimas 3 sesiones' },
  { concept: 'Deep Learning',    attention: 65, sessions: 'última sesión' },
] as const;

interface StudentAtencionTabProps {
  interactions: Interaction[];
  recommendations: SideRecommendation[];
  onSelectResource: (id: number) => void;
}

export function StudentAtencionTab({ interactions, recommendations, onSelectResource }: StudentAtencionTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">¿Qué muestra este mapa?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cada burbuja representa tu nivel de atención en un concepto a lo largo de las sesiones.
                Las burbujas más grandes y oscuras indican mayor atención. Los conceptos con burbujas
                pequeñas o claras son donde tu enfoque cayó — y donde el sistema prioriza recursos para ti.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AttentionHeatmap
        interactions={interactions}
        currentPrediction="Es probable que tengas dificultades con el próximo ejercicio de Redes Neuronales (probabilidad de éxito: 48%). Se recomienda revisar los fundamentos antes de continuar."
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Conceptos con atención baja — acción recomendada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {LOW_ATTENTION_CONCEPTS.map((item) => (
            <div
              key={item.concept}
              className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-[10px] gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.concept}</p>
                  <p className="text-xs text-muted-foreground">
                    Atención: {item.attention}% · Bajó en {item.sessions}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1.5 text-xs"
                onClick={() => onSelectResource(recommendations[1]?.id ?? 0)}
              >
                <PlayCircle className="w-3.5 h-3.5" /> Ver recurso
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
