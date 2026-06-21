import { useState } from 'react';
import { Wand2, Lightbulb, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { MaterialGenerado } from '@features/student/material.service';

interface GeneratedMaterialProps {
  material: MaterialGenerado;
}

/**
 * "Generado para ti" (Fase 4): material de estudio creado por un LLM a partir de
 * los recursos del curso, para reforzar el concepto más débil del alumno.
 */
export function GeneratedMaterial({ material }: GeneratedMaterialProps) {
  const [abierta, setAbierta] = useState<number | null>(null);
  if (!material.disponible || !material.resumen) return null;

  return (
    <Card className="border-violet-400/30 bg-violet-500/[0.04]">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-violet-500" />
          Generado para ti
          <Badge variant="outline" className="text-[10px] ml-1">IA</Badge>
        </CardTitle>
        <CardDescription>
          Material creado a tu medida para reforzar{' '}
          <span className="font-medium text-foreground">{material.concepto}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen */}
        <p className="text-sm leading-relaxed">{material.resumen}</p>

        {/* Puntos clave */}
        {material.puntos_clave.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1.5 text-violet-600">
              <Lightbulb className="w-3.5 h-3.5" /> Puntos clave
            </p>
            <ul className="space-y-1">
              {material.puntos_clave.map((p, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-violet-500 shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preguntas de práctica (respuesta colapsable) */}
        {material.preguntas.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-violet-600">Pon a prueba lo aprendido</p>
            {material.preguntas.map((q, i) => (
              <div key={i} className="rounded-[10px] border bg-background overflow-hidden">
                <button
                  onClick={() => setAbierta(abierta === i ? null : i)}
                  className="w-full flex items-start justify-between gap-2 p-3 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm font-medium">{i + 1}. {q.pregunta}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${
                      abierta === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {abierta === i && (
                  <p className="px-3 pb-3 text-sm text-muted-foreground border-t pt-2">{q.respuesta}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
