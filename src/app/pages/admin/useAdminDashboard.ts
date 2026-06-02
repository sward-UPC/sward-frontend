import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  mockUsers,
  mockNotifications,
} from "../../../mocks/data/admin.mock";
import type { AdminTab, AdminUser, AdminNotification } from "../../../core/types/admin.types";

export interface UseAdminDashboardReturn {
  // State
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  activeTab: AdminTab;
  userSearch: string;
  roleFilter: string;
  statusFilter: string;
  userList: AdminUser[];
  notifs: AdminNotification[];
  showNotifPopup: boolean;
  showProfilePopup: boolean;
  showProfileDialog: boolean;
  profileDialogTab: "profile" | "settings";
  modelRetrain: boolean;
  retrainDone: boolean;
  unread: number;
  darkMode: boolean;
  notifRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  filteredUsers: AdminUser[];

  // Handlers
  setActiveTab: (tab: AdminTab) => void;
  setUserSearch: (v: string) => void;
  setRoleFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setNotifs: React.Dispatch<React.SetStateAction<AdminNotification[]>>;
  setShowNotifPopup: (v: boolean) => void;
  setShowProfilePopup: (v: boolean) => void;
  setShowProfileDialog: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  toggleUserStatus: (id: number) => void;
  handleRetrain: () => void;
  openProfile: (tab: "profile" | "settings") => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("resumen");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userList, setUserList] = useState<AdminUser[]>(mockUsers);
  const [notifs, setNotifs] = useState<AdminNotification[]>(mockNotifications);
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
    setProfileDialogTab(tab);
    setShowProfileDialog(true);
    setShowProfilePopup(false);
  };

  const toggleUserStatus = (id: number) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const handleRetrain = () => {
    setModelRetrain(true);
    setTimeout(() => {
      setModelRetrain(false);
      setRetrainDone(true);
      setTimeout(() => setRetrainDone(false), 3000);
    }, 3000);
  };

  const filteredUsers = userList.filter((u) => {
    const matchSearch =
      userSearch === "" ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    userSearch,
    roleFilter,
    statusFilter,
    userList,
    notifs,
    showNotifPopup,
    showProfilePopup,
    showProfileDialog,
    profileDialogTab,
    modelRetrain,
    retrainDone,
    unread,
    darkMode,
    notifRef,
    profileRef,
    filteredUsers,
    setActiveTab,
    setUserSearch,
    setRoleFilter,
    setStatusFilter,
    setNotifs,
    setShowNotifPopup,
    setShowProfilePopup,
    setShowProfileDialog,
    setDarkMode,
    toggleUserStatus,
    handleRetrain,
    openProfile,
  };
}
