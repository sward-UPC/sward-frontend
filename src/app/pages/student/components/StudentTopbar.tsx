import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import {
  Bell, X, CheckCircle, AlertTriangle, Info, Settings,
  ChevronRight, Moon, Sun, Flame, User, LogOut, ChevronLeft, Menu,
} from 'lucide-react';
import { useState } from 'react';
import type { StudentUser, LearningPathStep } from '@core/types';
import type { AppNotification } from '@features/notifications/notifications.service';
import { NotificationDetailDialog } from '../../../components/notifications/NotificationDetailDialog';

interface StudentTopbarProps {
  user: StudentUser;
  streak: number;
  darkMode: boolean;
  sidebarOpen: boolean;
  learningPath: LearningPathStep[];
  notifications: AppNotification[];
  unreadCount: number;
  showNotifPopup: boolean;
  showProfilePopup: boolean;
  notifRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  onToggleNotif: () => void;
  onToggleProfile: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
  onClearNotifications: () => void;
  onOpenProfile: (tab: 'profile' | 'settings') => void;
  onLogout: () => void;
}

function getNotifIcon(type: string) {
  switch (type) {
    case 'warning': return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
  }
}

export function StudentTopbar({
  user,
  streak,
  darkMode,
  sidebarOpen,
  learningPath,
  notifications,
  unreadCount,
  showNotifPopup,
  showProfilePopup,
  notifRef,
  profileRef,
  onToggleSidebar,
  onToggleDarkMode,
  onToggleNotif,
  onToggleProfile,
  onMarkAllRead,
  onMarkRead,
  onDismissNotification,
  onClearNotifications,
  onOpenProfile,
  onLogout,
}: StudentTopbarProps) {
  // Notificación abierta en el modal de lectura completa.
  const [selectedNotif, setSelectedNotif] = useState<AppNotification | null>(null);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 gap-3">

        {/* Left: logo + sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
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

        {/* Center: learning path tracker */}
        <div className="hidden md:flex items-center gap-1.5 flex-1 max-w-md mx-4">
          {learningPath.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                step.done ? 'bg-success text-white' : step.current ? 'bg-primary text-white ring-2 ring-primary/30' : 'bg-muted text-muted-foreground'
              }`}>
                {step.done ? <CheckCircle className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-[10px] truncate hidden lg:block ${step.current ? 'text-primary font-semibold' : step.done ? 'text-success' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
              {i < learningPath.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full min-w-2 ${step.done ? 'bg-success' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{streak}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button variant="ghost" size="icon" onClick={onToggleNotif}>
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
                    <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline">
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0
                    ? <div className="py-8 text-center text-sm text-muted-foreground">Sin notificaciones</div>
                    : notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-start gap-2">
                          {getNotifIcon(n.type)}
                          <button
                            type="button"
                            onClick={() => { setSelectedNotif(n); if (!n.read) onMarkRead(n.id); }}
                            className="flex-1 min-w-0 text-left"
                          >
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed whitespace-pre-line line-clamp-2">
                              {n.message}
                            </p>
                            {n.message.length > 90 && (
                              <span className="text-[11px] text-primary mt-0.5 inline-block">Ver más</span>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </button>
                          <button
                            onClick={() => onDismissNotification(n.id)}
                            aria-label="Descartar notificación"
                            className="text-muted-foreground hover:text-foreground shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t">
                    <button onClick={onClearNotifications} className="text-xs text-muted-foreground hover:text-foreground">
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
              onClick={onToggleProfile}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                style={user.avatarColor ? { background: user.avatarColor } : undefined}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.avatar
                )}
              </div>
              <span className="text-sm font-medium hidden md:block">{user.name.split(' ')[0]}</span>
            </button>
            {showProfilePopup && (
              <div className="absolute right-0 top-11 w-64 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-primary/5 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden"
                      style={user.avatarColor ? { background: user.avatarColor } : undefined}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.avatar
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progreso general</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-1.5" />
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => onOpenProfile('profile')}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />Mi Perfil</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onOpenProfile('settings')}
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

      <NotificationDetailDialog
        notification={selectedNotif}
        open={!!selectedNotif}
        onClose={() => setSelectedNotif(null)}
      />
    </header>
  );
}
