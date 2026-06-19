import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { AlertCircle } from "lucide-react";
import { useUpdateCurso } from "../../../../features/admin/hooks/useUpdateCurso";
import type { ApiCurso } from "../../../../features/admin/services/admin.service";

interface EditCourseDialogProps {
  curso: ApiCurso | null;
  open: boolean;
  onClose: () => void;
}

export function EditCourseDialog({ curso, open, onClose }: EditCourseDialogProps) {
  const update = useUpdateCurso();
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  // Sincroniza el formulario con el curso seleccionado al abrir.
  useEffect(() => {
    if (curso) {
      setDescripcion(curso.descripcion ?? "");
      setActivo(curso.estado === "activo");
    }
  }, [curso]);

  if (!curso) return null;

  const handleSave = () => {
    update.mutate(
      { id: curso.id, payload: { descripcion, estado: activo ? "activo" : "inactivo" } },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar curso</DialogTitle>
          <DialogDescription>
            Nombre y código se sincronizan desde Moodle (no editables). Puedes ajustar la
            descripción y el estado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Campos read-only de Moodle */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-muted/40 rounded-[8px]">
              <p className="text-xs text-muted-foreground">Nombre (Moodle)</p>
              <p className="text-sm font-medium truncate">{curso.nombre}</p>
            </div>
            <div className="p-2.5 bg-muted/40 rounded-[8px]">
              <p className="text-xs text-muted-foreground">Código</p>
              <p className="text-sm font-medium font-mono truncate">{curso.codigo}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="curso-descripcion" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="curso-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del curso..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between rounded-[10px] border border-border p-3">
            <div>
              <p className="text-sm font-medium">Curso activo</p>
              <p className="text-xs text-muted-foreground">
                Los cursos inactivos no se muestran a estudiantes.
              </p>
            </div>
            <Switch checked={activo} onCheckedChange={setActivo} />
          </div>

          {update.isError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              No se pudo guardar. Intenta de nuevo.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={update.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={update.isPending}>
            {update.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
