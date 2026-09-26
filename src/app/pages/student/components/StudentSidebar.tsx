import { Flame, LayoutDashboard, Brain, BarChart2, Library, Sparkles, GraduationCap } from 'lucide-react';
import { Sidebar } from '@shared/components/layout/Sidebar';
import { AULA_VIRTUAL_URL } from '@core/types';
import type { NavItem } from '@core/types';

const NAV = [
  { id: 'hoy',         label: 'Inicio',           icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'aprendizaje', label: 'Mi Aprendizaje',   icon: <Brain className="w-4 h-4" /> },
  { id: 'atencion',    label: 'Mapa de Atención', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'progreso',    label: 'Progreso',          icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'recursos',    label: 'Recursos',          icon: <Library className="w-4 h-4" /> },
];

interface StudentSidebarProps {
  activeNav: NavItem;
  sidebarOpen: boolean;
  streak: number;
  ruta: { completados: number; total: number };
  onNavChange: (nav: NavItem) => void;
  onClose: () => void;
}

export function StudentSidebar({ activeNav, sidebarOpen, streak, ruta, onNavChange, onClose }: StudentSidebarProps) {
  const rutaPct = ruta.total > 0 ? Math.round((ruta.completados / ruta.total) * 100) : 0;
  const footer = (
    <div className="p-3 space-y-2.5">
      {/* El aula virtual, siempre a la vista. Durante la fase 1 el estudiante
          resuelve los quizzes allá y en SWARD todavía no hay nada que mirar: sin
          este enlace, quien entra primero aquí se queda sin saber adónde ir. */}
      {AULA_VIRTUAL_URL && (
        <a
          href={AULA_VIRTUAL_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-xs font-medium hover:bg-muted/60 transition-colors"
        >
          <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span>Ir al aula virtual</span>
        </a>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Flame className="w-3.5 h-3.5 text-warning shrink-0" />
        <span>
          {streak} {streak === 1 ? 'día' : 'días'} de racha
        </span>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Ruta de aprendizaje</span>
          <span className="font-medium text-foreground">
            {ruta.completados}/{ruta.total}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${rutaPct}%` }} />
        </div>
      </div>
    </div>
  );

  const footerCollapsed = (
    <div className="flex flex-col items-center gap-2 py-3">
      {AULA_VIRTUAL_URL && (
        <a href={AULA_VIRTUAL_URL} target="_blank" rel="noreferrer" title="Ir al aula virtual"
           aria-label="Ir al aula virtual" className="text-primary hover:opacity-80">
          <GraduationCap className="w-4 h-4" />
        </a>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <Flame className="w-4 h-4 text-warning" />
        <span className="text-[11px] font-bold text-warning leading-none">{streak}</span>
      </div>
    </div>
  );

  return (
    <Sidebar
      nav={NAV}
      activeId={activeNav}
      open={sidebarOpen}
      onNavigate={(id) => onNavChange(id as NavItem)}
      onClose={onClose}
      footer={footer}
      footerCollapsed={footerCollapsed}
    />
  );
}
