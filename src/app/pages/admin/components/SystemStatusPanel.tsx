import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Server, Globe, Database, Cpu, Wifi } from "lucide-react";
import { useSystemStatus } from "../../../../features/admin/hooks/useSystemStatus";
import type { ApiServiceHealth } from "../../../../core/types/admin.types";

function formatUptime(segundos: number): string {
  if (segundos < 60) return `${Math.round(segundos)}s`;
  if (segundos < 3600) return `${Math.round(segundos / 60)}m`;
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function ServiceCard({ service, icon }: { service: ApiServiceHealth; icon: React.ReactNode }) {
  const ok = service.estado === "operativo";
  const degraded = service.estado === "degradado";
  return (
    <div
      className={`p-3 rounded-[10px] border ${
        ok
          ? "border-success/20 bg-success/5"
          : degraded
            ? "border-warning/20 bg-warning/5"
            : "border-destructive/20 bg-destructive/5"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={ok ? "text-success" : degraded ? "text-warning" : "text-destructive"}>{icon}</span>
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            ok ? "bg-success" : degraded ? "bg-warning" : "bg-destructive"
          }`}
        />
      </div>
      <p className="text-sm font-semibold">{service.nombre}</p>
      <p className="text-xs text-muted-foreground capitalize">{service.estado}</p>
      {service.latencia_ms != null && (
        <p className="text-xs text-muted-foreground">{service.latencia_ms} ms</p>
      )}
      {service.detalle && service.latencia_ms == null && (
        <p className="text-xs text-muted-foreground truncate">{service.detalle}</p>
      )}
    </div>
  );
}

export function SystemStatusPanel() {
  const { data, isLoading } = useSystemStatus();

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" /> Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-[10px] bg-muted/40 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const uptimeStr = formatUptime(data.uptime_segundos);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-muted-foreground" /> Estado del Sistema
          <span className="ml-auto text-xs text-muted-foreground font-normal">uptime {uptimeStr}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ServiceCard service={data.api} icon={<Globe className="w-4 h-4" />} />
          <ServiceCard service={data.base_de_datos} icon={<Database className="w-4 h-4" />} />
          <ServiceCard service={data.redis} icon={<Wifi className="w-4 h-4" />} />
          <div
            className="p-3 rounded-[10px] border border-success/20 bg-success/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-success"><Cpu className="w-4 h-4" /></span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-sm font-semibold">Modelo XAI</p>
            <p className="text-xs text-muted-foreground">operativo</p>
            <p className="text-xs text-muted-foreground">SAKT v2.1</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
