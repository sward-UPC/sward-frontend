import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Progress } from "../ui/Progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface KnowledgeGraphProps {
  historicalData: Array<{
    session: string;
    mastery: number;
    concepts: number;
  }>;
  currentConcepts: Array<{
    name: string;
    mastery: number;
    trend: "up" | "down" | "stable";
  }>;
}

export function KnowledgeGraph({ historicalData, currentConcepts }: KnowledgeGraphProps) {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "text-success";
    if (mastery >= 60) return "text-warning";
    return "text-destructive";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Gráfico de Progreso Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de tu Conocimiento</CardTitle>
          <CardDescription>Progreso a lo largo de las últimas sesiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="session"
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                  label={{ value: "Dominio (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="mastery"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorMastery)"
                  name="Dominio Promedio"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-[12px]">
            <p className="text-sm text-success">
              <strong>Tendencia positiva:</strong> Tu dominio general ha aumentado un 15% en las
              últimas 5 sesiones. ¡Sigue así!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estado Actual por Concepto */}
      <Card>
        <CardHeader>
          <CardTitle>Dominio por Concepto</CardTitle>
          <CardDescription>Estado actual y tendencia de cada concepto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentConcepts.map((concept, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{concept.name}</span>
                  <span className={`text-lg ${getTrendColor(concept.trend)}`}>
                    {getTrendIcon(concept.trend)}
                  </span>
                </div>
                <span className={`text-sm font-medium ${getMasteryColor(concept.mastery)}`}>
                  {concept.mastery}%
                </span>
              </div>
              <Progress value={concept.mastery} className="h-2" />
              {concept.mastery < 60 && (
                <p className="text-xs text-destructive">
                  ⚠️ Concepto requiere refuerzo - Ver recursos recomendados
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
