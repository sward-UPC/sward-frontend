import { Card, CardContent } from "../../../components/ui/card";
import { Users, BookOpen, Activity, TrendingUp } from "lucide-react";
import { mockUsers, mockCourses } from "../../../../mocks/data/admin.mock";

export function AdminMetricsCards() {
  const kpis = [
    {
      label: "Usuarios Totales",
      value: mockUsers.length,
      icon: <Users className="w-5 h-5 text-primary" />,
      color: "bg-primary/10",
      sub: `${mockUsers.filter((u) => u.status === "active").length} activos`,
    },
    {
      label: "Cursos Activos",
      value: mockCourses.filter((c) => c.status === "active").length,
      icon: <BookOpen className="w-5 h-5 text-success" />,
      color: "bg-success/10",
      sub: `${mockCourses.reduce((a, c) => a + c.students, 0)} matriculados`,
    },
    {
      label: "Sesiones Hoy",
      value: 61,
      icon: <Activity className="w-5 h-5 text-warning" />,
      color: "bg-warning/10",
      sub: "+14% vs ayer",
    },
    {
      label: "Dominio Plataforma",
      value: "69%",
      icon: <TrendingUp className="w-5 h-5 text-info" />,
      color: "bg-info/10",
      sub: "+3% este mes",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${k.color} flex items-center justify-center shrink-0`}>
                {k.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
