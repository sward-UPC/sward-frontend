import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import type { NavItem } from '@core/types';
import { useNotifications } from '@features/notifications/useNotifications';
import type { AppNotification } from '@features/notifications/notifications.service';

export interface UseStudentDashboardReturn {
  /* navigation */
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  /* notifications */
  notifications: AppNotification[];
  unreadCount: number;
  showNotifPopup: boolean;
  setShowNotifPopup: React.Dispatch<React.SetStateAction<boolean>>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismissNotification: (id: string) => void;
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

  // El sidebar es persistente en desktop (abierto/expandido por defecto) pero un
  // drawer en móvil (oculto por defecto, se abre con el botón hamburguesa). El
  // estado inicial depende del ancho: en móvil (< md/768px) arranca CERRADO para
  // que no tape el contenido al cargar.
  const [sidebarOpen, setSidebarOpen] = useState(
    () => (typeof window === 'undefined' ? true : window.innerWidth >= 768),
  );
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<'profile' | 'settings'>('profile');

  // Notificaciones REALES del usuario (ms-usuarios) con polling. Reemplaza el mock.
  const notif = useNotifications();

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

  const clearNotifications = () => notif.notifications.forEach((n) => notif.dismiss(n.id));
  const openProfile = (tab: 'profile' | 'settings') => {
    setProfileDialogTab(tab);
    setShowProfileDialog(true);
    setShowProfilePopup(false);
  };

  return {
    activeNav,
    setActiveNav,
    sidebarOpen,
    setSidebarOpen,
    notifications: notif.notifications,
    unreadCount: notif.unreadCount,
    showNotifPopup,
    setShowNotifPopup,
    markAllRead: notif.markAllRead,
    markRead: notif.markRead,
    dismissNotification: notif.dismiss,
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
