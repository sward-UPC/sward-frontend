import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  LineChart as LineChartIcon,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';

/** Colores aprobados (indigo/primary + grises de los ejes). NO introducir nuevos. */
const PRIMARY = '#4F46E5';
const AXIS = '#6B7280';
const GRID = '#E5E7EB';

/** Entrada con fade/slide sutil y stagger; respeta prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-in fade-in-50 slide-in-from-bottom-2 duration-300 fill-mode-both motion-reduce:animate-none ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** KPI compacto: chip con ícono + valor jerarquizado + etiqueta. */
function KpiCard({
  icon,
  label,
  value,
  accent = 'bg-primary/10 text-primary',
  valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  valueClass?: string;
}) {
  return (
    <Card className="transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`shrink-0 rounded-[12px] p-2 ${accent}`} aria-hidden="true">
            {icon}
          </div>
          <div className="min-w-0">
            <p className={`text-2xl font-bold leading-none tabular-nums ${valueClass}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Tooltip uniforme para los charts (mismo estilo en línea y barras). */
const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: `1px solid ${GRID}`,
  borderRadius: '12px',
  fontSize: '12px',
} as const;

/** Skeleton de carga mientras llega tu data real (o si falta el curso). */
function ProgresoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[88px] rounded-[12px] bg-muted/50" />
        ))}
      </div>
      <div className="h-[280px] rounded-[12px] bg-muted/50" />
      <div className="h-[280px] rounded-[12px] bg-muted/50" />
    </div>
  );
}

/** Estado vacío amable y reutilizable dentro de una card (sin eje fantasma). */
function ChartEmpty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
      <div className="rounded-[12px] bg-muted/60 p-2.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">{text}</p>
    </div>
  );
}

/** Tab "Tu Progreso" del panel del estudiante. SOLO datos reales (ms-trazabilidad). */
export function StudentProgresoTab({ estudianteId, courseId }: StudentTabProps) {
  const { enabled, progress, interactions, conceptMastery, weeklyProgress } = useStudentDetail(
    estudianteId,
    courseId,
  );

  // Animación de marca pedida explícitamente: las barras crecen y la línea se dibuja
  // siempre (igual que Recharts por defecto / el radar; no se gatea con reduce-motion).
  const animar = true;

  // Sin curso seleccionado todavía → skeleton (las queries no corren).
  if (!courseId) {
    return <ProgresoSkeleton />;
  }

  const isLoading =
    progress.isLoading ||
    interactions.isLoading ||
    conceptMastery.isLoading ||
    weeklyProgress.isLoading;

  // Dominio por concepto/sección (mismo shape que StudentDetailView).
  const conceptos = enabled ? (conceptMastery.data ?? []) : [];
  // Evolución del dominio por etapa: keys `week` y `mastery`.
  const evolution = enabled ? (weeklyProgress.data ?? []) : [];
  const interaccionesTotal = enabled ? (interactions.data?.length ?? 0) : 0;

  if (isLoading) {
    return <ProgresoSkeleton />;
  }

  // Estado vacío: no hay nada de seguimiento todavía.
  const sinDatos =
    !enabled || (conceptos.length === 0 && evolution.length === 0 && interaccionesTotal === 0);
  if (sinDatos) {
    return (
      <Card>
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-3" aria-hidden="true">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-base font-medium">Aún no hay datos de tu progreso</p>
            <p className="text-sm text-muted-foreground max-w-md">
              A medida que interactúes con las actividades del curso, aquí verás tu evolución y tu
              dominio por concepto.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // KPIs reales.
  const promedioConceptos =
    conceptos.length > 0
      ? Math.round(conceptos.reduce((acc, c) => acc + c.dominio, 0) / conceptos.length)
      : 0;
  const dominioPromedio = progress.data?.puntajePromedio ?? promedioConceptos;
  const conceptosDominados = conceptos.filter((c) => c.dominio >= 75).length;
  const conceptosEnRiesgo = conceptos.filter((c) => c.dominio < 55).length;

  // Tendencia real de la curva: comparamos primer y último punto de la evolución.
  const tendencia =
    evolution.length >= 2 ? evolution[evolution.length - 1].mastery - evolution[0].mastery : 0;
  const tieneCurva = evolution.length >= 2;

  // Datos para los charts (mismos keys que StudentDetailView).
  const conceptBars = conceptos.map((c) => ({ concept: c.concepto, mastery: c.dominio }));

  return (
    <div className="space-y-6">
      {/* 1 · Franja de KPIs reales — jerarquía por número, no por color */}
      <Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Dominio promedio"
            value={`${dominioPromedio}%`}
          />
          <KpiCard
            icon={<Activity className="w-5 h-5" />}
            label="Interacciones"
            value={`${interaccionesTotal}`}
          />
          <KpiCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Conceptos dominados"
            value={`${conceptosDominados}`}
            accent="bg-success/10 text-success"
            valueClass="text-success"
          />
          <KpiCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="En riesgo"
            value={`${conceptosEnRiesgo}`}
            accent={
              conceptosEnRiesgo > 0 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
            }
            valueClass={conceptosEnRiesgo > 0 ? 'text-warning' : 'text-muted-foreground'}
          />
        </div>
      </Reveal>

      {/* 2 · Evolución de tu Dominio (foco principal) */}
      <Reveal delay={80}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-primary" aria-hidden="true" />
                  Evolución de tu dominio
                </CardTitle>
                <CardDescription>Tu dominio acumulado a lo largo de las actividades</CardDescription>
              </div>
              {tieneCurva && (
                <span
                  className={`shrink-0 inline-flex items-center gap-1 rounded-[12px] px-2 py-1 text-xs font-semibold tabular-nums ${
                    tendencia > 0
                      ? 'bg-success/10 text-success'
                      : tendencia < 0
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  aria-label={`Tendencia ${tendencia > 0 ? 'al alza' : tendencia < 0 ? 'a la baja' : 'estable'} de ${Math.abs(tendencia)} puntos`}
                >
                  {tendencia > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : tendencia < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {tendencia > 0 ? '+' : ''}
                  {tendencia} pts
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tieneCurva ? (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolution} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                    <XAxis dataKey="week" stroke={AXIS} tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
                    <YAxis stroke={AXIS} tickLine={false} axisLine={false} style={{ fontSize: '12px' }} domain={[0, 100]} width={40} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: GRID }} formatter={(v: number) => [`${v}%`, 'Dominio']} />
                    <Line
                      type="monotone"
                      dataKey="mastery"
                      stroke={PRIMARY}
                      strokeWidth={2.5}
                      name="Dominio %"
                      dot={{ r: 3, fill: PRIMARY }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={animar}
                      animationDuration={900}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartEmpty
                icon={<LineChartIcon className="w-5 h-5" />}
                text="Aún no hay suficientes etapas para dibujar tu curva. Sigue resolviendo actividades y pronto verás cómo avanza tu dominio."
              />
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* 3 · Dominio por Concepto (detalle, resalta lo que está en riesgo) */}
      <Reveal delay={160}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" aria-hidden="true" />
              Dominio por concepto
            </CardTitle>
            <CardDescription>
              Tu tasa de acierto por sección. Pasa el cursor (o toca) una barra para ver el nombre completo y el %.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conceptBars.length > 0 ? (
              // Barras HORIZONTALES: los nombres de sección (largos) se leen a la
              // izquierda en vez de amontonarse ilegibles en el eje X.
              <div style={{ height: Math.max(200, conceptBars.length * 46) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conceptBars}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke={AXIS}
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: '11px' }}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="concept"
                      stroke={AXIS}
                      tickLine={false}
                      axisLine={false}
                      width={150}
                      style={{ fontSize: '11px' }}
                      tickFormatter={(v: string) => (v.length > 22 ? `${v.slice(0, 21)}…` : v)}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
                      formatter={(v: number) => [`${v}%`, 'Dominio']}
                    />
                    <Bar
                      dataKey="mastery"
                      name="Dominio %"
                      radius={[0, 6, 6, 0]}
                      isAnimationActive={animar}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {conceptBars.map((c) => (
                        // Resaltamos secciones en riesgo bajando la opacidad (mismo color aprobado).
                        <Cell key={c.concept} fill={PRIMARY} fillOpacity={c.mastery < 55 ? 0.4 : 1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartEmpty
                icon={<BarChart3 className="w-5 h-5" />}
                text="Todavía no tienes dominio registrado por concepto en este curso."
              />
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
