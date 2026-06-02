import { Badge } from "../ui/badge";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { Resource } from "./types";
import { ResourceCard } from "./ResourceCard";

interface ResourceGridProps {
  recommended: Resource[];
  others: Resource[];
  filteredCount: number;
  completedResources: number[];
  onStart: (id: number) => void;
}

export function ResourceGrid({
  recommended,
  others,
  filteredCount,
  completedResources,
  onStart,
}: ResourceGridProps) {
  if (filteredCount === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No se encontraron recursos</p>
        <p className="text-sm mt-1">Intenta con otros filtros o términos de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      {recommended.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Recomendados por SAKT para ti</h3>
            <Badge variant="outline" className="text-xs">{recommended.length}</Badge>
          </div>
          <div className="space-y-3">
            {recommended.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isCompleted={completedResources.includes(resource.id)}
                onStart={() => onStart(resource.id)}
              />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-muted-foreground">Catálogo completo</h3>
            <Badge variant="outline" className="text-xs">{others.length}</Badge>
          </div>
          <div className="space-y-3">
            {others.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isCompleted={completedResources.includes(resource.id)}
                onStart={() => onStart(resource.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
