import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  ExternalLink,
  FileQuestion,
  PenLine,
  FileText,
  Library,
  Check,
  ChevronDown,
} from 'lucide-react';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import { useCourseResources } from '@features/teacher/hooks/useCourseResources';
import { useStudentPreferences } from '@features/teacher/hooks/useStudentPreferences';
import { tipoLabel } from '@features/teacher/services/personalRecommendations';
import type { CourseResource } from '@features/teacher/services/teacher.service';
import { useSaktRecommendations } from '@features/student/useSaktRecommendations';
import { useGeneratedMaterial } from '@features/student/useGeneratedMaterial';
import { generarMaterial } from '@features/student/material.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { RecommendedResources } from '../../../components/teacher/RecommendedResources';
import { SaktRecommendations } from '../../../components/student/SaktRecommendations';
import { RecommendationsSkeleton } from '../../../components/student/RecommendationsSkeleton';
import { GeneratedMaterial } from '../../../components/student/GeneratedMaterial';
import { GeneratedMaterialSkeleton } from '../../../components/student/GeneratedMaterialSkeleton';

/** Ícono según el tipo de módulo de Moodle (lecturas, quizzes, prácticas...). */
function iconFor(tipo: string) {
  if (tipo === 'quiz') return <FileQuestion className="w-4 h-4" />;
  if (['assign', 'workshop'].includes(tipo)) return <PenLine className="w-4 h-4" />;
  if (['page', 'book', 'resource', 'folder', 'url', 'lesson'].includes(tipo))
    return <BookOpen className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

/** Agrupa los recursos del curso por sección (preservando el orden de llegada). */
function agruparPorSeccion(recursos: CourseResource[]): { seccion: string; items: CourseResource[] }[] {
  const grupos: { seccion: string; items: CourseResource[] }[] = [];
  const indice = new Map<string, number>();
  for (const r of recursos) {
    if (!r.url) continue; // recursos sin URL no se muestran
    const seccion = r.seccion || 'General';
    let i = indice.get(seccion);
    if (i === undefined) {
      i = grupos.length;
      indice.set(seccion, i);
      grupos.push({ seccion, items: [] });
    }
    grupos[i].items.push(r);
  }
  return grupos;
}

/** Una sección colapsable del catálogo (colapsada por defecto para no alargar). */
function CatalogSection({
  seccion,
  items,
  vistos,
  defaultOpen = false,
}: {
  seccion: string;
  items: CourseResource[];
  vistos: Set<string>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const numVistos = items.filter((r) => vistos.has(r.url)).length;

  return (
    <div className="rounded-[12px] border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 transition-colors"
      >
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
        <span className="text-sm font-medium flex-1 min-w-0 truncate">{seccion}</span>
        {numVistos > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success shrink-0">
            <Check className="w-3 h-3" />
            {numVistos}
          </span>
        )}
        <Badge variant="secondary" className="text-[10px] shrink-0">
          {items.length}
        </Badge>
      </button>
      {open && (
        <div className="p-2 pt-0 space-y-2">
          {items.map((r) => {
            const visto = vistos.has(r.url);
            return (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-background rounded-[10px] border hover:border-primary/40 transition-colors group"
                title="Abrir en Moodle"
              >
                <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {iconFor(r.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">{r.nombre}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {tipoLabel(r.tipo)}
                    </Badge>
                    {visto && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success shrink-0">
                        <Check className="w-3 h-3" />
                        Visto
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Tab "Recursos" del panel del estudiante (en 2da persona).
 * Arriba, el material recomendado para ti (secciones flojas + formato preferido);
 * debajo, el catálogo completo del curso agrupado por sección (colapsable).
 * SOLO datos reales: skeleton mientras cargan y estado vacío si no hay recursos.
 */
export function StudentRecursosTab({ estudianteId, courseId, moodleCourseId }: StudentTabProps) {
  const { conceptMastery } = useStudentDetail(estudianteId, courseId);
  const { data: courseResources, isLoading: resourcesLoading } = useCourseResources(moodleCourseId);
  const { data: preferences } = useStudentPreferences(estudianteId, courseId);
  // Formato en el que el alumno rinde/consume mejor → el material lo enfatiza.
  const formatoPref = preferences?.tipo_fuerte ?? preferences?.formato_mas_consumido ?? null;
  // Motor REAL: el modelo SAKT entrenado. Si no devuelve nada, cae al heurístico.
  const { data: saktItems, isLoading: saktLoading } = useSaktRecommendations(estudianteId, courseId);
  // Fase 4: material generado por LLM para el concepto débil (best-effort).
  const { data: material, isLoading: materialLoading } = useGeneratedMaterial(
    estudianteId,
    courseId,
    formatoPref,
  );

  // "Generar más": regenera material fresco (salta cache) y reemplaza el mostrado.
  const queryClient = useQueryClient();
  const [regenerando, setRegenerando] = useState(false);
  async function regenerarMaterial() {
    if (!estudianteId || !courseId) return;
    setRegenerando(true);
    try {
      const nuevo = await generarMaterial(estudianteId, courseId, true, formatoPref);
      queryClient.setQueryData(['generated-material', estudianteId, courseId], nuevo);
    } catch {
      // best-effort
    } finally {
      setRegenerando(false);
    }
  }

  const vistos = new Set(preferences?.recursos_vistos ?? []);
  const grupos = agruparPorSeccion(courseResources ?? []);

  // Skeleton mientras cargan los recursos o el dominio por concepto.
  const loading = resourcesLoading || conceptMastery.isLoading;
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 rounded-[12px] bg-muted/50" />
        <div className="h-56 rounded-[12px] bg-muted/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recomendado para ti — motor SAKT real. Mientras el SAKT carga mostramos un
          skeleton con el header real + mensaje (NO el heurístico) para no enseñar dos
          versiones; solo si el SAKT ya respondió y vino vacío caemos al heurístico. */}
      {saktLoading ? (
        <RecommendationsSkeleton />
      ) : saktItems && saktItems.length > 0 ? (
        <SaktRecommendations items={saktItems} prefs={preferences} />
      ) : (
        <RecommendedResources
          weak={conceptMastery.data ?? []}
          recursos={courseResources ?? []}
          prefs={preferences}
          title="Recomendado para ti"
          description="Material elegido según tus secciones flojas y el formato en el que mejor aprendes."
        />
      )}

      {/* Generado para ti (LLM) — material nuevo para el concepto débil (Fase 4).
          Mientras genera (tarda por el LLM) mostramos el skeleton con su header real. */}
      {materialLoading ? (
        <GeneratedMaterialSkeleton />
      ) : (
        material &&
        courseId && (
          <GeneratedMaterial
            material={material}
            courseId={courseId}
            onRegenerar={regenerarMaterial}
            regenerando={regenerando}
          />
        )
      )}

      {/* Todos los recursos del curso, por sección colapsable (para no alargar) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Library className="w-5 h-5 text-primary" />
            Todos los recursos del curso
          </CardTitle>
          <CardDescription>
            El material completo de tu curso, organizado por sección. Toca una sección para abrirla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {grupos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Aún no hay recursos disponibles en este curso.
            </p>
          ) : (
            <div className="space-y-2">
              {grupos.map((g, i) => (
                <CatalogSection
                  key={g.seccion}
                  seccion={g.seccion}
                  items={g.items}
                  vistos={vistos}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
