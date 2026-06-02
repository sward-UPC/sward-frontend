import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select";
import {
  Search, Plus, CheckCircle2, XCircle, Eye, Edit,
  ToggleLeft, ToggleRight, User, BookOpen, Shield,
} from "lucide-react";
import type { AdminUser, UserStatus, UserRole2 } from "../../../../core/types/admin.types";

interface UsersTableProps {
  users: AdminUser[];
  userSearch: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onRoleFilterChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onToggleStatus: (id: number) => void;
}

function statusBadge(s: UserStatus) {
  switch (s) {
    case "active": return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Activo</Badge>;
    case "inactive": return <Badge variant="outline" className="gap-1 text-muted-foreground">Inactivo</Badge>;
    case "suspended": return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Suspendido</Badge>;
  }
}

function roleBadge(r: UserRole2) {
  switch (r) {
    case "student": return <Badge variant="outline" className="gap-1 text-primary border-primary/30"><User className="w-3 h-3" />Estudiante</Badge>;
    case "teacher": return <Badge variant="outline" className="gap-1 text-success border-success/30"><BookOpen className="w-3 h-3" />Docente</Badge>;
    case "admin": return <Badge variant="outline" className="gap-1 text-warning border-warning/30"><Shield className="w-3 h-3" />Admin</Badge>;
  }
}

export function UsersTable({
  users,
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
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="ml-auto gap-2">
              <Plus className="w-4 h-4" /> Nuevo Usuario
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-0">
          <div className="border rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último acceso</TableHead>
                  <TableHead className="text-center">Cursos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{roleBadge(u.role)}</TableCell>
                    <TableCell><span className="text-sm text-muted-foreground">{u.institution}</span></TableCell>
                    <TableCell>{statusBadge(u.status)}</TableCell>
                    <TableCell><span className="text-sm text-muted-foreground">{u.lastLogin}</span></TableCell>
                    <TableCell className="text-center"><span className="text-sm">{u.courses}</span></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Ver perfil"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Editar"><Edit className="w-4 h-4" /></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={u.status === "active" ? "Desactivar" : "Activar"}
                          onClick={() => onToggleStatus(u.id)}
                        >
                          {u.status === "active"
                            ? <ToggleRight className="w-4 h-4 text-success" />
                            : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground px-1 py-3">
            {users.length} usuario{users.length !== 1 ? "s" : ""} encontrado{users.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
