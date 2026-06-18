import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { ChevronRight, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { activityData } from "../../../../mocks/data/admin.mock";
import { AdminMetricsCards } from "./AdminMetricsCards";
import { SystemStatusPanel } from "./SystemStatusPanel";
import { useAdminMetrics } from "../../../../features/admin/hooks/useAdminMetrics";
import { useAdminLogs } from "../../../../features/admin/hooks/useAdminLogs";

const ROLE_COLORS = {
  Estudiantes: "#6366f1",
  Docentes: "#10b981",
  Admins: "#f59e0b",
};

function formatTimestamp(ts: string) {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return ts;
  }
}

interface ResumenTabProps {
  onViewLogs: () => void;
}

export function ResumenTab({ onViewLogs }: ResumenTabProps) {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: logs = [], isLoading: logsLoading } = useAdminLogs(4);

  const userDistData = metrics
    ? [
        { name: "Estudiantes", value: metrics.usuarios_por_rol.estudiante },
        { name: "Docentes", value: metrics.usuarios_por_rol.docente },
        { name: "Admins", value: metrics.usuarios_por_rol.administrador },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-4">
      <AdminMetricsCards />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Actividad de Sesiones — Últimos 7 días</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="gSes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="sesiones" stroke="#f59e0b" fill="url(#gSes)" strokeWidth={2} name="Sesiones" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Distribución de Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {metricsLoading ? (
              <div className="space-y-3 w-full pt-4">
                <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ) : userDistData.length > 0 ? (
              <>
                <PieChart width={140} height={140}>
                  <Pie data={userDistData} cx={65} cy={65} innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                    {userDistData.map((entry) => (
                      <Cell key={entry.name} fill={ROLE_COLORS[entry.name as keyof typeof ROLE_COLORS] ?? "#94a3b8"} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="space-y-1.5 w-full">
                  {userDistData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: ROLE_COLORS[d.name as keyof typeof ROLE_COLORS] ?? "#94a3b8" }}
                        />
                        {d.name}
                      </span>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground pt-8">Sin datos aún</p>
            )}
          </CardContent>
        </Card>
      </div>

      <SystemStatusPanel />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Actividad Reciente (auditoría)</CardTitle>
            <button onClick={onViewLogs} className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {logsLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-[10px] border border-border">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
          {!logsLoading && logs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin actividad registrada aún.
            </p>
          )}
          {!logsLoading && logs.slice(0, 4).map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-[10px] border border-border bg-muted/20">
              <div className="flex-1 min-w-0">
                <p className="text-sm">{log.detalle ?? log.accion}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(log.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
