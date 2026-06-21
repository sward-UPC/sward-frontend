import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Wand2,
  BookOpen,
  PenLine,
  FileQuestion,
  Youtube,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Brain,
  Lightbulb,
  Trophy,
  Repeat2,
  Eye,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { cn } from '../ui/utils';
import { burstConfetti, sideCannons } from './confetti';
import { MiniMarkdown } from './MiniMarkdown';
import { RichTextEditor } from './RichTextEditor';
import { YouTubePlayer } from './YouTubePlayer';
import {
  registrarResultadoQuiz,
  registrarMaterialCompletado,
  verificarEjercicio,
  type MaterialGenerado,
  type RecursoGenerado,
  type RecursoQuiz,
  type RecursoLectura,
  type RecursoPractica,
  type RecursoVideo,
  type VerificacionEjercicio,
} from '@features/student/material.service';

interface GeneratedMaterialProps {
  material: MaterialGenerado;
  courseId: string;
  onRegenerar?: () => void;
  regenerando?: boolean;
}

/**
 * Invalida las queries de progreso/dominio para que la barra de conocimiento, la
 * racha y los indicadores SUBAN en vivo cuando el alumno completa un recurso.
 */
function useInvalidarProgreso() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['teacher', 'student-detail'] });
    qc.invalidateQueries({ queryKey: ['student-streak'] });
  };
}

// Conceptos cuyo confeti de "material listo" ya se mostró. En memoria (no
// sessionStorage) para que un refresh de la página lo vuelva a disparar una vez,
// pero navegar entre tabs no lo repita en bucle.
const confettiMostrado = new Set<string>();

// --- Persistencia de recursos completados -----------------------------------
// El badge "Completado" debe SOBREVIVIR a un refresh. La fuente de verdad
// persistida es el set de TIPOS completados (no índices): un material tiene a lo
// más un quiz, una lectura, etc., así que el tipo es estable aunque el orden de
// los recursos cambie levemente. Clave estable por curso + concepto.

/** Clave de localStorage para los completados de un material. */
function claveCompletados(courseId: string, concepto: string | null): string {
  return `sward:completados:${courseId}:${concepto ?? ''}`;
}

/** Lee el set de TIPOS completados desde localStorage (robusto, SSR-safe). */
function leerTiposCompletados(courseId: string, concepto: string | null): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(claveCompletados(courseId, concepto));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((t): t is string => typeof t === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

/** Persiste el set de TIPOS completados en localStorage (robusto, SSR-safe). */
function guardarTiposCompletados(
  courseId: string,
  concepto: string | null,
  tipos: Set<string>,
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      claveCompletados(courseId, concepto),
      JSON.stringify([...tipos]),
    );
  } catch {
    // Best-effort: si localStorage no está disponible, no rompemos la UI.
  }
}

/** Metadatos de presentación + hint de aprendizaje por tipo de recurso. */
const TIPO_META: Record<
  RecursoGenerado['tipo'],
  { label: string; icon: typeof BookOpen; hint: string; aprende: string }
> = {
  quiz: {
    label: 'Quiz',
    icon: FileQuestion,
    hint: 'Responde y mide lo que sabes',
    aprende: 'Responde sin ayuda. Al final verás en qué fallaste y el porqué — se aprende del error.',
  },
  lectura: {
    label: 'Lectura',
    icon: BookOpen,
    hint: 'Mini-lección a tu medida',
    aprende: 'Lee con calma y quédate con las ideas clave antes de pasar a la práctica.',
  },
  practica: {
    label: 'Práctica',
    icon: PenLine,
    hint: 'Ejercicios con solución',
    aprende: 'Intenta resolver cada ejercicio tú mismo antes de mirar la solución.',
  },
  video: {
    label: 'Video',
    icon: Youtube,
    hint: 'Video recomendado',
    aprende: 'Míralo completo y toma nota de los puntos que refuercen el tema.',
  },
};

/** Botón para marcar un recurso como completado; confeti + registra la interacción. */
function CompletarRecurso({
  label = '¡Listo, lo completé!',
  onComplete,
}: {
  label?: string;
  onComplete?: () => void;
}) {
  const [hecho, setHecho] = useState(false);
  if (hecho) {
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium text-success">
        <CheckCircle2 className="w-4 h-4" /> ¡Completado!
      </div>
    );
  }
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        setHecho(true);
        burstConfetti();
        onComplete?.();
      }}
    >
      <CheckCircle2 className="w-4 h-4 mr-1.5" />
      {label}
    </Button>
  );
}

/** Banner de hint de aprendizaje que resalta, para que el alumno saque provecho. */
function LearningHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-[10px] bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-amber-800 dark:text-amber-300">
      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * "Generado para ti" (Fase 4): recursos educativos tipados creados por un LLM para
 * reforzar el concepto más débil. Cards → modal con el recurso interactivo. Incluye
 * el XAI (porqué, según el dominio estimado por el SAKT) y hints de aprendizaje. El
 * quiz registra la interacción que retroalimenta al modelo SAKT.
 */
export function GeneratedMaterial({
  material,
  courseId,
  onRegenerar,
  regenerando,
}: GeneratedMaterialProps) {
  const [abierto, setAbierto] = useState<number | null>(null);
  // Render por índice, pero hidratado desde el set de TIPOS persistido: marcamos
  // como completado cada índice cuyo recurso sea de un tipo ya completado.
  const [completados, setCompletados] = useState<Record<number, boolean>>(() => {
    const tipos = leerTiposCompletados(courseId, material.concepto ?? null);
    const inicial: Record<number, boolean> = {};
    material.recursos.forEach((r, i) => {
      if (tipos.has(r.tipo)) inicial[i] = true;
    });
    return inicial;
  });
  const listo = material.disponible && material.recursos.length > 0;

  // Re-hidrata si cambia el material (otro curso/concepto o "Generar más").
  useEffect(() => {
    const tipos = leerTiposCompletados(courseId, material.concepto ?? null);
    const inicial: Record<number, boolean> = {};
    material.recursos.forEach((r, i) => {
      if (tipos.has(r.tipo)) inicial[i] = true;
    });
    setCompletados(inicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, material.concepto]);

  // Confeti cuando el material termina de generar/cargar (una vez por concepto;
  // un refresh lo vuelve a mostrar porque el guard vive en memoria).
  useEffect(() => {
    if (!listo) return;
    const clave = material.concepto ?? 'material';
    if (confettiMostrado.has(clave)) return;
    confettiMostrado.add(clave);
    const t = setTimeout(sideCannons, 300);
    return () => clearTimeout(t);
  }, [listo, material.concepto]);

  if (!listo) return null;
  const concepto = material.concepto ?? 'tu concepto más débil';
  const dominio = material.dominio ?? null;
  const seleccion = abierto !== null ? material.recursos[abierto] : null;

  return (
    <Card className="border-violet-400/30 bg-violet-500/[0.04]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-violet-500" />
          Generado para ti
          <Badge variant="outline" className="text-[10px] ml-1">
            IA
          </Badge>
        </CardTitle>
        <CardDescription>
          Recursos hechos a tu medida para reforzar{' '}
          <span className="font-medium text-foreground">{concepto}</span>. Toca uno para abrirlo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* XAI: el porqué de esta generación, según el modelo SAKT */}
        <div className="rounded-[10px] bg-violet-500/[0.06] border border-violet-400/25 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground/90 leading-relaxed">
                <span className="font-semibold text-violet-700">Por qué esto:</span> el modelo SAKT
                detectó que <span className="font-medium">{concepto}</span> es uno de tus puntos más
                débiles
                {dominio !== null && (
                  <> — estima tu dominio en <span className="font-medium">{dominio}%</span></>
                )}
                . Creamos este material para reforzar justo ahí.
              </p>
              {dominio !== null && (
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-violet-500/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${Math.min(100, Math.max(4, dominio))}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards de recursos */}
        <div className="grid sm:grid-cols-2 gap-3">
          {material.recursos.map((recurso, i) => {
            const meta = TIPO_META[recurso.tipo];
            const Icon = meta.icon;
            const completado = !!completados[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAbierto(i)}
                aria-label={`${meta.label}: ${recurso.titulo}${completado ? ' (completado)' : ''}`}
                className="flex items-center gap-3 p-3 bg-background rounded-[12px] border text-left hover:border-violet-400/50 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="text-[10px]">
                    {meta.label}
                  </Badge>
                  <p className="text-sm font-medium truncate mt-0.5">{recurso.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{meta.hint}</p>
                </div>
                {completado ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-medium text-success shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completado
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-violet-600 transition-colors" />
                )}
              </button>
            );
          })}
        </div>

        {/* Generar más material fresco (otro set para el mismo concepto débil) */}
        {onRegenerar && (
          <div className="flex justify-center pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onRegenerar}
              disabled={regenerando}
              className="border-violet-400/40 text-violet-700 hover:bg-violet-500/5"
            >
              {regenerando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Generando más…
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                  Generar más material
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal con el recurso interactivo */}
      <Dialog open={abierto !== null} onOpenChange={(o) => !o && setAbierto(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">

          {seleccion && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 pr-6">
                  {(() => {
                    const Icon = TIPO_META[seleccion.tipo].icon;
                    return <Icon className="w-5 h-5 text-violet-600 shrink-0" />;
                  })()}
                  <span className="min-w-0">{seleccion.titulo}</span>
                </DialogTitle>
                <DialogDescription>
                  {TIPO_META[seleccion.tipo].label} · refuerza {concepto}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <LearningHint>{TIPO_META[seleccion.tipo].aprende}</LearningHint>
                <RecursoBody
                  recurso={seleccion}
                  concepto={concepto}
                  courseId={courseId}
                  onCompletado={() => {
                    if (abierto === null) return;
                    setCompletados((c) => ({ ...c, [abierto]: true }));
                    // Persiste el TIPO recién completado (fuente de verdad estable
                    // ante refresh), uniéndolo a lo que ya hubiera guardado.
                    const tipo = material.recursos[abierto]?.tipo;
                    if (tipo) {
                      const concepto = material.concepto ?? null;
                      const tipos = leerTiposCompletados(courseId, concepto);
                      tipos.add(tipo);
                      guardarTiposCompletados(courseId, concepto, tipos);
                    }
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/** Cuerpo interactivo según el tipo de recurso (dentro del modal). */
function RecursoBody({
  recurso,
  concepto,
  courseId,
  onCompletado,
}: {
  recurso: RecursoGenerado;
  concepto: string;
  courseId: string;
  onCompletado?: () => void;
}) {
  switch (recurso.tipo) {
    case 'quiz':
      return (
        <QuizBody recurso={recurso} concepto={concepto} courseId={courseId} onCompletado={onCompletado} />
      );
    case 'lectura':
      return (
        <LecturaBody recurso={recurso} concepto={concepto} courseId={courseId} onCompletado={onCompletado} />
      );
    case 'practica':
      return (
        <PracticaBody recurso={recurso} concepto={concepto} courseId={courseId} onCompletado={onCompletado} />
      );
    case 'video':
      return (
        <VideoBody recurso={recurso} concepto={concepto} courseId={courseId} onCompletado={onCompletado} />
      );
    default:
      return null;
  }
}

/**
 * Quiz interactivo PASO A PASO (una pregunta a la vez, como la práctica): el alumno
 * responde, ve al instante si acertó + la explicación, y avanza. Al final, resultado
 * y registro de la interacción que retroalimenta al modelo SAKT.
 */
function QuizBody({
  recurso,
  concepto,
  courseId,
  onCompletado,
}: {
  recurso: RecursoQuiz;
  concepto: string;
  courseId: string;
  onCompletado?: () => void;
}) {
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [registrado, setRegistrado] = useState(false);
  const invalidarProgreso = useInvalidarProgreso();

  const total = recurso.preguntas.length;
  const correctas = recurso.preguntas.reduce(
    (acc, p, i) => acc + (respuestas[i] === p.correcta ? 1 : 0),
    0,
  );
  const pct = Math.round((correctas / total) * 100);

  const p = recurso.preguntas[paso];
  const elegida = respuestas[paso];
  const respondida = elegida !== undefined;
  const esUltima = paso === total - 1;

  async function finalizar() {
    setFinalizado(true);
    onCompletado?.();
    // Confeti al COMPLETAR el quiz (siempre); más fuerte si aprobó.
    if (pct >= 60) sideCannons();
    else burstConfetti();
    setRegistrando(true);
    try {
      await registrarResultadoQuiz({ cursoId: courseId, concepto, totalPreguntas: total, correctas });
      setRegistrado(true);
      invalidarProgreso(); // la barra de dominio/racha sube en vivo
    } catch {
      // Best-effort: si falla el registro, el alumno igual ve su resultado.
    } finally {
      setRegistrando(false);
    }
  }

  function reiniciar() {
    setPaso(0);
    setRespuestas({});
    setFinalizado(false);
    setRegistrado(false);
  }

  // Pantalla de resultado final.
  if (finalizado) {
    return (
      <div className="rounded-[12px] border border-violet-400/30 bg-violet-500/5 p-5 text-center space-y-2">
        <Trophy className={cn('w-9 h-9 mx-auto', pct >= 60 ? 'text-amber-500' : 'text-muted-foreground')} />
        <p className="text-xl font-bold">
          {correctas}/{total} <span className="text-violet-600">· {pct}%</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {registrando
            ? 'Registrando tu avance…'
            : registrado
              ? '✓ Tu resultado alimenta tu modelo de aprendizaje (SAKT)'
              : pct >= 60
                ? '¡Bien! Sigue reforzando.'
                : 'Repasa la lectura y vuelve a intentarlo.'}
        </p>
        <Button size="sm" variant="outline" onClick={reiniciar} className="mt-1">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progreso por pasos (verde acierto · rojo fallo · violeta actual) */}
      <div className="flex items-center gap-1.5">
        {recurso.preguntas.map((q, i) => {
          const resp = respuestas[i];
          const estado =
            resp === undefined ? (i === paso ? 'actual' : 'pend') : resp === q.correcta ? 'bien' : 'mal';
          return (
            <button
              key={i}
              type="button"
              disabled={respuestas[i] === undefined && i !== paso}
              onClick={() => setPaso(i)}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                estado === 'bien' && 'bg-success',
                estado === 'mal' && 'bg-destructive',
                estado === 'actual' && 'bg-violet-500',
                estado === 'pend' && 'bg-muted',
              )}
              title={`Pregunta ${i + 1}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Pregunta {paso + 1} de {total}</span>
        <span>{correctas} correctas</span>
      </div>

      {/* Pregunta actual */}
      <MiniMarkdown text={p.enunciado} className="text-sm font-medium" />
      <div className="grid gap-1.5">
        {p.opciones.map((opcion, oi) => {
          const seleccionada = elegida === oi;
          const esCorrecta = p.correcta === oi;
          const mostrarBien = respondida && esCorrecta;
          const mostrarMal = respondida && seleccionada && !esCorrecta;
          return (
            <button
              key={oi}
              type="button"
              disabled={respondida}
              onClick={() => setRespuestas((r) => ({ ...r, [paso]: oi }))}
              className={cn(
                'flex items-center gap-2 rounded-[10px] border px-3 py-2 text-left text-sm transition-colors',
                !respondida && 'hover:bg-muted/50',
                mostrarBien && 'border-success/60 bg-success/10 text-success',
                mostrarMal && 'border-destructive/60 bg-destructive/10 text-destructive',
                respondida && !mostrarBien && !mostrarMal && 'opacity-60',
              )}
            >
              <span
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-semibold shrink-0',
                  mostrarBien && 'border-success text-success',
                  mostrarMal && 'border-destructive text-destructive',
                )}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              <MiniMarkdown inline text={opcion} className="flex-1" />
              {mostrarBien && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {mostrarMal && <XCircle className="w-4 h-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explicación al responder (XAI pedagógico) */}
      {respondida && p.explicacion && (
        <div className="flex items-start gap-2 rounded-[8px] bg-muted/50 px-3 py-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <MiniMarkdown text={p.explicacion} className="text-xs text-muted-foreground leading-relaxed" />
        </div>
      )}

      {/* Navegación / acción */}
      <div className="flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="ghost"
          disabled={paso === 0}
          onClick={() => setPaso((s) => Math.max(0, s - 1))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        {!respondida ? (
          <span className="text-xs text-muted-foreground">Elige una opción</span>
        ) : esUltima ? (
          <Button size="sm" onClick={finalizar} className="bg-violet-600 hover:bg-violet-700">
            Ver mi resultado
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setPaso((s) => Math.min(total - 1, s + 1))}>
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Lectura con dos modos: "Lección" (texto) y "Flashcards" (una por vez, navegable).
 * Al activar flashcards, la lección se oculta para enfocar la memorización.
 */
function LecturaBody({
  recurso,
  concepto,
  courseId,
  onCompletado,
}: {
  recurso: RecursoLectura;
  concepto: string;
  courseId: string;
  onCompletado?: () => void;
}) {
  const flashcards = recurso.flashcards ?? [];
  const [modo, setModo] = useState<'leccion' | 'flashcards'>('leccion');
  const invalidarProgreso = useInvalidarProgreso();

  return (
    <div className="space-y-4">
      {/* Toggle de modo (solo si hay flashcards) */}
      {flashcards.length > 0 && (
        <div className="inline-flex rounded-[10px] border bg-muted/40 p-0.5 text-sm">
          {(['leccion', 'flashcards'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1 transition-colors',
                modo === m
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'leccion' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5" /> Lección
                </>
              ) : (
                <>
                  <Repeat2 className="w-3.5 h-3.5" /> Flashcards ({flashcards.length})
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {modo === 'leccion' ? (
        <MiniMarkdown
          text={recurso.contenido}
          className="text-sm leading-relaxed text-muted-foreground animate-in fade-in-50 duration-300"
        />
      ) : (
        <FlashcardDeck flashcards={flashcards} />
      )}

      <div className="pt-1">
        <CompletarRecurso
          label="¡Listo, lo entendí!"
          onComplete={() => {
            onCompletado?.();
            registrarMaterialCompletado({ cursoId: courseId, concepto, tipo: 'lectura' })
              .then(() => invalidarProgreso())
              .catch(() => {});
          }}
        />
      </div>
    </div>
  );
}

/** Mazo de flashcards: una por vez, con puntos de progreso, anterior/siguiente. */
function FlashcardDeck({ flashcards }: { flashcards: { frente: string; reverso: string }[] }) {
  const [idx, setIdx] = useState(0);
  const total = flashcards.length;

  return (
    <div className="space-y-3 animate-in fade-in-50 duration-300">
      {/* Puntos de progreso del mazo */}
      <div className="flex items-center justify-center gap-1.5">
        {flashcards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === idx ? 'w-5 bg-violet-500' : 'w-1.5 bg-muted hover:bg-violet-500/40',
            )}
            title={`Tarjeta ${i + 1}`}
          />
        ))}
      </div>

      {/* key fuerza el re-montaje al cambiar de tarjeta → siempre arranca en "Concepto" */}
      <Flashcard key={idx} card={flashcards[idx]} />

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {idx + 1} / {total}
        </span>
        <Button
          size="sm"
          variant="ghost"
          disabled={idx === total - 1}
          onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/** Tarjeta de estudio con volteo SIN backface-visibility (evita el espejo de Safari/
 * login): se encoge en X hasta el canto, cambia la cara a mitad de la animación y se
 * expande de nuevo. Solo se renderiza una cara → nunca hay texto espejado. */
function Flashcard({ card }: { card: { frente: string; reverso: string } }) {
  const [lado, setLado] = useState<'frente' | 'reverso'>('frente');
  const [girando, setGirando] = useState(false);

  function voltear() {
    if (girando) return;
    setGirando(true);
    window.setTimeout(() => setLado((l) => (l === 'frente' ? 'reverso' : 'frente')), 170);
    window.setTimeout(() => setGirando(false), 340);
  }

  const esFrente = lado === 'frente';
  return (
    <button
      type="button"
      onClick={voltear}
      className="group h-48 w-full select-none"
      style={{ perspective: '1200px' }}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-2xl border p-5 flex flex-col items-center justify-center text-center shadow-sm transition-shadow group-hover:shadow-md',
          esFrente
            ? 'bg-gradient-to-br from-background to-violet-500/[0.04] border-violet-400/30'
            : 'bg-gradient-to-br from-violet-500/[0.10] to-violet-500/[0.03] border-violet-400/50',
        )}
        style={{
          transition: 'transform 0.34s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: girando ? 'rotateY(90deg) scale(0.97)' : 'rotateY(0deg) scale(1)',
        }}
      >
        {/* Etiqueta de la cara */}
        <span
          className={cn(
            'absolute top-3 left-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold',
            esFrente ? 'text-violet-500/70' : 'text-violet-600',
          )}
        >
          {esFrente ? (
            <>
              <Repeat2 className="w-3 h-3" /> Concepto
            </>
          ) : (
            <>
              <Lightbulb className="w-3 h-3" /> Definición
            </>
          )}
        </span>

        <MiniMarkdown
          inline
          text={esFrente ? card.frente : card.reverso}
          className={cn('px-2', esFrente ? 'text-base font-semibold' : 'text-sm leading-relaxed')}
        />

        <span className="absolute bottom-3 inset-x-0 text-[10px] text-muted-foreground">
          {esFrente ? 'toca para ver la definición' : 'toca para volver'}
        </span>
      </div>
    </button>
  );
}

/**
 * Práctica paso a paso: el alumno RESUELVE en la plataforma (escribe su respuesta),
 * la IA la verifica y, si aprueba, avanza. "Ver solución" es solo una pista, con un
 * aviso de "¿estás seguro?" para que lo intente primero.
 */
function PracticaBody({
  recurso,
  concepto,
  courseId,
  onCompletado,
}: {
  recurso: RecursoPractica;
  concepto: string;
  courseId: string;
  onCompletado?: () => void;
}) {
  const total = recurso.ejercicios.length;
  const [paso, setPaso] = useState(0);
  // Guardamos el HTML (para re-mostrar con formato al volver) y el texto plano (para
  // la IA y validar que haya contenido).
  const [respuestaHtml, setRespuestaHtml] = useState<Record<number, string>>({});
  const [respuestaText, setRespuestaText] = useState<Record<number, string>>({});
  const [veredicto, setVeredicto] = useState<Record<number, VerificacionEjercicio>>({});
  const [verificando, setVerificando] = useState(false);
  const [pistaVisible, setPistaVisible] = useState<Record<number, boolean>>({});
  const [revelada, setRevelada] = useState<Record<number, boolean>>({});
  const [confirmando, setConfirmando] = useState(false);
  const invalidarProgreso = useInvalidarProgreso();

  const e = recurso.ejercicios[paso];
  const texto = respuestaText[paso] ?? '';
  const v = veredicto[paso];
  const aprobado = !!v?.aprobado;
  const resueltos = recurso.ejercicios.filter((_, i) => veredicto[i]?.aprobado).length;

  async function verificar() {
    setVerificando(true);
    try {
      const r = await verificarEjercicio({
        enunciado: e.enunciado,
        solucion: e.solucion,
        respuesta: texto,
      });
      setVeredicto((m) => ({ ...m, [paso]: r }));
      if (r.aprobado) {
        // Registra la práctica resuelta como interacción calificada (alimenta al SAKT).
        registrarMaterialCompletado({
          cursoId: courseId,
          concepto,
          tipo: 'practica',
          aprobado: true,
        })
          .then(() => invalidarProgreso())
          .catch(() => {});
        // Confeti al resolver; si con este quedan TODOS resueltos, celebración grande.
        const aprobadosAhora = recurso.ejercicios.filter(
          (_, i) => i === paso || veredicto[i]?.aprobado,
        ).length;
        if (aprobadosAhora >= total) {
          onCompletado?.();
          setTimeout(sideCannons, 300);
        } else burstConfetti();
      }
    } catch {
      setVeredicto((m) => ({
        ...m,
        [paso]: { aprobado: false, feedback: 'No pude verificar ahora, inténtalo de nuevo.' },
      }));
    } finally {
      setVerificando(false);
    }
  }

  function irA(i: number) {
    setConfirmando(false);
    setPaso(i);
  }

  return (
    <div className="space-y-4">
      {/* Progreso por pasos (verde si la IA lo aprobó) */}
      <div className="flex items-center gap-1.5">
        {recurso.ejercicios.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => irA(i)}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              veredicto[i]?.aprobado ? 'bg-success' : i === paso ? 'bg-violet-500' : 'bg-muted',
            )}
            title={`Ejercicio ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Ejercicio {paso + 1} de {total}</span>
        <span>{resueltos} resueltos</span>
      </div>

      {/* Enunciado */}
      <div className="rounded-[12px] border p-4 space-y-3">
        <div className="flex gap-2.5">
          <span className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-600 text-sm font-bold flex items-center justify-center shrink-0">
            {paso + 1}
          </span>
          <MiniMarkdown text={e.enunciado} className="text-sm flex-1 leading-relaxed" />
        </div>

        {/* El alumno resuelve aquí (rich text WYSIWYG: negrita/cursiva/código/lista) */}
        <RichTextEditor
          key={paso}
          initialHtml={respuestaHtml[paso] ?? ''}
          onChange={(html, text) => {
            setRespuestaHtml((r) => ({ ...r, [paso]: html }));
            setRespuestaText((r) => ({ ...r, [paso]: text }));
          }}
          placeholder="Escribe tu respuesta…"
          disabled={aprobado}
        />

        {!aprobado ? (
          <Button
            size="sm"
            onClick={verificar}
            disabled={!texto.trim() || verificando}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {verificando ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Verificando…
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Verificar
              </>
            )}
          </Button>
        ) : null}

        {/* Veredicto de la IA */}
        {v && (
          <div
            className={cn(
              'flex items-start gap-2 rounded-[10px] border px-3 py-2.5',
              aprobado
                ? 'bg-success/[0.06] border-success/30'
                : 'bg-amber-500/10 border-amber-500/25',
            )}
          >
            {aprobado ? (
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={cn(
                  'text-[10px] uppercase tracking-wide font-semibold',
                  aprobado ? 'text-success' : 'text-amber-600',
                )}
              >
                {aprobado ? '¡Correcto!' : 'Casi — sigue intentando'}
              </p>
              <MiniMarkdown text={v.feedback} className="text-sm text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Pista: ayuda ligera SIN aviso (distinta de la solución) */}
        {e.pista && !aprobado && (
          <div className="space-y-2">
            {!pistaVisible[paso] ? (
              <button
                type="button"
                onClick={() => setPistaVisible((p) => ({ ...p, [paso]: true }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Pista
              </button>
            ) : (
              <div className="flex items-start gap-2 rounded-[10px] border border-amber-500/25 bg-amber-500/10 px-3 py-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-amber-600">
                    Pista
                  </p>
                  <MiniMarkdown text={e.pista} className="text-sm text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ver solución = la respuesta completa, CON aviso de "¿estás seguro?" */}
        {!revelada[paso] && !aprobado && (
          <div>
            {!confirmando ? (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver solución
              </button>
            ) : (
              <div className="flex items-start gap-2 rounded-[10px] border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-foreground/90">
                    ¿Seguro? Aprendes más si lo intentas tú primero y lo verificas con la IA.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => {
                        setRevelada((r) => ({ ...r, [paso]: true }));
                        setConfirmando(false);
                      }}
                    >
                      Sí, mostrar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7"
                      onClick={() => setConfirmando(false)}
                    >
                      Mejor lo intento
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {revelada[paso] && (
          <div className="flex items-start gap-2 rounded-[10px] border bg-muted/40 px-3 py-2.5">
            <Eye className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                Solución
              </p>
              <MiniMarkdown text={e.solucion} className="text-sm text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          disabled={paso === 0}
          onClick={() => irA(Math.max(0, paso - 1))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <Button
          size="sm"
          variant={aprobado && paso < total - 1 ? 'default' : 'ghost'}
          disabled={paso === total - 1}
          onClick={() => irA(Math.min(total - 1, paso + 1))}
          className={cn(aprobado && paso < total - 1 && 'bg-violet-600 hover:bg-violet-700')}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/** Video real de YouTube embebido. */
function VideoBody({
  recurso,
  concepto,
  courseId,
  onCompletado,
}: {
  recurso: RecursoVideo;
  concepto: string;
  courseId: string;
  onCompletado?: () => void;
}) {
  const invalidarProgreso = useInvalidarProgreso();
  return (
    <div className="space-y-3">
      <YouTubePlayer videoId={recurso.video_id} title={recurso.titulo} />
      <CompletarRecurso
        label="Marcar como visto"
        onComplete={() => {
          onCompletado?.();
          registrarMaterialCompletado({ cursoId: courseId, concepto, tipo: 'video' })
            .then(() => invalidarProgreso())
            .catch(() => {});
        }}
      />
    </div>
  );
}
