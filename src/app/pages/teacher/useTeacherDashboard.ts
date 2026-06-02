import { useState, useRef, useEffect } from 'react';
import type { Alert, StudentProgress, TeacherTab } from '@core/types';
import {
  mockStudents,
  mockTeacher,
  mockTeacherNotifications,
  mockTrendData,
  mockEngagementData,
} from '@mocks/data/teacher.mock';
import { useTheme } from '../../context/ThemeContext';

export interface UseTeacherDashboardReturn {
  /* data */
  students: StudentProgress[];
  teacher: typeof mockTeacher;
  notifications: Alert[];
  trendData: typeof mockTrendData;
  engagementData: typeof mockEngagementData;

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

  /* theme */
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function useTeacherDashboard(): UseTeacherDashboardReturn {
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
  const highRiskCount = mockStudents.filter((s) => s.riskLevel === 'high').length;
  const mediumRiskCount = mockStudents.filter((s) => s.riskLevel === 'medium').length;
  const lowRiskCount = mockStudents.filter((s) => s.riskLevel === 'low').length;
  const avgMastery = Math.round(mockStudents.reduce((a, s) => a + s.avgMastery, 0) / mockStudents.length);

  const sortedStudents = [...mockStudents]
    .filter((s) => riskFilter === 'all' || s.riskLevel === riskFilter)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.riskLevel as keyof typeof order] - order[b.riskLevel as keyof typeof order];
    });

  const currentStudent = mockStudents.find((s) => s.id === selectedStudent);

  return {
    students: mockStudents,
    teacher: mockTeacher,
    notifications,
    trendData: mockTrendData,
    engagementData: mockEngagementData,

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

    darkMode,
    setDarkMode,
  };
}
