import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";

interface InteractionData {
  id: number;
  concept: string;
  timestamp: string;
  isCorrect: boolean;
  attention: number;
}

interface AttentionHeatmapProps {
  interactions: InteractionData[];
  currentPrediction: string;
}

const CONCEPTS = ["Knowledge Tracing", "Intro a IA", "Python Básico", "Deep Learning", "Redes Neur."];
const SESSIONS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];

const heatmapMatrix = [
  [92, 85, 78, 70, 60, 45, 30],
  [88, 82, 75, 68, 55, 42, 28],
  [76, 70, 65, 58, 50, 40, 25],
  [65, 60, 55, 50, 45, 35, 20],
  [45, 40, 38, 32, 28, 22, 15],
];

function getBubbleStyle(value: number): { bg: string; label: string } {
  if (value >= 80) return { bg: "#312e81", label: "Alta" };
  if (value >= 60) return { bg: "#6366f1", label: "Media" };
  if (value >= 40) return { bg: "#a5b4fc", label: "Media" };
  return { bg: "#e0e7ff", label: "Baja" };
}

function getBubbleSize(value: number): number {
  return 28 + Math.round((value / 100) * 18);
}

export function AttentionHeatmap({ interactions, currentPrediction }: AttentionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Explicabilidad: Mapa de Atención SAKT
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>¿Cómo funciona el Mapa de Atención?</DialogTitle>
                    <DialogDescription>
                      Explicación del mecanismo de atención del modelo SAKT
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-[12px]">
                      <h4 className="font-medium mb-2">Mecanismo de Auto-Atención</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        El modelo SAKT utiliza auto-atención para identificar qué interacciones
                        pasadas son más relevantes para predecir tu desempeño futuro. Cada burbuja
                        representa la intensidad de atención entre un concepto y una sesión de
                        estudio.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Escala de Colores</h4>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full" style={{ background: "#e0e7ff" }} />
                          <span className="text-sm">Baja (&lt;40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full" style={{ background: "#a5b4fc" }} />
                          <span className="text-sm">Media (40-60%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full" style={{ background: "#6366f1" }} />
                          <span className="text-sm">Media-Alta (60-80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full" style={{ background: "#312e81" }} />
                          <span className="text-sm">Alta (&gt;80%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Visualización de qué interacciones pasadas influyen en las recomendaciones actuales
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Predicción actual */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
          <p className="text-sm font-medium text-primary mb-1">Predicción Actual</p>
          <p className="text-sm text-muted-foreground">{currentPrediction}</p>
        </div>

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
      </CardContent>
    </Card>
  );
}
