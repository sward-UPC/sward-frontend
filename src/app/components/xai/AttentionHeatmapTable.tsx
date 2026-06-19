import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/** Color de celda según el peso de atención (escala índigo). */
function cellColor(v: number): string {
  if (v >= 30) return "#3730a3"; // alta
  if (v >= 18) return "#4f46e5"; // media-alta
  if (v >= 10) return "#818cf8"; // media
  return "#c7d2fe"; // baja
}

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  // Cada interacción pasada = una fila (concepto) con su peso de atención del SAKT.
  // (La atención es 1‑D: del paso actual hacia cada interacción previa.)
  const items = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 8);
  const max = Math.max(1, ...items.map((i) => i.attention));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Mapa de calor de atención</p>
      <p className="text-xs text-muted-foreground -mt-2">
        Peso que el SAKT le dio a cada interacción pasada al predecir (celda más intensa = más
        atención).
      </p>

      <div className="space-y-1.5">
        {items.map((it) => {
          const c = cellColor(it.attention);
          return (
            <div key={it.id} className="flex items-center gap-3">
              {/* Concepto + acierto */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span
                  className={`shrink-0 text-xs font-bold ${it.isCorrect ? "text-success" : "text-destructive"}`}
                  title={it.isCorrect ? "Respondió correcto" : "Respondió incorrecto"}
                >
                  {it.isCorrect ? "✓" : "✗"}
                </span>
                <span className="text-xs font-medium truncate" title={it.concept}>
                  {it.concept}
                </span>
              </div>
              {/* Celda de calor (ancho relativo al máximo para ver la distribución) */}
              <div
                className="h-7 rounded-[6px] flex items-center justify-center shrink-0 transition-all"
                style={{
                  width: `${Math.max(34, Math.round((it.attention / max) * 160))}px`,
                  background: c,
                }}
                title={`${it.concept}: ${it.attention}% de atención`}
              >
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: it.attention >= 18 ? "#fff" : "#3730a3" }}
                >
                  {it.attention}%
                </span>
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
          { c: "#3730a3", l: "Alta" },
        ].map(({ c, l }) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[4px]" style={{ background: c }} />
            <span className="text-xs text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
