import { useState } from "react";
import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

/** Color de celda según el peso de atención (escala índigo). 0 = celda vacía. */
function cellColor(v: number): string {
  if (v <= 0) return "#f1f5f9"; // vacía (ese concepto no fue esa sesión)
  if (v >= 30) return "#3730a3"; // alta
  if (v >= 18) return "#4f46e5"; // media-alta
  if (v >= 10) return "#818cf8"; // media
  return "#c7d2fe"; // baja
}

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  // Matriz REAL: columnas = interacciones (sesiones) ordenadas por atención;
  // filas = sus conceptos. Celda = peso de atención (0 si no aplica).
  const cols = [...interactions].sort((a, b) => b.attention - a.attention).slice(0, 8);
  const SESSIONS = cols.map((_, i) => `S${i + 1}`);
  const CONCEPTS = Array.from(new Set(cols.map((c) => c.concept))).slice(0, 7);
  const matrix = CONCEPTS.map((concept) =>
    cols.map((col) => (col.concept === concept ? col.attention : 0)),
  );
  const labelW = 150;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Mapa de calor de atención</p>

      <div className="overflow-x-auto">
        <div style={{ minWidth: labelW + SESSIONS.length * 46 }}>
          {/* Encabezado de sesiones */}
          <div className="flex items-center mb-1.5" style={{ paddingLeft: labelW }}>
            {SESSIONS.map((s) => (
              <div
                key={s}
                className="text-[11px] text-muted-foreground text-center"
                style={{ width: 46 }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Filas (conceptos) */}
          <div className="space-y-1.5">
            {CONCEPTS.map((concept, r) => (
              <div key={concept} className="flex items-center">
                <div
                  className="text-xs text-muted-foreground text-right pr-3 shrink-0 truncate"
                  style={{ width: labelW }}
                  title={concept}
                >
                  {concept}
                </div>
                <div className="flex items-center gap-1.5">
                  {matrix[r].map((value, c) => {
                    const isHover = hovered?.r === r && hovered?.c === c;
                    return (
                      <div
                        key={c}
                        className="rounded-[6px] flex items-center justify-center cursor-default transition-all"
                        style={{
                          width: 40,
                          height: 34,
                          background: cellColor(value),
                          transform: isHover ? "scale(1.08)" : "scale(1)",
                          boxShadow: isHover && value > 0 ? `0 0 0 2px ${cellColor(value)}55` : "none",
                        }}
                        title={value > 0 ? `${concept} · ${SESSIONS[c]}: ${value}% de atención` : ""}
                        onMouseEnter={() => setHovered({ r, c })}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {value > 0 && (
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: value >= 18 ? "#fff" : "#3730a3" }}
                          >
                            {value}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {CONCEPTS.length === 0 && (
              <p className="text-xs text-muted-foreground">Sin interacciones para mostrar.</p>
            )}
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-end gap-4 mt-4">
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
      </div>
    </div>
  );
}
