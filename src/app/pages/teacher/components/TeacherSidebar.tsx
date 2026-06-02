import { LayoutDashboard, Users, BarChart2, FileText } from 'lucide-react';
import type { TeacherTab } from '@core/types';

interface NavItemDef {
  id: TeacherTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface TeacherSidebarProps {
  activeTab: TeacherTab;
  sidebarOpen: boolean;
  highRiskCount: number;
  onTabChange: (tab: TeacherTab) => void;
}

export function TeacherSidebar({ activeTab, sidebarOpen, highRiskCount, onTabChange }: TeacherSidebarProps) {
  const NAV: NavItemDef[] = [
    { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'estudiantes', label: 'Estudiantes', icon: <Users className="w-4 h-4" />, badge: highRiskCount > 0 ? highRiskCount : undefined },
    { id: 'analisis', label: 'Análisis', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'reportes', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 ${sidebarOpen ? 'w-52' : 'w-14'}`}>
      <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left w-full group relative ${
              activeTab === item.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {sidebarOpen ? (
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
    </aside>
  );
}
