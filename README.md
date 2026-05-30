# sward-frontend

Aplicación web del sistema **SWARD** (Sistema Web de Recomendación Adaptativa y Explicable).

Interfaz de usuario para estudiantes, docentes y administradores. Consume los microservicios del backend mediante el API Gateway.

## Stack

- React.js · TypeScript · Vite
- Tailwind CSS
- React Query (data fetching)
- React Router v6

## Usuarios

| Rol | Vistas principales |
|---|---|
| **Estudiante** | Dashboard, Recomendaciones, Progreso, XAI |
| **Docente** | Dashboard de trazabilidad, Alertas, Reportes PDF |
| **Administrador** | Panel de usuarios, Métricas |

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

## Variables de entorno

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8000  (apunta al API Gateway)
```

## Proyecto

**TP202610051** — Universidad Peruana de Ciencias Aplicadas (UPC)
Taller de Proyecto 1 / 2026
