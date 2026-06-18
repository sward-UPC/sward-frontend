import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Clock, Download, AlertCircle, FileText } from "lucide-react";
import { useAdminLogs } from "../../../../features/admin/hooks/useAdminLogs";

const FILTERS = ["Todos", "cambiar_estado", "asignar_rol"] as const;
type Filter = (typeof FILTERS)[number];

function actionBadge(accion: string) {
  switch (accion) {
    case "cambiar_estado":
      return <Badge variant="outline" className="text-xs text-warning border-warning/30">Estado</Badge>;
    case "asignar_rol":
      return <Badge variant="outline" className="text-xs text-primary border-primary/30">Rol</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{accion}</Badge>;
  }
}

function formatTimestamp(ts: string) {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return ts;
  }
}

export function LogsTab() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const { data: logs = [], isLoading, isError } = useAdminLogs(200);

  const filtered = activeFilter === "Todos"
    ? logs
    : logs.filter((l) => l.accion === activeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={[
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                activeFilter === f
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/40 hover:text-primary",
              ].join(" ")}
            >
              {f === "Todos" ? "Todos" : f === "cambiar_estado" ? "Cambios de estado" : "Asignación de rol"}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => {
            const csv = [
              "ID,Acción,Entidad,Entidad ID,Detalle,Admin ID,Timestamp",
              ...logs.map((l) =>
                [l.id, l.accion, l.entidad, l.entidad_id ?? "", l.detalle ?? "", l.admin_id ?? "", l.timestamp].join(",")
              ),
            ].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "audit-logs.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="pt-4 pb-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-[10px] border border-border">
                <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive p-3 rounded-[10px] border border-destructive/20 bg-destructive/5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          No se pudieron cargar los logs de auditoría.
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="w-8 h-8" />
            <p className="text-sm">No hay registros de auditoría aún.</p>
            <p className="text-xs">Las acciones de administradores aparecerán aquí.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Card>
          <CardContent className="pt-4 pb-4 space-y-2">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-[10px] border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    {actionBadge(log.accion)}
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {log.entidad}
                    </Badge>
                  </div>
                  <p className="text-sm">{log.detalle ?? log.accion}</p>
                  {log.entidad_id && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                      ID: {log.entidad_id}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(log.timestamp)}
                    {log.admin_id && (
                      <span className="ml-2 font-mono">· admin: {log.admin_id.slice(0, 8)}…</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
