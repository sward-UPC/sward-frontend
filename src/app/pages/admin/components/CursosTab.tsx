import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, Edit, Plus, Trash2 } from "lucide-react";
import { mockCourses } from "../../../../mocks/data/admin.mock";

export function CursosTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{mockCourses.length} cursos en la plataforma</p>
        <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Nuevo Curso</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCourses.map((c) => (
          <Card key={c.id} className={`transition-all hover:border-primary/40 ${c.status === "inactive" ? "opacity-70" : ""}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{c.name}</p>
                    {c.status === "active"
                      ? <Badge variant="success" className="text-xs gap-1"><CheckCircle2 className="w-3 h-3" />Activo</Badge>
                      : <Badge variant="outline" className="text-xs text-muted-foreground">Inactivo</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.teacher}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="p-2 bg-muted/40 rounded-[8px]">
                  <p className="text-xs text-muted-foreground">Estudiantes</p>
                  <p className="font-bold text-sm">{c.students}</p>
                </div>
                <div className="p-2 bg-muted/40 rounded-[8px]">
                  <p className="text-xs text-muted-foreground">Dominio prom.</p>
                  <p className={`font-bold text-sm ${c.avgMastery >= 75 ? "text-success" : c.avgMastery >= 60 ? "text-warning" : "text-destructive"}`}>{c.avgMastery}%</p>
                </div>
                <div className="p-2 bg-muted/40 rounded-[8px]">
                  <p className="text-xs text-muted-foreground">Inicio</p>
                  <p className="font-bold text-sm">{c.startDate}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dominio promedio</span>
                  <span>{c.avgMastery}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.avgMastery >= 75 ? "bg-success" : c.avgMastery >= 60 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${c.avgMastery}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
