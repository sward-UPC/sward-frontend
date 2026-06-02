import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Cpu, Server, Database, Activity, Zap, Lock,
  CheckCircle2, RefreshCw, Download,
} from "lucide-react";

interface SistemaTabProps {
  modelRetrain: boolean;
  retrainDone: boolean;
  onRetrain: () => void;
}

const SYSTEM_METRICS = [
  { label: "CPU", value: "42%", icon: <Cpu className="w-5 h-5 text-primary" />, ok: true, bar: 42 },
  { label: "Memoria RAM", value: "58%", icon: <Server className="w-5 h-5 text-warning" />, ok: true, bar: 58 },
  { label: "Almacenamiento", value: "68%", icon: <Database className="w-5 h-5 text-warning" />, ok: true, bar: 68 },
  { label: "Uptime", value: "99.9%", icon: <Activity className="w-5 h-5 text-success" />, ok: true, bar: 99 },
];

const MODEL_PARAMS = [
  { label: "Versión del modelo", value: "SAKT v2.1.3", tag: "Producción" },
  { label: "Último reentrenamiento", value: "Hoy 09:14", tag: "Exitoso" },
  { label: "Tasa de aprendizaje", value: "0.001", tag: "Optimizado" },
  { label: "Umbral de confianza XAI", value: "75%", tag: "Configurable" },
  { label: "Ventana de contexto", value: "50 interacciones", tag: "Fijo" },
  { label: "Dimensión de embedding", value: "128", tag: "Fijo" },
];

const SECURITY_SETTINGS = [
  { label: "Autenticación de dos factores (2FA)", desc: "Requerido para todos los administradores", enabled: true },
  { label: "Sesión con expiración automática", desc: "Cierre de sesión tras 30 min de inactividad", enabled: true },
  { label: "Registro de auditoría", desc: "Todas las acciones quedan registradas en logs", enabled: true },
  { label: "Acceso API externo", desc: "Permite integración con sistemas institucionales", enabled: false },
];

export function SistemaTab({ modelRetrain, retrainDone, onRetrain }: SistemaTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SYSTEM_METRICS.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">{m.icon}</span>
                <span className={`w-2 h-2 rounded-full ${m.ok ? "bg-success" : "bg-destructive"} animate-pulse`} />
              </div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xl font-bold mb-2">{m.value}</p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.bar > 80 ? "bg-destructive" : m.bar > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${m.bar}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" /> Configuración del Modelo XAI (SAKT)
          </CardTitle>
          <CardDescription className="text-xs">Parámetros del modelo de Knowledge Tracing con Explicabilidad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODEL_PARAMS.map((p) => (
              <div key={p.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-[10px]">
                <div>
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className="text-sm font-semibold font-mono">{p.value}</p>
                </div>
                <Badge variant="outline" className="text-xs">{p.tag}</Badge>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={onRetrain} disabled={modelRetrain} className="gap-2" variant={retrainDone ? "outline" : "default"}>
              {modelRetrain
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Reentrenando...</>
                : retrainDone
                ? <><CheckCircle2 className="w-4 h-4 text-success" /> Completado</>
                : <><RefreshCw className="w-4 h-4" /> Reentrenar Modelo</>}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => alert("Descargando métricas del modelo...")}>
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
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${s.enabled ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
