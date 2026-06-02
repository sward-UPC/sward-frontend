import { useState, useRef, useEffect } from "react";
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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import {
  LogOut, Bell, X, CheckCircle, Info, AlertTriangle, Settings,
  ChevronRight, Moon, Sun, User, Users, BookOpen, BarChart2,
  Shield, Activity, Server, Database, Cpu, TrendingUp, TrendingDown,
  LayoutDashboard, Search, ToggleLeft, ToggleRight, Eye, Edit,
  Trash2, Plus, Download, RefreshCw, CheckCircle2, XCircle,
  Zap, Clock, Globe, Lock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ─── Types ─── */
type Tab = "resumen" | "usuarios" | "cursos" | "sistema" | "logs";
type UserStatus = "active" | "inactive" | "suspended";
type UserRole2 = "student" | "teacher" | "admin";

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole2;
  status: UserStatus;
  institution: string;
  lastLogin: string;
  joinDate: string;
  courses: number;
}

interface Course {
  id: number;
  name: string;
  teacher: string;
  students: number;
  avgMastery: number;
  status: "active" | "inactive";
  startDate: string;
}

/* ─── Mock data ─── */
const mockAdmin = {
  name: "Admin SWARD",
  email: "admin@sward.edu.pe",
  role: "Administrador",
  institution: "SWARD Platform",
  avatar: "A",
};

const mockUsers: AppUser[] = [
  { id: 1, name: "Ana García Pérez", email: "ana.garcia@sward.edu.pe", role: "student", status: "active", institution: "UNMSM", lastLogin: "Hace 2 horas", joinDate: "Mar 2025", courses: 2 },
  { id: 2, name: "Prof. María Docente", email: "docente@sward.edu.pe", role: "teacher", status: "active", institution: "UNMSM", lastLogin: "Hace 30 min", joinDate: "Feb 2025", courses: 3 },
  { id: 3, name: "Carlos Méndez Torres", email: "carlos.mendez@sward.edu.pe", role: "student", status: "active", institution: "PUCP", lastLogin: "Hace 5 horas", joinDate: "Mar 2025", courses: 2 },
  { id: 4, name: "José Ramírez Castro", email: "jose.ramirez@sward.edu.pe", role: "student", status: "inactive", institution: "UNI", lastLogin: "Hace 4 días", joinDate: "Mar 2025", courses: 1 },
  { id: 5, name: "Prof. Luis Torres", email: "luis.torres@sward.edu.pe", role: "teacher", status: "active", institution: "PUCP", lastLogin: "Hace 1 día", joinDate: "Ene 2025", courses: 2 },
  { id: 6, name: "Laura Fernández Díaz", email: "laura.fernandez@sward.edu.pe", role: "student", status: "active", institution: "UNMSM", lastLogin: "Hace 3 horas", joinDate: "Abr 2025", courses: 2 },
  { id: 7, name: "Pedro Vásquez Rojas", email: "pedro.vasquez@sward.edu.pe", role: "student", status: "active", institution: "UPC", lastLogin: "Hace 30 min", joinDate: "Mar 2025", courses: 3 },
  { id: 8, name: "Prof. Sandra Ruiz", email: "sandra.ruiz@sward.edu.pe", role: "teacher", status: "suspended", institution: "UNI", lastLogin: "Hace 2 sem", joinDate: "Ene 2025", courses: 1 },
];

const mockCourses: Course[] = [
  { id: 1, name: "Inteligencia Artificial", teacher: "Prof. María Docente", students: 24, avgMastery: 69, status: "active", startDate: "Mar 2026" },
  { id: 2, name: "Machine Learning", teacher: "Prof. María Docente", students: 18, avgMastery: 74, status: "active", startDate: "Mar 2026" },
  { id: 3, name: "Deep Learning", teacher: "Prof. Luis Torres", students: 15, avgMastery: 61, status: "active", startDate: "Abr 2026" },
  { id: 4, name: "Bases de Datos", teacher: "Prof. Luis Torres", students: 30, avgMastery: 78, status: "active", startDate: "Mar 2026" },
  { id: 5, name: "Algoritmos y Estructuras", teacher: "Prof. Sandra Ruiz", students: 22, avgMastery: 55, status: "inactive", startDate: "Feb 2026" },
];

const systemLogs = [
  { id: 1, level: "info", message: "Modelo SAKT reentrenado exitosamente", time: "Hoy 09:14", module: "XAI Engine" },
  { id: 2, level: "warning", message: "Latencia elevada en predicciones (>200ms)", time: "Hoy 08:52", module: "API" },
  { id: 3, level: "info", message: "Backup diario completado (2.3 GB)", time: "Hoy 03:00", module: "Database" },
  { id: 4, level: "info", message: "Usuario suspendido: sandra.ruiz@sward.edu.pe", time: "Ayer 16:30", module: "Auth" },
  { id: 5, level: "error", message: "Fallo en exportación PDF — timeout al generar reporte", time: "Ayer 14:22", module: "Reports" },
  { id: 6, level: "info", message: "Nuevo curso creado: Deep Learning (Prof. Luis Torres)", time: "Ayer 11:05", module: "Courses" },
  { id: 7, level: "warning", message: "Uso de CPU >85% durante 5 min", time: "Ayer 10:18", module: "Infrastructure" },
  { id: 8, level: "info", message: "3 nuevos usuarios registrados", time: "Ayer 09:00", module: "Auth" },
];

const activityData = [
  { day: "Lun", sesiones: 42, nuevos: 3 },
  { day: "Mar", sesiones: 38, nuevos: 1 },
  { day: "Mié", sesiones: 55, nuevos: 5 },
  { day: "Jue", sesiones: 61, nuevos: 2 },
  { day: "Vie", sesiones: 49, nuevos: 4 },
  { day: "Sáb", sesiones: 22, nuevos: 0 },
  { day: "Dom", sesiones: 18, nuevos: 1 },
];

const userDistData = [
  { name: "Estudiantes", value: mockUsers.filter((u) => u.role === "student").length, color: "#6366f1" },
  { name: "Docentes", value: mockUsers.filter((u) => u.role === "teacher").length, color: "#10b981" },
  { name: "Admins", value: 1, color: "#f59e0b" },
];

const notifications = [
  { id: 1, type: "warning" as const, title: "CPU alta", message: "El servidor procesó picos de >85% CPU.", time: "Hace 1 h", read: false },
  { id: 2, type: "info" as const, title: "Backup completado", message: "Backup diario exitoso (2.3 GB).", time: "Hoy 03:00", read: false },
  { id: 3, type: "error" as const, title: "Error en exportación", message: "Fallo al generar reporte PDF.", time: "Ayer", read: true },
];

/* ─── Helpers ─── */
const statusBadge = (s: UserStatus) => {
  switch (s) {
    case "active": return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Activo</Badge>;
    case "inactive": return <Badge variant="outline" className="gap-1 text-muted-foreground">Inactivo</Badge>;
    case "suspended": return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Suspendido</Badge>;
  }
};

const roleBadge = (r: UserRole2) => {
  switch (r) {
    case "student": return <Badge variant="outline" className="gap-1 text-primary border-primary/30"><User className="w-3 h-3" />Estudiante</Badge>;
    case "teacher": return <Badge variant="outline" className="gap-1 text-success border-success/30"><BookOpen className="w-3 h-3" />Docente</Badge>;
    case "admin": return <Badge variant="outline" className="gap-1 text-warning border-warning/30"><Shield className="w-3 h-3" />Admin</Badge>;
  }
};

const logIcon = (level: string) => {
  switch (level) {
    case "error": return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0" />;
  }
};

const logBg = (level: string) => {
  switch (level) {
    case "error": return "bg-destructive/5 border-destructive/20";
    case "warning": return "bg-warning/5 border-warning/20";
    default: return "bg-muted/40 border-border";
  }
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
interface AdminDashboardProps { onLogout: () => void; }

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("resumen");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userList, setUserList] = useState(mockUsers);
  const [notifs, setNotifs] = useState(notifications);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<"profile" | "settings">("profile");
  const [modelRetrain, setModelRetrain] = useState(false);
  const [retrainDone, setRetrainDone] = useState(false);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifPopup(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfilePopup(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const openProfile = (tab: "profile" | "settings") => {
    setProfileDialogTab(tab); setShowProfileDialog(true); setShowProfilePopup(false);
  };

  const toggleUserStatus = (id: number) => {
    setUserList((prev) => prev.map((u) => u.id === id
      ? { ...u, status: u.status === "active" ? "inactive" : "active" }
      : u
    ));
  };

  const handleRetrain = () => {
    setModelRetrain(true);
    setTimeout(() => { setModelRetrain(false); setRetrainDone(true); setTimeout(() => setRetrainDone(false), 3000); }, 3000);
  };

  const filteredUsers = userList.filter((u) => {
    const matchSearch = userSearch === "" || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "resumen", label: "Resumen", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "usuarios", label: "Usuarios", icon: <Users className="w-4 h-4" /> },
    { id: "cursos", label: "Cursos", icon: <BookOpen className="w-4 h-4" /> },
    { id: "sistema", label: "Sistema", icon: <Server className="w-4 h-4" /> },
    { id: "logs", label: "Logs", icon: <Activity className="w-4 h-4" /> },
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />;
      case "error": return <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">

      {/* ── Header ── */}
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
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button variant="ghost" size="icon" onClick={() => { setShowNotifPopup(!showNotifPopup); setShowProfilePopup(false); }}>
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
                )}
              </Button>
              {showNotifPopup && (
                <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notificaciones</span>
                    {unread > 0 && <button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs text-primary hover:underline">Marcar leídas</button>}
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
                          <button onClick={() => setNotifs((p) => p.filter((x) => x.id !== n.id))} className="text-muted-foreground hover:text-foreground">
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
              <button onClick={() => { setShowProfilePopup(!showProfilePopup); setShowNotifPopup(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>A</div>
                <span className="text-sm font-medium hidden md:block">Admin</span>
              </button>
              {showProfilePopup && (
                <div className="absolute right-0 top-11 w-60 bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-warning/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>A</div>
                      <div>
                        <p className="font-semibold text-sm">{mockAdmin.name}</p>
                        <p className="text-xs text-muted-foreground">{mockAdmin.email}</p>
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
        <div className="container mx-auto px-4 border-t">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id ? "border-warning text-warning font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 container mx-auto p-4 space-y-4 max-w-7xl">

        {/* ════ TAB: RESUMEN ════ */}
        {activeTab === "resumen" && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Usuarios Totales", value: mockUsers.length, icon: <Users className="w-5 h-5 text-primary" />, color: "bg-primary/10", sub: `${mockUsers.filter(u=>u.status==="active").length} activos` },
                { label: "Cursos Activos", value: mockCourses.filter(c=>c.status==="active").length, icon: <BookOpen className="w-5 h-5 text-success" />, color: "bg-success/10", sub: `${mockCourses.reduce((a,c)=>a+c.students,0)} matriculados` },
                { label: "Sesiones Hoy", value: 61, icon: <Activity className="w-5 h-5 text-warning" />, color: "bg-warning/10", sub: "+14% vs ayer" },
                { label: "Dominio Plataforma", value: "69%", icon: <TrendingUp className="w-5 h-5 text-info" />, color: "bg-info/10", sub: "+3% este mes" },
              ].map((k) => (
                <Card key={k.label}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${k.color} flex items-center justify-center shrink-0`}>{k.icon}</div>
                      <div>
                        <p className="text-xs text-muted-foreground">{k.label}</p>
                        <p className="text-2xl font-bold">{k.value}</p>
                        <p className="text-xs text-muted-foreground">{k.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Actividad de Sesiones — Últimos 7 días</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="gSes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="sesiones" stroke="#f59e0b" fill="url(#gSes)" strokeWidth={2} name="Sesiones" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Distribución de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <PieChart width={140} height={140}>
                    <Pie data={userDistData} cx={65} cy={65} innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                      {userDistData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                  <div className="space-y-1.5 w-full">
                    {userDistData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                          {d.name}
                        </span>
                        <span className="font-semibold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System health */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" /> Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "API Server", value: "Operativo", icon: <Globe className="w-4 h-4" />, ok: true, sub: "99.9% uptime" },
                    { label: "Base de Datos", icon: <Database className="w-4 h-4" />, value: "Operativo", ok: true, sub: "2.3 ms avg" },
                    { label: "Modelo XAI", icon: <Cpu className="w-4 h-4" />, value: "Operativo", ok: true, sub: "SAKT v2.1" },
                    { label: "Almacenamiento", icon: <Server className="w-4 h-4" />, value: "68% usado", ok: true, sub: "34 GB / 50 GB" },
                  ].map((s) => (
                    <div key={s.label} className={`p-3 rounded-[10px] border ${s.ok ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={s.ok ? "text-success" : "text-destructive"}>{s.icon}</span>
                        <span className={`w-2 h-2 rounded-full ${s.ok ? "bg-success" : "bg-destructive"} animate-pulse`} />
                      </div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent logs */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Actividad Reciente</CardTitle>
                  <button onClick={() => setActiveTab("logs")} className="text-xs text-primary hover:underline flex items-center gap-1">
                    Ver todos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {systemLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className={`flex items-start gap-3 p-2.5 rounded-[10px] border ${logBg(log.level)}`}>
                    {logIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.module} · {log.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ════ TAB: USUARIOS ════ */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Buscar por nombre o correo..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-[10px] border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" />
                  </div>
                  <div className="shrink-0 w-36">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Rol" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="student">Estudiante</SelectItem>
                        <SelectItem value="teacher">Docente</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="shrink-0 w-36">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Estado" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                        <SelectItem value="suspended">Suspendidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="ml-auto gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Usuario
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-0">
                <div className="border rounded-[12px] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Institución</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último acceso</TableHead>
                        <TableHead className="text-center">Cursos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{roleBadge(u.role)}</TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{u.institution}</span></TableCell>
                          <TableCell>{statusBadge(u.status)}</TableCell>
                          <TableCell><span className="text-sm text-muted-foreground">{u.lastLogin}</span></TableCell>
                          <TableCell className="text-center"><span className="text-sm">{u.courses}</span></TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title="Ver perfil"><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" title="Editar"><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" title={u.status === "active" ? "Desactivar" : "Activar"}
                                onClick={() => toggleUserStatus(u.id)}>
                                {u.status === "active"
                                  ? <ToggleRight className="w-4 h-4 text-success" />
                                  : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground px-1 py-3">{filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""} encontrado{filteredUsers.length !== 1 ? "s" : ""}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ════ TAB: CURSOS ════ */}
        {activeTab === "cursos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockCourses.length} cursos en la plataforma</p>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Nuevo Curso</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCourses.map((c) => (
                <Card key={c.id} className={`transition-all hover:border-primary/40 ${c.status === "inactive" ? "opacity-70" : ""}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{c.name}</p>
                          {c.status === "active"
                            ? <Badge variant="success" className="text-xs gap-1"><CheckCircle2 className="w-3 h-3" />Activo</Badge>
                            : <Badge variant="outline" className="text-xs text-muted-foreground">Inactivo</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{c.teacher}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center mb-3">
                      <div className="p-2 bg-muted/40 rounded-[8px]">
                        <p className="text-xs text-muted-foreground">Estudiantes</p>
                        <p className="font-bold text-sm">{c.students}</p>
                      </div>
                      <div className="p-2 bg-muted/40 rounded-[8px]">
                        <p className="text-xs text-muted-foreground">Dominio prom.</p>
                        <p className={`font-bold text-sm ${c.avgMastery >= 75 ? "text-success" : c.avgMastery >= 60 ? "text-warning" : "text-destructive"}`}>{c.avgMastery}%</p>
                      </div>
                      <div className="p-2 bg-muted/40 rounded-[8px]">
                        <p className="text-xs text-muted-foreground">Inicio</p>
                        <p className="font-bold text-sm">{c.startDate}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Dominio promedio</span>
                        <span>{c.avgMastery}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${c.avgMastery >= 75 ? "bg-success" : c.avgMastery >= 60 ? "bg-warning" : "bg-destructive"}`}
                          style={{ width: `${c.avgMastery}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ════ TAB: SISTEMA ════ */}
        {activeTab === "sistema" && (
          <div className="space-y-4">
            {/* System health */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "CPU", value: "42%", icon: <Cpu className="w-5 h-5 text-primary" />, ok: true, bar: 42 },
                { label: "Memoria RAM", value: "58%", icon: <Server className="w-5 h-5 text-warning" />, ok: true, bar: 58 },
                { label: "Almacenamiento", value: "68%", icon: <Database className="w-5 h-5 text-warning" />, ok: true, bar: 68 },
                { label: "Uptime", value: "99.9%", icon: <Activity className="w-5 h-5 text-success" />, ok: true, bar: 99 },
              ].map((m) => (
                <Card key={m.label}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground">{m.icon}</span>
                      <span className={`w-2 h-2 rounded-full ${m.ok ? "bg-success" : "bg-destructive"} animate-pulse`} />
                    </div>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-xl font-bold mb-2">{m.value}</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.bar > 80 ? "bg-destructive" : m.bar > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${m.bar}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Model config */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning" /> Configuración del Modelo XAI (SAKT)
                </CardTitle>
                <CardDescription className="text-xs">Parámetros del modelo de Knowledge Tracing con Explicabilidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Versión del modelo", value: "SAKT v2.1.3", tag: "Producción" },
                    { label: "Último reentrenamiento", value: "Hoy 09:14", tag: "Exitoso" },
                    { label: "Tasa de aprendizaje", value: "0.001", tag: "Optimizado" },
                    { label: "Umbral de confianza XAI", value: "75%", tag: "Configurable" },
                    { label: "Ventana de contexto", value: "50 interacciones", tag: "Fijo" },
                    { label: "Dimensión de embedding", value: "128", tag: "Fijo" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-[10px]">
                      <div>
                        <p className="text-xs text-muted-foreground">{p.label}</p>
                        <p className="text-sm font-semibold font-mono">{p.value}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{p.tag}</Badge>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleRetrain} disabled={modelRetrain}
                    className="gap-2" variant={retrainDone ? "outline" : "default"}>
                    {modelRetrain
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Reentrenando...</>
                      : retrainDone
                      ? <><CheckCircle2 className="w-4 h-4 text-success" /> Completado</>
                      : <><RefreshCw className="w-4 h-4" /> Reentrenar Modelo</>}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => alert("Descargando métricas del modelo...")}>
                    <Download className="w-4 h-4" /> Exportar Métricas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security settings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" /> Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Autenticación de dos factores (2FA)", desc: "Requerido para todos los administradores", enabled: true },
                  { label: "Sesión con expiración automática", desc: "Cierre de sesión tras 30 min de inactividad", enabled: true },
                  { label: "Registro de auditoría", desc: "Todas las acciones quedan registradas en logs", enabled: true },
                  { label: "Acceso API externo", desc: "Permite integración con sistemas institucionales", enabled: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-[10px] border border-border">
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <div className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${s.enabled ? "bg-primary" : "bg-muted"}`}
                      style={{ height: 22 }}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${s.enabled ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ════ TAB: LOGS ════ */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {["Todos", "Error", "Warning", "Info"].map((f) => (
                  <button key={f} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors">
                    {f}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Exportar Logs
              </Button>
            </div>

            <Card>
              <CardContent className="pt-4 pb-4 space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className={`flex items-start gap-3 p-3 rounded-[10px] border ${logBg(log.level)}`}>
                    {logIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-xs font-bold uppercase tracking-wide ${log.level === "error" ? "text-destructive" : log.level === "warning" ? "text-warning" : "text-primary"}`}>
                          {log.level}
                        </span>
                        <Badge variant="outline" className="text-xs">{log.module}</Badge>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ProfileDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        user={{ name: mockAdmin.name, email: mockAdmin.email, role: mockAdmin.role, institution: mockAdmin.institution, avatar: mockAdmin.avatar, memberSince: "Enero 2025", bio: "Administrador de la plataforma SWARD." }}
        initialTab={profileDialogTab}
      />
    </div>
  );
}
