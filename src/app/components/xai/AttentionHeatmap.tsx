import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { InteractionData } from "@core/types/xai.types";
import { AttentionInfoModal } from "./AttentionInfoModal";
import { AttentionHeatmapTable } from "./AttentionHeatmapTable";

interface AttentionHeatmapProps {
  interactions: InteractionData[];
  currentPrediction: string;
}

export function AttentionHeatmap({ interactions, currentPrediction }: AttentionHeatmapProps) {
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

        <AttentionHeatmapTable interactions={interactions} />
      </CardContent>
    </Card>
  );
}
