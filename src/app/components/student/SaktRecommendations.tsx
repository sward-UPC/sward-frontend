import { Sparkles, BookOpen, Video, FileQuestion, PenLine, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { SaktRecItem } from '@features/student/sakt.service';
import { tipoLabel as prefTipoLabel } from '@features/teacher/services/personalRecommendations';
import type { StudentPreferences } from '@features/teacher/services/teacher.service';

interface SaktRecommendationsProps {
  items: SaktRecItem[];
  /** Señal de preferencia del alumno: para explicar el porqué (en qué rinde/consume). */
  prefs?: StudentPreferences;
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
 * "Recomendado para ti" generado por el MODELO SAKT entrenado (ms-recomendacion):
 * predice tu dominio y rankea el material del concepto débil. Explicable (motivo).
 */
export function SaktRecommendations({ items, prefs }: SaktRecommendationsProps) {
  if (items.length === 0) return null;

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

        {items.map((it) => (
          <a
            key={it.recurso_id + it.url}
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-background rounded-[12px] border hover:border-primary/40 transition-colors group"
            title="Abrir en Moodle"
          >
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {iconFor(it.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium truncate">{it.titulo}</p>
                <Badge variant="outline" className="text-[10px] shrink-0">{tipoLabel(it.tipo)}</Badge>
              </div>
              {it.motivo && <p className="text-xs text-muted-foreground mt-0.5">{it.motivo}</p>}
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
