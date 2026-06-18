import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Users, BookOpen, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { useAdminMetrics } from "../../../../features/admin/hooks/useAdminMetrics";
import { useAdminCourses } from "../../../../features/admin/hooks/useAdminCourses";

export function AdminMetricsCards() {
  const { data: metrics, isLoading: metricsLoading, isError: metricsError } = useAdminMetrics();
  const { data: cursos = [], isLoading: cursosLoading } = useAdminCourses();

  const isLoading = metricsLoading || cursosLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (metricsError || !metrics) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive p-3 rounded-[10px] border border-destructive/20 bg-destructive/5">
        <AlertCircle className="w-4 h-4 shrink-0" />
        No se pudieron cargar las métricas. Verifica tu conexión e intenta de nuevo.
      </div>
    );
  }

  const cursosActivos = cursos.filter((c) => c.estado === "activo").length;

  const kpis = [
    {
      label: "Usuarios Totales",
      value: metrics.total_usuarios,
      icon: <Users className="w-5 h-5 text-primary" />,
      color: "bg-primary/10",
      sub: `${metrics.usuarios_activos} activos · ${metrics.usuarios_inactivos} inactivos`,
    },
    {
      label: "Cursos Activos",
      value: cursosActivos,
      icon: <BookOpen className="w-5 h-5 text-success" />,
      color: "bg-success/10",
      sub: `${cursos.length} cursos en total`,
    },
    {
      label: "Sesiones Hoy",
      value: "—",
      icon: <Activity className="w-5 h-5 text-warning" />,
      color: "bg-warning/10",
      sub: "pendiente de implementar",
    },
    {
      label: "Dominio Plataforma",
      value: "—",
      icon: <TrendingUp className="w-5 h-5 text-info" />,
      color: "bg-info/10",
      sub: "requiere módulo SAKT",
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
