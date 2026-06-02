import { ResourcesTab } from '../components/resources/ResourcesTab';
import { ResourceViewer } from '../components/resources/ResourceViewer';
import { ProfileDialog } from '../components/ui/ProfileDialog';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Star, Target } from 'lucide-react';

import { StudentTopbar } from './student/components/StudentTopbar';
import { StudentSidebar } from './student/components/StudentSidebar';
import { StudentHoyTab } from './student/components/StudentHoyTab';
import { StudentProgresoTab } from './student/components/StudentProgresoTab';
import { StudentAprendizajeTab } from './student/components/StudentAprendizajeTab';
import { StudentAtencionTab } from './student/components/StudentAtencionTab';
import { useStudentDashboard } from './student/useStudentDashboard';
import { useLogout } from '../../core/auth/useLogout';

import {
  mockInteractions,
  mockHistoricalData,
  mockCurrentConcepts,
  mockDomainData,
  mockSideRecommendations,
  mockUser,
  mockXAIAnalysis,
  mockLearningPath,
} from '@mocks/data/student.mock';

function getResourceIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="w-3.5 h-3.5" />;
    case 'exercise': return <BookOpen className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

export function StudentDashboard() {
  const dash = useStudentDashboard();
  const logout = useLogout();
  const currentSideResource = mockSideRecommendations.find((r) => r.id === dash.selectedSideResource);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">

      <StudentTopbar
        user={mockUser}
        streak={dash.streak}
        darkMode={dash.darkMode}
        sidebarOpen={dash.sidebarOpen}
        learningPath={mockLearningPath}
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
          onNavChange={dash.setActiveNav}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 space-y-4">

            {/* ════ INICIO ════ */}
            {dash.activeNav === 'hoy' && (
              <StudentHoyTab
                userName={mockUser.name.split(' ')[0]}
                streak={dash.streak}
                completedCount={dash.completedCount}
                totalResources={dash.totalResources}
                currentConcepts={mockCurrentConcepts}
                topRecommendation={mockSideRecommendations[0]}
                learningPath={mockLearningPath}
                onSelectResource={dash.setSelectedSideResource}
                onNavChange={dash.setActiveNav}
              />
            )}

            {/* ════ MI APRENDIZAJE ════ */}
            {dash.activeNav === 'aprendizaje' && (
              <StudentAprendizajeTab
                xaiAnalysis={mockXAIAnalysis}
                domainData={mockDomainData}
                recommendations={mockSideRecommendations}
                completedResources={dash.completedResources}
                onSelectResource={dash.setSelectedSideResource}
              />
            )}

            {/* ════ MAPA DE ATENCIÓN ════ */}
            {dash.activeNav === 'atencion' && (
              <StudentAtencionTab
                interactions={mockInteractions}
                recommendations={mockSideRecommendations}
                onSelectResource={dash.setSelectedSideResource}
              />
            )}

            {/* ════ PROGRESO ════ */}
            {dash.activeNav === 'progreso' && (
              <StudentProgresoTab
                completedCount={dash.completedCount}
                totalResources={dash.totalResources}
                historicalData={mockHistoricalData}
                currentConcepts={mockCurrentConcepts}
                domainData={mockDomainData}
              />
            )}

            {/* ════ RECURSOS ════ */}
            {dash.activeNav === 'recursos' && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Tu ruta de aprendizaje</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 de 5 etapas completadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mockLearningPath.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex flex-col items-center gap-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                              step.done ? 'bg-success text-white' : step.current ? 'bg-primary text-white ring-2 ring-primary/30' : 'bg-muted text-muted-foreground'
                            }`}>
                              {step.done ? <CheckCircle className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`text-[9px] text-center leading-tight truncate w-14 ${step.current ? 'text-primary font-semibold' : step.done ? 'text-success' : 'text-muted-foreground'}`}>
                              {step.label}
                            </span>
                          </div>
                          {i < mockLearningPath.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded-full -mt-4 ${step.done ? 'bg-success' : 'bg-muted'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-warning" />
                      Completa <strong className="text-foreground">Redes Neuronales</strong> para desbloquear la siguiente etapa
                    </p>
                  </CardContent>
                </Card>

                <ResourcesTab completedResources={dash.completedResources} onCompleteResource={dash.handleCompleteFromTab} />
              </div>
            )}

          </div>
        </main>
      </div>

      {dash.selectedSideResource && currentSideResource && (
        <ResourceViewer
          resource={currentSideResource}
          onComplete={dash.handleCompleteSideResource}
          onClose={() => dash.setSelectedSideResource(null)}
        />
      )}

      <ProfileDialog
        open={dash.showProfileDialog}
        onClose={() => dash.setShowProfileDialog(false)}
        user={mockUser}
        initialTab={dash.profileDialogTab}
      />
    </div>
  );
}
