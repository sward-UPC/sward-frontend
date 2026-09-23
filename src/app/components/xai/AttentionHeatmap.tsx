import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { ExplanationVerification as Verification, InteractionData } from "@core/types/xai.types";
import { AttentionInfoModal } from "./AttentionInfoModal";
import { AttentionHeatmapTable } from "./AttentionHeatmapTable";
import { ExplanationVerification, type VerificationAudience } from "./ExplanationVerification";

interface AttentionHeatmapProps {
  interactions: InteractionData[];
  /** Dominio estimado (0-1). */
  probability: number;
  /** «promedio» cuando la cifra no salió del modelo; ver StudentAttention. */
  fuente?: 'modelo' | 'promedio';
  /** Veredicto de fidelidad; sin él se muestra solo la atención, sin afirmar motivos. */
  verification?: Verification | null;
  audience?: VerificationAudience;
}

/**
 * El mismo número se cuenta distinto según quién lo lee: al estudiante se le
 * habla de él y de lo que viene; al profesor, de su alumno y de si conviene
 * intervenir. Antes ambos veían el texto del profesor, y el estudiante leía
 * «El estudiante muestra un dominio adecuado» o «Se recomienda intervención
 * docente» sobre sí mismo.
 */
function textoPrediccion(probabilidad: number, audiencia: VerificationAudience): string {
  const pct = Math.round(probabilidad * 100);
  if (audiencia === "teacher") {
    const cierre =
      pct < 50
        ? " Se recomienda intervención docente."
        : " El estudiante muestra un dominio adecuado.";
    return `Probabilidad de éxito en el próximo ejercicio estimada por SAKT: ${pct}%.${cierre}`;
  }
  const cierre =
    pct < 50
      ? " Conviene repasar antes de seguir."
      : " Vas bien para lo que sigue.";
  return `El modelo estima en ${pct}% la probabilidad de que resuelvas bien el próximo ejercicio.${cierre}`;
}

/**
 * Qué se lee cuando la cifra no es del modelo. El SAKT solo conoce los temas con
 * los que se entrenó: en un curso nuevo, el servicio devuelve el promedio de
 * aciertos y reparte la atención por igual. Presentar eso como «estimado por
 * SAKT», con su mapa de calor, sería inventar una explicación — justo lo que
 * este trabajo trata de evitar.
 */
function SinModelo({ probabilidad, audiencia }: { probabilidad: number; audiencia: VerificationAudience }) {
  const pct = Math.round(probabilidad * 100);
  return (
    <div className="p-4 rounded-[12px] border border-warning/30 bg-warning/5 space-y-1.5">
      <p className="text-sm font-medium">Todavía sin estimación del modelo</p>
      <p className="text-sm text-muted-foreground">
        {audiencia === "teacher"
          ? `El modelo aún no conoce los temas de este curso, así que no hay predicción suya ni mapa de atención. El ${pct} % es el porcentaje de aciertos del estudiante hasta ahora.`
          : `El modelo aún no conoce los temas de este curso, así que todavía no puede anticipar tu siguiente paso. El ${pct} % es tu porcentaje de aciertos hasta ahora, no una predicción.`}
      </p>
    </div>
  );
}

export function AttentionHeatmap({
  interactions,
  probability,
  fuente = "modelo",
  verification = null,
  audience = "student",
}: AttentionHeatmapProps) {
  if (fuente !== "modelo") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explicabilidad: Mapa de Atención SAKT</CardTitle>
          <CardDescription>
            A qué interacciones pasadas prestó más atención el modelo al estimar el siguiente paso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SinModelo probabilidad={probability} audiencia={audience} />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Explicabilidad: Mapa de Atención SAKT
              <AttentionInfoModal />
            </CardTitle>
            <CardDescription>
              A qué interacciones pasadas prestó más atención el modelo al estimar el siguiente paso
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Predicción actual */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
          <p className="text-sm font-medium text-primary mb-1">Predicción Actual</p>
          <p className="text-sm text-muted-foreground">{textoPrediccion(probability, audience)}</p>
        </div>

        <ExplanationVerification verification={verification} audience={audience} />

        <AttentionHeatmapTable interactions={interactions} />
      </CardContent>
    </Card>
  );
}
