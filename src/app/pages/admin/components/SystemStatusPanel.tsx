import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Server, Globe, Database, Cpu } from "lucide-react";

export function SystemStatusPanel() {
  const services = [
    { label: "API Server", value: "Operativo", icon: <Globe className="w-4 h-4" />, ok: true, sub: "99.9% uptime" },
    { label: "Base de Datos", icon: <Database className="w-4 h-4" />, value: "Operativo", ok: true, sub: "2.3 ms avg" },
    { label: "Modelo XAI", icon: <Cpu className="w-4 h-4" />, value: "Operativo", ok: true, sub: "SAKT v2.1" },
    { label: "Almacenamiento", icon: <Server className="w-4 h-4" />, value: "68% usado", ok: true, sub: "34 GB / 50 GB" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-muted-foreground" /> Estado del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.label}
              className={`p-3 rounded-[10px] border ${s.ok ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={s.ok ? "text-success" : "text-destructive"}>{s.icon}</span>
                <span className={`w-2 h-2 rounded-full ${s.ok ? "bg-success" : "bg-destructive"} animate-pulse`} />
              </div>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
