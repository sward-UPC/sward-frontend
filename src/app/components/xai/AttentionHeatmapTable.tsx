import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/** Color de tile según la intensidad de atención relativa al máximo (escala índigo). */
function tileColor(v: number, max: number): string {
  const t = max > 0 ? v / max : 0;
  if (t >= 0.85) return "#312e81";
  if (t >= 0.6) return "#4338ca";
  if (t >= 0.4) return "#6366f1";
  if (t >= 0.2) return "#818cf8";
  return "#c7d2fe";
}

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  // Cada interacción pasada = un tile; el COLOR codifica cuánta atención le dio el SAKT.
  const items = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 9);
  const max = Math.max(1, ...items.map((i) => i.attention));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Mapa de calor de atención</p>
      <p className="text-xs text-muted-foreground -mt-2">
        Cada celda es una interacción pasada; el color más intenso = más atención del SAKT al
        predecir.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((it) => {
          const bg = tileColor(it.attention, max);
          const light = max > 0 && it.attention / max < 0.4;
          const fg = light ? "#312e81" : "#ffffff";
          return (
            <div
              key={it.id}
              className="rounded-[10px] p-2.5 flex flex-col justify-between min-h-[66px] transition-transform hover:scale-[1.03]"
              style={{ background: bg }}
              title={`${it.concept} · ${it.isCorrect ? "correcto" : "incorrecto"} · ${it.attention}% de atención`}
            >
              <p
                className="text-[11px] font-medium leading-tight"
                style={{
                  color: fg,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {it.concept}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className="text-[11px] font-bold"
                  style={{ color: light ? (it.isCorrect ? "#16a34a" : "#dc2626") : "#e0e7ff" }}
                >
                  {it.isCorrect ? "✓" : "✗"}
                </span>
                <span className="text-sm font-bold" style={{ color: fg }}>
                  {it.attention}%
                </span>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground col-span-full">
            Sin interacciones para mostrar.
          </p>
        )}
      </div>

      {/* Escala de color */}
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <span className="text-[10px] text-muted-foreground mr-1">Menos</span>
        {["#c7d2fe", "#818cf8", "#6366f1", "#4338ca", "#312e81"].map((c) => (
          <span key={c} className="w-5 h-3 rounded-[3px]" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">Más atención</span>
      </div>
    </div>
  );
}
