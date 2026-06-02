import { AttentionHeatmap } from '../components/xai/AttentionHeatmap';
import { XAIExplanation } from '../components/xai/XAIExplanation';
import { DomainRadar } from '../components/xai/DomainRadar';
import { ResourcesTab } from '../components/resources/ResourcesTab';
import { ResourceViewer } from '../components/resources/ResourceViewer';
import { ProfileDialog } from '../components/ui/ProfileDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PlayCircle, AlertTriangle, Info, BookOpen, Video, FileText, Clock, CheckCircle, Star, Target } from 'lucide-react';

import { StudentTopbar } from './student/components/StudentTopbar';
import { StudentSidebar } from './student/components/StudentSidebar';
import { StudentHoyTab } from './student/components/StudentHoyTab';
import { StudentProgresoTab } from './student/components/StudentProgresoTab';
import { useStudentDashboard } from './student/useStudentDashboard';

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

interface StudentDashboardProps { onLogout: () => void; }

function getResourceIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="w-3.5 h-3.5" />;
    case 'exercise': return <BookOpen className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const dash = useStudentDashboard();
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
        onLogout={onLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar
          activeNav={dash.activeNav}
          sidebarOpen={dash.sidebarOpen}
          streak={dash.streak}
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
              <div className="space-y-4">
                <XAIExplanation analysis={mockXAIAnalysis} />
                <DomainRadar data={mockDomainData} title="Vista Rápida de Dominio" />

                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 text-primary">✦</span> Recursos recomendados por SAKT
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {mockSideRecommendations.map((r) => {
                      const isCompleted = dash.completedResources.includes(r.id);
                      return (
                        <Card
                          key={r.id}
                          className={`transition-all ${isCompleted ? 'opacity-60 border-success/40 bg-success/5' : 'hover:border-primary/40 cursor-pointer'}`}
                          onClick={() => !isCompleted && dash.setSelectedSideResource(r.id)}
                        >
                          <CardContent className="pt-4 pb-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`p-1.5 rounded-lg ${r.type === 'video' ? 'bg-blue-500/10 text-blue-500' : r.type === 'exercise' ? 'bg-orange-500/10 text-orange-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                {getResourceIcon(r.type)}
                              </span>
                              <Badge variant="outline" className="text-xs">{r.concept}</Badge>
                            </div>
                            <p className="text-sm font-medium leading-tight">{r.title}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>
                              <span className="text-success font-medium">+{r.improvement}%</span>
                            </div>
                            {isCompleted
                              ? <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completado</p>
                              : <Button size="sm" className="w-full text-xs gap-1"><PlayCircle className="w-3.5 h-3.5" />Comenzar</Button>
                            }
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════ MAPA DE ATENCIÓN ════ */}
            {dash.activeNav === 'atencion' && (
              <div className="space-y-4">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">¿Qué muestra este mapa?</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Cada burbuja representa tu nivel de atención en un concepto a lo largo de las sesiones. Las burbujas más grandes y oscuras indican mayor atención. Los conceptos con burbujas pequeñas o claras son donde tu enfoque cayó — y donde el sistema prioriza recursos para ti.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <AttentionHeatmap
                  interactions={mockInteractions}
                  currentPrediction="Es probable que tengas dificultades con el próximo ejercicio de Redes Neuronales (probabilidad de éxito: 48%). Se recomienda revisar los fundamentos antes de continuar."
                />

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Conceptos con atención baja — acción recomendada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { concept: 'Redes Neuronales', attention: 38, resource: mockSideRecommendations[1], sessions: 'últimas 3 sesiones' },
                      { concept: 'Deep Learning', attention: 65, resource: mockSideRecommendations[1], sessions: 'última sesión' },
                    ].map((item) => (
                      <div key={item.concept} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-[10px] gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.concept}</p>
                            <p className="text-xs text-muted-foreground">Atención: {item.attention}% · Bajó en {item.sessions}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 gap-1.5 text-xs"
                          onClick={() => dash.setSelectedSideResource(item.resource.id)}>
                          <PlayCircle className="w-3.5 h-3.5" /> Ver recurso
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
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
