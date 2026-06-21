import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Skeleton de "Recomendado para ti": mantiene el encabezado REAL de la card y deja
 * el cuerpo con filas tenues + un mensaje centrado de "generando", para que no
 * cargue todo de golpe y la transición al contenido del modelo SAKT sea suave.
 */
export function RecommendationsSkeleton() {
  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recomendado para ti
          <Badge variant="outline" className="text-[10px] ml-1">
            modelo SAKT
          </Badge>
        </CardTitle>
        <CardDescription>
          Material elegido por el modelo de aprendizaje según tu estado de conocimiento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="space-y-3 opacity-40" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-background rounded-[12px] border"
              >
                <div className="w-9 h-9 rounded-[10px] bg-muted animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-muted/70 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-sm font-medium text-primary">
              Generando tus personalizaciones…
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
