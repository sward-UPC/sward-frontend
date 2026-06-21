import { useSearchParams } from 'react-router';
import type { StudentTabProps } from '@features/student/useStudentContext';
import { useStudentDetail } from '@features/teacher/hooks/useStudentDetail';
import { DomainRadar } from '../../../components/xai/DomainRadar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  Activity,
  ArrowRight,
  ChevronRight,
  Flame,
  Route,
} from 'lucide-react';
import { calcularRuta } from '@features/student/gamification';
import { useStudentStreak } from '@features/student/useStudentStreak';
import { useCountUp } from '@features/student/useCountUp';

interface ConceptMasteryItem {
  concepto: string;
  dominio: number;
  total: number;
}

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

/** Anillo de progreso (SVG) que se LLENA mientras el número cuenta hacia arriba. */
function ProgressRing({ value, size = 104, stroke = 9 }: { value: number; size?: number; stroke?: number }) {
  const objetivo = Math.min(100, Math.max(0, value));
  const v = useCountUp(objetivo); // cuenta 0 → objetivo (el aro sigue al número)
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Dominio promedio ${objetivo} por ciento`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-primary"
          style={{ strokeDasharray: c, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none tabular-nums">{v}%</span>
        <span className="text-[10px] text-muted-foreground mt-0.5">dominio</span>
      </div>
    </div>
  );
}

/** Barra de la ruta de aprendizaje que se llena y cuenta hacia arriba. */
function BarraRuta({ completados, total }: { completados: number; total: number }) {
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0;
  const pctAnim = useCountUp(pct);
  const compAnim = useCountUp(completados);
  const faltan = total - completados;
  return (
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Route className="w-4 h-4 text-primary" aria-hidden="true" />
          Ruta de aprendizaje
        </span>
        <span className="font-semibold tabular-nums">
          {compAnim}/{total}
        </span>
      </div>
      <Progress value={pctAnim} />
      <p className="text-xs text-muted-foreground">
        {faltan <= 0
          ? '¡Ruta completada, excelente!'
          : `${faltan} ${faltan === 1 ? 'sección' : 'secciones'} para completar tu ruta`}
      </p>
    </div>
  );
}

/** Card de racha CUSTOM: llama que titila/brilla mientras el número sube. */
function RachaCard({ racha }: { racha: number }) {
  const n = useCountUp(racha);
  const activa = racha > 0;
  // La llama es una animación de marca pedida explícitamente; no se desactiva con
  // reduce-motion (igual que los charts de Recharts).
  const animarLlama = activa;
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 rounded-[12px] p-2 bg-warning/10 text-warning">
            {animarLlama && (
              <span
                className="absolute inset-0 rounded-[12px] bg-warning/25 blur-md animate-pulse"
                aria-hidden="true"
              />
            )}
            <Flame
              className="w-5 h-5 relative"
              aria-hidden="true"
              style={
                animarLlama
                  ? { animation: 'sward-flame 1.3s ease-in-out infinite', transformOrigin: '50% 90%' }
                  : undefined
              }
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Días de racha</p>
            <p className="text-2xl font-bold tabular-nums">{n}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activa ? '¡Sigue conectándote a diario!' : 'Resuelve algo hoy para empezar'}
            </p>
          </div>
        </div>
      </CardContent>
      <style>{`@keyframes sward-flame{0%,100%{transform:scale(1) rotate(-3deg)}25%{transform:scale(1.12) rotate(3deg)}50%{transform:scale(.94) rotate(-1deg)}75%{transform:scale(1.07) rotate(2deg)}}`}</style>
    </Card>
  );
}

/** Tarjeta de KPI con su valor real (cuenta hacia arriba) y un subtítulo motivador. */
function KpiCard({
  icon,
  label,
  value,
  suffix = '',
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  hint: string;
  accent?: string;
}) {
  const n = useCountUp(value);
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-[12px] p-2 ${accent ?? 'bg-primary/10 text-primary'}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums">
              {n}
              {suffix}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tab "Hoy" del panel del estudiante: resumen motivador con SUS datos reales.
 * Jerarquía: saludo → foco (progreso + acción) → métricas → detalle (radar).
 */
export function StudentHoyTab({ estudianteId, courseId, courseName }: StudentTabProps) {
  // Misma fuente real que usa el panel docente, pero pidiendo MI propia data.
  const { enabled, progress, interactions, conceptMastery } = useStudentDetail(estudianteId, courseId);

  // Racha GLOBAL (todos los cursos): el mismo número en cualquier curso, no por curso.
  const { data: rachaGlobal } = useStudentStreak(estudianteId);

  // Navegación a la pestaña Recursos (preservando el curso seleccionado en la URL).
  const [searchParams, setSearchParams] = useSearchParams();
  const irARecursos = () => {
    const next = new URLSearchParams(searchParams);
    next.set('nav', 'recursos');
    setSearchParams(next);
  };

  // Mientras no haya curso o sigan cargando los conceptos → skeleton.
  const isLoading = !courseId || conceptMastery.isLoading;
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-2/3 rounded-[12px] bg-muted/50" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-[12px] bg-muted/50" />
          <div className="h-40 rounded-[12px] bg-muted/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 rounded-[12px] bg-muted/50" />
          <div className="h-24 rounded-[12px] bg-muted/50" />
          <div className="h-24 rounded-[12px] bg-muted/50" />
        </div>
        <div className="h-72 rounded-[12px] bg-muted/50" />
      </div>
    );
  }

  const cm: ConceptMasteryItem[] = enabled ? (conceptMastery.data ?? []) : [];

  // Estado vacío amable: el alumno aún no tiene seguimiento real en este curso.
  if (cm.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">¡Hola!</h2>
        {courseName && (
          <p className="text-sm text-muted-foreground">
            Estás en <strong>{courseName}</strong>.
          </p>
        )}
        <Card>
          <CardContent className="pt-10 pb-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="rounded-full bg-primary/10 text-primary p-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-base font-medium">Todavía no tenemos datos tuyos por aquí</p>
              <p className="text-sm text-muted-foreground max-w-md">
                En cuanto empieces a resolver actividades del curso, verás tu dominio por sección,
                qué reforzar y tus interacciones. ¡Anímate a comenzar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dominio promedio: puntaje real si existe, si no promedio del radar.
  const avgFromConcepts = Math.round(cm.reduce((acc, c) => acc + c.dominio, 0) / cm.length);
  const avgMastery = progress.data?.puntajePromedio ?? avgFromConcepts;

  const weak = cm.filter((c) => c.dominio < 60).sort((a, b) => a.dominio - b.dominio);
  const porReforzar = weak.length;
  const totalInteractions = interactions.data?.length ?? 0;

  const radarData = cm.map((c) => ({ subject: c.concepto, value: c.dominio, fullMark: 100 }));
  const proximas = (weak.length > 0 ? weak : [...cm].sort((a, b) => a.dominio - b.dominio)).slice(0, 2);

  const racha = rachaGlobal ?? 0;
  const ruta = calcularRuta(cm);

  return (
    <div className="space-y-6">
      {/* 1 · Saludo + contexto */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">¡Hola!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {courseName ? (
            <>Este es tu resumen de hoy en <strong className="text-foreground">{courseName}</strong>. Sigue así.</>
          ) : (
            <>Este es tu resumen de hoy. Sigue así.</>
          )}
        </p>
      </div>

      {/* 2 · Foco: progreso (hero) + acción "lo próximo" */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tu progreso — anillo de dominio + ruta de aprendizaje */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Tu progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <ProgressRing value={avgMastery} />
                <BarraRuta completados={ruta.completados} total={ruta.total} />
              </div>
            </CardContent>
          </Card>

          {/* Lo próximo para ti — acción primaria */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Lo próximo para ti
              </CardTitle>
              <CardDescription>
                {porReforzar > 0
                  ? 'Tu mejor oportunidad de mejora ahora mismo.'
                  : 'Mantén el ritmo y refuerza con retos avanzados.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {proximas.map((c, i) => (
                <button
                  key={c.concepto}
                  type="button"
                  onClick={irARecursos}
                  aria-label={`Ir a Recursos para reforzar ${c.concepto}, dominio ${c.dominio} por ciento`}
                  className="w-full text-left p-3 bg-muted/40 rounded-[12px] border border-transparent transition-colors hover:border-primary/40 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-medium truncate">
                      {i + 1}. {c.concepto}
                    </p>
                    <span className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          c.dominio < 60 ? 'text-warning' : 'text-success'
                        }`}
                      >
                        {c.dominio}%
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.dominio < 40
                      ? 'Conviene empezar por aquí: un repaso te dará un gran salto.'
                      : c.dominio < 60
                        ? 'Estás cerca: con un repaso más lo dominas.'
                        : '¡Buen nivel! Refuérzalo para que quede sólido.'}
                  </p>
                </button>
              ))}

              <button
                type="button"
                onClick={irARecursos}
                className="w-full flex items-center justify-center gap-2 pt-1 text-sm text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Practicar en Recursos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* 3 · Métricas reales (cards) */}
      <Reveal delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RachaCard racha={racha} />
          <KpiCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Por reforzar"
            value={porReforzar}
            hint={
              porReforzar === 0
                ? 'Nada pendiente, ¡genial!'
                : `Sección${porReforzar === 1 ? '' : 'es'} para repasar`
            }
            accent={porReforzar === 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
          />
          <KpiCard
            icon={<Activity className="w-5 h-5" />}
            label="Interacciones"
            value={totalInteractions}
            hint="Tu actividad en el curso"
            accent="bg-primary/10 text-primary"
          />
        </div>
      </Reveal>

      {/* 4 · Detalle: radar de dominio por sección (ancho completo) */}
      <Reveal delay={160}>
        <DomainRadar
          key={`radar-hoy-${radarData.length}`}
          data={radarData}
          title="Tu dominio por sección"
        />
      </Reveal>
    </div>
  );
}
