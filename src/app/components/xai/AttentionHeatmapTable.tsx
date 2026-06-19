import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/**
 * Escala de calor (frío→caliente) según la atención relativa al máximo.
 * Amarillo claro = poca atención · Rojo intenso = máxima atención del SAKT.
 */
function heatColor(v: number, max: number): string {
  const t = max > 0 ? v / max : 0;
  if (t >= 0.8) return "#b91c1c"; // red-700
  if (t >= 0.6) return "#ef4444"; // red-500
  if (t >= 0.45) return "#f97316"; // orange-500
  if (t >= 0.3) return "#fb923c"; // orange-400
  if (t >= 0.15) return "#fcd34d"; // amber-300
  return "#fef08a"; // yellow-200
}

const HEAT_RAMP = ["#fef08a", "#fcd34d", "#fb923c", "#f97316", "#ef4444", "#b91c1c"];

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  // Cada interacción pasada = una celda; el COLOR (intensidad de calor) codifica
  // cuánta atención le dio el SAKT al predecir el siguiente paso del estudiante.
  const items = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 12);
  const max = Math.max(1, ...items.map((i) => i.attention));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Mapa de calor de atención</p>
      <p className="text-xs text-muted-foreground -mt-2">
        Intensidad de color = cuánta atención puso el SAKT en cada interacción pasada al predecir.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {items.map((it) => {
          const bg = heatColor(it.attention, max);
          const light = max > 0 && it.attention / max < 0.45;
          const fg = light ? "#7c2d12" : "#ffffff";
          return (
            <div key={it.id} className="flex flex-col items-center gap-1">
              <div
                className="w-full aspect-square rounded-[10px] flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-[1.04]"
                style={{ background: bg }}
                title={`${it.concept} · ${it.isCorrect ? "correcto" : "incorrecto"} · ${it.attention}% de atención`}
              >
                <span className="text-base font-extrabold leading-none" style={{ color: fg }}>
                  {it.attention}%
                </span>
                <span
                  className="text-xs font-bold leading-none mt-1"
                  style={{ color: light ? (it.isCorrect ? "#16a34a" : "#dc2626") : "#ffffff" }}
                >
                  {it.isCorrect ? "✓" : "✗"}
                </span>
              </div>
              <span
                className="text-[10px] text-muted-foreground text-center leading-tight w-full"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={it.concept}
              >
                {it.concept}
              </span>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground col-span-full">
            Sin interacciones para mostrar.
          </p>
        )}
      </div>

      {/* Escala de calor */}
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <span className="text-[10px] text-muted-foreground mr-1">Menos</span>
        {HEAT_RAMP.map((c) => (
          <span key={c} className="w-5 h-3 rounded-[3px]" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">Más atención</span>
      </div>
    </div>
  );
}
