import { Sparkles, BookOpen, Video, FileQuestion, PenLine, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { SaktRecItem } from '@features/student/sakt.service';

interface SaktRecommendationsProps {
  items: SaktRecItem[];
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
export function SaktRecommendations({ items }: SaktRecommendationsProps) {
  if (items.length === 0) return null;

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
