# SWARD - Sistema Web de Recomendación Adaptativa

> **Maqueta Funcional de Alta Fidelidad**  
> Sistema Web Distribuido de Recomendación Adaptativa y Explicable de Recursos Educativos  
> Basado en Deep Knowledge Tracing (SAKT) con Trazabilidad y Control Docente

---

## 📋 Descripción del Proyecto

SWARD es un sistema de aprendizaje adaptativo desarrollado como proyecto académico para la Universidad Peruana de Ciencias Aplicadas (UPC). Esta maqueta funcional implementa:

- ✅ Flujo completo de autenticación (Login/Registro)
- ✅ Dashboard de Estudiante con arquitectura 70/30
- ✅ Dashboard Docente con trazabilidad en tiempo real
- ✅ Visualización de mapas de atención SAKT
- ✅ Sistema de recomendaciones adaptativas
- ✅ Explicabilidad XAI (Inteligencia Artificial Explicable)
- ✅ Cumplimiento WCAG 2.1 Nivel AA

---

## 🎨 Sistema de Diseño

### Paleta de Colores Institucional
- **Fondo Neutro**: `#F9FAFB`
- **Contenedores**: `#FFFFFF`
- **Acento Primario (Morado UPC)**: `#4F46E5`
- **Semáforo de Riesgo**:
  - Verde (Bajo): `#10B981`
  - Amarillo (Medio): `#F59E0B`
  - Rojo (Alto): `#DC2626`

### Especificaciones de Diseño
- **Espaciado**: Escala de 4px
- **Bordes Redondeados**: 12px
- **Sombras**: Suaves (shadow-sm)
- **Tipografía**: Sans-serif sistema, 16px base
- **Contraste**: WCAG 2.1 AA compliant

---

## 🎯 Funcionalidad Completa de UX

**IMPORTANTE**: Esta es una maqueta **COMPLETAMENTE FUNCIONAL**. Todas las interacciones, validaciones, visualizaciones XAI y flujos de usuario funcionan en tiempo real sin backend.

## 🚀 Características Implementadas

### 1. Flujo de Acceso (EP001)

#### Pantalla de Login
- ✅ Validación de formato de correo
- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Selector de rol (Estudiante, Docente, Administrador)
- ✅ Estados de error funcionales:
  - Campos vacíos
  - Formato inválido
  - Credenciales incorrectas
  - Cuenta inactiva
- ✅ Recuperación de contraseña
- ✅ Enlace a registro

**Credenciales de demostración:**
- Email: `demo@sward.edu.pe`
- Contraseña: `demo123`
- Cualquier rol disponible

#### Pantalla de Registro
- ✅ Formulario completo con validación en tiempo real
- ✅ Verificación de correo institucional
- ✅ Confirmación de contraseña
- ✅ Detección de correos duplicados
- ✅ Mensaje de éxito con redirección automática
- ✅ Estados de error específicos por campo

### 2. Dashboard de Estudiante (Arquitectura 70/30)

#### Panel Principal (70%) - Sistema de Pestañas Completo

**Pestaña "Resumen" - Explicabilidad XAI Avanzada**
- ✅ **XAI Explanation Component** con análisis interpretable completo
- ✅ Conceptos dominados y conceptos que requieren refuerzo
- ✅ Confianza del modelo SAKT (87%)
- ✅ Razonamiento detallado del modelo en lenguaje natural
- ✅ Estrategia recomendada personalizada
- ✅ Modal de "Ver Detalles" con explicación profunda
- ✅ Información sobre cómo se calculó el análisis

**Pestaña "Mapa de Atención" - Visualización Interactiva**
- ✅ **Attention Heatmap Component** completamente funcional
- ✅ Tabla interactiva de últimas 6 interacciones
- ✅ Peso de atención visual (0-100%) con barras de color
- ✅ Estados correctos/incorrectos por interacción
- ✅ Hover effects con información adicional
- ✅ Predicción actual del modelo en lenguaje natural
- ✅ Modal de ayuda explicando el mecanismo de atención
- ✅ Escala de colores interpretable (verde/amarillo/naranja/rojo)

**Pestaña "Progreso" - Gráficos Interactivos**
- ✅ **Knowledge Graph Component** con Recharts
- ✅ Gráfico de área temporal (evolución de dominio)
- ✅ Dominio por concepto con barras de progreso
- ✅ Indicadores de tendencia (↗ up, → stable, ↘ down)
- ✅ Alertas de conceptos con dominio < 60%
- ✅ Análisis de tendencia positiva/negativa
- ✅ Tooltip interactivo en gráficos

#### Panel Lateral (30%)

**Recomendaciones Actuales - Completamente Funcionales**
- ✅ 3 recursos personalizados con explicación XAI
- ✅ Badges de tipo de recurso (Video, Lectura, Ejercicio)
- ✅ Duración estimada
- ✅ Razón detallada de la recomendación
- ✅ **Botón "Iniciar" completamente funcional**
- ✅ Estados de selección visual
- ✅ **Recursos que se marcan como completados**
- ✅ **Contador dinámico de recursos pendientes**

**Resource Viewer - Modal Interactivo**
- ✅ Modal de visualización de recursos completo
- ✅ Vista diferenciada por tipo (Video/Lectura/Ejercicio)
- ✅ Simulación de reproducción de video con progreso
- ✅ Lectura de contenido completo con scroll
- ✅ Ejercicios con opciones múltiples interactivas
- ✅ Barra de progreso animada (0-100%)
- ✅ Mensaje de completado con confirmación
- ✅ Actualización automática del estado de conocimiento
- ✅ Vista previa del "por qué" de cada recurso

**Indicadores de Progreso**
- ✅ Recursos completados (12/18)
- ✅ Tiempo de estudio acumulado
- ✅ Conceptos dominados
- ✅ Barras de progreso visuales

#### Header
- ✅ Logo y nombre del sistema
- ✅ Indicador de progreso general dinámico (actualiza con recursos completados)
- ✅ **Notificaciones con badge de alerta**
- ✅ **Sistema de notificaciones funcional** (alertas de bajo rendimiento)
- ✅ Botón de perfil
- ✅ Botón de cerrar sesión

### 3. Dashboard Docente (Trazabilidad EP005)

#### Estadísticas Generales
- ✅ Contador de estudiantes en riesgo alto (con icono)
- ✅ Contador de estudiantes en riesgo medio (con icono)
- ✅ Promedio general del curso (con icono)
- ✅ Cards con diseño profesional y codificación por colores

#### Tabla de Datos Completamente Funcional
- ✅ Lista completa de estudiantes
- ✅ Ordenamiento por nivel de riesgo (automático)
- ✅ Columnas:
  - Indicador de semáforo (punto de color)
  - Nombre y email del estudiante
  - Badge de nivel de riesgo
  - Dominio promedio (%)
  - Conceptos en riesgo (con alerta)
  - Engagement (%)
  - Última actividad
  - Acciones (Ver detalle / Enviar feedback)

#### Semáforo de Riesgo Académico
- ✅ **Rojo** (Alto): < 60% dominio
- ✅ **Amarillo** (Medio): 60-80% dominio
- ✅ **Verde** (Bajo): > 80% dominio
- ✅ Iconos visuales adicionales (AlertTriangle, TrendingUp, Minus)

#### Filtros
- ✅ Filtro por curso
- ✅ Filtro por semana
- ✅ Filtro por concepto específico (disponible)

#### Vista Detallada de Estudiante - Component Completo
- ✅ **StudentDetailView Component** funcional
- ✅ Métricas principales (Dominio, Engagement, Conceptos en riesgo, Última actividad)
- ✅ **Gráfico de evolución temporal** con Recharts (línea)
- ✅ **Gráfico de dominio por concepto** con Recharts (barras)
- ✅ **Historial de interacciones recientes** (últimas 10)
- ✅ Indicadores de resultado (✓ Completado / ⚠ Incorrecto)
- ✅ Análisis de tendencia (positiva/negativa)
- ✅ **Recomendaciones de intervención** para el docente
- ✅ Botón de "Enviar Retroalimentación" integrado
- ✅ Botón de cerrar vista

#### Sistema de Feedback Funcional
- ✅ **FeedbackDialog Component** completamente funcional
- ✅ **4 categorías predefinidas** (Motivación, Preocupación, Recurso Adicional, Solicitar Reunión)
- ✅ **Plantillas de mensaje** automáticas por categoría
- ✅ Área de texto editable para personalizar
- ✅ **Vista previa del mensaje** antes de enviar
- ✅ Contador de caracteres
- ✅ Animación de envío (1.5s)
- ✅ **Mensaje de confirmación** exitosa
- ✅ Estado de carga durante envío

#### Funcionalidades Adicionales
- ✅ Botón "Exportar Reporte PDF" funcional (alert)
- ✅ Panel de detalle expandible al seleccionar estudiante
- ✅ Botones de "Ver Detalle" y "Enviar Feedback" completamente funcionales
- ✅ Estados de hover en filas de tabla
- ✅ Filtros por curso y semana operativos

---

## 📊 Componentes XAI Avanzados

### AttentionHeatmap
- **Tabla interactiva** de interacciones pasadas
- **Pesos de atención** visualizados con barras de color
- **Hover effects** para mostrar porcentajes exactos
- **Modal de ayuda** explicando el mecanismo
- **Predicción actual** del modelo en contexto
- Escala de colores interpretable

### XAIExplanation
- **Análisis completo** en lenguaje natural
- **Confianza del modelo** (87% con barra visual)
- **Conceptos dominados** con badges verdes
- **Conceptos que requieren refuerzo** con badges rojos
- **Razonamiento detallado** del modelo
- **Estrategia recomendada** personalizada
- **Modal expandible** con explicación profunda
- Sección "¿Cómo se calculó?"

### KnowledgeGraph
- **Gráfico de área temporal** (Recharts)
- **Gráfico de barras** por concepto
- **Indicadores de tendencia** (up/down/stable)
- **Alertas automáticas** para conceptos < 60%
- **Análisis de tendencia** en texto
- **Tooltips interactivos**

### ResourceViewer
- **Modal de visualización** completo
- **Vista por tipo** (Video/Lectura/Ejercicio)
- **Simulación de progreso** (0-100%)
- **Contenido real** (no placeholders)
- **Estados de completado**
- **Actualización de conocimiento** simulada

---

## 🧩 Componentes UI Reutilizables

Todos los componentes siguen el sistema de diseño y son accesibles (WCAG 2.1 AA):

### Componentes Básicos
- ✅ **Button** (variant: default, destructive, outline, secondary, ghost, link)
- ✅ **Input** (con validación de errores y helper text)
- ✅ **Label** (con indicador de campo requerido)
- ✅ **Card** (Header, Content, Footer, Title, Description)
- ✅ **Badge** (variant: success, warning, destructive, video, reading, exercise)
- ✅ **Select** (dropdown accesible con Radix UI)
- ✅ **Progress** (barras de progreso visuales)
- ✅ **Table** (estructura semántica completa)

### Componentes Avanzados
- ✅ **Dialog** (Modal accesible con Radix UI)
- ✅ **Tabs** (Pestañas interactivas)

### Componentes XAI
- ✅ **AttentionHeatmap** (Mapa de calor de atención SAKT)
- ✅ **XAIExplanation** (Explicación interpretable)
- ✅ **KnowledgeGraph** (Gráficos de progreso con Recharts)

### Componentes de Recursos
- ✅ **ResourceViewer** (Visualizador de recursos educativos)

### Componentes de Docente
- ✅ **StudentDetailView** (Vista detallada de estudiante)
- ✅ **FeedbackDialog** (Modal de retroalimentación)

---

## ♿ Accesibilidad WCAG 2.1 AA

### Características Implementadas

#### Perceptible
- ✅ Contraste de color mínimo 4.5:1 (texto normal)
- ✅ Contraste de color mínimo 3:1 (texto grande)
- ✅ Alternativas de texto (aria-label) en todos los iconos
- ✅ Información no depende solo del color

#### Operable
- ✅ Navegación completa por teclado
- ✅ Estados de focus visibles (ring de enfoque)
- ✅ Orden lógico de tabulación
- ✅ Sin trampas de teclado

#### Comprensible
- ✅ Etiquetas claras en todos los campos
- ✅ Mensajes de error específicos y contextuales
- ✅ Campos requeridos marcados con asterisco (*)
- ✅ Validación en tiempo real con feedback visual

#### Robusto
- ✅ HTML semántico válido
- ✅ Atributos ARIA apropiados:
  - `aria-label`
  - `aria-required`
  - `aria-invalid`
  - `aria-describedby`
  - `role="alert"`
  - `aria-live="polite"`

**Documento completo**: Ver [ACCESIBILIDAD.md](./ACCESIBILIDAD.md)

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Arquitectura 70/30 en desktop
- ✅ Layout vertical en móvil
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px)
- ✅ Touch targets mínimo 44x44px
- ✅ Sin scroll horizontal

---

## 🔄 Flujos de Usuario Completamente Funcionales

### Estudiante (100% Funcional)
1. **Login** → Seleccionar rol "Estudiante" → Ingresar credenciales → Autenticación con validación
2. **Dashboard** → Ver notificación de alerta → Navegar por pestañas
3. **Pestaña "Resumen"** → Leer explicación XAI → Abrir modal de detalles
4. **Pestaña "Mapa de Atención"** → Explorar tabla interactiva → Ver pesos de atención → Leer predicción
5. **Pestaña "Progreso"** → Analizar gráficos temporales → Ver tendencias por concepto
6. **Recursos** → Hacer clic en "Iniciar" → Completar recurso (video/lectura/ejercicio) → Ver confirmación
7. **Progreso actualizado** → Ver contador de recursos completados incrementar
8. **Logout** → Cerrar sesión segura

### Docente (100% Funcional)
1. **Login** → Seleccionar rol "Docente" → Ingresar credenciales → Autenticación con validación
2. **Dashboard** → Ver estadísticas generales (riesgo alto/medio/promedio)
3. **Filtrar** → Aplicar filtros por curso y/o semana
4. **Tabla** → Revisar estudiantes ordenados por riesgo → Ver semáforo de colores
5. **Ver Detalle** → Hacer clic en icono de ojo → Ver StudentDetailView completo
   - Métricas principales
   - Gráfico de evolución
   - Gráfico por concepto
   - Historial de interacciones
   - Recomendaciones de intervención
6. **Enviar Feedback** → Hacer clic en icono de mensaje → Abrir FeedbackDialog
   - Seleccionar categoría
   - Editar mensaje
   - Ver vista previa
   - Enviar con animación
   - Ver confirmación
7. **Exportar** → Hacer clic en "Exportar Reporte PDF" → Confirmación
8. **Logout** → Cerrar sesión segura

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18.3.1 + TypeScript
- **Estilos**: Tailwind CSS 4.1.12
- **Componentes UI**: Radix UI + Material UI
- **Iconos**: Lucide React
- **Validación**: React Hook Form 7.55.0
- **Build**: Vite 6.3.5
- **Gestión de paquetes**: pnpm

---

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── Tabs.tsx
│   │   ├── xai/
│   │   │   ├── AttentionHeatmap.tsx      # Mapa de calor de atención
│   │   │   ├── XAIExplanation.tsx         # Explicación interpretable
│   │   │   └── KnowledgeGraph.tsx         # Gráficos de progreso
│   │   ├── resources/
│   │   │   └── ResourceViewer.tsx         # Visualizador de recursos
│   │   └── teacher/
│   │       ├── StudentDetailView.tsx      # Vista detallada de estudiante
│   │       └── FeedbackDialog.tsx         # Modal de feedback
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── StudentDashboard.tsx          # 100% funcional con XAI
│   │   └── TeacherDashboard.tsx          # 100% funcional con trazabilidad
│   ├── lib/
│   │   └── utils.ts
│   └── App.tsx                            # Router principal
├── styles/
│   ├── theme.css                          # Colores institucionales
│   └── fonts.css
└── imports/
    └── PRD-SWARD-v1.0.md
```

---

## 🎯 Casos de Uso de Prueba

### Login - Casos de Error

1. **Campos vacíos**
   - Dejar email o contraseña vacíos
   - ✅ Resultado: Mensaje de error específico

2. **Formato de email inválido**
   - Email: `test@`
   - ✅ Resultado: "Por favor ingrese un correo válido"

3. **Cuenta inactiva**
   - Email: `inactive@example.com`
   - Contraseña: cualquiera
   - ✅ Resultado: "Tu cuenta está inactiva. Contacta al administrador."

4. **Credenciales incorrectas**
   - Email: `wrong@test.com`
   - Contraseña: `wrongpass`
   - ✅ Resultado: "Credenciales inválidas. Verifique su correo y contraseña."

### Registro - Casos de Error

1. **Email duplicado**
   - Email: `existing@sward.edu.pe`
   - ✅ Resultado: "El correo ya se encuentra registrado. Intente iniciar sesión."

2. **Contraseñas no coinciden**
   - Contraseña: `password123`
   - Confirmar: `password456`
   - ✅ Resultado: "Las contraseñas no coinciden"

3. **Contraseña corta**
   - Contraseña: `1234`
   - ✅ Resultado: "La contraseña debe tener al menos 8 caracteres"

---

## 📖 Documentación de Referencia

- **PRD Completo**: [PRD-SWARD-v1.0.md](./src/imports/PRD-SWARD-v1.0.md)
- **Accesibilidad**: [ACCESIBILIDAD.md](./ACCESIBILIDAD.md)
- **Código de Proyecto**: TP202610051
- **Institución**: Universidad Peruana de Ciencias Aplicadas (UPC)
- **Especialidad**: Ingeniería de Software
- **Metodología**: Scrum + Modelo C4

---

## 👥 Equipo del Proyecto

- **Jefe de Proyecto**: Vittorio Marcelo Eduardo Espinoza
- **Jefe de Desarrollo**: Alex Ramon Alberto Avila Asto
- **Product Owner**: Mori Yzaguirre, Daniel Enrique

---

## 📝 Notas Finales

Esta es una **maqueta COMPLETAMENTE FUNCIONAL** de alta fidelidad diseñada para validación académica y pruebas de usabilidad con usuarios reales.

### ✨ Nivel de Funcionalidad

**No es un prototipo estático ni clickable - es una aplicación web funcional completa:**

- ✅ **100% de las interacciones funcionan** (clicks, inputs, navegación)
- ✅ **Validación en tiempo real** de todos los formularios
- ✅ **Visualizaciones XAI interactivas** con gráficos de Recharts
- ✅ **Mapa de calor de atención** completamente interactivo
- ✅ **Flujo completo de recursos** (iniciar, progresar, completar)
- ✅ **Sistema de notificaciones** funcional
- ✅ **Feedback docente** con envío simulado
- ✅ **Vista detallada de estudiantes** con gráficos en tiempo real
- ✅ **Estados dinámicos** (recursos completados, progreso actualizado)
- ✅ **Animaciones y transiciones** suaves
- ✅ **Modales y dialogs** completamente funcionales
- ✅ **Sistema de pestañas** interactivo

### 🎯 Experiencia del Usuario

Un usuario puede:
1. Registrarse con validación completa
2. Iniciar sesión con autenticación funcional
3. Navegar por dashboards interactivos
4. Ver visualizaciones XAI en tiempo real
5. Completar recursos educativos
6. Enviar feedback a estudiantes
7. Exportar reportes (simulado)
8. Cerrar sesión

**Todo funciona sin backend** - La lógica está implementada en el frontend con estado local.

### 📊 Datos de Demostración

- 6 estudiantes con datos realistas
- 6 interacciones históricas por estudiante
- 3 recursos educativos completos (video, lectura, ejercicio)
- 5 sesiones de progreso temporal
- 5 conceptos con métricas de dominio

---

**Versión**: 2.0 (XAI Completo + UX Funcional)  
**Fecha**: Mayo 2026  
**Estado**: Maqueta Completamente Funcional  
**Líneas de Código**: ~3,500 (TypeScript + React + Tailwind)
