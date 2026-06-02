import { Card, CardContent } from '../../../components/ui/card';
import { TrendingDown, Minus, TrendingUp, Activity } from 'lucide-react';

interface TeacherMetricsCardsProps {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgMastery: number;
}

export function TeacherMetricsCards({
  highRiskCount,
  mediumRiskCount,
  lowRiskCount,
  avgMastery,
}: TeacherMetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Riesgo Alto</p>
              <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
              <Minus className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Riesgo Medio</p>
              <p className="text-2xl font-bold text-warning">{mediumRiskCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bajo Riesgo</p>
              <p className="text-2xl font-bold text-success">{lowRiskCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Promedio General</p>
              <p className="text-2xl font-bold">{avgMastery}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
