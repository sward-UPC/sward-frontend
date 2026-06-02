import { useRef } from "react";
import { Button } from "../../../components/ui/button";
import {
  LogOut, Bell, X, Info, AlertTriangle, Settings,
  ChevronRight, Moon, Sun, User, XCircle,
} from "lucide-react";
import type { AdminTab, AdminNotification } from "../../../../core/types/admin.types";
import { mockAdmin } from "../../../../mocks/data/admin.mock";

interface AdminTopbarProps {
  activeTab: AdminTab;
  tabs: { id: AdminTab; label: string; icon: React.ReactNode }[];
  notifs: AdminNotification[];
  unread: number;
  showNotifPopup: boolean;
  showProfilePopup: boolean;
  darkMode: boolean;
  notifRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  onTabChange: (tab: AdminTab) => void;
  onToggleDark: () => void;
  onToggleNotif: () => void;
  onToggleProfile: () => void;
  onMarkAllRead: () => void;
  onDismissNotif: (id: number) => void;
  onOpenProfile: (tab: "profile" | "settings") => void;
  onLogout: () => void;
}

function getNotifIcon(type: string) {
  switch (type) {
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
    case "error": return <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
  }
}

export function AdminTopbar({
  activeTab,
  tabs,
  notifs,
  unread,
  showNotifPopup,
  showProfilePopup,
  darkMode,
  notifRef,
  profileRef,
  onTabChange,
  onToggleDark,
  onToggleNotif,
  onToggleProfile,
  onMarkAllRead,
  onDismissNotif,
  onOpenProfile,
  onLogout,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold">SWARD</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Administración</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onToggleDark}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button variant="ghost" size="icon" onClick={onToggleNotif}>
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
              )}
            </Button>
            {showNotifPopup && (
              <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-semibold text-sm">Notificaciones</span>
                  {unread > 0 && (
                    <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline">
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.read ? "bg-primary/5" : ""}`}>
                      <div className="flex items-start gap-2">
                        {getNotifIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                        </div>
                        <button onClick={() => onDismissNotif(n.id)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
              >
                A
              </div>
              <span className="text-sm font-medium hidden md:block">Admin</span>
            </button>
            {showProfilePopup && (
              <div className="absolute right-0 top-11 w-60 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b bg-warning/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
                    >
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{mockAdmin.name}</p>
                      <p className="text-xs text-muted-foreground">{mockAdmin.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button onClick={() => onOpenProfile("profile")} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />Mi Perfil</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => onOpenProfile("settings")} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2"><Settings className="w-4 h-4 text-muted-foreground" />Configuración</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="border-t mt-1 pt-1">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
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
      <div className="container mx-auto px-4 border-t">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-warning text-warning font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
