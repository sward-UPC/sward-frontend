import { ProfileDialog } from "../components/ui/ProfileDialog";
import { mockAdmin } from "../../mocks/data/admin.mock";
import {
  useAdminDashboard, AdminTopbar, AdminSidebar,
  UsersTable, ResumenTab, CursosTab, SistemaTab, LogsTab,
} from "./admin";
import { useLogout } from "../../core/auth/useLogout";

export function AdminDashboard() {
  const dash = useAdminDashboard();
  const logout = useLogout();

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <AdminTopbar
        notifs={dash.notifs}
        unread={dash.unread}
        showNotifPopup={dash.showNotifPopup}
        showProfilePopup={dash.showProfilePopup}
        darkMode={dash.darkMode}
        notifRef={dash.notifRef}
        profileRef={dash.profileRef}
        sidebarOpen={dash.sidebarOpen}
        onToggleSidebar={() => dash.setSidebarOpen((p) => !p)}
        onToggleDark={() => dash.setDarkMode(!dash.darkMode)}
        onToggleNotif={() => { dash.setShowNotifPopup(!dash.showNotifPopup); dash.setShowProfilePopup(false); }}
        onToggleProfile={() => { dash.setShowProfilePopup(!dash.showProfilePopup); dash.setShowNotifPopup(false); }}
        onMarkAllRead={() => dash.setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
        onDismissNotif={(id) => dash.setNotifs((p) => p.filter((x) => x.id !== id))}
        onOpenProfile={dash.openProfile}
        onLogout={logout}
      />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          activeTab={dash.activeTab}
          sidebarOpen={dash.sidebarOpen}
          onTabChange={dash.setActiveTab}
          onClose={() => dash.setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 space-y-4">
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
            {dash.activeTab === "cursos"  && <CursosTab />}
            {dash.activeTab === "sistema" && (
              <SistemaTab
                modelRetrain={dash.modelRetrain}
                retrainDone={dash.retrainDone}
                onRetrain={dash.handleRetrain}
              />
            )}
            {dash.activeTab === "logs" && <LogsTab />}
          </div>
        </main>
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
