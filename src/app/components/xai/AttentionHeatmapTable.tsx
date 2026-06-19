import { useState } from "react";
import { InteractionData } from "@core/types/xai.types";

interface AttentionHeatmapTableProps {
  interactions: InteractionData[];
}

function getBubbleStyle(value: number): { bg: string; label: string } {
  if (value >= 80) return { bg: "#312e81", label: "Alta" };
  if (value >= 60) return { bg: "#6366f1", label: "Media" };
  if (value >= 40) return { bg: "#a5b4fc", label: "Media" };
  if (value > 0) return { bg: "#e0e7ff", label: "Baja" };
  return { bg: "#f1f5f9", label: "—" }; // celda vacía (ese concepto no fue esa sesión)
}

function getBubbleSize(value: number): number {
  return 28 + Math.round((value / 100) * 18);
}

export function AttentionHeatmapTable({ interactions }: AttentionHeatmapTableProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Matriz REAL: columnas = interacciones (sesiones) con mayor atención del SAKT;
  // filas = sus conceptos. La celda lleva el peso de atención (0 = no aplica).
  const cols = interactions.slice(0, 7);
  const SESSIONS = cols.map((_, i) => `S${i + 1}`);
  const CONCEPTS = Array.from(new Set(cols.map((c) => c.concept))).slice(0, 6);
  const heatmapMatrix = CONCEPTS.map((concept) =>
    cols.map((col) => (col.concept === concept ? col.attention : 0)),
  );

  return (
    <>
      {/* Bubble Heatmap */}
      <div>
        <p className="text-sm font-medium mb-4 text-center text-muted-foreground">
          Mapa de Calor de Atención
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            {/* Session headers */}
            <div className="flex items-center mb-2" style={{ paddingLeft: "130px" }}>
              {SESSIONS.map((s) => (
                <div
                  key={s}
                  className="text-xs text-muted-foreground text-center"
                  style={{ width: "52px" }}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {CONCEPTS.map((concept, rowIdx) => (
                <div key={concept} className="flex items-center gap-0">
                  <div
                    className="text-xs text-muted-foreground text-right pr-3 shrink-0"
                    style={{ width: "130px" }}
                  >
                    {concept}
                  </div>
                  <div className="flex items-center">
                    {SESSIONS.map((_, colIdx) => {
                      const value = heatmapMatrix[rowIdx][colIdx];
                      const style = getBubbleStyle(value);
                      const size = getBubbleSize(value);
                      const isHovered =
                        hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                      return (
                        <div
                          key={colIdx}
                          className="flex items-center justify-center cursor-pointer transition-transform"
                          style={{ width: "52px", height: "52px" }}
                          onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className="rounded-full transition-all duration-200 flex items-center justify-center"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              background: style.bg,
                              transform: isHovered ? "scale(1.25)" : "scale(1)",
                              boxShadow: isHovered ? `0 0 0 3px ${style.bg}44` : "none",
                            }}
                            title={`${concept} - ${SESSIONS[colIdx]}: ${value}%`}
                          >
                            {isHovered && (
                              <span
                                className="text-white select-none"
                                style={{ fontSize: "9px", fontWeight: 700 }}
                              >
                                {value}%
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-5">
              {[
                { color: "#e0e7ff", label: "Baja" },
                { color: "#a5b4fc", label: "Media" },
                { color: "#4f46e5", label: "Alta" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="rounded-full"
                    style={{ width: "14px", height: "14px", background: color }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de interacciones recientes */}
      <div>
        <p className="text-sm font-medium mb-3">Interacciones Recientes con Mayor Atención</p>
        <div className="space-y-2">
          {interactions.slice(0, 4).map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-center justify-between p-3 rounded-[12px] bg-muted/40 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: getBubbleStyle(interaction.attention).bg }}
                />
                <div>
                  <p className="text-sm font-medium">{interaction.concept}</p>
                  <p className="text-xs text-muted-foreground">{interaction.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {interaction.isCorrect ? (
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
                    ✓ Correcto
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full">
                    ✗ Incorrecto
                  </span>
                )}
                <span
                  className="text-sm font-semibold w-10 text-right"
                  style={{ color: getBubbleStyle(interaction.attention).bg }}
                >
                  {interaction.attention}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
