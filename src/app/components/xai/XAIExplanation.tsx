import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Eye } from "lucide-react";

interface XAIExplanationProps {
  analysis: {
    strongConcepts: string[];
    weakConcepts: string[];
    recommendation: string;
    reasoning: string;
    confidence: number;
  };
}

export function XAIExplanation({ analysis }: XAIExplanationProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Explicación de tu Estado de Conocimiento
            </CardTitle>
            <CardDescription>Análisis interpretable generado por el modelo SAKT</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Análisis Detallado de Conocimiento</DialogTitle>
                <DialogDescription>
                  Explicación completa del modelo SAKT sobre tu estado actual
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Confianza del modelo */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Confianza del Modelo</span>
                    <span className="text-2xl font-bold text-primary">{analysis.confidence}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${analysis.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    El modelo está {analysis.confidence >= 80 ? "muy" : ""} seguro de esta
                    predicción basándose en tu historial de interacciones.
                  </p>
                </div>

                {/* Fortalezas */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h4 className="font-medium">Conceptos Dominados</h4>
                  </div>
                  <div className="p-4 bg-success/5 border border-success/20 rounded-[12px]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {analysis.strongConcepts.map((concept, index) => (
                        <Badge key={index} variant="success">
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
                      {analysis.weakConcepts.map((concept, index) => (
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

                {/* Razonamiento del modelo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">Razonamiento del Modelo</h4>
                  </div>
                  <div className="p-4 bg-muted rounded-[12px]">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {analysis.reasoning}
                    </p>
                  </div>
                </div>

                {/* Recomendación principal */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    <h4 className="font-medium">Estrategia Recomendada</h4>
                  </div>
                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-[12px]">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>

                {/* Cómo se calculó */}
                <div className="p-4 bg-muted rounded-[12px]">
                  <h4 className="font-medium mb-2 text-sm">¿Cómo se calculó este análisis?</h4>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                    <li>
                      El modelo SAKT procesó tus últimas 50 interacciones con recursos educativos
                    </li>
                    <li>
                      Se aplicaron mecanismos de auto-atención para identificar patrones de
                      aprendizaje
                    </li>
                    <li>
                      Se calculó la probabilidad de dominio para cada concepto usando redes
                      neuronales
                    </li>
                    <li>
                      Se generaron explicaciones en lenguaje natural mediante reglas interpretables
                    </li>
                    <li>Las recomendaciones se personalizaron según tu trayectoria de aprendizaje</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Análisis Principal */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Análisis Actual
          </h4>
          <p className="text-sm leading-relaxed">
            Tu dominio en{" "}
            {analysis.strongConcepts.map((c, i) => (
              <strong key={i} className="text-success">
                {c}
                {i < analysis.strongConcepts.length - 1 ? ", " : ""}
              </strong>
            ))}{" "}
            es excelente. Sin embargo, se ha detectado que tu rendimiento en{" "}
            {analysis.weakConcepts.map((c, i) => (
              <strong key={i} className="text-destructive">
                {c}
                {i < analysis.weakConcepts.length - 1 ? ", " : ""}
              </strong>
            ))}{" "}
            está por debajo del umbral recomendado.
          </p>
        </div>

        {/* Recomendación */}
        <div className="p-4 bg-success/5 border border-success/20 rounded-[12px]">
          <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Recomendación Personalizada
          </h4>
          <p className="text-sm leading-relaxed">{analysis.recommendation}</p>
        </div>

        {/* Explicación del cálculo */}
        <div className="p-4 bg-muted rounded-[12px]">
          <h4 className="text-sm font-medium mb-2">¿Cómo se calculó esto?</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            El modelo SAKT analiza tus interacciones pasadas con ejercicios y recursos,
            identificando patrones en tu progreso. Los conceptos con mayor peso de atención son
            aquellos que más han influido en tus resultados recientes. La confianza de{" "}
            <strong>{analysis.confidence}%</strong> se basa en la consistencia de tus respuestas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
