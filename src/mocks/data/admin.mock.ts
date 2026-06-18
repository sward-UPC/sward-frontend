import type {
  AdminCourse,
  SystemLog,
  AdminNotification,
  ActivityDataPoint,
  UserDistDataPoint,
} from "../../core/types/admin.types";

export const mockCourses: AdminCourse[] = [
  { id: 1, name: "Inteligencia Artificial", teacher: "Prof. María Docente", students: 24, avgMastery: 69, status: "active", startDate: "Mar 2026" },
  { id: 2, name: "Machine Learning", teacher: "Prof. María Docente", students: 18, avgMastery: 74, status: "active", startDate: "Mar 2026" },
  { id: 3, name: "Deep Learning", teacher: "Prof. Luis Torres", students: 15, avgMastery: 61, status: "active", startDate: "Abr 2026" },
  { id: 4, name: "Bases de Datos", teacher: "Prof. Luis Torres", students: 30, avgMastery: 78, status: "active", startDate: "Mar 2026" },
  { id: 5, name: "Algoritmos y Estructuras", teacher: "Prof. Sandra Ruiz", students: 22, avgMastery: 55, status: "inactive", startDate: "Feb 2026" },
];

export const activityData: ActivityDataPoint[] = [
  { day: "Lun", sesiones: 42, nuevos: 3 },
  { day: "Mar", sesiones: 38, nuevos: 1 },
  { day: "Mié", sesiones: 55, nuevos: 5 },
  { day: "Jue", sesiones: 61, nuevos: 2 },
  { day: "Vie", sesiones: 49, nuevos: 4 },
  { day: "Sáb", sesiones: 22, nuevos: 0 },
  { day: "Dom", sesiones: 18, nuevos: 1 },
];

export const userDistData: UserDistDataPoint[] = [
  { name: "Estudiantes", value: 0, color: "#6366f1" },
  { name: "Docentes",    value: 0, color: "#10b981" },
  { name: "Admins",      value: 0, color: "#f59e0b" },
];

export const mockNotifications: AdminNotification[] = [
  { id: 1, type: "warning", title: "CPU alta", message: "El servidor procesó picos de >85% CPU.", time: "Hace 1 h", read: false },
  { id: 2, type: "info",    title: "Backup completado", message: "Backup diario exitoso (2.3 GB).", time: "Hoy 03:00", read: false },
  { id: 3, type: "error",   title: "Error en exportación", message: "Fallo al generar reporte PDF.", time: "Ayer", read: true },
];

export const systemLogs: SystemLog[] = [
  { id: 1, level: "info",    message: "Modelo SAKT reentrenado exitosamente", time: "Hoy 09:14", module: "XAI Engine" },
  { id: 2, level: "warning", message: "Latencia elevada en predicciones (>200ms)", time: "Hoy 08:52", module: "API" },
  { id: 3, level: "info",    message: "Backup diario completado (2.3 GB)", time: "Hoy 03:00", module: "Database" },
  { id: 4, level: "info",    message: "Usuario suspendido: sandra.ruiz@sward.edu.pe", time: "Ayer 16:30", module: "Auth" },
  { id: 5, level: "error",   message: "Fallo en exportación PDF — timeout al generar reporte", time: "Ayer 14:22", module: "Reports" },
  { id: 6, level: "info",    message: "Nuevo curso creado: Deep Learning (Prof. Luis Torres)", time: "Ayer 11:05", module: "Courses" },
  { id: 7, level: "warning", message: "Uso de CPU >85% durante 5 min", time: "Ayer 10:18", module: "Infrastructure" },
  { id: 8, level: "info",    message: "3 nuevos usuarios registrados", time: "Ayer 09:00", module: "Auth" },
];
