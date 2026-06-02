import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Video,
  BookOpen,
  FileText,
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  Info,
} from "lucide-react";
import { Resource } from "./types";

interface ResourceCardProps {
  resource: Resource;
  isCompleted: boolean;
  onStart: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  exercise: <BookOpen className="w-4 h-4" />,
  reading: <FileText className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  video: "Video",
  exercise: "Ejercicio",
  reading: "Lectura",
};

const difficultyColor: Record<string, string> = {
  Básico: "bg-success/10 text-success",
  Intermedio: "bg-warning/10 text-warning",
  Avanzado: "bg-primary/10 text-primary",
};

export function ResourceCard({ resource, isCompleted, onStart }: ResourceCardProps) {
  return (
    <Card
      className={`transition-all ${
        isCompleted ? "opacity-70 border-success/40 bg-success/5" : "hover:border-primary/40"
      } ${resource.isRecommended ? "border-primary/30 bg-primary/5" : ""}`}
    >
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                resource.type === "video"
                  ? "bg-blue-500/10 text-blue-500"
                  : resource.type === "exercise"
                  ? "bg-orange-500/10 text-orange-500"
                  : "bg-purple-500/10 text-purple-500"
              }`}
            >
              {typeIcons[resource.type]}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm leading-tight">{resource.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {resource.concept}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[resource.difficulty]}`}>
                  {resource.difficulty}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {resource.duration}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-warning text-warning" /> {resource.rating}
                </span>
              </div>
            </div>
          </div>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          ) : (
            <Badge variant={resource.type as any} className="shrink-0">
              {typeLabels[resource.type]}
            </Badge>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* XAI Reason (only if recommended) */}
        {resource.isRecommended && (
          <div className="p-3 bg-muted/40 border border-primary/10 rounded-[10px] space-y-2">
            <p className="text-xs font-medium flex items-center gap-1.5 text-foreground">
              <Info className="w-3.5 h-3.5 text-primary" />
              ¿Por qué te recomendamos esto?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{resource.reason}</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                Confianza: {resource.confidence}%
              </span>
              <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
                Mejora: +{resource.improvement}%
              </span>
            </div>
          </div>
        )}

        {/* Progress bar (if recommended, show expected improvement) */}
        {resource.isRecommended && !isCompleted && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dominio actual en {resource.concept}</span>
              <span>Meta: +{resource.improvement}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(resource.confidence, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-xs text-success font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Recurso completado
          </div>
        ) : (
          <Button
            size="sm"
            className={`w-full gap-2 ${resource.isRecommended ? "" : "variant-outline"}`}
            variant={resource.isRecommended ? "default" : "outline"}
            onClick={onStart}
          >
            <PlayCircle className="w-4 h-4" />
            Comenzar Recurso
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
