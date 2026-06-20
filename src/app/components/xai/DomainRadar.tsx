import { useEffect, useState } from "react";
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
  const hasData = data.length > 0;

  // Para que los PUNTOS del radar "se expandan desde el centro": arrancamos el
  // polígono colapsado (todos los valores en 0) y un frame después ponemos los
  // valores reales. recharts interpola cada punto de 0 → real, así que el
  // polígono crece visiblemente desde el centro (animación nativa fiable, sin
  // depender de que el ResponsiveContainer ya tenga tamaño en el primer paint).
  const [animatedData, setAnimatedData] = useState<DomainRadarProps["data"]>([]);
  // Clave estable: solo re-anima cuando cambian los valores reales (no en cada
  // render del padre, que recrea el array con los mismos datos).
  const dataKey = data.map((d) => `${d.subject}:${d.value}`).join("|");

  useEffect(() => {
    if (!hasData) {
      setAnimatedData([]);
      return;
    }
    // 1) colapsado en el centro
    setAnimatedData(data.map((d) => ({ ...d, value: 0 })));
    // 2) tras dos frames (ya con layout/tamaño), a los valores reales → crece
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimatedData(data));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // dataKey resume los valores reales; data se usa adentro a propósito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {hasData && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={animatedData}>
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
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
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
