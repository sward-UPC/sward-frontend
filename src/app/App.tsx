import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LoginPage } from "./pages/Login";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

type Page = "login" | "student-dashboard" | "teacher-dashboard" | "admin-dashboard";
type UserRole = "student" | "teacher" | "admin" | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: "student" | "teacher" | "admin") => {
    setUserRole(role);

    switch (role) {
      case "student":
        setCurrentPage("student-dashboard");
        break;
      case "teacher":
        setCurrentPage("teacher-dashboard");
        break;
      case "admin":
        setCurrentPage("admin-dashboard");
        break;
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage("login");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} />;
      case "student-dashboard":
        return <StudentDashboard onLogout={handleLogout} />;
      case "teacher-dashboard":
        return <TeacherDashboard onLogout={handleLogout} />;
      case "admin-dashboard":
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="size-full">{renderPage()}</div>
    </ThemeProvider>
  );
}