import { BookOpen } from 'lucide-react';
import { ProfileDialog } from '../components/ui/ProfileDialog';
import { StudentTopbar } from './student/components/StudentTopbar';
import { StudentSidebar } from './student/components/StudentSidebar';
import { StudentHoyTab } from './student/components/StudentHoyTab';
import { StudentProgresoTab } from './student/components/StudentProgresoTab';
import { StudentAprendizajeTab } from './student/components/StudentAprendizajeTab';
import { StudentAtencionTab } from './student/components/StudentAtencionTab';
import { StudentRecursosTab } from './student/components/StudentRecursosTab';
import { useStudentDashboard } from './student/useStudentDashboard';
import { useStudentContext } from '@features/student/useStudentContext';
import { useAuth } from '@core/auth/useAuth';
import { useLogout } from '../../core/auth/useLogout';

export function StudentDashboard() {
  const dash = useStudentDashboard();
  const ctx = useStudentContext();
  const { user } = useAuth();
  const logout = useLogout();

  // Perfil del estudiante construido desde la sesión real (no mock).
  const studentUser = {
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Estudiante',
    email: user?.email ?? '',
    role: 'Estudiante',
    institution: user?.institution ?? '',
    avatar: (user?.firstName?.[0] ?? user?.email?.[0] ?? 'E').toUpperCase(),
    memberSince: '',
  };

  // Props reales que recibe cada tab (su propio id + curso activo).
  const tabProps = {
    estudianteId: ctx.estudianteId,
    courseId: ctx.courseId,
    moodleCourseId: ctx.moodleCourseId,
    courseName: ctx.courseName,
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <StudentTopbar
        user={studentUser}
        streak={dash.streak}
        darkMode={dash.darkMode}
        sidebarOpen={dash.sidebarOpen}
        learningPath={[]}
        notifications={dash.notifications}
        unreadCount={dash.unreadCount}
        showNotifPopup={dash.showNotifPopup}
        showProfilePopup={dash.showProfilePopup}
        notifRef={dash.notifRef}
        profileRef={dash.profileRef}
        onToggleSidebar={() => dash.setSidebarOpen((p) => !p)}
        onToggleDarkMode={() => dash.setDarkMode(!dash.darkMode)}
        onToggleNotif={() => { dash.setShowNotifPopup(!dash.showNotifPopup); dash.setShowProfilePopup(false); }}
        onToggleProfile={() => { dash.setShowProfilePopup(!dash.showProfilePopup); dash.setShowNotifPopup(false); }}
        onMarkAllRead={dash.markAllRead}
        onDismissNotification={dash.dismissNotification}
        onClearNotifications={dash.clearNotifications}
        onOpenProfile={dash.openProfile}
        onLogout={logout}
      />

      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar
          activeNav={dash.activeNav}
          sidebarOpen={dash.sidebarOpen}
          streak={dash.streak}
          onNavChange={dash.setActiveNav}
          onClose={() => dash.setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 space-y-4">
            {/* Selector de curso (datos reales del estudiante por curso) */}
            {ctx.courses.length > 0 && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <label htmlFor="curso-est" className="text-sm text-muted-foreground">Curso:</label>
                <select
                  id="curso-est"
                  value={ctx.activeCourseId ?? ''}
                  onChange={(e) => ctx.setActiveCourseId(e.target.value)}
                  className="text-sm border border-border rounded-md bg-background px-2 py-1"
                >
                  {ctx.courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {dash.activeNav === 'hoy' && <StudentHoyTab {...tabProps} />}
            {dash.activeNav === 'aprendizaje' && <StudentAprendizajeTab {...tabProps} />}
            {dash.activeNav === 'atencion' && <StudentAtencionTab {...tabProps} />}
            {dash.activeNav === 'progreso' && <StudentProgresoTab {...tabProps} />}
            {dash.activeNav === 'recursos' && <StudentRecursosTab {...tabProps} />}
          </div>
        </main>
      </div>

      <ProfileDialog
        open={dash.showProfileDialog}
        onClose={() => dash.setShowProfileDialog(false)}
        user={studentUser}
        initialTab={dash.profileDialogTab}
      />
    </div>
  );
}
