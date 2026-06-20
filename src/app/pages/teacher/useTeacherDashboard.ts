import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import type {
  Alert,
  StudentProgress,
  TeacherTab,
  TeacherProfile,
  ClassTrendDataPoint,
  EngagementDataPoint,
} from '@core/types';
import { useAuth } from '@core/auth/useAuth';
import { useTeacherCourses } from '@features/teacher/hooks/useTeacherCourses';
import { useTeacherStudents } from '@features/teacher/hooks/useTeacherStudents';
import { useTeacherAlerts } from '@features/teacher/hooks/useTeacherAlerts';
import { useClassTrend } from '@features/teacher/hooks/useClassTrend';
import { useTheme } from '../../context/ThemeContext';

export interface UseTeacherDashboardReturn {
  /* data */
  students: StudentProgress[];
  teacher: TeacherProfile;
  notifications: Alert[];
  trendData: ClassTrendDataPoint[];
  engagementData: EngagementDataPoint[];

  /* datos reales / curso activo */
  courses: { id: string; nombre: string; moodleCourseId: string }[];
  activeCourseId: string | undefined;
  setActiveCourseId: (id: string | undefined) => void;
  isLoadingStudents: boolean;
  usingRealData: boolean;

  /* estados globales del dashboard (skeleton / error / vacío) */
  isLoading: boolean;
  isError: boolean;
  hasCourses: boolean;

  /* derived counts */
  unreadCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgMastery: number;
  sortedStudents: StudentProgress[];

  /* tab state */
  activeTab: TeacherTab;
  setActiveTab: (tab: TeacherTab) => void;

  /* filter state */
  courseFilter: string;
  setCourseFilter: (v: string) => void;
  weekFilter: string;
  setWeekFilter: (v: string) => void;
  riskFilter: string;
  setRiskFilter: (v: string) => void;

  /* student selection */
  selectedStudent: number | null;
  setSelectedStudent: (id: number | null) => void;
  currentStudent: StudentProgress | undefined;

  /* feedback dialog */
  feedbackStudent: { id: number; name: string; estudianteId?: string } | null;
  setFeedbackStudent: (s: { id: number; name: string; estudianteId?: string } | null) => void;

  /* notification popup */
  showNotifPopup: boolean;
  setShowNotifPopup: (v: boolean) => void;
  notifRef: React.RefObject<HTMLDivElement>;
  markAllRead: () => void;
  dismissNotification: (id: number) => void;
  clearNotifications: () => void;

  /* profile popup */
  showProfilePopup: boolean;
  setShowProfilePopup: (v: boolean) => void;
  profileRef: React.RefObject<HTMLDivElement>;

  /* profile dialog */
  showProfileDialog: boolean;
  setShowProfileDialog: (v: boolean) => void;
  profileDialogTab: 'profile' | 'settings';
  openProfile: (tab: 'profile' | 'settings') => void;

  /* sidebar */
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void;

  /* theme */
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function useTeacherDashboard(): UseTeacherDashboardReturn {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Estado en la URL: la tab y el alumno seleccionado viven en query params
  // (?tab=estudiantes&alumno=5) para que un refresh o un enlace compartido
  // restauren la misma vista en vez de volver al inicio del docente. ──────────
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS: TeacherTab[] = ['resumen', 'estudiantes', 'analisis', 'reportes'];
  const tabParam = searchParams.get('tab') as TeacherTab | null;
  const activeTab: TeacherTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'resumen';
  const alumnoParam = searchParams.get('alumno');
  const selectedStudent: number | null = alumnoParam ? Number(alumnoParam) : null;

  const setActiveTab = useCallback((tab: TeacherTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === 'resumen') next.delete('tab');
      else next.set('tab', tab);
      // Cambiar de sección cierra el detalle del alumno.
      next.delete('alumno');
      return next;
    });
  }, [setSearchParams]);

  const setSelectedStudent = useCallback((id: number | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id == null) {
        next.delete('alumno');
      } else {
        // Ver el detalle implica estar en la sección Estudiantes (al volver,
        // aterriza en la lista). Lo fijamos aquí para que los handlers que
        // llaman setActiveTab + setSelectedStudent no compitan por la URL.
        next.set('alumno', String(id));
        next.set('tab', 'estudiantes');
      }
      return next;
    });
  }, [setSearchParams]);

  const [courseFilter, setCourseFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [feedbackStudent, setFeedbackStudent] = useState<{ id: number; name: string; estudianteId?: string } | null>(null);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<'profile' | 'settings'>('profile');
  const [notifications, setNotifications] = useState<Alert[]>([]);

  const { darkMode, setDarkMode } = useTheme();
  const { user } = useAuth();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ── Datos reales (SIN fallback a mock): cargando → skeleton, error → estado
  // de error, vacío → estado vacío. Nunca se muestra data ficticia. ───────────
  const {
    data: courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useTeacherCourses();
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>(undefined);
  // Selecciona el primer curso disponible mientras no haya selección explícita.
  const effectiveCourseId = activeCourseId ?? courses?.[0]?.id;
  const {
    data: realStudents,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useTeacherStudents(effectiveCourseId);

  const students: StudentProgress[] = realStudents ?? [];
  const usingRealData = students.length > 0;

  // Alertas (ms-xai) y tendencia (ms-trazabilidad) reales, sin fallback.
  const { data: realAlerts } = useTeacherAlerts(effectiveCourseId);
  const { data: realTrend } = useClassTrend(effectiveCourseId);

  // Las alertas reales son la fuente de las notificaciones; sin alertas → vacío.
  useEffect(() => {
    setNotifications(realAlerts ?? []);
  }, [realAlerts]);

  const trendData: ClassTrendDataPoint[] = realTrend ?? [];
  const engagementData: EngagementDataPoint[] = students.map((s) => ({
    name: s.name.split(' ')[0] || s.name,
    engagement: s.engagement,
    dominio: s.avgMastery,
  }));

  // Perfil del docente desde la sesión real (no mock).
  const teacher: TeacherProfile = {
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Docente',
    email: user?.email ?? '',
    role: 'Docente',
    department: user?.institution ?? '',
    avatar: user?.avatarUrl ?? '',
    courses: courses?.map((c) => c.nombre).join(', ') ?? '',
  };

  // Estados globales para que la vista muestre skeleton / error / vacío.
  const hasCourses = (courses?.length ?? 0) > 0;
  const isLoading = isLoadingCourses || (!!effectiveCourseId && isLoadingStudents);
  const isError = isErrorCourses || isErrorStudents;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopup(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfilePopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const dismissNotification = (id: number) => setNotifications((p) => p.filter((n) => n.id !== id));
  const clearNotifications = () => setNotifications([]);
  const openProfile = (tab: 'profile' | 'settings') => {
    setProfileDialogTab(tab);
    setShowProfileDialog(true);
    setShowProfilePopup(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highRiskCount = students.filter((s) => s.riskLevel === 'high').length;
  const mediumRiskCount = students.filter((s) => s.riskLevel === 'medium').length;
  const lowRiskCount = students.filter((s) => s.riskLevel === 'low').length;
  const avgMastery = students.length
    ? Math.round(students.reduce((a, s) => a + s.avgMastery, 0) / students.length)
    : 0;

  const sortedStudents = useMemo(
    () =>
      [...students]
        .filter((s) => riskFilter === 'all' || s.riskLevel === riskFilter)
        .sort((a, b) => {
          const order = { high: 0, medium: 1, low: 2 };
          return order[a.riskLevel as keyof typeof order] - order[b.riskLevel as keyof typeof order];
        }),
    [students, riskFilter],
  );

  const currentStudent = students.find((s) => s.id === selectedStudent);

  return {
    students,
    teacher,
    notifications,
    trendData,
    engagementData,

    /* datos reales / curso activo */
    courses: courses ?? [],
    activeCourseId: effectiveCourseId,
    setActiveCourseId,
    isLoadingStudents,
    usingRealData,

    /* estados globales */
    isLoading,
    isError,
    hasCourses,

    unreadCount,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    avgMastery,
    sortedStudents,

    activeTab,
    setActiveTab,

    courseFilter,
    setCourseFilter,
    weekFilter,
    setWeekFilter,
    riskFilter,
    setRiskFilter,

    selectedStudent,
    setSelectedStudent,
    currentStudent,

    feedbackStudent,
    setFeedbackStudent,

    showNotifPopup,
    setShowNotifPopup,
    notifRef,
    markAllRead,
    dismissNotification,
    clearNotifications,

    showProfilePopup,
    setShowProfilePopup,
    profileRef,

    showProfileDialog,
    setShowProfileDialog,
    profileDialogTab,
    openProfile,

    sidebarOpen,
    setSidebarOpen,

    darkMode,
    setDarkMode,
  };
}
