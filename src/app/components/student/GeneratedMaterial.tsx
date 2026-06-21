import { useState } from 'react';
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
  Check,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { cn } from '../ui/utils';
import {
  registrarResultadoQuiz,
  type MaterialGenerado,
  type RecursoGenerado,
  type RecursoQuiz,
  type RecursoLectura,
  type RecursoPractica,
  type RecursoVideo,
} from '@features/student/material.service';

interface GeneratedMaterialProps {
  material: MaterialGenerado;
  courseId: string;
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
export function GeneratedMaterial({ material, courseId }: GeneratedMaterialProps) {
  const [abierto, setAbierto] = useState<number | null>(null);
  if (!material.disponible || material.recursos.length === 0) return null;
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
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAbierto(i)}
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
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-violet-600 transition-colors" />
              </button>
            );
          })}
        </div>
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
                <RecursoBody recurso={seleccion} concepto={concepto} courseId={courseId} />
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
}: {
  recurso: RecursoGenerado;
  concepto: string;
  courseId: string;
}) {
  switch (recurso.tipo) {
    case 'quiz':
      return <QuizBody recurso={recurso} concepto={concepto} courseId={courseId} />;
    case 'lectura':
      return <LecturaBody recurso={recurso} />;
    case 'practica':
      return <PracticaBody recurso={recurso} />;
    case 'video':
      return <VideoBody recurso={recurso} />;
    default:
      return null;
  }
}

/** Quiz interactivo: el alumno elige, se corrige, se explica y se registra al SAKT. */
function QuizBody({
  recurso,
  concepto,
  courseId,
}: {
  recurso: RecursoQuiz;
  concepto: string;
  courseId: string;
}) {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [enviado, setEnviado] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  const total = recurso.preguntas.length;
  const respondidas = Object.keys(respuestas).length;
  const correctas = recurso.preguntas.reduce(
    (acc, p, i) => acc + (respuestas[i] === p.correcta ? 1 : 0),
    0,
  );
  const todasRespondidas = respondidas === total;
  const pct = Math.round((correctas / total) * 100);

  async function enviar() {
    setEnviado(true);
    setRegistrando(true);
    try {
      await registrarResultadoQuiz({ cursoId: courseId, concepto, totalPreguntas: total, correctas });
      setRegistrado(true);
    } catch {
      // Best-effort: si falla el registro, el alumno igual ve su resultado.
    } finally {
      setRegistrando(false);
    }
  }

  function reiniciar() {
    setRespuestas({});
    setEnviado(false);
    setRegistrado(false);
  }

  return (
    <div className="space-y-4">
      {/* Progreso de respuestas */}
      {!enviado && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${(respondidas / total) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {respondidas}/{total}
          </span>
        </div>
      )}

      {recurso.preguntas.map((p, qi) => {
        const elegida = respuestas[qi];
        return (
          <div key={qi} className="space-y-2">
            <p className="text-sm font-medium">
              {qi + 1}. {p.enunciado}
            </p>
            <div className="grid gap-1.5">
              {p.opciones.map((opcion, oi) => {
                const seleccionada = elegida === oi;
                const esCorrecta = p.correcta === oi;
                const mostrarBien = enviado && esCorrecta;
                const mostrarMal = enviado && seleccionada && !esCorrecta;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={enviado}
                    onClick={() => setRespuestas((r) => ({ ...r, [qi]: oi }))}
                    className={cn(
                      'flex items-center gap-2 rounded-[10px] border px-3 py-2 text-left text-sm transition-colors',
                      !enviado && seleccionada && 'border-violet-500 bg-violet-500/10',
                      !enviado && !seleccionada && 'hover:bg-muted/50',
                      mostrarBien && 'border-success/60 bg-success/10 text-success',
                      mostrarMal && 'border-destructive/60 bg-destructive/10 text-destructive',
                      enviado && !mostrarBien && !mostrarMal && 'opacity-60',
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-semibold shrink-0',
                        seleccionada && !enviado && 'border-violet-500 text-violet-600',
                        mostrarBien && 'border-success text-success',
                        mostrarMal && 'border-destructive text-destructive',
                      )}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opcion}</span>
                    {mostrarBien && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {mostrarMal && <XCircle className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {/* Explicación (XAI pedagógico): por qué la respuesta correcta */}
            {enviado && p.explicacion && (
              <div className="flex items-start gap-2 rounded-[8px] bg-muted/50 px-3 py-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{p.explicacion}</p>
              </div>
            )}
          </div>
        );
      })}

      {!enviado ? (
        <Button
          size="sm"
          disabled={!todasRespondidas}
          onClick={enviar}
          className="bg-violet-600 hover:bg-violet-700 w-full"
        >
          {todasRespondidas ? 'Enviar respuestas' : `Responde las ${total} preguntas`}
        </Button>
      ) : (
        <div className="rounded-[12px] border border-violet-400/30 bg-violet-500/5 p-4 text-center space-y-2">
          <Trophy
            className={cn('w-8 h-8 mx-auto', pct >= 60 ? 'text-amber-500' : 'text-muted-foreground')}
          />
          <p className="text-lg font-bold">
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
      )}
    </div>
  );
}

/** Mini-lección de lectura + flashcards para memorizar (se voltean al tocar). */
function LecturaBody({ recurso }: { recurso: RecursoLectura }) {
  const parrafos = recurso.contenido
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);
  const flashcards = recurso.flashcards ?? [];

  return (
    <div className="space-y-5">
      {/* Mini-lección */}
      <div className="space-y-3">
        {parrafos.map((parrafo, i) => (
          <p
            key={i}
            className={cn(
              'text-sm leading-relaxed',
              i === 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}
          >
            {parrafo}
          </p>
        ))}
      </div>

      {/* Flashcards para memorizar */}
      {flashcards.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Repeat2 className="w-4 h-4 text-violet-600" />
            <p className="text-sm font-semibold">Flashcards · toca para voltear</p>
            <Badge variant="secondary" className="text-[10px]">
              {flashcards.length}
            </Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {flashcards.map((fc, i) => (
              <Flashcard key={i} card={fc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Tarjeta que se voltea (frente: concepto · reverso: definición). */
function Flashcard({ card }: { card: { frente: string; reverso: string } }) {
  const [volteada, setVolteada] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setVolteada((v) => !v)}
      className={cn(
        'min-h-24 rounded-[12px] border p-3 text-left transition-colors flex flex-col justify-center gap-1',
        volteada
          ? 'bg-violet-500/[0.07] border-violet-400/40'
          : 'bg-background hover:border-violet-400/40',
      )}
    >
      <span className="text-[10px] uppercase tracking-wide font-semibold text-violet-600">
        {volteada ? 'Definición' : 'Concepto'}
      </span>
      <span className="text-sm">{volteada ? card.reverso : card.frente}</span>
    </button>
  );
}

/** Práctica paso a paso: un ejercicio a la vez, con verificación y navegación. */
function PracticaBody({ recurso }: { recurso: RecursoPractica }) {
  const total = recurso.ejercicios.length;
  const [paso, setPaso] = useState(0);
  // Soluciones reveladas y autoevaluación (¿lo lograste?) por ejercicio.
  const [revelados, setRevelados] = useState<Record<number, boolean>>({});
  const [logrados, setLogrados] = useState<Record<number, boolean>>({});

  const e = recurso.ejercicios[paso];
  const revelado = !!revelados[paso];
  const resueltos = Object.values(logrados).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Progreso por pasos */}
      <div className="flex items-center gap-1.5">
        {recurso.ejercicios.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPaso(i)}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              logrados[i]
                ? 'bg-success'
                : i === paso
                  ? 'bg-violet-500'
                  : 'bg-muted',
            )}
            title={`Ejercicio ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Ejercicio {paso + 1} de {total}
        </span>
        <span>{resueltos} resueltos</span>
      </div>

      {/* Enunciado del paso actual */}
      <div className="rounded-[12px] border p-4">
        <div className="flex gap-2.5">
          <span className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-600 text-sm font-bold flex items-center justify-center shrink-0">
            {paso + 1}
          </span>
          <p className="text-sm flex-1 leading-relaxed">{e.enunciado}</p>
        </div>

        {!revelado ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRevelados((r) => ({ ...r, [paso]: true }))}
            className="mt-3 ml-9"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Verificar / ver solución
          </Button>
        ) : (
          <div className="mt-3 ml-9 space-y-3">
            <div className="flex items-start gap-2 rounded-[10px] border bg-success/[0.06] px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-wide font-semibold text-success">
                  Solución
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.solucion}</p>
              </div>
            </div>
            {/* Autoevaluación: ¿lo lograste? */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">¿Lo lograste?</span>
              <Button
                size="sm"
                variant={logrados[paso] ? 'default' : 'outline'}
                onClick={() => setLogrados((l) => ({ ...l, [paso]: true }))}
                className={cn('h-7', logrados[paso] && 'bg-success hover:bg-success/90')}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Sí
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLogrados((l) => ({ ...l, [paso]: false }))}
                className="h-7"
              >
                Aún no
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navegación entre pasos */}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          disabled={paso === 0}
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={paso === total - 1}
          onClick={() => setPaso((p) => Math.min(total - 1, p + 1))}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/** Video real de YouTube embebido. */
function VideoBody({ recurso }: { recurso: RecursoVideo }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[10px] bg-black aspect-video">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${recurso.video_id}`}
        title={recurso.titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
