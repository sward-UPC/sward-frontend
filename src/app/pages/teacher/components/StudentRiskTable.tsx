import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../../components/ui/table';
import {
  AlertTriangle, Eye, MessageSquare, TrendingUp, Minus, Search, X,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Users,
} from 'lucide-react';
import type { StudentProgress } from '@core/types';

interface StudentRiskTableProps {
  /** Lista COMPLETA de estudiantes del curso (sin filtrar). */
  students: StudentProgress[];
  riskFilter: string;
  setRiskFilter: (v: string) => void;
  onViewStudent: (id: number) => void;
  onFeedback: (student: { id: number; name: string }) => void;
}

const PAGE_SIZE = 12;
const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

type SortKey = 'risk' | 'name' | 'avgMastery' | 'conceptsAtRisk' | 'engagement';
type SortDir = 'asc' | 'desc';

function getRiskBadge(level: string) {
  switch (level) {
    case 'high':
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Riesgo Alto</Badge>;
    case 'medium':
      return <Badge variant="warning" className="gap-1"><Minus className="w-3 h-3" />Riesgo Medio</Badge>;
    case 'low':
      return <Badge variant="success" className="gap-1"><TrendingUp className="w-3 h-3" />Bajo Riesgo</Badge>;
    default:
      return null;
  }
}

function getRiskColor(level: string) {
  switch (level) {
    case 'high': return 'bg-destructive';
    case 'medium': return 'bg-warning';
    case 'low': return 'bg-success';
    default: return 'bg-muted';
  }
}

function getMasteryColor(v: number) {
  return v >= 80 ? 'text-success' : v >= 60 ? 'text-warning' : 'text-destructive';
}

function getMasteryBar(v: number) {
  return v >= 80 ? 'bg-success' : v >= 60 ? 'bg-warning' : 'bg-destructive';
}

/** Normaliza para búsqueda insensible a mayúsculas y acentos. */
function normalizar(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function StudentRiskTable({
  students,
  riskFilter,
  setRiskFilter,
  onViewStudent,
  onFeedback,
}: StudentRiskTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  // Conteos por nivel (sobre el total del curso) para el filtro segmentado.
  const counts = useMemo(() => ({
    all: students.length,
    high: students.filter((s) => s.riskLevel === 'high').length,
    medium: students.filter((s) => s.riskLevel === 'medium').length,
    low: students.filter((s) => s.riskLevel === 'low').length,
  }), [students]);

  // Filtro (riesgo + búsqueda) y orden.
  const filtered = useMemo(() => {
    const q = normalizar(search.trim());
    const dir = sortDir === 'asc' ? 1 : -1;
    return students
      .filter((s) => riskFilter === 'all' || s.riskLevel === riskFilter)
      .filter((s) => !q || normalizar(s.name).includes(q) || normalizar(s.email).includes(q))
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
        if (sortKey === 'risk') {
          return (RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]) * dir;
        }
        return ((a[sortKey] as number) - (b[sortKey] as number)) * dir;
      });
  }, [students, riskFilter, search, sortKey, sortDir]);

  // Resetea a la primera página cuando cambian filtros/búsqueda/orden.
  useEffect(() => { setPage(1); }, [riskFilter, search, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const desde = filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1;
  const hasta = Math.min(pageSafe * PAGE_SIZE, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const segmentos: { value: string; label: string; count: number; dot?: string }[] = [
    { value: 'all', label: 'Todos', count: counts.all },
    { value: 'high', label: 'Alto', count: counts.high, dot: 'bg-destructive' },
    { value: 'medium', label: 'Medio', count: counts.medium, dot: 'bg-warning' },
    { value: 'low', label: 'Bajo', count: counts.low, dot: 'bg-success' },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar: búsqueda + filtro segmentado por riesgo */}
      <Card>
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo…"
              aria-label="Buscar estudiante"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nivel de riesgo">
            {segmentos.map((seg) => {
              const activo = riskFilter === seg.value;
              return (
                <button
                  key={seg.value}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setRiskFilter(seg.value)}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    activo
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                  ].join(' ')}
                >
                  {seg.dot && (
                    <span className={`w-2 h-2 rounded-full ${seg.dot} ${activo ? 'ring-1 ring-white/60' : ''}`} />
                  )}
                  {seg.label}
                  <span className={`tabular-nums ${activo ? 'text-primary-foreground/80' : 'text-muted-foreground/70'}`}>
                    {seg.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="pt-4 pb-0">
          {/* Contador de resultados */}
          <div className="flex items-center justify-between gap-2 pb-3 text-xs text-muted-foreground">
            <span>
              {filtered.length === 0
                ? 'Sin resultados'
                : `Mostrando ${desde}–${hasta} de ${filtered.length} estudiante${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-2 py-12">
              <div className="rounded-full bg-muted p-3 text-muted-foreground">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">No se encontraron estudiantes</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Prueba con otro término de búsqueda o cambia el filtro de riesgo.
              </p>
              {(search || riskFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => { setSearch(''); setRiskFilter('all'); }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
            {/* MÓVIL: tarjetas apiladas (la tabla no cabe en pantallas chicas) */}
            <div className="sm:hidden space-y-2">
              {paged.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onViewStudent(student.id)}
                  className="w-full text-left rounded-[12px] border p-3 hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${getRiskColor(student.riskLevel)}`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        {student.registrado === false && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30 shrink-0">
                            No registrado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    </div>
                    {getRiskBadge(student.riskLevel)}
                  </div>

                  {/* Métricas */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Dominio</p>
                      <p className={`text-sm font-semibold ${getMasteryColor(student.avgMastery)}`}>{student.avgMastery}%</p>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${getMasteryBar(student.avgMastery)}`}
                          style={{ width: `${Math.max(0, Math.min(100, student.avgMastery))}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Engagement</p>
                      <p className={`text-sm font-semibold ${getMasteryColor(student.engagement)}`}>{student.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">En riesgo</p>
                      <p className="text-sm font-semibold">
                        {student.conceptsAtRisk > 0 ? (
                          <span className="text-destructive">{student.conceptsAtRisk}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewStudent(student.id)}>
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onFeedback({ id: student.id, name: student.name })}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Mensaje
                    </Button>
                  </div>
                </button>
              ))}
            </div>

            {/* DESKTOP/TABLET: tabla */}
            <div className="hidden sm:block border rounded-[12px] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-6"></TableHead>
                    <SortHeader label="Estudiante" col="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <TableHead className="hidden sm:table-cell">Semáforo</TableHead>
                    <SortHeader label="Dominio" col="avgMastery" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="center" />
                    <SortHeader label="En Riesgo" col="conceptsAtRisk" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="center" className="hidden lg:table-cell" />
                    <SortHeader label="Engagement" col="engagement" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="center" className="hidden md:table-cell" />
                    <TableHead className="hidden lg:table-cell">Última Actividad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() => onViewStudent(student.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${getRiskColor(student.riskLevel)}`}
                          title={student.riskLevel === 'high' ? 'Riesgo alto' : student.riskLevel === 'medium' ? 'Riesgo medio' : 'Bajo riesgo'}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{student.name}</p>
                            {student.registrado === false && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30 shrink-0"
                                title="El estudiante existe en Moodle pero aún no se ha registrado en SWARD"
                              >
                                No registrado
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{getRiskBadge(student.riskLevel)}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center gap-1 min-w-[3rem]">
                          <span className={`font-semibold text-sm ${getMasteryColor(student.avgMastery)}`}>
                            {student.avgMastery}%
                          </span>
                          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getMasteryBar(student.avgMastery)}`}
                              style={{ width: `${Math.max(0, Math.min(100, student.avgMastery))}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        {student.conceptsAtRisk > 0 ? (
                          <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="w-3 h-3 text-destructive" />{student.conceptsAtRisk}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className={`text-sm ${getMasteryColor(student.engagement)}`}>
                          {student.engagement}%
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{student.lastActivity}</span>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Ver detalle de ${student.name}`} onClick={() => onViewStudent(student.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Enviar retroalimentación a ${student.name}`}
                            onClick={() => onFeedback({ id: student.id, name: student.name })}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
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
            <p className="text-xs text-muted-foreground">
              Semáforo: Rojo (&lt;60%), Amarillo (60–80%), Verde (&gt;80%).
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
        </CardContent>
      </Card>
    </div>
  );
}

/** Encabezado de columna ordenable: clic alterna asc/desc, con indicador e aria-sort. */
function SortHeader({
  label, col, sortKey, sortDir, onSort, align = 'left', className = '',
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}) {
  const activo = sortKey === col;
  const ariaSort = activo ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
  const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
  return (
    <TableHead aria-sort={ariaSort} className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-1 ${justify} hover:text-foreground transition-colors ${activo ? 'text-foreground font-semibold' : ''}`}
      >
        {label}
        {activo ? (
          sortDir === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}
