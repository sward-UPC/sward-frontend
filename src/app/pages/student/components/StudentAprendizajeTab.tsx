import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { XAIExplanation } from '../../../components/xai/XAIExplanation';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import type { mockXAIAnalysis, mockSideRecommendations, mockDomainData } from '../../../../mocks/data/student.mock';

type XAIAnalysis = typeof mockXAIAnalysis;
type SideRecommendation = (typeof mockSideRecommendations)[number];
type DomainData = typeof mockDomainData;

const RESOURCE_TYPE_STYLES: Record<string, string> = {
  video:    'bg-blue-500/10 text-blue-500',
  exercise: 'bg-orange-500/10 text-orange-500',
  reading:  'bg-purple-500/10 text-purple-500',
};

function getResourceIcon(type: string) {
  if (type === 'video')    return <PlayCircle className="w-3.5 h-3.5" />;
  if (type === 'exercise') return <CheckCircle className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
}

interface StudentAprendizajeTabProps {
  xaiAnalysis: XAIAnalysis;
  domainData: DomainData;
  recommendations: SideRecommendation[];
  completedResources: number[];
  onSelectResource: (id: number) => void;
}

export function StudentAprendizajeTab({
  xaiAnalysis,
  domainData,
  recommendations,
  completedResources,
  onSelectResource,
}: StudentAprendizajeTabProps) {
  return (
    <div className="space-y-4">
      <XAIExplanation analysis={xaiAnalysis} />
      <DomainRadar data={domainData} title="Vista Rápida de Dominio" />

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-4 h-4 text-primary">✦</span> Recursos recomendados por SAKT
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendations.map((r) => {
            const isCompleted = completedResources.includes(r.id);
            return (
              <Card
                key={r.id}
                className={`transition-all ${isCompleted ? 'opacity-60 border-success/40 bg-success/5' : 'hover:border-primary/40 cursor-pointer'}`}
                onClick={() => !isCompleted && onSelectResource(r.id)}
              >
                <CardContent className="pt-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${RESOURCE_TYPE_STYLES[r.type] ?? ''}`}>
                      {getResourceIcon(r.type)}
                    </span>
                    <Badge variant="outline" className="text-xs">{r.concept}</Badge>
                  </div>
                  <p className="text-sm font-medium leading-tight">{r.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>
                    <span className="text-success font-medium">+{r.improvement}%</span>
                  </div>
                  {isCompleted
                    ? <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completado</p>
                    : <Button size="sm" className="w-full text-xs gap-1"><PlayCircle className="w-3.5 h-3.5" />Comenzar</Button>
                  }
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
