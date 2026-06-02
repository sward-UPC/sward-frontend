import { LayoutDashboard, Users, BookOpen, Server, Activity } from 'lucide-react';
import { Sidebar } from '@shared/components/layout/Sidebar';
import type { AdminTab } from '@core/types/admin.types';

const NAV = [
  { id: 'resumen',  label: 'Resumen',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'usuarios', label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
  { id: 'cursos',   label: 'Cursos',   icon: <BookOpen className="w-4 h-4" /> },
  { id: 'sistema',  label: 'Sistema',  icon: <Server className="w-4 h-4" /> },
  { id: 'logs',     label: 'Logs',     icon: <Activity className="w-4 h-4" /> },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  sidebarOpen: boolean;
  onTabChange: (tab: AdminTab) => void;
  onClose: () => void;
}

export function AdminSidebar({ activeTab, sidebarOpen, onTabChange, onClose }: AdminSidebarProps) {
  return (
    <Sidebar
      nav={NAV}
      activeId={activeTab}
      open={sidebarOpen}
      onNavigate={(id) => onTabChange(id as AdminTab)}
      onClose={onClose}
    />
  );
}
