import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import { mockNotifications } from '@mocks/data/student.mock';
import type { NavItem, StudentNotification } from '@core/types';

export interface UseStudentDashboardReturn {
  /* navigation */
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  /* resources */
  selectedSideResource: number | null;
  setSelectedSideResource: (id: number | null) => void;
  completedResources: number[];
  handleCompleteFromTab: (id: number) => void;
  handleCompleteSideResource: () => void;
  completedCount: number;
  totalResources: number;
  streak: number;

  /* notifications */
  notifications: StudentNotification[];
  unreadCount: number;
  showNotifPopup: boolean;
  setShowNotifPopup: React.Dispatch<React.SetStateAction<boolean>>;
  markAllRead: () => void;
  dismissNotification: (id: number) => void;
  clearNotifications: () => void;
  notifRef: React.RefObject<HTMLDivElement>;

  /* profile popup */
  showProfilePopup: boolean;
  setShowProfilePopup: React.Dispatch<React.SetStateAction<boolean>>;
  showProfileDialog: boolean;
  setShowProfileDialog: React.Dispatch<React.SetStateAction<boolean>>;
  profileDialogTab: 'profile' | 'settings';
  openProfile: (tab: 'profile' | 'settings') => void;
  profileRef: React.RefObject<HTMLDivElement>;

  /* theme */
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function useStudentDashboard(): UseStudentDashboardReturn {
  // Sección activa en la URL (?nav=progreso) → el refresh mantiene la vista.
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_NAV: NavItem[] = ['hoy', 'aprendizaje', 'atencion', 'progreso', 'recursos'];
  const navParam = searchParams.get('nav') as NavItem | null;
  const activeNav: NavItem = navParam && VALID_NAV.includes(navParam) ? navParam : 'hoy';
  const setActiveNav = useCallback((nav: NavItem) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nav === 'hoy') next.delete('nav');
      else next.set('nav', nav);
      return next;
    });
  }, [setSearchParams]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSideResource, setSelectedSideResource] = useState<number | null>(null);
  const [completedResources, setCompletedResources] = useState<number[]>([]);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<'profile' | 'settings'>('profile');
  const [notifications, setNotifications] = useState<StudentNotification[]>(mockNotifications);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const handleCompleteFromTab = (id: number) => setCompletedResources((p) => [...p, id]);
  const handleCompleteSideResource = () => {
    if (selectedSideResource) {
      setCompletedResources((p) => [...p, selectedSideResource]);
      setSelectedSideResource(null);
    }
  };

  const completedCount = 12 + completedResources.length;
  const totalResources = 18;
  const streak = 5;

  return {
    activeNav,
    setActiveNav,
    sidebarOpen,
    setSidebarOpen,
    selectedSideResource,
    setSelectedSideResource,
    completedResources,
    handleCompleteFromTab,
    handleCompleteSideResource,
    completedCount,
    totalResources,
    streak,
    notifications,
    unreadCount,
    showNotifPopup,
    setShowNotifPopup,
    markAllRead,
    dismissNotification,
    clearNotifications,
    notifRef,
    showProfilePopup,
    setShowProfilePopup,
    showProfileDialog,
    setShowProfileDialog,
    profileDialogTab,
    openProfile,
    profileRef,
    darkMode,
    setDarkMode,
  };
}
