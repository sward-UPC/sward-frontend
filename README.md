# SWARD Frontend

**SWARD** (Sistema Web de Recomendación Adaptativa y Explicable de Recursos Educativos) es la
interfaz web de una plataforma educativa adaptativa. A partir de la trazabilidad de la actividad
del estudiante y de un modelo de *Deep Knowledge Tracing* (SAKT), SWARD recomienda recursos
personalizados, explica sus decisiones mediante técnicas de IA Explicable (XAI) y ofrece a los
docentes paneles de seguimiento y control sobre el progreso de su clase.

Este repositorio contiene únicamente el **frontend**: una SPA en React que consume la API de los
microservicios de SWARD y se despliega en **GitHub Pages**.

---

## Stack tecnológico

- **React 19** + **TypeScript 5**
- **Vite 6** como bundler y servidor de desarrollo
- **Tailwind CSS 4** (vía `@tailwindcss/vite`) + componentes **shadcn/ui** (Radix UI)
- **React Router 7** para el enrutado y la protección de rutas por rol
- **TanStack React Query 5** para la gestión de datos del servidor (fetching, caché, revalidación)
- **Axios** como cliente HTTP
- **Recharts** para visualizaciones y **motion** para animaciones

---

## Estructura del proyecto

```
src/
├── app/                  # Capa de presentación de la aplicación
│   ├── pages/            # Páginas por rol: StudentDashboard, TeacherDashboard,
│   │                     #   AdminDashboard, Login, Register
│   ├── components/       # Componentes de UI (student, teacher, xai, resources,
│   │                     #   notifications, ui/ shadcn)
│   ├── context/          # ThemeContext
│   └── lib/              # Utilidades de UI (utils.ts)
│
├── core/                 # Infraestructura transversal (no depende de features)
│   ├── api/              # Cliente axios y definición de endpoints
│   ├── auth/             # AuthContext, useAuth, ProtectedRoute (control por rol)
│   ├── types/            # Tipos globales del dominio (auth, student, teacher, admin, xai)
│   └── constants.ts      # Constantes del dominio (roles, tipos de recurso, umbrales)
│
├── features/             # Lógica de negocio por dominio (hooks + services)
│   ├── auth/             # Autenticación y sesión
│   ├── student/          # Recomendaciones SAKT, material generado, gamificación
│   ├── teacher/          # Dashboard docente, feedback, alertas
│   ├── admin/            # Administración
│   ├── xai/              # Explicabilidad (mapas de atención, etc.)
│   └── notifications/    # Notificaciones docente → estudiante
│
├── shared/               # Componentes y hooks reutilizables entre features
├── routes/               # Definición del árbol de rutas y lazy loading
├── styles/               # globals.css, tailwind.css, theme.css, fonts, view-transitions
├── mocks/                # Datos mock para desarrollo sin backend
└── main.tsx              # Punto de entrada
```

La aplicación sigue una separación en capas: `core/` (infraestructura), `features/` (negocio por
dominio) y `app/` (presentación). Los alias de import (`@`, `@core`, `@features`, `@shared`,
`@mocks`, `@routes`) están configurados en `vite.config.ts` y `tsconfig.json`.

---

## Roles de usuario

La aplicación define tres roles, cada uno con su propio dashboard y rutas protegidas
(`ProtectedRoute`). El rol del usuario proviene del backend (LMS / Moodle) tras el login.

| Rol            | Ruta base    | Descripción |
|----------------|--------------|-------------|
| **Estudiante** | `/student/*` | Recibe recomendaciones personalizadas (SAKT), visualiza su progreso, dominio por tema, gamificación y explicaciones XAI de las recomendaciones. |
| **Docente**    | `/teacher/*` | Consulta el progreso de su clase, engagement, tendencias, alertas de riesgo y envía retroalimentación a los estudiantes. |
| **Admin**      | `/admin/*`   | Administración general de la plataforma. |

---

## Desarrollo local

Requisitos: **Node 20+**. El proyecto usa **pnpm** (lockfile `pnpm-lock.yaml`); también funciona
con npm.

```bash
# Instalar dependencias
pnpm install        # o: npm install

# Servidor de desarrollo (http://localhost:5173)
pnpm dev            # o: npm run dev

# Verificación de tipos
pnpm type-check     # o: npm run type-check

# Lint
pnpm lint           # o: npm run lint
```

### Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable        | Descripción                                              | Ejemplo |
|-----------------|----------------------------------------------------------|---------|
| `VITE_API_URL`  | URL base de la API de microservicios de SWARD            | `http://localhost:8000` (local) · `https://d11c2gdoarsvsa.cloudfront.net` (prod) |
| `VITE_APP_ENV`  | Entorno de la aplicación                                 | `development` |
| `VITE_BASE_URL` | Ruta base de servido (lo usa Vite). En GitHub Pages debe ser `/sward-frontend/` | `/` |

---

## Build

```bash
pnpm build          # o: npm run build
```

Genera la versión de producción en `dist/`. Para previsualizar localmente puedes servir esa carpeta
con cualquier servidor estático.

---

## Despliegue (GitHub Pages)

El despliegue es automático mediante GitHub Actions (`.github/workflows/deploy-pages.yml`): en cada
**push a `main`** se construye la aplicación y se publica en GitHub Pages.

Puntos clave del despliegue:

- El sitio se sirve bajo la subruta **`/sward-frontend/`**, por lo que el workflow construye con
  `VITE_BASE_URL=/sward-frontend/` y `VITE_API_URL` apuntando al backend de producción (CloudFront).
- Al ser una SPA, el workflow copia `dist/index.html` a `dist/404.html` para que GitHub Pages
  redirija correctamente las rutas del lado del cliente (deep links).
- También puede lanzarse manualmente desde la pestaña *Actions* (`workflow_dispatch`).

---

## Documentación adicional

- [`guidelines/Guidelines.md`](guidelines/Guidelines.md) — guía de implementación para el equipo.
- [`ACCESIBILIDAD.md`](ACCESIBILIDAD.md) — cumplimiento WCAG 2.1 AA.
- [`FUNCIONALIDAD-XAI.md`](FUNCIONALIDAD-XAI.md) — detalle de las funcionalidades de IA Explicable.
- [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) — atribuciones de terceros (shadcn/ui, Unsplash).
