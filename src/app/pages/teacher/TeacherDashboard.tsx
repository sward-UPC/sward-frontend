import { StudentDetailView } from '../../components/teacher/StudentDetailView';
import { FeedbackDialog } from '../../components/teacher/FeedbackDialog';
import { ProfileDialog } from '../../components/ui/ProfileDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import { ChevronLeft, ChevronRight, FileText, BarChart2, Users, BookOpen, Clock, Download } from 'lucide-react';
import { useTeacherDashboard } from './useTeacherDashboard';
import { useLogout } from '../../../core/auth/useLogout';
import { TeacherTopbar } from './components/TeacherTopbar';
import { TeacherSidebar } from './components/TeacherSidebar';
import { TeacherMetricsCards } from './components/TeacherMetricsCards';
import { AlertsPanel } from './components/AlertsPanel';
import { StudentRiskTable } from './components/StudentRiskTable';


function getRiskColor(level: string) {
  switch (level) {
    case 'high': return 'bg-destructive';
    case 'medium': return 'bg-warning';
    case 'low': return 'bg-success';
    default: return 'bg-muted';
  }
}

function getMasteryColor(v: number) {
  return v >= 80 ? 'text-success' : v >= 60 ? 'text-warning' : 'text-destructive';
}

export function TeacherDashboard() {
  const dash = useTeacherDashboard();
  const logout = useLogout();

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <TeacherTopbar
        teacher={dash.teacher}
        notifications={dash.notifications}
        unreadCount={dash.unreadCount}
        darkMode={dash.darkMode}
        setDarkMode={dash.setDarkMode}
        showNotifPopup={dash.showNotifPopup}
        setShowNotifPopup={dash.setShowNotifPopup}
        notifRef={dash.notifRef}
        markAllRead={dash.markAllRead}
        dismissNotification={dash.dismissNotification}
        showProfilePopup={dash.showProfilePopup}
        setShowProfilePopup={dash.setShowProfilePopup}
        profileRef={dash.profileRef}
        openProfile={dash.openProfile}
        onLogout={logout}
        clearNotifications={dash.clearNotifications}
        sidebarOpen={dash.sidebarOpen}
        onToggleSidebar={() => dash.setSidebarOpen((p) => !p)}
      />

      <div className="flex flex-1 overflow-hidden">
        <TeacherSidebar
          activeTab={dash.activeTab}
          sidebarOpen={dash.sidebarOpen}
          highRiskCount={dash.highRiskCount}
          onTabChange={dash.setActiveTab}
          onClose={() => dash.setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 space-y-4">

            {/* STUDENT DETAIL VIEW */}
            {dash.selectedStudent && dash.currentStudent ? (
              <div className="space-y-4">
                <button
                  onClick={() => dash.setSelectedStudent(null)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Volver a Estudiantes
                </button>
                <StudentDetailView
                  student={dash.currentStudent}
                  onClose={() => dash.setSelectedStudent(null)}
                  onSendFeedback={() =>
                    dash.setFeedbackStudent({ id: dash.currentStudent!.id, name: dash.currentStudent!.name })
                  }
                />
              </div>
            ) : (
              <>
                {/* TAB: RESUMEN */}
                {dash.activeTab === 'resumen' && (
                  <div className="space-y-4">
                    <TeacherMetricsCards
                      highRiskCount={dash.highRiskCount}
                      mediumRiskCount={dash.mediumRiskCount}
                      lowRiskCount={dash.lowRiskCount}
                      avgMastery={dash.avgMastery}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Tendencia de Dominio Grupal</CardTitle>
                          <CardDescription className="text-xs">Promedio semanal del grupo</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={dash.trendData}>
                              <defs>
                                <linearGradient id="gProm" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <YAxis domain={[55, 75]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                              <Area type="monotone" dataKey="promedio" stroke="#6366f1" fill="url(#gProm)" strokeWidth={2} name="Dominio %" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Engagement vs Dominio</CardTitle>
                          <CardDescription className="text-xs">Por estudiante</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={dash.engagementData} barSize={14}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                              <Legend wrapperStyle={{ fontSize: 11 }} />
                              <Bar dataKey="engagement" fill="#6366f1" name="Engagement" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="dominio" fill="#10b981" name="Dominio" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <AlertsPanel
                      highRiskStudents={dash.students.filter((s) => s.riskLevel === 'high')}
                      onViewStudent={(id) => { dash.setActiveTab('estudiantes'); dash.setSelectedStudent(id); }}
                      onFeedback={dash.setFeedbackStudent}
                    />

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Vista Rápida — Todos los Estudiantes</CardTitle>
                          <button onClick={() => dash.setActiveTab('estudiantes')} className="text-xs text-primary hover:underline flex items-center gap-1">
                            Ver tabla completa <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {dash.students.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => dash.setSelectedStudent(s.id)}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getRiskColor(s.riskLevel)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{s.name}</p>
                              <p className="text-xs text-muted-foreground">{s.lastActivity}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`text-sm font-semibold ${getMasteryColor(s.avgMastery)}`}>{s.avgMastery}%</span>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* TAB: ESTUDIANTES */}
                {dash.activeTab === 'estudiantes' && (
                  <StudentRiskTable
                    sortedStudents={dash.sortedStudents}
                    courseFilter={dash.courseFilter}
                    setCourseFilter={dash.setCourseFilter}
                    weekFilter={dash.weekFilter}
                    setWeekFilter={dash.setWeekFilter}
                    riskFilter={dash.riskFilter}
                    setRiskFilter={dash.setRiskFilter}
                    onViewStudent={dash.setSelectedStudent}
                    onFeedback={dash.setFeedbackStudent}
                  />
                )}

                {/* TAB: ANÁLISIS */}
                {dash.activeTab === 'analisis' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Evolución del Dominio Grupal</CardTitle>
                          <CardDescription className="text-xs">Semanas 1–4</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={dash.trendData}>
                              <defs>
                                <linearGradient id="gProm2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <YAxis domain={[55, 75]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                              <Area type="monotone" dataKey="promedio" stroke="#6366f1" fill="url(#gProm2)" strokeWidth={2} name="Dominio %" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Estudiantes en Riesgo Alto por Semana</CardTitle>
                          <CardDescription className="text-xs">Evolución semanal</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={dash.trendData} barSize={32}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                              <Bar dataKey="riesgoAlto" fill="#ef4444" name="En riesgo alto" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Engagement vs Dominio — Vista Comparativa</CardTitle>
                        <CardDescription className="text-xs">Todos los estudiantes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={dash.engagementData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="engagement" fill="#6366f1" name="Engagement %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="dominio" fill="#10b981" name="Dominio %" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* TAB: REPORTES */}
                {dash.activeTab === 'reportes' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: <FileText className="w-6 h-6 text-primary" />, title: 'Reporte Semanal Completo', desc: 'Progreso individual y grupal de las últimas 4 semanas.', badge: 'PDF', badgeColor: 'bg-red-500' },
                        { icon: <BarChart2 className="w-6 h-6 text-success" />, title: 'Análisis de Riesgo', desc: 'Detalle de estudiantes en riesgo con recomendaciones de intervención.', badge: 'Excel', badgeColor: 'bg-green-600' },
                        { icon: <Users className="w-6 h-6 text-warning" />, title: 'Registro de Engagement', desc: 'Historial de actividad y tiempos de sesión por estudiante.', badge: 'CSV', badgeColor: 'bg-blue-500' },
                        { icon: <BookOpen className="w-6 h-6 text-purple-500" />, title: 'Mapa de Conocimiento', desc: 'Estado de dominio por concepto para todo el grupo.', badge: 'PDF', badgeColor: 'bg-red-500' },
                      ].map((r) => (
                        <Card
                          key={r.title}
                          className="hover:border-primary/40 transition-colors cursor-pointer group"
                          onClick={() => alert(`Generando: ${r.title}...`)}
                        >
                          <CardContent className="pt-5 pb-5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-[12px] bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                {r.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">{r.title}</p>
                                  <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${r.badgeColor}`}>{r.badge}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                              </div>
                              <Download className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" /> Historial de Reportes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          { name: 'Reporte Semana 3 — Completo', date: '28 May 2026', size: '2.4 MB' },
                          { name: 'Análisis de Riesgo — Semana 3', date: '28 May 2026', size: '1.1 MB' },
                          { name: 'Reporte Semana 2 — Completo', date: '21 May 2026', size: '2.2 MB' },
                          { name: 'Registro de Engagement — Mayo', date: '18 May 2026', size: '0.8 MB' },
                        ].map((r) => (
                          <div key={r.name} className="flex items-center justify-between p-3 rounded-[10px] hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                              <div>
                                <p className="text-sm font-medium">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      {dash.feedbackStudent && (
        <FeedbackDialog
          studentName={dash.feedbackStudent.name}
          open={true}
          onClose={() => dash.setFeedbackStudent(null)}
        />
      )}
      <ProfileDialog
        open={dash.showProfileDialog}
        onClose={() => dash.setShowProfileDialog(false)}
        user={{
          name: dash.teacher.name,
          email: dash.teacher.email,
          role: dash.teacher.role,
          institution: dash.teacher.department,
          avatar: dash.teacher.avatar,
          memberSince: 'Marzo 2025',
          bio: `Docente del área de ${dash.teacher.department}. Cursos: ${dash.teacher.courses}.`,
        }}
        initialTab={dash.profileDialogTab}
      />
    </div>
  );
}
