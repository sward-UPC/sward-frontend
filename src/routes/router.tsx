import { lazy, Suspense, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { UserRole } from '@core/types';

// Lazy loading con retry automático ante chunks obsoletos (GitHub Pages cache)
const LoginPage = lazyWithRetry(() =>
  import('../app/pages/Login').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazyWithRetry(() =>
  import('../app/pages/Register').then((m) => ({ default: m.RegisterPage }))
);
const StudentDashboard = lazyWithRetry(() =>
  import('../app/pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard }))
);
const TeacherDashboard = lazyWithRetry(() =>
  import('../app/pages/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard }))
);
const AdminDashboard = lazyWithRetry(() =>
  import('../app/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

// Retry lazy import once on chunk load failure (stale deploy cache on GitHub Pages)
function lazyWithRetry<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(() =>
    factory().catch(() => {
      window.location.reload();
      return new Promise<never>(() => {});
    })
  );
}

class ChunkErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  componentDidCatch(_: Error, __: ErrorInfo) { this.setState({ error: true }); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-8">
          <p className="text-muted-foreground text-sm">Hubo un problema al cargar la página.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChunkErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="w-10 h-10" label="Cargando página..." />
          </div>
        }
      >
        {children}
      </Suspense>
    </ChunkErrorBoundary>
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
          <LoginPage />
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

    // Dashboards: cada uno tiene su propio layout (topbar + sidebar)
    // AppLayout no se usa porque causaría doble sidebar/topbar
    {
      element: <ProtectedRoute allowedRoles={[UserRole.Student]} />,
      children: [
        {
          path: '/student/*',
          element: <SuspenseWrapper><StudentDashboard /></SuspenseWrapper>,
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[UserRole.Teacher]} />,
      children: [
        {
          path: '/teacher/*',
          element: <SuspenseWrapper><TeacherDashboard /></SuspenseWrapper>,
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
      children: [
        {
          path: '/admin/*',
          element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
