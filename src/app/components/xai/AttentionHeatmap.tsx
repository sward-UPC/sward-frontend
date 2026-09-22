import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { ExplanationVerification as Verification, InteractionData } from "@core/types/xai.types";
import { AttentionInfoModal } from "./AttentionInfoModal";
import { AttentionHeatmapTable } from "./AttentionHeatmapTable";
import { ExplanationVerification, type VerificationAudience } from "./ExplanationVerification";

interface AttentionHeatmapProps {
  interactions: InteractionData[];
  /** Dominio estimado por el SAKT (0-1). */
  probability: number;
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

export function AttentionHeatmap({
  interactions,
  probability,
  verification = null,
  audience = "student",
}: AttentionHeatmapProps) {
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
