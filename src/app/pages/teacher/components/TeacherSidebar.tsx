import { LayoutDashboard, Users, BarChart2, FileText } from 'lucide-react';
import { Sidebar } from '@shared/components/layout/Sidebar';
import type { TeacherTab } from '@core/types';

interface TeacherSidebarProps {
  activeTab: TeacherTab;
  sidebarOpen: boolean;
  highRiskCount: number;
  onTabChange: (tab: TeacherTab) => void;
  onClose: () => void;
}

export function TeacherSidebar({ activeTab, sidebarOpen, highRiskCount, onTabChange, onClose }: TeacherSidebarProps) {
  const nav = [
    { id: 'resumen',     label: 'Resumen',    icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'estudiantes', label: 'Estudiantes', icon: <Users className="w-4 h-4" />, badge: highRiskCount > 0 ? highRiskCount : undefined },
    { id: 'analisis',    label: 'Análisis',    icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'reportes',    label: 'Reportes',    icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <Sidebar
      nav={nav}
      activeId={activeTab}
      open={sidebarOpen}
      onNavigate={(id) => onTabChange(id as TeacherTab)}
      onClose={onClose}
    />
  );
}
