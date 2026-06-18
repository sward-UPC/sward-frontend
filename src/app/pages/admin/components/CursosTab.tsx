import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { CheckCircle2, Edit, BookOpen, AlertCircle } from "lucide-react";
import { useAdminCourses } from "../../../../features/admin/hooks/useAdminCourses";

export function CursosTab() {
  const { data: cursos = [], isLoading, isError } = useAdminCourses();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 rounded-[8px]" />
                  <Skeleton className="h-12 rounded-[8px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive p-3 rounded-[10px] border border-destructive/20 bg-destructive/5">
        <AlertCircle className="w-4 h-4 shrink-0" />
        No se pudieron cargar los cursos. Verifica tu conexión e intenta de nuevo.
      </div>
    );
  }

  if (cursos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <BookOpen className="w-10 h-10" />
        <p className="text-sm">No hay cursos registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {cursos.length} curso{cursos.length !== 1 ? "s" : ""} en la plataforma
          · {cursos.filter((c) => c.estado === "activo").length} activos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cursos.map((c) => (
          <Card
            key={c.id}
            className={`transition-all hover:border-primary/40 ${c.estado === "inactivo" ? "opacity-70" : ""}`}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm">{c.nombre}</p>
                    {c.estado === "activo"
                      ? <Badge className="text-xs gap-1 shrink-0 border-transparent bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3" />Activo</Badge>
                      : <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">Inactivo</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{c.codigo}</p>
                  {c.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.descripcion}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" title="Editar curso" className="shrink-0">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-muted/40 rounded-[8px]">
                  <p className="text-xs text-muted-foreground">Moodle ID</p>
                  <p className="font-bold text-sm font-mono">{c.moodle_course_id || "—"}</p>
                </div>
                <div className="p-2 bg-muted/40 rounded-[8px]">
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="font-bold text-sm capitalize">{c.estado}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
