import type { ReactNode } from 'react';
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
import { generarMaterial, registrarMaterialCompletado } from '@features/student/material.service';
import type { SaktRecItem } from '@features/student/sakt.service';
import {
  FORMATOS,
  alimentaAlModelo,
  formatoDe,
  pasaFormato,
  tipoParaRegistro,
} from '@features/student/formato';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { RecommendedResources } from '../../../components/teacher/RecommendedResources';
import { SaktRecommendations } from '../../../components/student/SaktRecommendations';
import { RecommendationsSkeleton } from '../../../components/student/RecommendationsSkeleton';
import { GeneratedMaterial, limpiarTiposCompletados } from '../../../components/student/GeneratedMaterial';
import { GeneratedMaterialSkeleton } from '../../../components/student/GeneratedMaterialSkeleton';
import { FiltroFormato, type FiltroFormatoValor } from '../../../components/student/FiltroFormato';

/** Qué pasó al marcar un recurso, para contárselo al alumno (HU-027). */
interface AvisoCompletado {
  concepto: string;
  /** Prácticas y quizzes cambian el dominio estimado; las lecturas, no. */
  alimenta: boolean;
  /** Recursos que entraron a la lista después de marcarlo. */
  nuevos: number;
}

/**
 * Concepto (sección de Moodle) de un recurso recomendado. El item del SAKT no lo
 * trae, así que se toma del catálogo por su URL; si no aparece, del motivo, que
 * el motor redacta como «Refuerza <concepto> — …».
 */
function conceptoDe(item: SaktRecItem, seccionPorUrl: Map<string, string>): string | null {
  const porUrl = seccionPorUrl.get(item.url);
  if (porUrl) return porUrl;
  const m = /^Refuerza (.+?) —/.exec(item.motivo ?? '');
  return m ? m[1] : null;
}

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
  const todosVistos = numVistos === items.length && items.length > 0;

  return (
    <div className="rounded-[12px] border overflow-hidden transition-colors hover:border-primary/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${seccion}: ${items.length} recurso${items.length === 1 ? '' : 's'}${
          numVistos > 0 ? `, ${numVistos} visto${numVistos === 1 ? '' : 's'}` : ''
        }`}
        className="w-full flex items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
        <span className="text-sm font-medium flex-1 min-w-0 truncate">{seccion}</span>
        {numVistos > 0 && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium text-success shrink-0 tabular-nums"
            aria-hidden="true"
          >
            <Check className="w-3.5 h-3.5" />
            {todosVistos ? 'Completa' : `${numVistos}/${items.length}`}
          </span>
        )}
        <Badge variant="secondary" className="text-[10px] shrink-0 tabular-nums">
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
                aria-label={`${r.nombre} — ${tipoLabel(r.tipo)}${visto ? ', visto' : ''}. Abrir en Moodle`}
                className="flex items-center gap-3 p-2.5 bg-background rounded-[10px] border transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {iconFor(r.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{tipoLabel(r.tipo)}</span>
                    {visto && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success shrink-0">
                        <Check className="w-3 h-3" />
                        Visto
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 transition-colors group-hover:text-primary" />
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

  // "Generar más": regenera material fresco (salta cache), ROTA al siguiente
  // concepto débil (evita repetir el mostrado) y limpia los badges de completado
  // (es contenido nuevo, no debe arrastrar lo "completado" anterior).
  const queryClient = useQueryClient();
  const [regenerando, setRegenerando] = useState(false);
  const [regenSeq, setRegenSeq] = useState(0);
  // Filtro por formato (HU-026) y recursos marcados en esta visita (HU-027).
  const [formato, setFormato] = useState<FiltroFormatoValor>('todos');
  const [completados, setCompletados] = useState<Set<string>>(() => new Set());
  const [aviso, setAviso] = useState<AvisoCompletado | null>(null);
  async function regenerarMaterial() {
    if (!estudianteId || !courseId) return;
    setRegenerando(true);
    const conceptoActual = material?.concepto ?? null;
    try {
      const nuevo = await generarMaterial(
        estudianteId,
        courseId,
        true,
        formatoPref,
        conceptoActual, // evitarConcepto → rota al siguiente débil
      );
      // Contenido nuevo: borra los completados del concepto anterior y del nuevo.
      limpiarTiposCompletados(courseId, conceptoActual);
      limpiarTiposCompletados(courseId, nuevo.concepto ?? null);
      queryClient.setQueryData(['generated-material', estudianteId, courseId], nuevo);
      setRegenSeq((s) => s + 1); // fuerza remonte → estado de completados limpio
    } catch {
      // best-effort
    } finally {
      setRegenerando(false);
    }
  }

  const vistos = new Set(preferences?.recursos_vistos ?? []);
  const catalogo = courseResources ?? [];
  const recomendados = saktItems ?? [];
  const pasaFiltro = (tipo: string) => pasaFormato(tipo, formato);
  // Solo se ofrecen formatos que el curso realmente tiene.
  const formatosDisponibles = FORMATOS.filter(
    (f) =>
      recomendados.some((i) => pasaFormato(i.tipo, f)) ||
      catalogo.some((r) => pasaFormato(r.tipo, f)),
  );
  const recomendadosFiltrados = recomendados.filter((i) => pasaFiltro(i.tipo));
  const grupos = agruparPorSeccion(catalogo.filter((r) => pasaFiltro(r.tipo)));
  const seccionPorUrl = new Map(catalogo.map((r) => [r.url, r.seccion] as [string, string]));

  /**
   * Registra el recurso como completado y vuelve a pedir recomendaciones, para
   * que el alumno vea si el sistema se adaptó. Si la lista no cambia, también se
   * lo decimos: adaptarse sin comunicarlo es invisible para quien aprende.
   */
  async function completar(item: SaktRecItem, aprobado: boolean) {
    if (!courseId) throw new Error('Sin curso seleccionado');
    const concepto = conceptoDe(item, seccionPorUrl);
    if (!concepto) throw new Error('No se pudo resolver el concepto del recurso');
    const f = formatoDe(item.tipo) ?? 'lectura';
    const alimenta = alimentaAlModelo(f);
    await registrarMaterialCompletado({
      cursoId: courseId,
      concepto,
      tipo: tipoParaRegistro(f),
      aprobado: alimenta ? aprobado : true,
    });
    setCompletados((prev) => new Set(prev).add(item.recurso_id));

    const antes = new Set(recomendados.map((i) => i.recurso_id));
    const clave = ['sakt-recommendations', estudianteId, courseId];
    await queryClient.invalidateQueries({ queryKey: clave });
    void queryClient.invalidateQueries({
      queryKey: ['teacher', 'student-detail', 'concept-mastery', estudianteId, courseId],
    });
    void queryClient.invalidateQueries({
      queryKey: ['teacher', 'student-preferences', estudianteId, courseId],
    });
    const despues = queryClient.getQueryData<SaktRecItem[]>(clave) ?? [];
    setAviso({
      concepto,
      alimenta,
      nuevos: despues.filter((i) => !antes.has(i.recurso_id)).length,
    });
  }

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

  const totalRecursos = grupos.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Encabezado del tab: orienta sobre qué es accionable vs el catálogo de referencia. */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Recursos para ti</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Empieza por lo que te recomendamos y, cuando quieras explorar más, abre el catálogo
          completo del curso.
        </p>
      </div>

      <FiltroFormato disponibles={formatosDisponibles} valor={formato} onChange={setFormato} />

      {aviso && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 p-3 rounded-[12px] border border-success/30 bg-success/5 text-sm"
        >
          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            {aviso.alimenta ? (
              <>
                Registramos tu avance en <strong>{aviso.concepto}</strong>.{' '}
                {aviso.nuevos > 0
                  ? `Tus recomendaciones se actualizaron: ${aviso.nuevos} recurso${
                      aviso.nuevos === 1 ? ' nuevo' : 's nuevos'
                    }.`
                  : 'Tus recomendaciones siguen igual: con tu historial actual, el modelo todavía ve estos temas como los que más conviene reforzar.'}
              </>
            ) : (
              <>
                Anotamos que revisaste material de <strong>{aviso.concepto}</strong>. Las lecturas
                no cambian tu dominio estimado; las prácticas y los quizzes, sí.
              </>
            )}
          </p>
        </div>
      )}

      {/* 1 · Recomendado para ti — motor SAKT real. Mientras el SAKT carga mostramos un
          skeleton con el header real + mensaje (NO el heurístico) para no enseñar dos
          versiones; solo si el SAKT ya respondió y vino vacío caemos al heurístico. */}
      <Reveal>
        {saktLoading ? (
          <RecommendationsSkeleton />
        ) : recomendados.length > 0 ? (
          <SaktRecommendations
            items={recomendadosFiltrados}
            prefs={preferences}
            filtradoVacio={recomendadosFiltrados.length === 0}
            completados={completados}
            onCompletar={completar}
          />
        ) : (
          <RecommendedResources
            weak={conceptMastery.data ?? []}
            recursos={catalogo.filter((r) => pasaFiltro(r.tipo))}
            prefs={preferences}
            title="Recomendado para ti"
            description="Material elegido según tus secciones flojas y el formato en el que mejor aprendes."
          />
        )}
      </Reveal>

      {/* 2 · Generado para ti (LLM) — material nuevo para el concepto débil (Fase 4).
          Mientras genera (tarda por el LLM) mostramos el skeleton con su header real. */}
      {(materialLoading || (material && courseId)) && (
        <Reveal delay={80}>
          {materialLoading ? (
            <GeneratedMaterialSkeleton />
          ) : (
            material &&
            courseId && (
              <GeneratedMaterial
                key={`gen-${regenSeq}`}
                material={material}
                courseId={courseId}
                onRegenerar={regenerarMaterial}
                regenerando={regenerando}
              />
            )
          )}
        </Reveal>
      )}

      {/* 3 · Catálogo de referencia: todos los recursos del curso, por sección colapsable. */}
      <Reveal delay={160}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <Library className="w-5 h-5 text-primary" />
                  Todos los recursos del curso
                </CardTitle>
                <CardDescription className="mt-1">
                  El material completo de tu curso, organizado por sección. Toca una sección para
                  abrirla.
                </CardDescription>
              </div>
              {totalRecursos > 0 && (
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {totalRecursos}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {grupos.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-2 py-8">
                <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
                  <Library className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formato === 'todos'
                    ? 'Aún no hay recursos disponibles en este curso.'
                    : 'No hay recursos de este formato en el curso.'}
                </p>
              </div>
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
      </Reveal>
    </div>
  );
}
