import { LayoutDashboard, Users, BookOpen, Server, Activity } from "lucide-react";
import { ProfileDialog } from "../components/ui/ProfileDialog";
import { mockAdmin } from "../../mocks/data/admin.mock";
import {
  useAdminDashboard, AdminTopbar, UsersTable,
  ResumenTab, CursosTab, SistemaTab, LogsTab,
} from "./admin";
import type { AdminTab } from "../../core/types/admin.types";

interface AdminDashboardProps { onLogout: () => void; }

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "resumen", label: "Resumen", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "usuarios", label: "Usuarios", icon: <Users className="w-4 h-4" /> },
  { id: "cursos", label: "Cursos", icon: <BookOpen className="w-4 h-4" /> },
  { id: "sistema", label: "Sistema", icon: <Server className="w-4 h-4" /> },
  { id: "logs", label: "Logs", icon: <Activity className="w-4 h-4" /> },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const dash = useAdminDashboard();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <AdminTopbar
        activeTab={dash.activeTab}
        tabs={TABS}
        notifs={dash.notifs}
        unread={dash.unread}
        showNotifPopup={dash.showNotifPopup}
        showProfilePopup={dash.showProfilePopup}
        darkMode={dash.darkMode}
        notifRef={dash.notifRef}
        profileRef={dash.profileRef}
        onTabChange={dash.setActiveTab}
        onToggleDark={() => dash.setDarkMode(!dash.darkMode)}
        onToggleNotif={() => { dash.setShowNotifPopup(!dash.showNotifPopup); dash.setShowProfilePopup(false); }}
        onToggleProfile={() => { dash.setShowProfilePopup(!dash.showProfilePopup); dash.setShowNotifPopup(false); }}
        onMarkAllRead={() => dash.setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
        onDismissNotif={(id) => dash.setNotifs((p) => p.filter((x) => x.id !== id))}
        onOpenProfile={dash.openProfile}
        onLogout={onLogout}
      />

      <div className="flex-1 container mx-auto p-4 space-y-4 max-w-7xl">
        {dash.activeTab === "resumen" && (
          <ResumenTab onViewLogs={() => dash.setActiveTab("logs")} />
        )}
        {dash.activeTab === "usuarios" && (
          <UsersTable
            users={dash.filteredUsers}
            userSearch={dash.userSearch}
            roleFilter={dash.roleFilter}
            statusFilter={dash.statusFilter}
            onSearchChange={dash.setUserSearch}
            onRoleFilterChange={dash.setRoleFilter}
            onStatusFilterChange={dash.setStatusFilter}
            onToggleStatus={dash.toggleUserStatus}
          />
        )}
        {dash.activeTab === "cursos" && <CursosTab />}
        {dash.activeTab === "sistema" && (
          <SistemaTab
            modelRetrain={dash.modelRetrain}
            retrainDone={dash.retrainDone}
            onRetrain={dash.handleRetrain}
          />
        )}
        {dash.activeTab === "logs" && <LogsTab />}
      </div>

      <ProfileDialog
        open={dash.showProfileDialog}
        onClose={() => dash.setShowProfileDialog(false)}
        user={{
          name: mockAdmin.name,
          email: mockAdmin.email,
          role: mockAdmin.role,
          institution: mockAdmin.institution,
          avatar: mockAdmin.avatar,
          memberSince: "Enero 2025",
          bio: "Administrador de la plataforma SWARD.",
        }}
        initialTab={dash.profileDialogTab}
      />
    </div>
  );
}
