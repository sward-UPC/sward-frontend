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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import {
  registrarResultadoQuiz,
  type MaterialGenerado,
  type RecursoQuiz,
  type RecursoLectura,
  type RecursoPractica,
  type RecursoVideo,
} from '@features/student/material.service';

interface GeneratedMaterialProps {
  material: MaterialGenerado;
  courseId: string;
}

/**
 * "Generado para ti" (Fase 4): un set de recursos educativos tipados creados por
 * un LLM para reforzar el concepto más débil del alumno —quiz interactivo,
 * mini-lección, práctica y un video real de YouTube— consumibles DENTRO de la
 * plataforma. El quiz, al responderse, retroalimenta al modelo SAKT.
 */
export function GeneratedMaterial({ material, courseId }: GeneratedMaterialProps) {
  if (!material.disponible || material.recursos.length === 0) return null;
  const concepto = material.concepto ?? 'tu concepto más débil';

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
          <span className="font-medium text-foreground">{concepto}</span>. Respóndelos aquí mismo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {material.recursos.map((recurso, i) => {
          switch (recurso.tipo) {
            case 'quiz':
              return (
                <QuizCard key={i} recurso={recurso} concepto={concepto} courseId={courseId} />
              );
            case 'lectura':
              return <LecturaCard key={i} recurso={recurso} />;
            case 'practica':
              return <PracticaCard key={i} recurso={recurso} />;
            case 'video':
              return <VideoCard key={i} recurso={recurso} />;
            default:
              return null;
          }
        })}
      </CardContent>
    </Card>
  );
}

/** Encabezado compacto y consistente para cada recurso tipado. */
function RecursoHeader({
  icon,
  etiqueta,
  titulo,
}: {
  icon: React.ReactNode;
  etiqueta: string;
  titulo: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-[8px] bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-violet-600 font-semibold">
          {etiqueta}
        </p>
        <p className="text-sm font-medium truncate">{titulo}</p>
      </div>
    </div>
  );
}

/** Quiz interactivo: el alumno elige, se corrige, se explica y se registra al SAKT. */
function QuizCard({
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
    <div className="rounded-[12px] border bg-background p-4 space-y-4">
      <RecursoHeader
        icon={<FileQuestion className="w-4 h-4" />}
        etiqueta="Quiz"
        titulo={recurso.titulo}
      />

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
      </div>

      {!enviado ? (
        <Button
          size="sm"
          disabled={!todasRespondidas}
          onClick={enviar}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {todasRespondidas
            ? 'Enviar respuestas'
            : `Responde las ${total} preguntas`}
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
function LecturaCard({ recurso }: { recurso: RecursoLectura }) {
  return (
    <div className="rounded-[12px] border bg-background p-4 space-y-3">
      <RecursoHeader
        icon={<BookOpen className="w-4 h-4" />}
        etiqueta="Lectura"
        titulo={recurso.titulo}
      />
      <div className="text-sm leading-relaxed space-y-2 text-muted-foreground">
        {recurso.contenido
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean)
          .map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
      </div>
    </div>
  );
}

/** Práctica con ejercicios y solución colapsable. */
function PracticaCard({ recurso }: { recurso: RecursoPractica }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  return (
    <div className="rounded-[12px] border bg-background p-4 space-y-3">
      <RecursoHeader
        icon={<PenLine className="w-4 h-4" />}
        etiqueta="Práctica"
        titulo={recurso.titulo}
      />
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
    </div>
  );
}

/** Video real de YouTube embebido. */
function VideoCard({ recurso }: { recurso: RecursoVideo }) {
  return (
    <div className="rounded-[12px] border bg-background p-4 space-y-3">
      <RecursoHeader
        icon={<Youtube className="w-4 h-4" />}
        etiqueta="Video"
        titulo={recurso.titulo}
      />
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
    </div>
  );
}
