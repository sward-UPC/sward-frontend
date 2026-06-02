import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuth } from '@core/auth/useAuth';
import { UserRole } from '@core/types';
import {
  LayoutDashboard, Brain, BarChart2, Library, Sparkles,
  Users, FileText, Shield, LogOut, Moon, Sun, Menu, ChevronLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: 'Inicio', to: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Mi Aprendizaje', to: '/student/learning', icon: <Brain className="w-4 h-4" /> },
  { label: 'Mapa de Atención', to: '/student/attention', icon: <Sparkles className="w-4 h-4" /> },
  { label: 'Progreso', to: '/student/progress', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Recursos', to: '/student/resources', icon: <Library className="w-4 h-4" /> },
];

const teacherNav: NavItem[] = [
  { label: 'Resumen', to: '/teacher', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Estudiantes', to: '/teacher/students', icon: <Users className="w-4 h-4" /> },
  { label: 'Análisis', to: '/teacher/analysis', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Reportes', to: '/teacher/reports', icon: <FileText className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Panel', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Usuarios', to: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Sistema', to: '/admin/system', icon: <Shield className="w-4 h-4" /> },
];

function getNavItems(role: UserRole | null): NavItem[] {
  switch (role) {
    case UserRole.Teacher: return teacherNav;
    case UserRole.Admin: return adminNav;
    default: return studentNav;
  }
}

/** Layout autenticado con sidebar colapsable, topbar con perfil y theme toggle. */
export function AppLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const navItems = getNavItems(role);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-white">S</span>
              </div>
              <span className="font-semibold text-sm hidden sm:block">SWARD</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {user?.firstName?.[0] ?? 'U'}
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.firstName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 ${
            sidebarOpen ? 'w-52' : 'w-14'
          }`}
        >
          <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student' || item.to === '/teacher' || item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left w-full ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
