import { Button } from '../../../components/ui/button';
import {
  Bell, X, AlertTriangle, CheckCircle, Info,
  User, Settings, ChevronRight, Moon, Sun, LogOut,
  LayoutDashboard, Users, BarChart2, FileText,
} from 'lucide-react';
import type { Alert, TeacherProfile, TeacherTab } from '@core/types';

interface TeacherTopbarProps {
  teacher: TeacherProfile;
  notifications: Alert[];
  unreadCount: number;
  highRiskCount: number;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showNotifPopup: boolean;
  setShowNotifPopup: (v: boolean) => void;
  notifRef: React.RefObject<HTMLDivElement>;
  markAllRead: () => void;
  dismissNotification: (id: number) => void;
  showProfilePopup: boolean;
  setShowProfilePopup: (v: boolean) => void;
  profileRef: React.RefObject<HTMLDivElement>;
  openProfile: (tab: 'profile' | 'settings') => void;
  onLogout: () => void;
  selectedStudent: number | null;
  currentStudentName?: string;
  activeTab: TeacherTab;
  setActiveTab: (tab: TeacherTab) => void;
  clearNotifications: () => void;
}

const TABS: { id: TeacherTab; label: string; icon: React.ReactNode }[] = [
  { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'estudiantes', label: 'Estudiantes', icon: <Users className="w-4 h-4" /> },
  { id: 'analisis', label: 'Análisis', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'reportes', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
];

function getNotifIcon(type: string) {
  switch (type) {
    case 'warning': return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
  }
}

export function TeacherTopbar({
  teacher,
  notifications,
  unreadCount,
  highRiskCount,
  darkMode,
  setDarkMode,
  showNotifPopup,
  setShowNotifPopup,
  notifRef,
  markAllRead,
  dismissNotification,
  showProfilePopup,
  setShowProfilePopup,
  profileRef,
  openProfile,
  onLogout,
  selectedStudent,
  currentStudentName,
  activeTab,
  setActiveTab,
  clearNotifications,
}: TeacherTopbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo + breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-foreground">SWARD</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Docente</span>
            {selectedStudent && currentStudentName && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground truncate max-w-[140px]">{currentStudentName.split(' ')[0]}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setShowNotifPopup(!showNotifPopup); setShowProfilePopup(false); }}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            {showNotifPopup && (
              <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-semibold text-sm">Notificaciones</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">Sin notificaciones</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-start gap-2">
                          {getNotifIcon(n.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="text-muted-foreground hover:text-foreground shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t">
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Limpiar todas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfilePopup(!showProfilePopup); setShowNotifPopup(false); }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                {teacher.avatar}
              </div>
              <span className="text-sm font-medium hidden md:block">{teacher.name.split(' ')[1]}</span>
            </button>
            {showProfilePopup && (
              <div className="absolute right-0 top-11 w-64 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-primary/5 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {teacher.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => openProfile('profile')}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />Mi Perfil</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => openProfile('settings')}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2"><Settings className="w-4 h-4 text-muted-foreground" />Configuración</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="border-t mt-1 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      {!selectedStudent && (
        <div className="container mx-auto px-4 border-t">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}{tab.label}
                {tab.id === 'estudiantes' && highRiskCount > 0 && (
                  <span className="w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {highRiskCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
