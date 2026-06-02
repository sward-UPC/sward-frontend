import { Flame, LayoutDashboard, Brain, BarChart2, Library, Sparkles } from 'lucide-react';
import type { NavItem } from '@core/types';

interface NavItemDef {
  id: NavItem;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const NAV: NavItemDef[] = [
  { id: 'hoy', label: 'Inicio', shortLabel: 'Inicio', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'aprendizaje', label: 'Mi Aprendizaje', shortLabel: 'Aprendizaje', icon: <Brain className="w-4 h-4" /> },
  { id: 'atencion', label: 'Mapa de Atención', shortLabel: 'Atención', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'progreso', label: 'Progreso', shortLabel: 'Progreso', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'recursos', label: 'Recursos', shortLabel: 'Recursos', icon: <Library className="w-4 h-4" /> },
];

interface StudentSidebarProps {
  activeNav: NavItem;
  sidebarOpen: boolean;
  streak: number;
  onNavChange: (nav: NavItem) => void;
}

export function StudentSidebar({ activeNav, sidebarOpen, streak, onNavChange }: StudentSidebarProps) {
  return (
    <aside className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 ${sidebarOpen ? 'w-52' : 'w-14'}`}>
      <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left w-full group ${
              activeNav === item.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
            {!sidebarOpen && (
              <div className="absolute left-14 bg-card border border-border rounded-[8px] px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-md z-50 transition-opacity">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-3 border-t space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flame className="w-3.5 h-3.5 text-warning" />
            <span>{streak} días de racha</span>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Ruta de aprendizaje</span>
              <span className="font-medium text-foreground">2/5</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
