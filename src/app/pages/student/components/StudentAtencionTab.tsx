import { Sparkles } from 'lucide-react';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import { AttentionHeatmap } from '../../../components/xai/AttentionHeatmap';
import { Card, CardContent } from '../../../components/ui/card';

/**
 * Tab "Mapa de Atención" del panel del estudiante. Le muestra al alumno, en
 * segunda persona y de forma explicable, en qué interacciones pasadas se "fija"
 * más el modelo SAKT para predecir su siguiente paso. SOLO datos reales.
 */
export function StudentAtencionTab({ estudianteId, courseId }: StudentTabProps) {
  const { enabled, attention } = useStudentDetail(estudianteId, courseId);

  // Pesos de atención reales del SAKT (vacío mientras carga o sin curso).
  const attData = enabled ? attention.data : null;
  const interactions = attData?.interactions ?? [];
  const prediction = attData?.prediction ?? '';

  // Esqueleto mientras no hay curso activo o la consulta sigue cargando.
  if (!courseId || (enabled && attention.isLoading)) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 rounded-[12px] bg-muted/50" />
        <div className="h-80 rounded-[12px] bg-muted/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Texto introductorio explicable (2da persona) */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Este es tu <strong>mapa de atención</strong>. El modelo SAKT muestra en qué
          interacciones pasadas se "fija" más para predecir tu siguiente paso: cuanto más
          intenso el color, más peso tuvo esa interacción en lo que viene.
        </p>
      </div>

      {/* Estado vacío amable cuando aún no hay interacciones */}
      {interactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">Todavía no hay datos de atención</p>
            <p className="text-sm text-muted-foreground">
              A medida que sigas resolviendo actividades en este curso, aquí verás en qué se
              fija el modelo para acompañar tu aprendizaje.
            </p>
          </CardContent>
        </Card>
      ) : (
        <AttentionHeatmap interactions={interactions} currentPrediction={prediction} />
      )}
    </div>
  );
}
