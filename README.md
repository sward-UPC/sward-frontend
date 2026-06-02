# SWARD Frontend

**Sistema Web Distribuido de Recomendación Adaptativa y Explicable**

Aplicación web del proyecto de tesis **TP202610051** (UPC – Lima, Perú). SWARD personaliza el recorrido de aprendizaje de cada estudiante usando el modelo de Knowledge Tracing SAKT (Self-Attentive Knowledge Tracing), genera recomendaciones de recursos adaptativas y expone las decisiones del modelo con técnicas XAI (Explicabilidad de IA) para estudiantes, docentes y administradores.

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React + TypeScript | 18.x / 5.x |
| Build | Vite | 6.x |
| Estilos | Tailwind CSS v4 | 4.x |
| Componentes UI | shadcn/ui (Radix UI) | — |
| Routing | React Router v7 | 7.x |
| Data fetching | @tanstack/react-query | 5.x |
| HTTP client | Axios | 1.x |
| Formularios | react-hook-form | 7.x |
| Gráficos | Recharts | 2.x |
| Animaciones | Motion (ex Framer Motion) | 12.x |
| Gestor de paquetes | pnpm | — |

> MUI (`@mui/material`, `@emotion/*`) fue eliminado. La UI unifica exclusivamente en shadcn/ui + Tailwind.

---

## Estado de implementación

### Implementado con datos mock

| Épica PRD | Vista | Estado |
|---|---|---|
| EP001 | Login (`/login`) | UI completa, auth con mock |
| EP001 | Register (`/register`) | UI completa, sin validación backend |
| EP003 | StudentDashboard — Inicio, Aprendizaje, Progreso, Recursos | UI completa, datos mock inline |
| EP004 | XAI — AttentionHeatmap, KnowledgeGraph, XAIExplanation, DomainRadar | Componentes funcionales, datos mock |
| EP005 | TeacherDashboard — Resumen, Estudiantes, Análisis, Reportes | UI completa, datos mock |
| EP006 | AdminDashboard — Usuarios, Cursos, Sistema, Logs | UI completa, datos mock |

### Pendiente de integración

| Épica PRD | Descripción |
|---|---|
| EP001 | JWT real: login/register contra API Gateway, refresh token, recuperación de contraseña |
| EP002 | Vista de integración Moodle (sincronización de cursos y actividades) |
| EP003 | Endpoints reales: `/recommendations`, `/knowledge-state` (SAKT) |
| EP004 | Endpoints XAI: `/xai/attention-heatmap`, `/xai/explanation` |
| EP005 | Endpoints teacher: `/teacher/students`, `/teacher/alerts`, exportar PDF |
| EP006 | Endpoints admin: `/admin/users`, `/admin/metrics` |
| — | React Router v7 — el routing actual usa `useState` switch en App.tsx |
| — | AuthContext + ProtectedRoute (RBAC por rol) |
| — | React Query (`useQuery`, `useMutation`) reemplazando mock directo |

---

## Arquitectura objetivo (feature-based)

```
src/
├── core/
│   ├── api/
│   │   ├── client.ts           # axios instance con JWT interceptor
│   │   └── endpoints.ts        # constantes de endpoints del PRD
│   ├── auth/
│   │   ├── AuthContext.tsx     # AuthContext + AuthProvider con JWT
│   │   ├── useAuth.ts          # hook que consume AuthContext
│   │   └── ProtectedRoute.tsx  # guard para rutas autenticadas (RBAC)
│   └── types/
│       ├── auth.types.ts       # User, LoginRequest, RegisterRequest, AuthResponse
│       ├── student.types.ts    # KnowledgeState, Recommendation, Interaction
│       ├── teacher.types.ts    # StudentProgress, Alert, Feedback
│       └── index.ts            # re-exports
├── features/
│   ├── auth/                   # login, register, logout, refresh
│   ├── student/                # recomendaciones, knowledge state, interacciones
│   ├── xai/                    # attention heatmap, explicaciones
│   ├── teacher/                # lista de estudiantes, alertas
│   └── admin/                  # gestión de usuarios, métricas
├── shared/
│   ├── components/
│   │   ├── layout/             # AppLayout (autenticado), AuthLayout (login/register)
│   │   └── feedback/           # LoadingSpinner, ErrorBoundary, EmptyState
│   └── hooks/                  # useDebounce, useMediaQuery
├── mocks/
│   └── data/                   # mock data extraída de pages (student, teacher, xai)
├── routes/
│   └── router.tsx              # createBrowserRouter + lazy loading
└── app/                        # código legacy Figma (no borrar aún)
    ├── pages/                  # StudentDashboard, TeacherDashboard, AdminDashboard
    └── components/             # ui/, xai/, teacher/, resources/
```

---

## Configuración local

### Requisitos

- Node.js >= 20
- pnpm >= 9

### Instalación

```bash
pnpm install
```

### Variables de entorno

```bash
cp .env.example .env
```

`.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
```

### Comandos

```bash
pnpm dev          # servidor de desarrollo en http://localhost:5173
pnpm build        # build de producción
pnpm preview      # preview del build
pnpm lint         # ESLint sobre src/
pnpm type-check   # tsc --noEmit
```

---

## Roles de usuario

| Rol | Ruta base | Vistas |
|---|---|---|
| `student` | `/student/*` | Inicio, Mi Aprendizaje (XAI), Mapa de Atención, Progreso, Recursos |
| `teacher` | `/teacher/*` | Resumen de clase, Lista de estudiantes, Análisis, Reportes PDF |
| `admin` | `/admin/*` | Usuarios, Cursos, Estado del sistema, Logs |

Las rutas protegidas usan `ProtectedRoute` con RBAC: si el token JWT no tiene el rol requerido, redirige a `/login`.

---

## Convenciones de código

- **TypeScript estricto**: `strict: true` en tsconfig, sin `any` explícito
- **Path aliases**: `@core/*`, `@features/*`, `@shared/*`, `@mocks/*`, `@routes/*`
- **Componentes**: PascalCase, un componente por archivo
- **Hooks**: prefijo `use`, retornan objeto con propiedades nombradas (no array salvo casos simétricos tipo `useState`)
- **Servicios**: funciones puras que reciben parámetros y retornan `Promise<T>`; no manejan estado de UI
- **Commits**: Conventional Commits en español (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- **Naming de query keys**: semánticos por recurso y usuario — `['recommendations', userId]`, `['knowledge-state', userId]`

### Estructura de un PR

1. Rama desde `main`: `feat/<épica>-<descripción-corta>` o `fix/<descripción>`
2. PR title sigue Conventional Commits
3. Al menos un reviewer antes de mergear
4. Tests de UI (vitest + testing-library) obligatorios para nuevos hooks y servicios

---

## Accesibilidad

El proyecto apunta a cumplir **WCAG 2.1 nivel AA**. Ver `ACCESIBILIDAD.md` para el estado actual de cada vista.

---

## Documentación del proyecto

- PRD v1.0: `src/imports/PRD-SWARD-v1.0.md`
- Funcionalidad XAI: `FUNCIONALIDAD-XAI.md`
- Guia de estilos: `guidelines/Guidelines.md`
- Progreso de implementacion: `docs/PROGRESS.md`

---

## Proyecto académico

**TP202610051** — Universidad Peruana de Ciencias Aplicadas (UPC), Lima, Perú.
Repositorio GitHub: organización `TP202610051`.
