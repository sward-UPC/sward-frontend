import type { ReactNode } from 'react';
import { Sparkles, Eye, Target, CheckCircle2, ListChecks } from 'lucide-react';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import { AttentionHeatmap } from '../../../components/xai/AttentionHeatmap';
import { Card, CardContent } from '../../../components/ui/card';

/** Entrada con fade/slide sutil y stagger; respeta prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both motion-reduce:animate-none ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Mini-tarjeta de resumen: dato real + ícono. Sirve de alternativa textual al heatmap. */
function SummaryCard({
  icon,
  label,
  value,
  hint,
  accent = 'bg-primary/10 text-primary',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-[12px] p-2 ${accent}`} aria-hidden="true">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold leading-snug truncate" title={value}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tab "Mapa de Atención" del panel del estudiante. Le muestra al alumno, en
 * segunda persona y de forma explicable, en qué interacciones pasadas se "fija"
 * más el modelo SAKT para predecir su siguiente paso. SOLO datos reales.
 *
 * Jerarquía: encabezado → qué es / cómo leerlo → resumen textual (a11y) → heatmap.
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
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-2/3 rounded-[12px] bg-muted/50" />
        <div className="h-24 rounded-[12px] bg-muted/50" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-[12px] bg-muted/50" />
          <div className="h-24 rounded-[12px] bg-muted/50" />
          <div className="h-24 rounded-[12px] bg-muted/50" />
        </div>
        <div className="h-80 rounded-[12px] bg-muted/50" />
      </div>
    );
  }

  // Resumen textual REAL (alternativa accesible al heatmap, no inventa números).
  const topConcept = [...interactions].sort((a, b) => b.attention - a.attention)[0] ?? null;
  const correctos = interactions.filter((i) => i.isCorrect).length;
  const total = interactions.length;
  const pctCorrectos = total > 0 ? Math.round((correctos / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1 · Encabezado */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Mapa de atención</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Una mirada explicable a cómo el modelo decide tu siguiente paso.
        </p>
      </div>

      {/* 2 · Qué es / cómo leerlo (callout explicable, 2da persona) */}
      <Reveal>
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
          <div className="shrink-0 rounded-[12px] p-2 bg-primary/10 text-primary" aria-hidden="true">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="font-medium text-foreground">¿Qué es esto?</p>
            <p className="text-muted-foreground">
              El modelo SAKT revisa tu historial y se <strong>"fija"</strong> más en algunas
              interacciones para anticipar lo que viene. Aquí ves cuáles pesaron más.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Cómo leerlo:</strong> cada fila es una interacción
              pasada. Cuanto <strong>más larga y más cálida</strong> la barra, más atención le dio el
              modelo. El porcentaje a la derecha indica ese peso, y el ✓/✗ si la acertaste.
            </p>
          </div>
        </div>
      </Reveal>

      {interactions.length === 0 ? (
        /* Estado vacío amable cuando aún no hay interacciones */
        <Reveal delay={80}>
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="rounded-[12px] p-3 bg-primary/10 text-primary" aria-hidden="true">
                  <Eye className="w-6 h-6" />
                </div>
                <p className="text-base font-medium">Todavía no hay datos de atención</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  A medida que sigas resolviendo actividades en este curso, aquí verás en qué se fija
                  el modelo para acompañar tu aprendizaje.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <>
          {/* 3 · Resumen textual real — alternativa accesible al heatmap */}
          <Reveal delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                icon={<Target className="w-5 h-5" />}
                label="Mayor atención en"
                value={topConcept ? topConcept.concept : '—'}
                hint={
                  topConcept
                    ? `${topConcept.attention}% del peso · ${topConcept.isCorrect ? 'la acertaste' : 'a reforzar'}`
                    : 'Sin dato destacado aún'
                }
                accent="bg-primary/10 text-primary"
              />
              <SummaryCard
                icon={<CheckCircle2 className="w-5 h-5" />}
                label="Aciertos en lo analizado"
                value={`${pctCorrectos}%`}
                hint={`${correctos} de ${total} interacciones correctas`}
                accent={
                  pctCorrectos >= 60 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }
              />
              <SummaryCard
                icon={<ListChecks className="w-5 h-5" />}
                label="Interacciones consideradas"
                value={`${total}`}
                hint="Las que el modelo pesó para tu predicción"
                accent="bg-primary/10 text-primary"
              />
            </div>
          </Reveal>

          {/* 4 · Heatmap real del SAKT (componente compartido, intacto) */}
          <Reveal delay={160}>
            <AttentionHeatmap interactions={interactions} currentPrediction={prediction} />
          </Reveal>
        </>
      )}
    </div>
  );
}
