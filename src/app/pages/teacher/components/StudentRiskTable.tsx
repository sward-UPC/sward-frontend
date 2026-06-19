import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../../components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../../components/ui/select';
import { Filter, AlertTriangle, Eye, MessageSquare, TrendingUp, Minus } from 'lucide-react';
import type { StudentProgress } from '@core/types';

interface StudentRiskTableProps {
  sortedStudents: StudentProgress[];
  courseFilter: string;
  setCourseFilter: (v: string) => void;
  weekFilter: string;
  setWeekFilter: (v: string) => void;
  riskFilter: string;
  setRiskFilter: (v: string) => void;
  onViewStudent: (id: number) => void;
  onFeedback: (student: { id: number; name: string }) => void;
}

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

export function StudentRiskTable({
  sortedStudents,
  courseFilter,
  setCourseFilter,
  weekFilter,
  setWeekFilter,
  riskFilter,
  setRiskFilter,
  onViewStudent,
  onFeedback,
}: StudentRiskTableProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="shrink-0 w-44">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Curso" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  <SelectItem value="ia">Inteligencia Artificial</SelectItem>
                  <SelectItem value="ml">Machine Learning</SelectItem>
                  <SelectItem value="dl">Deep Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="shrink-0 w-36">
              <Select value={weekFilter} onValueChange={setWeekFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Semana" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las semanas</SelectItem>
                  <SelectItem value="1">Semana 1</SelectItem>
                  <SelectItem value="2">Semana 2</SelectItem>
                  <SelectItem value="3">Semana 3</SelectItem>
                  <SelectItem value="4">Semana 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="shrink-0 w-36">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Riesgo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="high">Riesgo Alto</SelectItem>
                  <SelectItem value="medium">Riesgo Medio</SelectItem>
                  <SelectItem value="low">Bajo Riesgo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {sortedStudents.length} estudiante{sortedStudents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-4 pb-0">
          <div className="border rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6"></TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Semáforo</TableHead>
                  <TableHead className="text-center">Dominio</TableHead>
                  <TableHead className="text-center">En Riesgo</TableHead>
                  <TableHead className="text-center">Engagement</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/30 cursor-pointer"
                    onClick={() => onViewStudent(student.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className={`w-2.5 h-2.5 rounded-full ${getRiskColor(student.riskLevel)}`} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{student.name}</p>
                          {student.registrado === false && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30"
                              title="El estudiante existe en Moodle pero aún no se ha registrado en SWARD"
                            >
                              No registrado en SWARD
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold text-sm ${getMasteryColor(student.avgMastery)}`}>
                        {student.avgMastery}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.conceptsAtRisk > 0 ? (
                        <Badge variant="outline" className="gap-1">
                          <AlertTriangle className="w-3 h-3 text-destructive" />{student.conceptsAtRisk}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm ${getMasteryColor(student.engagement)}`}>
                        {student.engagement}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{student.lastActivity}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onViewStudent(student.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
          <p className="text-xs text-muted-foreground px-1 py-3">
            Ordenados por nivel de riesgo. Semáforo: Rojo (&lt;60%), Amarillo (60–80%), Verde (&gt;80%).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
