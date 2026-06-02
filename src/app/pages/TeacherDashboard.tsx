import { useState, useRef, useEffect } from "react";
import { StudentDetailView } from "../components/teacher/StudentDetailView";
import { FeedbackDialog } from "../components/teacher/FeedbackDialog";
import { ProfileDialog } from "../components/ui/ProfileDialog";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import {
  Download, LogOut, User, AlertTriangle, Eye, MessageSquare,
  Filter, TrendingDown, TrendingUp, Minus, Bell, X,
  CheckCircle, Info, Settings, ChevronRight, Moon, Sun,
  LayoutDashboard, Users, BarChart2, FileText, ChevronLeft,
  Activity, BookOpen, Clock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ─── Mock data ─── */
const mockTeacherNotifications = [
  { id: 1, type: "warning" as const, title: "Estudiante en Riesgo Alto", message: "Ana García Pérez lleva 2 días sin actividad y su dominio bajó a 42%.", time: "Hace 10 min", read: false },
  { id: 2, type: "warning" as const, title: "Nuevo Estudiante en Riesgo", message: "José Ramírez Castro acaba de clasificarse como riesgo alto. Requiere intervención.", time: "Hace 30 min", read: false },
  { id: 3, type: "info" as const, title: "Reporte Semanal Disponible", message: "El reporte de progreso de la semana 3 está listo para descargar.", time: "Hace 2 horas", read: true },
  { id: 4, type: "success" as const, title: "Mejora de Estudiante", message: "Pedro Vásquez Rojas mejoró su dominio a 92%. ¡Excelente progreso!", time: "Hace 3 horas", read: true },
];

const mockTeacher = {
  name: "Prof. María Docente",
  email: "docente@sward.edu.pe",
  role: "Docente",
  department: "Ciencias de la Computación",
  avatar: "D",
  courses: "IA, Machine Learning",
};

const mockStudents = [
  { id: 1, name: "Ana García Pérez", email: "ana.garcia@sward.edu.pe", riskLevel: "high", avgMastery: 42, conceptsAtRisk: 4, lastActivity: "Hace 2 días", engagement: 35 },
  { id: 2, name: "Carlos Méndez Torres", email: "carlos.mendez@sward.edu.pe", riskLevel: "medium", avgMastery: 68, conceptsAtRisk: 2, lastActivity: "Hace 5 horas", engagement: 72 },
  { id: 3, name: "María López Suárez", email: "maria.lopez@sward.edu.pe", riskLevel: "low", avgMastery: 87, conceptsAtRisk: 0, lastActivity: "Hace 1 hora", engagement: 91 },
  { id: 4, name: "José Ramírez Castro", email: "jose.ramirez@sward.edu.pe", riskLevel: "high", avgMastery: 51, conceptsAtRisk: 3, lastActivity: "Hace 4 días", engagement: 28 },
  { id: 5, name: "Laura Fernández Díaz", email: "laura.fernandez@sward.edu.pe", riskLevel: "medium", avgMastery: 73, conceptsAtRisk: 1, lastActivity: "Hace 3 horas", engagement: 78 },
  { id: 6, name: "Pedro Vásquez Rojas", email: "pedro.vasquez@sward.edu.pe", riskLevel: "low", avgMastery: 92, conceptsAtRisk: 0, lastActivity: "Hace 30 min", engagement: 95 },
];

const trendData = [
  { week: "Sem 1", promedio: 61, riesgoAlto: 3 },
  { week: "Sem 2", promedio: 64, riesgoAlto: 3 },
  { week: "Sem 3", promedio: 67, riesgoAlto: 2 },
  { week: "Sem 4", promedio: 69, riesgoAlto: 2 },
];

const engagementData = mockStudents.map((s) => ({
  name: s.name.split(" ")[0],
  engagement: s.engagement,
  dominio: s.avgMastery,
}));

/* ─── Types ─── */
type Tab = "resumen" | "estudiantes" | "analisis" | "reportes";

interface TeacherDashboardProps {
  onLogout: () => void;
}

/* ─── Helpers ─── */
const getRiskBadge = (level: string) => {
  switch (level) {
    case "high": return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Riesgo Alto</Badge>;
    case "medium": return <Badge variant="warning" className="gap-1"><Minus className="w-3 h-3" />Riesgo Medio</Badge>;
    case "low": return <Badge variant="success" className="gap-1"><TrendingUp className="w-3 h-3" />Bajo Riesgo</Badge>;
    default: return null;
  }
};

const getRiskColor = (level: string) => {
  switch (level) {
    case "high": return "bg-destructive";
    case "medium": return "bg-warning";
    case "low": return "bg-success";
    default: return "bg-muted";
  }
};

const getMasteryColor = (v: number) => v >= 80 ? "text-success" : v >= 60 ? "text-warning" : "text-destructive";

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("resumen");
  const [courseFilter, setCourseFilter] = useState("all");
  const [weekFilter, setWeekFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [feedbackStudent, setFeedbackStudent] = useState<{ id: number; name: string } | null>(null);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<"profile" | "settings">("profile");
  const [notifications, setNotifications] = useState(mockTeacherNotifications);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highRiskCount = mockStudents.filter((s) => s.riskLevel === "high").length;
  const mediumRiskCount = mockStudents.filter((s) => s.riskLevel === "medium").length;
  const lowRiskCount = mockStudents.filter((s) => s.riskLevel === "low").length;
  const avgMastery = Math.round(mockStudents.reduce((a, s) => a + s.avgMastery, 0) / mockStudents.length);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifPopup(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfilePopup(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const dismissNotification = (id: number) => setNotifications((p) => p.filter((n) => n.id !== id));
  const openProfile = (tab: "profile" | "settings") => { setProfileDialogTab(tab); setShowProfileDialog(true); setShowProfilePopup(false); };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
      case "success": return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
    }
  };

  const sortedStudents = [...mockStudents]
    .filter((s) => riskFilter === "all" || s.riskLevel === riskFilter)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.riskLevel as keyof typeof order] - order[b.riskLevel as keyof typeof order];
    });

  const currentStudent = mockStudents.find((s) => s.id === selectedStudent);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "resumen", label: "Resumen", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "estudiantes", label: "Estudiantes", icon: <Users className="w-4 h-4" /> },
    { id: "analisis", label: "Análisis", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "reportes", label: "Reportes", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">

      {/* ── Header ── */}
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
              {selectedStudent && currentStudent && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground truncate max-w-[140px]">{currentStudent.name.split(" ")[0]}</span>
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
              <Button variant="ghost" size="icon" onClick={() => { setShowNotifPopup(!showNotifPopup); setShowProfilePopup(false); }}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </Button>
              {showNotifPopup && (
                <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notificaciones</span>
                    {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-primary hover:underline">Marcar leídas</button>}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0
                      ? <div className="py-8 text-center text-sm text-muted-foreground">Sin notificaciones</div>
                      : notifications.map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.read ? "bg-primary/5" : ""}`}>
                          <div className="flex items-start gap-2">
                            {getNotifIcon(n.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                            </div>
                            <button onClick={() => dismissNotification(n.id)} className="text-muted-foreground hover:text-foreground shrink-0"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t">
                      <button onClick={() => setNotifications([])} className="text-xs text-muted-foreground hover:text-foreground">Limpiar todas</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfilePopup(!showProfilePopup); setShowNotifPopup(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">{mockTeacher.avatar}</div>
                <span className="text-sm font-medium hidden md:block">{mockTeacher.name.split(" ")[1]}</span>
              </button>
              {showProfilePopup && (
                <div className="absolute right-0 top-11 w-64 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-primary/5 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">{mockTeacher.avatar}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{mockTeacher.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{mockTeacher.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button onClick={() => openProfile("profile")} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                      <span className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />Mi Perfil</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => openProfile("settings")} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors">
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
        {!selectedStudent && (
          <div className="container mx-auto px-4 border-t">
            <div className="flex gap-0">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {tab.icon}{tab.label}
                  {tab.id === "estudiantes" && highRiskCount > 0 && (
                    <span className="w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">{highRiskCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <div className="flex-1 container mx-auto p-4 space-y-4 max-w-7xl">

        {/* ════ STUDENT DETAIL VIEW ════ */}
        {selectedStudent && currentStudent ? (
          <div className="space-y-4">
            <button onClick={() => setSelectedStudent(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Volver a Estudiantes
            </button>
            <StudentDetailView
              student={currentStudent}
              onClose={() => setSelectedStudent(null)}
              onSendFeedback={() => setFeedbackStudent({ id: currentStudent.id, name: currentStudent.name })}
            />
          </div>
        ) : (
          <>
            {/* ════ TAB: RESUMEN ════ */}
            {activeTab === "resumen" && (
              <div className="space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Riesgo Alto</p>
                          <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                          <Minus className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Riesgo Medio</p>
                          <p className="text-2xl font-bold text-warning">{mediumRiskCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bajo Riesgo</p>
                          <p className="text-2xl font-bold text-success">{lowRiskCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Promedio General</p>
                          <p className="text-2xl font-bold">{avgMastery}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tendencia de Dominio Grupal</CardTitle>
                      <CardDescription className="text-xs">Promedio semanal del grupo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="gProm" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <YAxis domain={[55, 75]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
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
                        <BarChart data={engagementData} barSize={14}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Bar dataKey="engagement" fill="#6366f1" name="Engagement" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="dominio" fill="#10b981" name="Dominio" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk alerts */}
                {highRiskCount > 0 && (
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" /> Estudiantes que requieren atención inmediata
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mockStudents.filter((s) => s.riskLevel === "high").map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-card rounded-[10px] border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{s.name}</p>
                              <p className="text-xs text-muted-foreground">Dominio: {s.avgMastery}% · Última actividad: {s.lastActivity}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setActiveTab("estudiantes"); setSelectedStudent(s.id); }}>
                              <Eye className="w-3.5 h-3.5 mr-1" /> Ver
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setFeedbackStudent({ id: s.id, name: s.name })}>
                              <MessageSquare className="w-3.5 h-3.5 mr-1" /> Mensaje
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quick student list */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Vista Rápida — Todos los Estudiantes</CardTitle>
                      <button onClick={() => setActiveTab("estudiantes")} className="text-xs text-primary hover:underline flex items-center gap-1">
                        Ver tabla completa <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockStudents.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedStudent(s.id)}>
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

            {/* ════ TAB: ESTUDIANTES ════ */}
            {activeTab === "estudiantes" && (
              <div className="space-y-4">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="shrink-0 w-44">
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Curso" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los cursos</SelectItem>
                            <SelectItem value="ia">Inteligencia Artificial</SelectItem>
                            <SelectItem value="ml">Machine Learning</SelectItem>
                            <SelectItem value="dl">Deep Learning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="shrink-0 w-36">
                        <Select value={weekFilter} onValueChange={setWeekFilter}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Semana" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las semanas</SelectItem>
                            <SelectItem value="1">Semana 1</SelectItem>
                            <SelectItem value="2">Semana 2</SelectItem>
                            <SelectItem value="3">Semana 3</SelectItem>
                            <SelectItem value="4">Semana 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="shrink-0 w-36">
                        <Select value={riskFilter} onValueChange={setRiskFilter}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Riesgo" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="high">Riesgo Alto</SelectItem>
                            <SelectItem value="medium">Riesgo Medio</SelectItem>
                            <SelectItem value="low">Bajo Riesgo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">{sortedStudents.length} estudiante{sortedStudents.length !== 1 ? "s" : ""}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Table */}
                <Card>
                  <CardContent className="pt-4 pb-0">
                    <div className="border rounded-[12px] overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-6"></TableHead>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Semáforo</TableHead>
                            <TableHead className="text-center">Dominio</TableHead>
                            <TableHead className="text-center">En Riesgo</TableHead>
                            <TableHead className="text-center">Engagement</TableHead>
                            <TableHead>Última Actividad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedStudents.map((student) => (
                            <TableRow key={student.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedStudent(student.id)}>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <div className={`w-2.5 h-2.5 rounded-full ${getRiskColor(student.riskLevel)}`} />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
                              <TableCell className="text-center">
                                <span className={`font-semibold text-sm ${getMasteryColor(student.avgMastery)}`}>{student.avgMastery}%</span>
                              </TableCell>
                              <TableCell className="text-center">
                                {student.conceptsAtRisk > 0
                                  ? <Badge variant="outline" className="gap-1"><AlertTriangle className="w-3 h-3 text-destructive" />{student.conceptsAtRisk}</Badge>
                                  : <span className="text-muted-foreground text-sm">—</span>}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={`text-sm ${getMasteryColor(student.engagement)}`}>{student.engagement}%</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">{student.lastActivity}</span>
                              </TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(student.id)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => setFeedbackStudent({ id: student.id, name: student.name })}>
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground px-1 py-3">
                      Ordenados por nivel de riesgo. Semáforo: Rojo (&lt;60%), Amarillo (60–80%), Verde (&gt;80%).
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ════ TAB: ANÁLISIS ════ */}
            {activeTab === "analisis" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Evolución del Dominio Grupal</CardTitle>
                      <CardDescription className="text-xs">Semanas 1–4</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="gProm2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <YAxis domain={[55, 75]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
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
                        <BarChart data={trendData} barSize={32}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
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
                      <BarChart data={engagementData} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="engagement" fill="#6366f1" name="Engagement %" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="dominio" fill="#10b981" name="Dominio %" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ════ TAB: REPORTES ════ */}
            {activeTab === "reportes" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: <FileText className="w-6 h-6 text-primary" />, title: "Reporte Semanal Completo", desc: "Progreso individual y grupal de las últimas 4 semanas.", badge: "PDF", badgeColor: "bg-red-500" },
                    { icon: <BarChart2 className="w-6 h-6 text-success" />, title: "Análisis de Riesgo", desc: "Detalle de estudiantes en riesgo con recomendaciones de intervención.", badge: "Excel", badgeColor: "bg-green-600" },
                    { icon: <Users className="w-6 h-6 text-warning" />, title: "Registro de Engagement", desc: "Historial de actividad y tiempos de sesión por estudiante.", badge: "CSV", badgeColor: "bg-blue-500" },
                    { icon: <BookOpen className="w-6 h-6 text-purple-500" />, title: "Mapa de Conocimiento", desc: "Estado de dominio por concepto para todo el grupo.", badge: "PDF", badgeColor: "bg-red-500" },
                  ].map((r) => (
                    <Card key={r.title} className="hover:border-primary/40 transition-colors cursor-pointer group"
                      onClick={() => alert(`Generando: ${r.title}...`)}>
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
                      { name: "Reporte Semana 3 — Completo", date: "28 May 2026", size: "2.4 MB" },
                      { name: "Análisis de Riesgo — Semana 3", date: "28 May 2026", size: "1.1 MB" },
                      { name: "Reporte Semana 2 — Completo", date: "21 May 2026", size: "2.2 MB" },
                      { name: "Registro de Engagement — Mayo", date: "18 May 2026", size: "0.8 MB" },
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

      {/* Dialogs */}
      {feedbackStudent && (
        <FeedbackDialog studentName={feedbackStudent.name} open={true} onClose={() => setFeedbackStudent(null)} />
      )}
      <ProfileDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        user={{
          name: mockTeacher.name,
          email: mockTeacher.email,
          role: mockTeacher.role,
          institution: mockTeacher.department,
          avatar: mockTeacher.avatar,
          memberSince: "Marzo 2025",
          bio: `Docente del área de ${mockTeacher.department}. Cursos: ${mockTeacher.courses}.`,
        }}
        initialTab={profileDialogTab}
      />
    </div>
  );
}
