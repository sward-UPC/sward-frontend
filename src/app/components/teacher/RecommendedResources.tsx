import { Sparkles, BookOpen, ExternalLink, FileQuestion, PenLine, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  construirRecursosRecomendados,
  tipoLabel,
} from "@features/teacher/services/personalRecommendations";
import type {
  CourseResource,
  ConceptMastery,
  StudentPreferences,
} from "@features/teacher/services/teacher.service";

interface RecommendedResourcesProps {
  weak: ConceptMastery[];
  recursos: CourseResource[];
  prefs?: StudentPreferences;
  /** Texto del título (el panel docente y el del estudiante lo personalizan). */
  title?: string;
  description?: string;
}

function iconFor(tipo: string) {
  if (["quiz"].includes(tipo)) return <FileQuestion className="w-4 h-4" />;
  if (["assign", "workshop"].includes(tipo)) return <PenLine className="w-4 h-4" />;
  if (["page", "book", "resource", "folder"].includes(tipo)) return <BookOpen className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

export function RecommendedResources({
  weak,
  recursos,
  prefs,
  title = "Recomendado para ti",
  description = "Recursos de Moodle elegidos según tus secciones flojas y el formato en el que rindes mejor.",
}: RecommendedResourcesProps) {
  const recs = construirRecursosRecomendados(weak, recursos, prefs);
  if (recs.length === 0) return null;

  const fuerte = prefs?.tipo_fuerte
    ? prefs.por_tipo.find((p) => p.tipo === prefs.tipo_fuerte)
    : undefined;
  const consumido = prefs?.formato_mas_consumido
    ? prefs.engagement_por_tipo?.find((e) => e.tipo === prefs.formato_mas_consumido)
    : undefined;

  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {(fuerte || consumido) && (
          <div className="text-xs text-muted-foreground bg-background rounded-[10px] p-2.5 border space-y-1">
            {fuerte && (
              <p>
                📈 Rinde mejor con{" "}
                <span className="font-medium text-foreground">{tipoLabel(prefs!.tipo_fuerte)}</span>{" "}
                (promedio {Math.round(fuerte.promedio)}% en {fuerte.total} actividad
                {fuerte.total === 1 ? "" : "es"}).
              </p>
            )}
            {consumido && (
              <p>
                👀 Es el que más consume:{" "}
                <span className="font-medium text-foreground">
                  {tipoLabel(prefs!.formato_mas_consumido!)}
                </span>{" "}
                ({consumido.vistas} vista{consumido.vistas === 1 ? "" : "s"}). Priorizamos esos formatos.
              </p>
            )}
          </div>
        )}

        {recs.map((r) => (
          <a
            key={r.recurso.url}
            href={r.recurso.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-background rounded-[12px] border hover:border-primary/40 transition-colors group"
            title="Abrir en Moodle"
          >
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {iconFor(r.recurso.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{r.recurso.nombre}</p>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {tipoLabel(r.recurso.tipo)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{r.motivo}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
