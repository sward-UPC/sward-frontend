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
              El modelo SAKT utiliza auto-atención para identificar qué interacciones
              pasadas son más relevantes para predecir tu desempeño futuro. Cada burbuja
              representa la intensidad de atención entre un concepto y una sesión de
              estudio.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Escala de Colores</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: "#e0e7ff" }} />
                <span className="text-sm">Baja (&lt;40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: "#a5b4fc" }} />
                <span className="text-sm">Media (40-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: "#6366f1" }} />
                <span className="text-sm">Media-Alta (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: "#312e81" }} />
                <span className="text-sm">Alta (&gt;80%)</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
