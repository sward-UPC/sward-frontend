import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { CheckCircle2, Sparkles, BarChart2 } from "lucide-react";
import { ResourceViewer } from "./ResourceViewer";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceGrid } from "./ResourceGrid";
import { useResourceFilters } from "./useResourceFilters";
import { allResources } from "./data";

interface ResourcesTabProps {
  completedResources: number[];
  onCompleteResource: (id: number) => void;
}

export function ResourcesTab({ completedResources, onCompleteResource }: ResourcesTabProps) {
  const [activeResource, setActiveResource] = useState<number | null>(null);

  const {
    filters,
    setSearch,
    setTypeFilter,
    setConceptFilter,
    setDifficultyFilter,
    setStatusFilter,
    toggleRecommended,
    filtered,
    recommended,
    others,
    concepts,
  } = useResourceFilters(completedResources);

  const currentResource = allResources.find((r) => r.id === activeResource);

  const handleComplete = () => {
    if (activeResource) {
      onCompleteResource(activeResource);
      setActiveResource(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completados</p>
                <p className="font-bold">{completedResources.length + 12} / {allResources.length + 10}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recomendados</p>
                <p className="font-bold">{allResources.filter((r) => r.isRecommended).length} activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mejora estimada</p>
                <p className="font-bold">+12% dominio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResourceFilters
        filters={filters}
        concepts={concepts}
        filteredCount={filtered.length}
        onSearchChange={setSearch}
        onTypeChange={setTypeFilter}
        onConceptChange={setConceptFilter}
        onDifficultyChange={setDifficultyFilter}
        onStatusChange={setStatusFilter}
        onToggleRecommended={toggleRecommended}
      />

      <ResourceGrid
        recommended={recommended}
        others={others}
        filteredCount={filtered.length}
        completedResources={completedResources}
        onStart={setActiveResource}
      />

      {activeResource && currentResource && (
        <ResourceViewer
          resource={currentResource}
          onComplete={handleComplete}
          onClose={() => setActiveResource(null)}
        />
      )}
    </div>
  );
}
