import { useState } from 'react';
import {
  Wand2,
  ChevronDown,
  BookOpen,
  PenLine,
  FileQuestion,
  Youtube,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
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

/** Metadatos de presentación por tipo de recurso generado. */
const TIPO_META: Record<RecursoGenerado['tipo'], { label: string; icon: typeof BookOpen; hint: string }> = {
  quiz: { label: 'Quiz', icon: FileQuestion, hint: 'Responde y mide lo que sabes' },
  lectura: { label: 'Lectura', icon: BookOpen, hint: 'Mini-lección a tu medida' },
  practica: { label: 'Práctica', icon: PenLine, hint: 'Ejercicios con solución' },
  video: { label: 'Video', icon: Youtube, hint: 'Video recomendado' },
};

/**
 * "Generado para ti" (Fase 4): recursos educativos tipados creados por un LLM para
 * reforzar el concepto más débil. Se muestran como cards; al hacer clic se abre un
 * modal con el recurso interactivo (quiz/lectura/práctica/video) — así no carga todo
 * de golpe y el quiz registra la interacción que retroalimenta al modelo SAKT.
 */
export function GeneratedMaterial({ material, courseId }: GeneratedMaterialProps) {
  const [abierto, setAbierto] = useState<number | null>(null);
  if (!material.disponible || material.recursos.length === 0) return null;
  const concepto = material.concepto ?? 'tu concepto más débil';
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
      <CardContent>
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
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {meta.label}
                    </Badge>
                  </div>
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
        <DialogContent
          className={cn(
            'max-h-[90vh] overflow-y-auto',
            seleccion?.tipo === 'video' && 'sm:max-w-2xl',
          )}
        >
          {seleccion && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = TIPO_META[seleccion.tipo].icon;
                    return <Icon className="w-5 h-5 text-violet-600" />;
                  })()}
                  {seleccion.titulo}
                </DialogTitle>
                <DialogDescription>
                  {TIPO_META[seleccion.tipo].label} · refuerza {concepto}
                </DialogDescription>
              </DialogHeader>
              <RecursoBody recurso={seleccion} concepto={concepto} courseId={courseId} />
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
  const correctas = recurso.preguntas.reduce(
    (acc, p, i) => acc + (respuestas[i] === p.correcta ? 1 : 0),
    0,
  );
  const todasRespondidas = Object.keys(respuestas).length === total;

  async function enviar() {
    setEnviado(true);
    setRegistrando(true);
    try {
      await registrarResultadoQuiz({
        cursoId: courseId,
        concepto,
        totalPreguntas: total,
        correctas,
      });
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
            {enviado && p.explicacion && (
              <p className="text-xs text-muted-foreground bg-muted/40 rounded-[8px] px-3 py-2">
                {p.explicacion}
              </p>
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
        <div className="flex items-center justify-between gap-3 rounded-[10px] bg-violet-500/5 border border-violet-400/20 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold">
              {correctas} / {total} correctas ·{' '}
              <span className="text-violet-600">{Math.round((correctas / total) * 100)}%</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              {registrando
                ? 'Registrando tu avance…'
                : registrado
                  ? 'Tu resultado alimenta tu modelo de aprendizaje ✓'
                  : 'Resultado calculado'}
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={reiniciar}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
}

/** Mini-lección de lectura generada. */
function LecturaBody({ recurso }: { recurso: RecursoLectura }) {
  return (
    <div className="text-sm leading-relaxed space-y-2 text-muted-foreground">
      {recurso.contenido
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
    </div>
  );
}

/** Práctica con ejercicios y solución colapsable. */
function PracticaBody({ recurso }: { recurso: RecursoPractica }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {recurso.ejercicios.map((e, i) => (
        <div key={i} className="rounded-[10px] border overflow-hidden">
          <div className="p-3 space-y-2">
            <p className="text-sm">
              <span className="font-medium">{i + 1}.</span> {e.enunciado}
            </p>
            <button
              type="button"
              onClick={() => setAbierto(abierto === i ? null : i)}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline"
            >
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform', abierto === i && 'rotate-180')}
              />
              {abierto === i ? 'Ocultar solución' : 'Ver solución'}
            </button>
          </div>
          {abierto === i && (
            <p className="px-3 pb-3 text-sm text-muted-foreground border-t pt-2 bg-muted/20">
              {e.solucion}
            </p>
          )}
        </div>
      ))}
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
