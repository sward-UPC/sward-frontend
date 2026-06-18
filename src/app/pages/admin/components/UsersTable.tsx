import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import {
  Search, CheckCircle2, XCircle,
  ToggleLeft, ToggleRight, User, BookOpen, Shield, Users,
} from "lucide-react";
import type { AdminUser, UserStatus, UserRole2 } from "../../../../core/types/admin.types";

interface UsersTableProps {
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

function statusBadge(s: UserStatus) {
  switch (s) {
    case "active":
      return <Badge className="gap-1 border-transparent bg-emerald-500 text-white"><CheckCircle2 className="w-3 h-3" />Activo</Badge>;
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
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={userSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-[10px] border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
              />
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
            <div className="shrink-0 w-36">
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="suspended">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Users className="w-8 h-8" />
              <p className="text-sm">No hay usuarios que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="border rounded-[12px] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Moodle ID</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell>{statusBadge(u.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground font-mono">
                          {u.moodleUserId ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={u.status === "active" ? "Desactivar usuario" : "Activar usuario"}
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
          )}
          <p className="text-xs text-muted-foreground px-1 py-3">
            {users.length} de {total} usuario{total !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
