import { Badge } from "../ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface XAIConceptBadgesProps {
  strongConcepts: string[];
  weakConcepts: string[];
}

export function XAIConceptBadges({ strongConcepts, weakConcepts }: XAIConceptBadgesProps) {
  return (
    <>
      {/* Fortalezas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          <h4 className="font-medium">Conceptos Dominados</h4>
        </div>
        <div className="p-4 bg-success/5 border border-success/20 rounded-[12px]">
          <div className="flex flex-wrap gap-2 mb-3">
            {strongConcepts.map((concept, index) => (
              <Badge key={index} variant={"success" as any}>
                ✓ {concept}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Has demostrado un dominio sólido en estos conceptos. Las interacciones
            recientes muestran respuestas correctas consistentes y un tiempo de resolución
            óptimo. Puedes avanzar con confianza a temas más avanzados relacionados.
          </p>
        </div>
      </div>

      {/* Áreas de mejora */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h4 className="font-medium">Conceptos que Requieren Refuerzo</h4>
        </div>
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-[12px]">
          <div className="flex flex-wrap gap-2 mb-3">
            {weakConcepts.map((concept, index) => (
              <Badge key={index} variant="destructive">
                ⚠ {concept}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El análisis de tus interacciones revela dificultades en estos conceptos.
            Patrones identificados: errores frecuentes, tiempo de resolución elevado, y
            falta de práctica reciente. Se recomienda revisión inmediata.
          </p>
        </div>
      </div>
    </>
  );
}
