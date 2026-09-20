import { Button } from "../ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function AttentionInfoModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>¿Cómo funciona el Mapa de Atención?</DialogTitle>
          <DialogDescription>
            Explicación del mecanismo de atención del modelo SAKT
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-[12px]">
            <h4 className="font-medium mb-2">Mecanismo de Auto-Atención</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El modelo SAKT utiliza auto-atención: al estimar tu próximo resultado reparte
              su atención entre tus interacciones pasadas. Cada barra muestra cuánta atención
              recibió una interacción.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-[12px]">
            <h4 className="font-medium mb-2">Atención no es lo mismo que causa</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Que el modelo se fije en una interacción no prueba que esa sea la razón de su
              predicción. Por eso, para cada predicción lo comprobamos: si las interacciones más
              atendidas bastan para llegar al mismo resultado mejor que interacciones elegidas al
              azar, la explicación aparece como verificada. Si no, lo indicamos.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Escala de Colores</h4>
            {/* Misma rampa que AttentionHeatmapTable: relativa a la interacción más atendida. */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">menos atención</span>
              {["#fde68a", "#fcd34d", "#fb923c", "#f97316", "#ef4444", "#b91c1c"].map((c) => (
                <span key={c} className="w-6 h-3 rounded-[2px]" style={{ background: c }} />
              ))}
              <span className="text-sm text-muted-foreground">más atención</span>
            </div>
            <p className="text-xs text-muted-foreground">
              El color es relativo a la interacción que más atención recibió. La etiqueta{" "}
              <span className="rounded-full bg-success/15 text-success px-1.5 py-0.5 font-semibold">
                basta
              </span>{" "}
              marca las interacciones que comprobamos que bastan para llegar a la predicción.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
