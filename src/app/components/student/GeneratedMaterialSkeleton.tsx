import { Wand2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Skeleton de "Generado para ti" (Fase 4): conserva el encabezado real y muestra un
 * mensaje centrado mientras el LLM crea el material (tarda unos segundos). Evita que
 * la card aparezca de golpe y que parezca que "no sale".
 */
export function GeneratedMaterialSkeleton() {
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
          Estamos creando recursos a tu medida para reforzar tu concepto más débil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="space-y-3 opacity-40" aria-hidden>
            {[0, 1].map((i) => (
              <div key={i} className="rounded-[12px] border bg-background p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[8px] bg-muted animate-pulse shrink-0" />
                  <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3 w-full rounded bg-muted/70 animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-muted/70 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            <p className="text-sm font-medium text-violet-600">
              Generando material a tu medida…
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
