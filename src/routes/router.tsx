import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { AppLayout } from '@shared/components/layout/AppLayout';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { UserRole } from '@core/types';

// Lazy loading para reducir el bundle inicial
const LoginPage = lazy(() =>
  import('../app/pages/Login').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../app/pages/Register').then((m) => ({ default: m.RegisterPage }))
);
const StudentDashboard = lazy(() =>
  import('../app/pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard }))
);
const TeacherDashboard = lazy(() =>
  import('../app/pages/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard }))
);
const AdminDashboard = lazy(() =>
  import('../app/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="w-10 h-10" label="Cargando página..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    // Raíz → redirige a login
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },

    // Login maneja su propio layout full-screen (panel lateral + card)
    {
      path: '/login',
      element: (
        <SuspenseWrapper>
          <LoginPage onLogin={() => {}} />
        </SuspenseWrapper>
      ),
    },

    // Registro usa AuthLayout centrado
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/register',
          element: (
            <SuspenseWrapper>
              <RegisterPage />
            </SuspenseWrapper>
          ),
        },
      ],
    },

    // Rutas de estudiante
    {
      element: <ProtectedRoute allowedRoles={[UserRole.Student]} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              path: '/student/*',
              element: <SuspenseWrapper><StudentDashboard /></SuspenseWrapper>,
            },
          ],
        },
      ],
    },

    // Rutas de docente
    {
      element: <ProtectedRoute allowedRoles={[UserRole.Teacher]} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              path: '/teacher/*',
              element: <SuspenseWrapper><TeacherDashboard /></SuspenseWrapper>,
            },
          ],
        },
      ],
    },

    // Rutas de administrador
    {
      element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              path: '/admin/*',
              element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>,
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
