import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { AttentionHeatmap } from "../components/xai/AttentionHeatmap";
import { KnowledgeGraph } from "../components/xai/KnowledgeGraph";
import { XAIExplanation } from "../components/xai/XAIExplanation";
import { DomainRadar } from "../components/xai/DomainRadar";
import { ResourcesTab } from "../components/resources/ResourcesTab";
import { ResourceViewer } from "../components/resources/ResourceViewer";
import { ProfileDialog } from "../components/ui/ProfileDialog";
import {
  BookOpen, Video, FileText, LogOut, User, TrendingUp, TrendingDown,
  Bell, X, CheckCircle, AlertTriangle, Info, Settings, ChevronRight,
  Moon, Sun, LayoutDashboard, Brain, BarChart2, Library, Flame,
  Target, PlayCircle, Sparkles, ArrowRight, Minus, Clock, Star,
  ChevronLeft, Menu,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ─── Types ─── */
type NavItem = "hoy" | "aprendizaje" | "atencion" | "progreso" | "recursos";

/* ─── Mock data ─── */
const mockInteractions = [
  { id: 1, concept: "Knowledge Tracing", timestamp: "15/05/26 10:30", isCorrect: true, attention: 92 },
  { id: 2, concept: "Introducción a IA", timestamp: "15/05/26 09:15", isCorrect: true, attention: 85 },
  { id: 3, concept: "Python Básico", timestamp: "14/05/26 16:45", isCorrect: true, attention: 78 },
  { id: 4, concept: "Deep Learning", timestamp: "14/05/26 14:20", isCorrect: false, attention: 65 },
  { id: 5, concept: "Redes Neuronales", timestamp: "13/05/26 11:00", isCorrect: false, attention: 45 },
  { id: 6, concept: "Redes Neuronales", timestamp: "12/05/26 15:30", isCorrect: false, attention: 38 },
];

const mockHistoricalData = [
  { session: "S1", mastery: 45, concepts: 2 },
  { session: "S2", mastery: 52, concepts: 3 },
  { session: "S3", mastery: 58, concepts: 4 },
  { session: "S4", mastery: 65, concepts: 5 },
  { session: "S5", mastery: 68, concepts: 6 },
];

const mockCurrentConcepts = [
  { name: "Knowledge Tracing", mastery: 90, trend: "up" as const },
  { name: "Introducción a IA", mastery: 85, trend: "up" as const },
  { name: "Python Básico", mastery: 75, trend: "stable" as const },
  { name: "Deep Learning", mastery: 65, trend: "up" as const },
  { name: "Redes Neuronales", mastery: 45, trend: "down" as const },
];

const mockDomainData = [
  { subject: "Algoritmos", value: 90, fullMark: 100 },
  { subject: "Python", value: 75, fullMark: 100 },
  { subject: "Deep Learning", value: 65, fullMark: 100 },
  { subject: "Redes Neur.", value: 45, fullMark: 100 },
  { subject: "Know. Tracing", value: 90, fullMark: 100 },
];

const mockSideRecommendations = [
  { id: 101, title: "Normalización de Bases de Datos - Formas Normales", type: "video" as const, duration: "18 min", reason: "Tu dominio en este concepto es del 55%. Este recurso refuerza los fundamentos de normalización.", content: "Contenido del video sobre normalización de bases de datos...", concept: "Bases de Datos", confidence: 92, improvement: 8 },
  { id: 102, title: "Ejercicios Prácticos de Deep Learning", type: "exercise" as const, duration: "30 min", reason: "Reforzar concepto con dominio medio (65%). La práctica te ayudará a consolidar el conocimiento.", content: "¿Cuál es la función de activación más común en redes neuronales profundas?\n\nSelecciona la respuesta correcta:", concept: "Deep Learning", confidence: 87, improvement: 6 },
  { id: 103, title: "Lectura: Arquitecturas de Atención", type: "reading" as const, duration: "20 min", reason: "Tienes un buen dominio (90%) en Knowledge Tracing. Este tema es el siguiente paso natural.", content: `Las arquitecturas de atención son mecanismos que permiten a los modelos enfocarse en partes específicas de la entrada.\n\n1. Identificar qué interacciones pasadas son más relevantes\n2. Ponderar la importancia de cada concepto aprendido\n3. Generar representaciones contextuales del estado de conocimiento`, concept: "Knowledge Tracing", confidence: 91, improvement: 5 },
];

const mockNotifications = [
  { id: 1, type: "warning" as const, title: "Alerta de Aprendizaje", message: "Bajo rendimiento detectado en Redes Neuronales (45%). Revisa los recursos recomendados.", time: "Hace 5 min", read: false },
  { id: 2, type: "info" as const, title: "Nueva Recomendación", message: "Se añadió un nuevo recurso personalizado para reforzar Deep Learning.", time: "Hace 1 hora", read: false },
  { id: 3, type: "success" as const, title: "Logro Desbloqueado", message: "¡Completaste 12 recursos! Estás en el top 20% de tu clase.", time: "Hace 2 horas", read: true },
];

const mockUser = {
  name: "Estudiante Demo",
  email: "demo@sward.edu.pe",
  role: "Estudiante",
  institution: "Universidad Nacional Mayor",
  avatar: "E",
  memberSince: "Enero 2026",
};

const learningPath = [
  { id: 1, label: "Fundamentos IA", done: true },
  { id: 2, label: "Python ML", done: true },
  { id: 3, label: "Redes Neur.", done: false, current: true },
  { id: 4, label: "Deep Learning", done: false },
  { id: 5, label: "Know. Tracing", done: false },
];

const xaiAnalysis = {
  strongConcepts: ["Knowledge Tracing", "Introducción a IA"],
  weakConcepts: ["Redes Neuronales", "Deep Learning"],
  recommendation: "Te sugerimos reforzar los conceptos fundamentales de Redes Neuronales antes de avanzar a temas más complejos.",
  reasoning: `El análisis de tus últimas 50 interacciones muestra:\n\n• Excelente desempeño en Knowledge Tracing (90% de dominio)\n• Solidez en conceptos introductorios de IA (85% de dominio)\n• Dificultades consistentes en Redes Neuronales (3 intentos incorrectos consecutivos)\n• El peso de atención más alto (92%) corresponde a tu última interacción correcta en Knowledge Tracing\n\nEl modelo SAKT identifica que tu comprensión de conceptos avanzados se ve limitada por las brechas en fundamentos de redes neuronales.`,
  confidence: 87,
};

/* ─── Nav items ─── */
const NAV: { id: NavItem; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: "hoy", label: "Inicio", shortLabel: "Inicio", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "aprendizaje", label: "Mi Aprendizaje", shortLabel: "Aprendizaje", icon: <Brain className="w-4 h-4" /> },
  { id: "atencion", label: "Mapa de Atención", shortLabel: "Atención", icon: <Sparkles className="w-4 h-4" /> },
  { id: "progreso", label: "Progreso", shortLabel: "Progreso", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "recursos", label: "Recursos", shortLabel: "Recursos", icon: <Library className="w-4 h-4" /> },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
interface StudentDashboardProps { onLogout: () => void; }

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavItem>("hoy");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSideResource, setSelectedSideResource] = useState<number | null>(null);
  const [completedResources, setCompletedResources] = useState<number[]>([]);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<"profile" | "settings">("profile");
  const [notifications, setNotifications] = useState(mockNotifications);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const currentSideResource = mockSideRecommendations.find((r) => r.id === selectedSideResource);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
      case "success": return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-3.5 h-3.5" />;
      case "exercise": return <BookOpen className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleCompleteFromTab = (id: number) => setCompletedResources((p) => [...p, id]);
  const handleCompleteSideResource = () => {
    if (selectedSideResource) { setCompletedResources((p) => [...p, selectedSideResource]); setSelectedSideResource(null); }
  };

  const completedCount = 12 + completedResources.length;
  const totalResources = 18;
  const streak = 5;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 gap-3">
          {/* Left: logo + sidebar toggle */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((p) => !p)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
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
                  step.done ? "bg-success text-white" : step.current ? "bg-primary text-white ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                }`}>
                  {step.done ? <CheckCircle className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className={`text-[10px] truncate hidden lg:block ${step.current ? "text-primary font-semibold" : step.done ? "text-success" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {i < learningPath.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full min-w-2 ${step.done ? "bg-success" : "bg-muted"}`} />
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
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{mockUser.avatar}</div>
                <span className="text-sm font-medium hidden md:block">{mockUser.name.split(" ")[0]}</span>
              </button>
              {showProfilePopup && (
                <div className="absolute right-0 top-11 w-64 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-primary/5 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">{mockUser.avatar}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{mockUser.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progreso general</span><span className="font-medium">68%</span></div>
                      <Progress value={68} className="h-1.5" />
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
      </header>

      {/* ── Body: sidebar + main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 shrink-0 ${sidebarOpen ? "w-52" : "w-14"}`}>
          {/* Nav items */}
          <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left w-full group ${
                  activeNav === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-14 bg-card border border-border rounded-[8px] px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-md z-50 transition-opacity">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar bottom: quick stats */}
          {sidebarOpen && (
            <div className="p-3 border-t space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-warning" />
                <span>{streak} días de racha</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Ruta de aprendizaje</span>
                  <span className="font-medium text-foreground">2/5</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 space-y-4">

            {/* ════ INICIO ════ */}
            {activeNav === "hoy" && (
              <div className="space-y-4">
                {/* Welcome banner */}
                <div className="rounded-[16px] p-5 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
                    style={{ background: "radial-gradient(circle, #a5b4fc, transparent)" }} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-indigo-200 text-sm">Lunes, 1 de junio · Semana 4</p>
                        <h2 className="text-white mt-1" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                          ¡Hola, {mockUser.name.split(" ")[0]}! 👋
                        </h2>
                        <p className="text-indigo-200 text-sm mt-1">Llevas <strong className="text-white">{streak} días</strong> consecutivos aprendiendo. ¡Sigue así!</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <Flame className="w-4 h-4 text-warning" />
                        <span className="text-white text-sm font-bold">{streak}</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Dominio actual", value: "68%", icon: <TrendingUp className="w-4 h-4" /> },
                        { label: "Recursos completados", value: `${completedCount}/${totalResources}`, icon: <CheckCircle className="w-4 h-4" /> },
                        { label: "Meta semanal", value: "80%", icon: <Target className="w-4 h-4" /> },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-[12px] p-3">
                          <div className="flex items-center gap-1.5 text-indigo-200 mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                          <p className="text-white font-bold">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meta semanal */}
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Meta de la semana — llegar a 80% de dominio</span>
                      </div>
                      <span className="text-sm font-bold text-primary">68% / 80%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: "85%", background: "linear-gradient(90deg, #6366f1, #7c3aed)" }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Te faltan completar 2 recursos recomendados para alcanzar tu meta</p>
                  </CardContent>
                </Card>

                {/* Next recommended resource */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Próximo recurso recomendado
                  </h3>
                  <Card className="border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedSideResource(mockSideRecommendations[0].id)}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-[12px] bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Video className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-tight">{mockSideRecommendations[0].title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{mockSideRecommendations[0].concept}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{mockSideRecommendations[0].duration}</span>
                            <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">+{mockSideRecommendations[0].improvement}% dominio</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{mockSideRecommendations[0].reason}</p>
                        </div>
                        <Button size="sm" className="shrink-0 gap-1.5">
                          <PlayCircle className="w-4 h-4" /> Empezar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick concept status */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" /> Estado de tus conceptos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mockCurrentConcepts.map((c) => (
                      <div key={c.name} className="flex items-center gap-3 p-3 bg-card border border-border rounded-[10px]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{c.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {c.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-success" />}
                              {c.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                              {c.trend === "stable" && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                              <span className={`text-sm font-bold ${c.mastery >= 75 ? "text-success" : c.mastery >= 60 ? "text-warning" : "text-destructive"}`}>
                                {c.mastery}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${c.mastery >= 75 ? "bg-success" : c.mastery >= 60 ? "bg-warning" : "bg-destructive"}`}
                              style={{ width: `${c.mastery}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended shortcuts */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Accesos rápidos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Ver Progreso", nav: "progreso" as NavItem, icon: <BarChart2 className="w-4 h-4" />, color: "text-primary" },
                      { label: "Mis Recursos", nav: "recursos" as NavItem, icon: <Library className="w-4 h-4" />, color: "text-success" },
                      { label: "Mapa Atención", nav: "atencion" as NavItem, icon: <Sparkles className="w-4 h-4" />, color: "text-warning" },
                      { label: "XAI Análisis", nav: "aprendizaje" as NavItem, icon: <Brain className="w-4 h-4" />, color: "text-purple-500" },
                    ].map((s) => (
                      <button key={s.label} onClick={() => setActiveNav(s.nav)}
                        className="flex items-center gap-2 p-3 bg-card border border-border rounded-[10px] hover:border-primary/40 hover:bg-muted/50 transition-all text-left group">
                        <span className={s.color}>{s.icon}</span>
                        <span className="text-xs font-medium">{s.label}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ MI APRENDIZAJE ════ */}
            {activeNav === "aprendizaje" && (
              <div className="space-y-4">
                <XAIExplanation analysis={xaiAnalysis} />
                <DomainRadar data={mockDomainData} title="Vista Rápida de Dominio" />

                {/* Side recommendations inline */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Recursos recomendados por SAKT
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {mockSideRecommendations.map((r) => {
                      const isCompleted = completedResources.includes(r.id);
                      return (
                        <Card key={r.id} className={`transition-all ${isCompleted ? "opacity-60 border-success/40 bg-success/5" : "hover:border-primary/40 cursor-pointer"}`}
                          onClick={() => !isCompleted && setSelectedSideResource(r.id)}>
                          <CardContent className="pt-4 pb-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`p-1.5 rounded-lg ${r.type === "video" ? "bg-blue-500/10 text-blue-500" : r.type === "exercise" ? "bg-orange-500/10 text-orange-500" : "bg-purple-500/10 text-purple-500"}`}>
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
                              : <Button size="sm" className="w-full text-xs gap-1"><PlayCircle className="w-3.5 h-3.5" />Comenzar</Button>}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════ MAPA DE ATENCIÓN ════ */}
            {activeNav === "atencion" && (
              <div className="space-y-4">
                {/* Context explanation */}
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

                {/* Low-attention concepts with actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Conceptos con atención baja — acción recomendada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { concept: "Redes Neuronales", attention: 38, resource: mockSideRecommendations[1], sessions: "últimas 3 sesiones" },
                      { concept: "Deep Learning", attention: 65, resource: mockSideRecommendations[1], sessions: "última sesión" },
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
                          onClick={() => setSelectedSideResource(item.resource.id)}>
                          <PlayCircle className="w-3.5 h-3.5" /> Ver recurso
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ════ PROGRESO ════ */}
            {activeNav === "progreso" && (
              <div className="space-y-4">
                {/* AI narrative summary */}
                <Card className="border-primary/20" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(124,58,237,0.05))" }}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          Resumen de SAKT
                          <Badge variant="outline" className="text-xs">IA · Confianza 87%</Badge>
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Esta semana <strong className="text-success">mejoraste en Algoritmos (+8%)</strong> y consolidaste Knowledge Tracing. Sin embargo, <strong className="text-destructive">Redes Neuronales bajó 12%</strong> — tuviste 3 respuestas incorrectas consecutivas que el modelo detecta como brecha crítica. Se recomienda dedicar al menos <strong className="text-foreground">20 minutos hoy</strong> al recurso de fundamentos antes de avanzar.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Recursos completados", value: `${completedCount}/${totalResources}`, pct: (completedCount / totalResources) * 100, color: "bg-primary" },
                    { label: "Tiempo de estudio", value: "8.5 hrs", pct: 85, color: "bg-success" },
                    { label: "Conceptos dominados", value: "4/7", pct: 57, color: "bg-warning" },
                  ].map((s) => (
                    <Card key={s.label}>
                      <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                        <p className="font-bold text-lg mb-2">{s.value}</p>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <KnowledgeGraph historicalData={mockHistoricalData} currentConcepts={mockCurrentConcepts} />
                <DomainRadar data={mockDomainData} title="Radar de Dominio por Área" />
              </div>
            )}

            {/* ════ RECURSOS ════ */}
            {activeNav === "recursos" && (
              <div className="space-y-4">
                {/* Learning path tracker */}
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
                      {learningPath.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex flex-col items-center gap-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                              step.done ? "bg-success text-white" : step.current ? "bg-primary text-white ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                            }`}>
                              {step.done ? <CheckCircle className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`text-[9px] text-center leading-tight truncate w-14 ${step.current ? "text-primary font-semibold" : step.done ? "text-success" : "text-muted-foreground"}`}>
                              {step.label}
                            </span>
                          </div>
                          {i < learningPath.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded-full -mt-4 ${step.done ? "bg-success" : "bg-muted"}`} />
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

                <ResourcesTab completedResources={completedResources} onCompleteResource={handleCompleteFromTab} />
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Resource Viewer */}
      {selectedSideResource && currentSideResource && (
        <ResourceViewer resource={currentSideResource} onComplete={handleCompleteSideResource} onClose={() => setSelectedSideResource(null)} />
      )}

      <ProfileDialog open={showProfileDialog} onClose={() => setShowProfileDialog(false)} user={mockUser} initialTab={profileDialogTab} />
    </div>
  );
}
