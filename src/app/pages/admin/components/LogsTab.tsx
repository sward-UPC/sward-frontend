import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Clock, Download, AlertCircle, FileText, Search, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAdminLogs } from "../../../../features/admin/hooks/useAdminLogs";

const FILTERS = ["Todos", "cambiar_estado", "asignar_rol"] as const;
type Filter = (typeof FILTERS)[number];
const PAGE_SIZE = 12;

/** Normaliza para búsqueda insensible a mayúsculas y acentos. */
function normalizar(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: logs = [], isLoading, isError } = useAdminLogs(200);

  const filtered = useMemo(() => {
    const q = normalizar(search.trim());
    return logs
      .filter((l) => activeFilter === "Todos" || l.accion === activeFilter)
      .filter((l) => {
        if (!q) return true;
        return (
          normalizar(l.detalle ?? "").includes(q) ||
          normalizar(l.accion).includes(q) ||
          normalizar(l.entidad).includes(q) ||
          normalizar(l.entidad_id ?? "").includes(q)
        );
      });
  }, [logs, activeFilter, search]);

  // Resetea a la primera página cuando cambian filtros/búsqueda.
  useEffect(() => { setPage(1); }, [activeFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const desde = filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1;
  const hasta = Math.min(pageSafe * PAGE_SIZE, filtered.length);

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

      {/* Búsqueda por texto */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por detalle, acción o entidad…"
          aria-label="Buscar en logs de auditoría"
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
          <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-2 text-muted-foreground">
            <FileText className="w-8 h-8" />
            {logs.length === 0 ? (
              <>
                <p className="text-sm">No hay registros de auditoría aún.</p>
                <p className="text-xs">Las acciones de administradores aparecerán aquí.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">No se encontraron registros</p>
                <p className="text-xs">Prueba con otro término de búsqueda o cambia el filtro.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => { setSearch(""); setActiveFilter("Todos"); }}
                >
                  Limpiar filtros
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Card>
          <CardContent className="pt-4 pb-4 space-y-2">
            <div className="text-xs text-muted-foreground pb-1">
              Mostrando {desde}–{hasta} de {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            </div>
            {paged.map((log) => (
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

            {pageCount > 1 && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={pageSafe <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                  Página {pageSafe} de {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={pageSafe >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
