import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChevronRight, XCircle, Info, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { activityData, userDistData, systemLogs } from "../../../../mocks/data/admin.mock";
import { AdminMetricsCards } from "./AdminMetricsCards";
import { SystemStatusPanel } from "./SystemStatusPanel";

interface ResumenTabProps {
  onViewLogs: () => void;
}

function logIcon(level: string) {
  switch (level) {
    case "error": return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0" />;
  }
}

function logBg(level: string) {
  switch (level) {
    case "error": return "bg-destructive/5 border-destructive/20";
    case "warning": return "bg-warning/5 border-warning/20";
    default: return "bg-muted/40 border-border";
  }
}

export function ResumenTab({ onViewLogs }: ResumenTabProps) {
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
            <PieChart width={140} height={140}>
              <Pie data={userDistData} cx={65} cy={65} innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                {userDistData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="space-y-1.5 w-full">
              {userDistData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SystemStatusPanel />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Actividad Reciente</CardTitle>
            <button onClick={onViewLogs} className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {systemLogs.slice(0, 4).map((log) => (
            <div key={log.id} className={`flex items-start gap-3 p-2.5 rounded-[10px] border ${logBg(log.level)}`}>
              {logIcon(log.level)}
              <div className="flex-1 min-w-0">
                <p className="text-sm">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{log.module} · {log.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
