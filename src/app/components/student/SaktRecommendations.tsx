import { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Video,
  FileQuestion,
  PenLine,
  FileText,
  ExternalLink,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { SaktRecItem } from '@features/student/sakt.service';
import { alimentaAlModelo, formatoDe } from '@features/student/formato';
import { tipoLabel as prefTipoLabel } from '@features/teacher/services/personalRecommendations';
import type { StudentPreferences } from '@features/teacher/services/teacher.service';

interface SaktRecommendationsProps {
  items: SaktRecItem[];
  /** Señal de preferencia del alumno: para explicar el porqué (en qué rinde/consume). */
  prefs?: StudentPreferences;
  /** Hay un filtro de formato activo que dejó la lista vacía. */
  filtradoVacio?: boolean;
  /** Recursos ya marcados en esta sesión (por `recurso_id`). */
  completados?: Set<string>;
  /**
   * Marca un recurso como completado (HU-027). `aprobado` solo aplica a
   * prácticas y quizzes, que son los que alimentan al modelo.
   */
  onCompletar?: (item: SaktRecItem, aprobado: boolean) => Promise<void>;
}

/** Etiqueta legible por tipo SWARD que devuelve el motor de recomendación. */
const TIPO_LABEL: Record<string, string> = {
  lectura: 'Lectura',
  video: 'Video',
  ejercicio: 'Práctica',
  quiz: 'Quiz',
  presentacion: 'Presentación',
};

function tipoLabel(tipo: string): string {
  return TIPO_LABEL[tipo] ?? (tipo ? tipo[0].toUpperCase() + tipo.slice(1) : 'Recurso');
}

function iconFor(tipo: string) {
  if (tipo === 'video') return <Video className="w-4 h-4" />;
  if (tipo === 'quiz') return <FileQuestion className="w-4 h-4" />;
  if (tipo === 'ejercicio') return <PenLine className="w-4 h-4" />;
  if (tipo === 'lectura') return <BookOpen className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

/**
 * Acción de completar un recurso. En una práctica pregunta cómo le fue, porque
 * esa respuesta entra al historial que usa el modelo: registrar «aprobado» sin
 * preguntarlo inventaría un acierto.
 */
function CompletarRecurso({
  item,
  hecho,
  onCompletar,
}: {
  item: SaktRecItem;
  hecho: boolean;
  onCompletar: (item: SaktRecItem, aprobado: boolean) => Promise<void>;
}) {
  const [preguntando, setPreguntando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);
  const formato = formatoDe(item.tipo) ?? 'lectura';
  const esPractica = alimentaAlModelo(formato);

  if (hecho) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
        Completado
      </span>
    );
  }

  async function enviar(aprobado: boolean) {
    setEnviando(true);
    setError(false);
    try {
      await onCompletar(item, aprobado);
    } catch {
      setError(true);
    } finally {
      setEnviando(false);
    }
  }

  if (enviando) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        Registrando…
      </span>
    );
  }

  if (preguntando) {
    return (
      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="¿Cómo te fue?">
        <span className="text-xs text-muted-foreground">¿Cómo te fue?</span>
        <Button size="sm" variant="outline" onClick={() => enviar(true)}>
          Me salió bien
        </Button>
        <Button size="sm" variant="outline" onClick={() => enviar(false)}>
          Me costó
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-destructive">No se pudo registrar.</span>}
      <Button
        size="sm"
        variant="outline"
        onClick={() => (esPractica ? setPreguntando(true) : enviar(true))}
      >
        <CheckCircle2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
        {esPractica ? 'Marcar como completado' : 'Ya lo revisé'}
      </Button>
    </div>
  );
}

/**
 * "Recomendado para ti" generado por el MODELO SAKT entrenado (ms-recomendacion):
 * predice tu dominio y rankea el material del concepto débil. Explicable (motivo).
 */
export function SaktRecommendations({
  items,
  prefs,
  filtradoVacio = false,
  completados,
  onCompletar,
}: SaktRecommendationsProps) {
  if (items.length === 0 && !filtradoVacio) return null;

  // Señal de preferencia (mismo "porqué" que el motor heurístico): en qué formato
  // rinde mejor y cuál consume más, para explicar la elección del modelo.
  const fuerte = prefs?.tipo_fuerte
    ? prefs.por_tipo.find((p) => p.tipo === prefs.tipo_fuerte)
    : undefined;
  const consumido = prefs?.formato_mas_consumido
    ? prefs.engagement_por_tipo?.find((e) => e.tipo === prefs.formato_mas_consumido)
    : undefined;

  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recomendado para ti
          <Badge variant="outline" className="text-[10px] ml-1">modelo SAKT</Badge>
        </CardTitle>
        <CardDescription>
          Material elegido por el modelo de aprendizaje según tu estado de conocimiento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {(fuerte || consumido) && (
          <div className="text-xs text-muted-foreground bg-background rounded-[10px] p-2.5 border space-y-1">
            {fuerte && (
              <p>
                📈 Rinde mejor con{' '}
                <span className="font-medium text-foreground">{prefTipoLabel(prefs!.tipo_fuerte)}</span>{' '}
                (promedio {Math.round(fuerte.promedio)}% en {fuerte.total} actividad
                {fuerte.total === 1 ? '' : 'es'}).
              </p>
            )}
            {consumido && (
              <p>
                👀 Es el que más consume:{' '}
                <span className="font-medium text-foreground">
                  {prefTipoLabel(prefs!.formato_mas_consumido!)}
                </span>{' '}
                ({consumido.vistas} vista{consumido.vistas === 1 ? '' : 's'}). El modelo lo tiene en cuenta.
              </p>
            )}
          </div>
        )}

        {filtradoVacio && (
          <p className="text-sm text-muted-foreground bg-background rounded-[10px] p-3 border">
            Ninguna recomendación es de este formato. Puedes buscarlo en el catálogo del curso,
            más abajo.
          </p>
        )}

        {items.map((it) => (
          <div
            key={it.recurso_id + it.url}
            className="flex items-start gap-3 p-3 bg-background rounded-[12px] border hover:border-primary/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {iconFor(it.tipo)}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[6px]"
                title="Abrir en Moodle"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {it.titulo}
                  </p>
                  <Badge variant="outline" className="text-[10px] shrink-0">{tipoLabel(it.tipo)}</Badge>
                  <ExternalLink
                    className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </div>
                {it.motivo && <p className="text-xs text-muted-foreground mt-0.5">{it.motivo}</p>}
              </a>
              {onCompletar && (
                <CompletarRecurso
                  item={it}
                  hecho={completados?.has(it.recurso_id) ?? false}
                  onCompletar={onCompletar}
                />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
