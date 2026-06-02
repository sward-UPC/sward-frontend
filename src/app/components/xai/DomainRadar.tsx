import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface DomainRadarProps {
  data?: Array<{ subject: string; value: number; fullMark: number }>;
  title?: string;
}

const defaultData = [
  { subject: "Algoritmos", value: 82, fullMark: 100 },
  { subject: "POO", value: 68, fullMark: 100 },
  { subject: "Bases de Datos", value: 55, fullMark: 100 },
  { subject: "Arquitectura", value: 74, fullMark: 100 },
  { subject: "Redes", value: 45, fullMark: 100 },
];

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-border rounded-[12px] p-3 shadow-md">
        <p className="text-sm font-medium">{d.subject}</p>
        <p className="text-sm text-primary font-semibold">{d.value}% dominio</p>
      </div>
    );
  }
  return null;
};

export function DomainRadar({ data = defaultData, title = "Vista Rápida de Dominio" }: DomainRadarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickCount={5}
              />
              <Radar
                name="Dominio"
                dataKey="value"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.subject} className="flex items-center justify-between text-xs px-2 py-1 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground truncate">{item.subject}</span>
              <span
                className="font-semibold ml-2 shrink-0"
                style={{
                  color:
                    item.value >= 75
                      ? "#22c55e"
                      : item.value >= 55
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
