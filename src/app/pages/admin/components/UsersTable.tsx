import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import {
  Search, X, CheckCircle2, XCircle,
  ToggleLeft, ToggleRight, User, BookOpen, Shield, Users,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { AdminUser, UserStatus, UserRole2 } from "../../../../core/types/admin.types";

interface UsersTableProps {
  /** Lista COMPLETA de usuarios (sin filtrar). El filtrado/orden/paginación es local. */
  users: AdminUser[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  userSearch: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onRoleFilterChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onToggleStatus: (id: string, currentStatus: UserStatus) => void;
}

const PAGE_SIZE = 12;
const ROLE_ORDER: Record<UserRole2, number> = { admin: 0, teacher: 1, student: 2 };
const STATUS_ORDER: Record<UserStatus, number> = { active: 0, inactive: 1, suspended: 2 };

type SortKey = "name" | "role" | "status" | "moodle";
type SortDir = "asc" | "desc";

function statusBadge(s: UserStatus) {
  switch (s) {
    case "active":
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Activo</Badge>;
    case "inactive":
      return <Badge variant="outline" className="gap-1 text-muted-foreground">Inactivo</Badge>;
    case "suspended":
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Bloqueado</Badge>;
  }
}

function roleBadge(r: UserRole2) {
  switch (r) {
    case "student":
      return <Badge variant="outline" className="gap-1 text-primary border-primary/30"><User className="w-3 h-3" />Estudiante</Badge>;
    case "teacher":
      return <Badge variant="outline" className="gap-1 text-success border-success/30"><BookOpen className="w-3 h-3" />Docente</Badge>;
    case "admin":
      return <Badge variant="outline" className="gap-1 text-warning border-warning/30"><Shield className="w-3 h-3" />Admin</Badge>;
  }
}

/** Normaliza para búsqueda insensible a mayúsculas y acentos. */
function normalizar(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function UsersTable({
  users,
  total,
  isLoading,
  isError,
  userSearch,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onToggleStatus,
}: UsersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // Conteos por estado (sobre la lista total) para el filtro segmentado.
  const counts = useMemo(() => ({
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  }), [users]);

  // Filtro (búsqueda + rol + estado) y orden.
  const filtered = useMemo(() => {
    const q = normalizar(userSearch.trim());
    const dir = sortDir === "asc" ? 1 : -1;
    return users
      .filter((u) => !q || normalizar(u.name).includes(q) || normalizar(u.email).includes(q))
      .filter((u) => roleFilter === "all" || u.role === roleFilter)
      .filter((u) => statusFilter === "all" || u.status === statusFilter)
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
        if (sortKey === "role") return (ROLE_ORDER[a.role] - ROLE_ORDER[b.role]) * dir;
        if (sortKey === "status") return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        // moodle
        return ((a.moodleUserId ?? -1) - (b.moodleUserId ?? -1)) * dir;
      });
  }, [users, userSearch, roleFilter, statusFilter, sortKey, sortDir]);

  // Resetea a la primera página cuando cambian filtros/búsqueda/orden.
  useEffect(() => { setPage(1); }, [userSearch, roleFilter, statusFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const desde = filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1;
  const hasta = Math.min(pageSafe * PAGE_SIZE, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const hasFilters = userSearch !== "" || roleFilter !== "all" || statusFilter !== "all";
  const limpiarFiltros = () => {
    onSearchChange("");
    onRoleFilterChange("all");
    onStatusFilterChange("all");
  };

  const segmentos: { value: string; label: string; count: number; dot?: string }[] = [
    { value: "all", label: "Todos", count: counts.all },
    { value: "active", label: "Activos", count: counts.active, dot: "bg-success" },
    { value: "inactive", label: "Inactivos", count: counts.inactive, dot: "bg-muted-foreground" },
    { value: "suspended", label: "Bloqueados", count: counts.suspended, dot: "bg-destructive" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar: búsqueda + filtro de rol + segmentado por estado */}
      <Card>
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={userSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre o correo…"
                aria-label="Buscar usuario"
                className="pl-9 pr-9"
              />
              {userSearch && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="shrink-0 w-36">
              <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Rol" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="teacher">Docente</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
            {segmentos.map((seg) => {
              const activo = statusFilter === seg.value;
              return (
                <button
                  key={seg.value}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => onStatusFilterChange(seg.value)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activo
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {seg.dot && (
                    <span className={`w-2 h-2 rounded-full ${seg.dot} ${activo ? "ring-1 ring-white/60" : ""}`} />
                  )}
                  {seg.label}
                  <span className={`tabular-nums ${activo ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                    {seg.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isError && (
        <div className="text-sm text-destructive p-3 rounded-[10px] border border-destructive/20 bg-destructive/5">
          No se pudo cargar la lista de usuarios. Verifica tu sesión e intenta de nuevo.
        </div>
      )}

      <Card>
        <CardContent className="pt-4 pb-0">
          {isLoading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="flex items-center justify-between gap-2 pb-3 text-xs text-muted-foreground">
                <span>
                  {filtered.length === 0
                    ? "Sin resultados"
                    : `Mostrando ${desde}–${hasta} de ${filtered.length} usuario${filtered.length !== 1 ? "s" : ""}`}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-2 py-12">
                  <div className="rounded-full bg-muted p-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium">No se encontraron usuarios</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Prueba con otro término de búsqueda o cambia los filtros de rol y estado.
                  </p>
                  {hasFilters && (
                    <Button variant="outline" size="sm" className="mt-1" onClick={limpiarFiltros}>
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              ) : (
                <>
                {/* MÓVIL: tarjetas apiladas (la tabla no cabe en pantallas chicas) */}
                <div className="sm:hidden space-y-2">
                  {paged.map((u) => (
                    <div key={u.id} className="rounded-[12px] border p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          title={u.status === "active" ? "Desactivar usuario" : "Activar usuario"}
                          aria-label={u.status === "active" ? `Desactivar a ${u.name}` : `Activar a ${u.name}`}
                          onClick={() => onToggleStatus(u.id, u.status)}
                        >
                          {u.status === "active"
                            ? <ToggleRight className="w-5 h-5 text-success" />
                            : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {roleBadge(u.role)}
                        {statusBadge(u.status)}
                        {u.moodleUserId != null && (
                          <span className="text-[11px] text-muted-foreground font-mono ml-auto">
                            Moodle #{u.moodleUserId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP/TABLET: tabla */}
                <div className="hidden sm:block border rounded-[12px] overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortHeader label="Usuario" col="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                        <SortHeader label="Rol" col="role" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                        <SortHeader label="Estado" col="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                        <SortHeader label="Moodle ID" col="moodle" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden md:table-cell" />
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paged.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{u.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{roleBadge(u.role)}</TableCell>
                          <TableCell>{statusBadge(u.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm text-muted-foreground font-mono">
                              {u.moodleUserId ?? "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={u.status === "active" ? "Desactivar usuario" : "Activar usuario"}
                              aria-label={u.status === "active" ? `Desactivar a ${u.name}` : `Activar a ${u.name}`}
                              onClick={() => onToggleStatus(u.id, u.status)}
                            >
                              {u.status === "active"
                                ? <ToggleRight className="w-4 h-4 text-success" />
                                : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                </>
              )}

              {/* Pie: leyenda + paginación */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 py-3">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {total} usuario{total !== 1 ? "s" : ""} en total
                </p>
                {pageCount > 1 && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
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
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Encabezado de columna ordenable: clic alterna asc/desc, con indicador e aria-sort. */
function SortHeader({
  label, col, sortKey, sortDir, onSort, align = "left", className = "",
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const activo = sortKey === col;
  const ariaSort = activo ? (sortDir === "asc" ? "ascending" : "descending") : "none";
  const justify = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  return (
    <TableHead aria-sort={ariaSort} className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-1 ${justify} hover:text-foreground transition-colors ${activo ? "text-foreground font-semibold" : ""}`}
      >
        {label}
        {activo ? (
          sortDir === "asc"
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}
