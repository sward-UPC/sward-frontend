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
  onClose: () => void;
  /** Contenido fijo al pie (ej: racha del estudiante) */
  footer?: ReactNode;
  /** Footer simplificado cuando el sidebar está colapsado en desktop */
  footerCollapsed?: ReactNode;
}

function NavList({
  nav,
  activeId,
  showLabels,
  onNavigate,
}: {
  nav: SidebarNavItem[];
  activeId: string;
  showLabels: boolean;
  onNavigate: (id: string) => void;
}) {
  return (
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
          {showLabels ? (
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
              {item.badge !== undefined && (
                <span className="ml-1 text-destructive font-bold">({item.badge})</span>
              )}
            </div>
          )}
        </button>
      ))}
    </nav>
  );
}

export function Sidebar({ nav, activeId, open, onNavigate, onClose, footer, footerCollapsed }: SidebarProps) {
  const handleNavigate = (id: string) => {
    onNavigate(id);
    onClose(); // cierra el drawer en móvil tras navegar
  };

  return (
    <>
      {/* ── MÓVIL: drawer con overlay ── */}
      <div className="md:hidden">
        {/* Backdrop (scrim): cubre todo y cierra al tocar. Solo capturable cuando abre. */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer: por encima del topbar (z-50) para que no quede tapado. */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 max-w-[80vw] z-50 bg-card border-r flex flex-col transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <NavList nav={nav} activeId={activeId} showLabels onNavigate={handleNavigate} />
          {footer && <div className="border-t shrink-0">{footer}</div>}
        </aside>
      </div>

      {/* ── DESKTOP: sidebar en flujo flex ── */}
      <aside
        className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 h-full ${
          open ? 'w-52' : 'w-14'
        }`}
      >
        <NavList nav={nav} activeId={activeId} showLabels={open} onNavigate={onNavigate} />
        {(footer || footerCollapsed) && (
          <div className="border-t shrink-0">
            {open ? footer : footerCollapsed}
          </div>
        )}
      </aside>
    </>
  );
}
