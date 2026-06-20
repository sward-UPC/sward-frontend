import { Check, X } from "lucide-react";
import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/**
 * Escala de calor (frío→caliente) según la atención relativa al máximo.
 * Amarillo = poca atención · Rojo = máxima atención del SAKT.
 */
function heatColor(v: number, max: number): string {
  const t = max > 0 ? v / max : 0;
  if (t >= 0.85) return "#b91c1c"; // red-700
  if (t >= 0.65) return "#ef4444"; // red-500
  if (t >= 0.45) return "#f97316"; // orange-500
  if (t >= 0.3) return "#fb923c"; // orange-400
  if (t >= 0.15) return "#fcd34d"; // amber-300
  return "#fde68a"; // amber-200
}

const HEAT_RAMP = ["#fde68a", "#fcd34d", "#fb923c", "#f97316", "#ef4444", "#b91c1c"];

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  // Ranking: cada interacción pasada como una barra cuyo LARGO y COLOR codifican
  // cuánta atención le dio el SAKT al predecir el siguiente paso del estudiante.
  const items = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 8);
  const max = Math.max(1, ...items.map((i) => i.attention));
  const top = items[0];

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin interacciones para mostrar.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Mapa de calor de atención</p>
        {/* Leyenda de calor */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">menos</span>
          {HEAT_RAMP.map((c) => (
            <span key={c} className="w-4 h-2.5 rounded-[2px]" style={{ background: c }} />
          ))}
          <span className="text-[10px] text-muted-foreground">más</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Barra más larga y más cálida = más atención del SAKT. La predicción se apoya sobre todo en{" "}
        <span className="font-medium text-foreground">{top.concept}</span>.
      </p>

      <div className="space-y-2">
        {items.map((it, idx) => {
          const widthPct = Math.round((it.attention / max) * 100);
          const bg = heatColor(it.attention, max);
          return (
            <div key={it.id} className="flex items-center gap-2.5">
              {/* Acierto / fallo */}
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
                  it.isCorrect ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                }`}
                title={it.isCorrect ? "Respondió correcto" : "Respondió incorrecto"}
              >
                {it.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>

              {/* Concepto */}
              <span
                className="w-28 sm:w-44 shrink-0 text-xs text-foreground/90 truncate"
                title={it.concept}
              >
                {it.concept}
              </span>

              {/* Barra de atención (largo + color = intensidad) */}
              <div className="flex-1 h-6 rounded-md bg-muted/50 overflow-hidden relative min-w-[40px]">
                <div
                  className="h-full rounded-md transition-[width] duration-500"
                  style={{ width: `${Math.max(widthPct, 6)}%`, background: bg }}
                />
                {idx === 0 && (
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-white/90">
                    máx
                  </span>
                )}
              </div>

              {/* Porcentaje real */}
              <span className="w-10 text-right text-xs font-semibold tabular-nums text-foreground">
                {it.attention}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
