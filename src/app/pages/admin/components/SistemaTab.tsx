import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Cpu, Server, Database, Activity, Zap, Lock,
  CheckCircle2, RefreshCw, Download,
} from "lucide-react";
import { useSystemMetrics } from "../../../../features/admin/hooks/useSystemMetrics";
import { useModelConfig, useTriggerRetrain } from "../../../../features/admin/hooks/useModelConfig";
import { useDatabasesStatus } from "../../../../features/admin/hooks/useDatabasesStatus";

interface SistemaTabProps {
  modelRetrain: boolean;
  retrainDone: boolean;
  onRetrain: () => void;
}

const SECURITY_SETTINGS = [
  { label: "Autenticación de dos factores (2FA)", desc: "Requerido para todos los administradores", enabled: true },
  { label: "Sesión con expiración automática", desc: "Cierre de sesión tras 30 min de inactividad", enabled: true },
  { label: "Registro de auditoría", desc: "Todas las acciones quedan registradas en logs", enabled: true },
  { label: "Acceso API externo", desc: "Permite integración con sistemas institucionales", enabled: false },
];

function formatUptime(segundos: number): string {
  if (segundos < 60) return `${Math.round(segundos)}s`;
  if (segundos < 3600) return `${Math.round(segundos / 60)} min`;
  const d = Math.floor(segundos / 86400);
  const h = Math.floor((segundos % 86400) / 3600);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${Math.floor((segundos % 3600) / 60)}m`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  const d = new Date(iso);
  return d.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

function MetricCard({
  label,
  value,
  bar,
  icon,
  loading,
  positive = false,
}: {
  label: string;
  value: string;
  bar: number;
  icon: React.ReactNode;
  loading: boolean;
  /** Si la métrica es "más es mejor" (p.ej. uptime): barra siempre verde. */
  positive?: boolean;
}) {
  const barColor = positive
    ? "bg-success"
    : bar > 80
      ? "bg-destructive"
      : bar > 60
        ? "bg-warning"
        : "bg-success";
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">{icon}</span>
          <span
            className={`w-2 h-2 rounded-full ${loading ? "bg-muted animate-pulse" : "bg-success animate-pulse"}`}
          />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-muted/50 rounded animate-pulse mb-2" />
        ) : (
          <p className="text-xl font-bold mb-2">{value}</p>
        )}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: loading ? "0%" : `${bar}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function SistemaTab({ modelRetrain, retrainDone, onRetrain }: SistemaTabProps) {
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();
  const { data: modelConfig, isLoading: configLoading } = useModelConfig();
  const { data: databases, isLoading: dbLoading } = useDatabasesStatus();
  const retrain = useTriggerRetrain();

  const handleRetrain = () => {
    retrain.mutate(undefined, {
      onSuccess: () => onRetrain(),
    });
  };

  const systemMetrics = [
    {
      label: "CPU",
      value: metrics ? `${metrics.cpu_pct}%` : "—",
      bar: metrics?.cpu_pct ?? 0,
      icon: <Cpu className="w-5 h-5 text-primary" />,
    },
    {
      label: "Memoria RAM",
      value: metrics ? `${metrics.ram_pct}%` : "—",
      bar: metrics?.ram_pct ?? 0,
      icon: <Server className="w-5 h-5 text-warning" />,
    },
    {
      label: "Almacenamiento",
      value: metrics ? `${metrics.disco_pct}%` : "—",
      bar: metrics?.disco_pct ?? 0,
      icon: <Database className="w-5 h-5 text-warning" />,
    },
    {
      label: "Uptime",
      value: metrics ? formatUptime(metrics.uptime_segundos) : "—",
      bar: 100,
      icon: <Activity className="w-5 h-5 text-success" />,
      positive: true,
    },
  ];

  const modelParams = modelConfig
    ? [
        { label: "Versión del modelo", value: modelConfig.version, tag: "Producción" },
        { label: "Último reentrenamiento", value: formatDate(modelConfig.ultimo_reentrenamiento), tag: "Exitoso" },
        { label: "Tasa de aprendizaje", value: String(modelConfig.tasa_aprendizaje), tag: "Optimizado" },
        {
          label: "Umbral de confianza XAI",
          value: `${Math.round(modelConfig.umbral_confianza_xai * 100)}%`,
          tag: "Configurable",
        },
        { label: "Ventana de contexto", value: `${modelConfig.ventana_contexto} interacciones`, tag: "Fijo" },
        { label: "Dimensión de embedding", value: String(modelConfig.dimension_embedding), tag: "Fijo" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {systemMetrics.map((m) => (
          <MetricCard key={m.label} {...m} loading={metricsLoading} />
        ))}
      </div>

      {/* Estado de las bases de datos de todos los microservicios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" /> Bases de Datos
          </CardTitle>
          <CardDescription className="text-xs">
            Estado de la base de datos de cada microservicio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dbLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 rounded-[10px] bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(databases ?? []).map((db) => {
                const ok = db.estado === "operativo";
                return (
                  <div
                    key={db.servicio}
                    className={`p-3 rounded-[10px] border ${
                      ok ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Database className={`w-4 h-4 ${ok ? "text-success" : "text-destructive"}`} />
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${ok ? "bg-success" : "bg-destructive"}`}
                      />
                    </div>
                    <p className="text-sm font-semibold capitalize">{db.servicio}</p>
                    <p className="text-xs text-muted-foreground capitalize">{db.estado}</p>
                    {db.latencia_ms != null ? (
                      <p className="text-xs text-muted-foreground">{db.latencia_ms} ms</p>
                    ) : (
                      db.detalle && <p className="text-xs text-muted-foreground truncate">{db.detalle}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" /> Configuración del Modelo XAI (SAKT)
          </CardTitle>
          <CardDescription className="text-xs">
            Parámetros del modelo de Knowledge Tracing con Explicabilidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 rounded-[10px] bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modelParams.map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-[10px]">
                  <div>
                    <p className="text-xs text-muted-foreground">{p.label}</p>
                    <p className="text-sm font-semibold font-mono">{p.value}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{p.tag}</Badge>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleRetrain}
              disabled={modelRetrain || retrain.isPending}
              className="gap-2 w-full sm:w-auto justify-center"
              variant={retrainDone ? "outline" : "default"}
            >
              {modelRetrain || retrain.isPending
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Reentrenando...</>
                : retrainDone
                  ? <><CheckCircle2 className="w-4 h-4 text-success" /> Completado</>
                  : <><RefreshCw className="w-4 h-4" /> Reentrenar Modelo</>}
            </Button>
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto justify-center"
              onClick={() => {
                if (!metrics) return;
                const csv = [
                  "metrica,valor",
                  `cpu_pct,${metrics.cpu_pct}`,
                  `ram_pct,${metrics.ram_pct}`,
                  `ram_usado_mb,${metrics.ram_usado_mb}`,
                  `ram_total_mb,${metrics.ram_total_mb}`,
                  `disco_pct,${metrics.disco_pct}`,
                  `disco_usado_gb,${metrics.disco_usado_gb}`,
                  `disco_total_gb,${metrics.disco_total_gb}`,
                  `uptime_segundos,${metrics.uptime_segundos}`,
                  modelConfig ? `modelo_version,${modelConfig.version}` : "",
                  modelConfig ? `tasa_aprendizaje,${modelConfig.tasa_aprendizaje}` : "",
                  modelConfig ? `umbral_xai,${modelConfig.umbral_confianza_xai}` : "",
                ]
                  .filter(Boolean)
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `sward-metricas-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4" /> Exportar Métricas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" /> Configuración de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECURITY_SETTINGS.map((s) => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-[10px] border border-border">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <div
                className={`w-10 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${s.enabled ? "bg-primary" : "bg-muted"}`}
                style={{ height: 22 }}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${s.enabled ? "translate-x-4" : "translate-x-0"}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
