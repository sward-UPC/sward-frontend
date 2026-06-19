import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/** Color del peso de atención (escala índigo: más oscuro = más atención). */
function barColor(v: number): string {
  if (v >= 30) return "#4338ca"; // alta
  if (v >= 18) return "#6366f1"; // media
  if (v >= 10) return "#818cf8"; // media-baja
  return "#c7d2fe"; // baja
}

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  // Distribución de atención: interacciones pasadas ordenadas por su peso.
  const items = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 8);
  const max = Math.max(1, ...items.map((i) => i.attention));

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Distribución de atención del SAKT</p>
        <p className="text-xs text-muted-foreground">
          Cuánto pesó cada interacción pasada en la predicción actual — barra más larga = más
          atención del modelo.
        </p>
      </div>

      <div className="space-y-2.5">
        {items.map((it) => {
          const rel = Math.round((it.attention / max) * 100); // ancho relativo al máximo
          return (
            <div key={it.id} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`shrink-0 font-bold ${it.isCorrect ? "text-success" : "text-destructive"}`}
                    title={it.isCorrect ? "Respondió correcto" : "Respondió incorrecto"}
                  >
                    {it.isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="font-medium truncate" title={it.concept}>
                    {it.concept}
                  </span>
                </div>
                <span
                  className="shrink-0 font-semibold tabular-nums"
                  style={{ color: barColor(it.attention) }}
                >
                  {it.attention}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(4, rel)}%`, background: barColor(it.attention) }}
                />
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">Sin interacciones para mostrar.</p>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-end gap-4 pt-1">
        {[
          { c: "#c7d2fe", l: "Baja" },
          { c: "#818cf8", l: "Media" },
          { c: "#4338ca", l: "Alta" },
        ].map(({ c, l }) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span className="text-xs text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
