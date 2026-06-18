import { useState, useRef, useEffect, useMemo } from 'react';
import type { Alert, StudentProgress, TeacherTab } from '@core/types';
import {
  mockStudents,
  mockTeacher,
  mockTeacherNotifications,
  mockTrendData,
  mockEngagementData,
} from '@mocks/data/teacher.mock';
import { useTeacherCourses } from '@features/teacher/hooks/useTeacherCourses';
import { useTeacherStudents } from '@features/teacher/hooks/useTeacherStudents';
import { useTeacherAlerts } from '@features/teacher/hooks/useTeacherAlerts';
import { useClassTrend } from '@features/teacher/hooks/useClassTrend';
import { useTheme } from '../../context/ThemeContext';

export interface UseTeacherDashboardReturn {
  /* data */
  students: StudentProgress[];
  teacher: typeof mockTeacher;
  notifications: Alert[];
  trendData: typeof mockTrendData;
  engagementData: typeof mockEngagementData;

  /* datos reales / curso activo */
  courses: { id: string; nombre: string; moodleCourseId: string }[];
  activeCourseId: string | undefined;
  setActiveCourseId: (id: string | undefined) => void;
  isLoadingStudents: boolean;
  usingRealData: boolean;

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
  feedbackStudent: { id: number; name: string } | null;
  setFeedbackStudent: (s: { id: number; name: string } | null) => void;

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
  const [activeTab, setActiveTab] = useState<TeacherTab>('resumen');
  const [courseFilter, setCourseFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [feedbackStudent, setFeedbackStudent] = useState<{ id: number; name: string } | null>(null);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<'profile' | 'settings'>('profile');
  const [notifications, setNotifications] = useState<Alert[]>(mockTeacherNotifications);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ── Datos reales (con fallback a mock si no hay curso/datos) ──────────────
  const { data: courses } = useTeacherCourses();
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>(undefined);
  // Selecciona el primer curso disponible mientras no haya selección explícita.
  const effectiveCourseId = activeCourseId ?? courses?.[0]?.id;
  const { data: realStudents, isLoading: isLoadingStudents } =
    useTeacherStudents(effectiveCourseId);

  // Si el backend devuelve estudiantes, se usan; si no, se conserva el mock
  // para no perder la vista (ver PENDIENTES-PANEL-DOCENTE.md).
  const usingRealData = !!realStudents && realStudents.length > 0;
  const students: StudentProgress[] = usingRealData ? realStudents : mockStudents;

  // Alertas (ms-xai) y tendencia (ms-trazabilidad) reales, con fallback a mock.
  const { data: realAlerts } = useTeacherAlerts(effectiveCourseId);
  const { data: realTrend } = useClassTrend(effectiveCourseId);

  // Cuando llegan alertas reales, reemplazan a las notificaciones mock.
  useEffect(() => {
    if (realAlerts && realAlerts.length > 0) setNotifications(realAlerts);
  }, [realAlerts]);

  const trendData = realTrend && realTrend.length > 0 ? realTrend : mockTrendData;
  // Engagement real: se deriva de los estudiantes reales; si no, mock.
  const engagementData = usingRealData
    ? students.map((s) => ({
        name: s.name.split(' ')[0] || s.name,
        engagement: s.engagement,
        dominio: s.avgMastery,
      }))
    : mockEngagementData;

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
    teacher: mockTeacher,
    notifications,
    trendData,
    engagementData,

    /* datos reales / curso activo */
    courses: courses ?? [],
    activeCourseId: effectiveCourseId,
    setActiveCourseId,
    isLoadingStudents,
    usingRealData,

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
