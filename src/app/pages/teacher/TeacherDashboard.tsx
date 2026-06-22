import { StudentDetailView } from '../../components/teacher/StudentDetailView';
import { FeedbackDialog } from '../../components/teacher/FeedbackDialog';
import { ProfileDialog } from '../../components/ui/ProfileDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import { ChevronLeft, ChevronRight, FileText, BarChart2, Users, BookOpen, Clock, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTeacherDashboard } from './useTeacherDashboard';
import { downloadClassReport } from '@features/teacher/services/teacher.service';
import {
  downloadRiskAnalysisCsv,
  downloadEngagementCsv,
  downloadKnowledgeMapCsv,
} from '@features/teacher/services/reports';
import { useLogout } from '../../../core/auth/useLogout';
import { useAuth } from '@core/auth/useAuth';
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

/** Estado de error: el backend no respondió. Nunca se muestra data ficticia. */
function DashboardError() {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center justify-center text-center gap-3 py-16">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <p className="font-semibold">Ocurrió un error al cargar los datos</p>
          <p className="text-sm text-muted-foreground mt-1">
            No se pudo contactar al servidor. Verifica tu conexión e inténtalo de nuevo.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90"
        >
          <RefreshCw className="w-4 h-4" /> Reintentar
        </button>
      </CardContent>
    </Card>
  );
}

/** Skeleton mientras cargan los datos reales. */
function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[12px] bg-muted/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-52 rounded-[12px] bg-muted/50" />
        <div className="h-52 rounded-[12px] bg-muted/50" />
      </div>
      <div className="h-64 rounded-[12px] bg-muted/50" />
    </div>
  );
}

/** Estado vacío: el docente no tiene cursos asignados. */
function DashboardEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center text-center gap-2 py-16">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-semibold">No hay cursos disponibles</p>
        <p className="text-sm text-muted-foreground">
          Aún no tienes cursos asignados o sincronizados desde Moodle.
        </p>
      </CardContent>
    </Card>
  );
}

/** Reportes disponibles en el panel docente. */
type ReportKey = 'completo' | 'riesgo' | 'engagement' | 'conocimiento';
interface GeneratedReport {
  key: ReportKey;
  name: string;
  format: string;
  time: string;
}

export function TeacherDashboard() {
  const dash = useTeacherDashboard();
  const { user } = useAuth();
  const logout = useLogout();

  // Historial REAL de reportes generados en esta sesión (no mock).
  const [reportLog, setReportLog] = useState<GeneratedReport[]>([]);
  const [generating, setGenerating] = useState<ReportKey | null>(null);

  const activeCourseName = dash.courses.find((c) => c.id === dash.activeCourseId)?.nombre;

  async function handleGenerateReport(key: ReportKey, name: string, format: string) {
    try {
      setGenerating(key);
      if (key === 'completo') {
        if (!dash.activeCourseId) {
          alert('Selecciona un curso para generar el reporte.');
          return;
        }
        await downloadClassReport(dash.activeCourseId, activeCourseName);
      } else {
        if (dash.students.length === 0) {
          alert('No hay datos de estudiantes para este curso todavía.');
          return;
        }
        if (key === 'riesgo') downloadRiskAnalysisCsv(dash.students, activeCourseName);
        if (key === 'engagement') downloadEngagementCsv(dash.students, activeCourseName);
        if (key === 'conocimiento') downloadKnowledgeMapCsv(dash.students, activeCourseName);
      }
      const time = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      setReportLog((prev) => [{ key, name, format, time }, ...prev].slice(0, 8));
    } catch {
      alert('No se pudo generar el reporte. Inténtalo de nuevo.');
    } finally {
      setGenerating(null);
    }
  }

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
          onTabChange={(t) => {
            // Al cambiar de sección, salir del detalle del alumno (si no, el
            // detalle tapaba la nueva tab y parecía que no se podía navegar).
            dash.setSelectedStudent(null);
            dash.setActiveTab(t);
          }}
          onClose={() => dash.setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 space-y-4">

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
                  courseId={dash.activeCourseId}
                  moodleCourseId={dash.courses.find((c) => c.id === dash.activeCourseId)?.moodleCourseId}
                  onClose={() => dash.setSelectedStudent(null)}
                  onSendFeedback={() =>
                    dash.setFeedbackStudent({
                      id: dash.currentStudent!.id,
                      name: dash.currentStudent!.name,
                      estudianteId: dash.currentStudent!.estudianteId,
                    })
                  }
                />
              </div>
            ) : dash.isError ? (
              <DashboardError />
            ) : dash.isLoading ? (
              <DashboardSkeleton />
            ) : !dash.hasCourses ? (
              <DashboardEmpty />
            ) : (
              <>
                {/* SELECTOR DE CURSO (datos reales por curso) */}
                {dash.courses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <label htmlFor="curso-sel" className="text-sm text-muted-foreground">Curso:</label>
                    <select
                      id="curso-sel"
                      value={dash.activeCourseId ?? ''}
                      onChange={(e) => dash.setActiveCourseId(e.target.value || undefined)}
                      className="text-sm border border-border rounded-md bg-background px-2 py-1"
                    >
                      {dash.courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

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
                      onViewAll={() => { dash.setRiskFilter('high'); dash.setActiveTab('estudiantes'); }}
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
                    students={dash.students}
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
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Reportes generados con los datos reales del curso
                        {activeCourseName ? <> <span className="font-medium text-foreground">{activeCourseName}</span></> : null}.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {([
                        { key: 'completo', icon: <FileText className="w-6 h-6 text-primary" />, title: 'Reporte de Clase (PDF)', desc: 'Documento con resumen por nivel de riesgo y detalle por estudiante.', badge: 'PDF', badgeColor: 'bg-red-500' },
                        { key: 'riesgo', icon: <BarChart2 className="w-6 h-6 text-success" />, title: 'Análisis de Riesgo', desc: 'Estudiantes en riesgo alto/medio con dominio, conceptos en riesgo y engagement.', badge: 'CSV', badgeColor: 'bg-green-600' },
                        { key: 'engagement', icon: <Users className="w-6 h-6 text-warning" />, title: 'Registro de Engagement', desc: 'Engagement y dominio por estudiante, ordenado por participación.', badge: 'CSV', badgeColor: 'bg-blue-500' },
                        { key: 'conocimiento', icon: <BookOpen className="w-6 h-6 text-purple-500" />, title: 'Mapa de Conocimiento', desc: 'Estado de dominio del grupo por estudiante, con promedio grupal.', badge: 'CSV', badgeColor: 'bg-purple-500' },
                      ] as const).map((r) => (
                        <Card
                          key={r.key}
                          className="hover:border-primary/40 transition-colors cursor-pointer group"
                          onClick={() => handleGenerateReport(r.key, r.title, r.badge)}
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
                              {generating === r.key ? (
                                <div className="w-4 h-4 mt-1 shrink-0 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" /> Reportes generados (esta sesión)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {reportLog.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2">
                            Aún no has generado reportes en esta sesión. Genera uno desde las tarjetas de arriba.
                          </p>
                        ) : (
                          reportLog.map((r, i) => (
                            <div key={`${r.key}-${i}`} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/30">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">{r.name}</p>
                                  <p className="text-xs text-muted-foreground">{r.time} · {r.format}</p>
                                </div>
                              </div>
                              <span className="text-xs text-success font-medium">Descargado</span>
                            </div>
                          ))
                        )}
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
          estudianteId={dash.feedbackStudent.estudianteId}
          courseId={dash.activeCourseId}
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
          avatarColor: user?.avatarColor,
          avatarUrl: user?.avatarUrl,
          memberSince: 'Marzo 2025',
        }}
        initialTab={dash.profileDialogTab}
      />
    </div>
  );
}
