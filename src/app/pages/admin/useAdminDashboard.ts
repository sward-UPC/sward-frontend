import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { useAdminUsers } from "../../../features/admin/hooks/useAdminUsers";
import { useUpdateUserStatus } from "../../../features/admin/hooks/useUpdateUserStatus";
import { useNotifications } from "@features/notifications/useNotifications";
import type { AppNotification } from "@features/notifications/notifications.service";
import type { AdminTab, AdminUser, UserStatus } from "../../../core/types/admin.types";

export interface UseAdminDashboardReturn {
  // State
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  activeTab: AdminTab;
  userSearch: string;
  roleFilter: string;
  statusFilter: string;
  users: AdminUser[];
  usersTotal: number;
  usersLoading: boolean;
  usersError: boolean;
  notifs: AppNotification[];
  showNotifPopup: boolean;
  showProfilePopup: boolean;
  showProfileDialog: boolean;
  profileDialogTab: "profile" | "settings";
  modelRetrain: boolean;
  retrainDone: boolean;
  unread: number;
  darkMode: boolean;
  notifRef: React.RefObject<HTMLDivElement | null>;
  profileRef: React.RefObject<HTMLDivElement | null>;
  filteredUsers: AdminUser[];

  // Handlers
  setActiveTab: (tab: AdminTab) => void;
  setUserSearch: (v: string) => void;
  setRoleFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismissNotif: (id: string) => void;
  setShowNotifPopup: (v: boolean) => void;
  setShowProfilePopup: (v: boolean) => void;
  setShowProfileDialog: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  toggleUserStatus: (id: string, currentStatus: UserStatus) => void;
  handleRetrain: () => void;
  openProfile: (tab: "profile" | "settings") => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tab activa en la URL (?tab=usuarios) → el refresh mantiene la sección.
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS: AdminTab[] = ["resumen", "usuarios", "cursos", "sistema", "logs"];
  const tabParam = searchParams.get("tab") as AdminTab | null;
  const activeTab: AdminTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "resumen";
  const setActiveTab = useCallback((tab: AdminTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === "resumen") next.delete("tab");
      else next.set("tab", tab);
      return next;
    });
  }, [setSearchParams]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const notif = useNotifications();
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileDialogTab, setProfileDialogTab] = useState<"profile" | "settings">("profile");
  const [modelRetrain, setModelRetrain] = useState(false);
  const [retrainDone, setRetrainDone] = useState(false);

  const { darkMode, setDarkMode } = useTheme();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: usersData, isLoading: usersLoading, isError: usersError } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const users = usersData?.items ?? [];
  const usersTotal = usersData?.total ?? 0;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifPopup(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfilePopup(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const openProfile = (tab: "profile" | "settings") => {
    setProfileDialogTab(tab);
    setShowProfileDialog(true);
    setShowProfilePopup(false);
  };

  const toggleUserStatus = (id: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus = currentStatus === "active" ? "inactive" : "active";
    updateStatus.mutate({ userId: id, status: nextStatus });
  };

  const handleRetrain = () => {
    setModelRetrain(true);
    setTimeout(() => {
      setModelRetrain(false);
      setRetrainDone(true);
      setTimeout(() => setRetrainDone(false), 3000);
    }, 3000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        userSearch === "" ||
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  return {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    userSearch,
    roleFilter,
    statusFilter,
    users,
    usersTotal,
    usersLoading,
    usersError,
    notifs: notif.notifications,
    showNotifPopup,
    showProfilePopup,
    showProfileDialog,
    profileDialogTab,
    modelRetrain,
    retrainDone,
    unread: notif.unreadCount,
    darkMode,
    notifRef,
    profileRef,
    filteredUsers,
    setActiveTab,
    setUserSearch,
    setRoleFilter,
    setStatusFilter,
    markAllRead: notif.markAllRead,
    markRead: notif.markRead,
    dismissNotif: notif.dismiss,
    setShowNotifPopup,
    setShowProfilePopup,
    setShowProfileDialog,
    setDarkMode,
    toggleUserStatus,
    handleRetrain,
    openProfile,
  };
}
