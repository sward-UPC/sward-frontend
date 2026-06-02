import type { ReactNode } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface SidebarProps {
  nav: SidebarNavItem[];
  activeId: string;
  open: boolean;
  onNavigate: (id: string) => void;
  /** Contenido fijo al pie (ej: racha del estudiante) */
  footer?: ReactNode;
}

export function Sidebar({ nav, activeId, open, onNavigate, footer }: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 h-full ${
        open ? 'w-52' : 'w-14'
      }`}
    >
      <nav className="flex flex-col gap-1 p-2 flex-1 pt-3 overflow-hidden">
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left w-full group relative ${
              activeId === item.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {open ? (
              <>
                <span className="text-sm truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            ) : (
              <div className="absolute left-14 bg-card border border-border rounded-[8px] px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-md z-50 transition-opacity">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {footer && <div className="border-t shrink-0">{footer}</div>}
    </aside>
  );
}
