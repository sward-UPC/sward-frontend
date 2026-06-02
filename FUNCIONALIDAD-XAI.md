# Funcionalidad XAI y UX Interactiva - Sistema SWARD

> **Maqueta Completamente Funcional**  
> Todas las características descritas en este documento están implementadas y funcionan en tiempo real

---

## 🧠 Explicabilidad XAI (Inteligencia Artificial Explicable)

### 1. AttentionHeatmap Component

**Ubicación**: Dashboard Estudiante → Pestaña "Mapa de Atención"

#### Características Implementadas

**Tabla Interactiva de Interacciones**
- ✅ Muestra las últimas 6 interacciones del estudiante
- ✅ Cada fila contiene:
  - Concepto (ej. "Knowledge Tracing")
  - Fecha y hora (15/05/26 10:30)
  - Resultado (✓ Correcto / ✗ Incorrecto)
  - Peso de atención (0-100%)
- ✅ Barras de color visuales:
  - Verde: Alta influencia (80-100%)
  - Amarillo: Media influencia (60-80%)
  - Naranja: Baja influencia (40-60%)
  - Rojo: Muy baja influencia (<40%)

**Interactividad**
- ✅ **Hover effect**: Al pasar el mouse sobre una interacción, se resalta y muestra el porcentaje exacto
- ✅ **Predicción actual**: Caja superior mostrando la predicción del modelo en lenguaje natural
- ✅ **Modal de ayuda**: Botón de info (ⓘ) que abre un dialog explicando:
  - Qué es el mecanismo de auto-atención
  - Qué significan los pesos de atención
  - Escala de colores interpretable

**Explicación Contextual**
- ✅ Texto interpretativo al pie del componente
- ✅ Ejemplo: "Las interacciones con mayor peso de atención (barras verdes) son las que más influyen en la predicción actual"

---

### 2. XAIExplanation Component

**Ubicación**: Dashboard Estudiante → Pestaña "Resumen"

#### Características Implementadas

**Análisis Principal**
- ✅ **Conceptos Dominados**: Lista de conceptos con alto dominio (>80%)
- ✅ **Conceptos que Requieren Refuerzo**: Lista de conceptos con bajo dominio (<60%)
- ✅ **Badges visuales**: Verde para dominados, Rojo para débiles
- ✅ **Análisis en lenguaje natural**: Texto interpretable sobre el estado actual

**Modal de Detalles Avanzados**
- ✅ **Botón "Ver Detalles"** que abre un dialog con:
  
  **Confianza del Modelo**
  - Porcentaje (87%)
  - Barra de progreso visual
  - Interpretación: "El modelo está muy seguro de esta predicción"

  **Fortalezas**
  - Lista de conceptos dominados con badges ✓
  - Explicación detallada del por qué

  **Áreas de Mejora**
  - Lista de conceptos débiles con badges ⚠
  - Patrones identificados (errores frecuentes, tiempo elevado)

  **Razonamiento del Modelo**
  - Explicación de cómo el modelo llegó a sus conclusiones
  - Análisis de las últimas 50 interacciones
  - Patrones de aprendizaje detectados

  **Estrategia Recomendada**
  - Pasos específicos a seguir
  - Orden de estudio sugerido

  **¿Cómo se Calculó?**
  - Lista de pasos del proceso de inferencia
  - Mecanismos de atención aplicados
  - Redes neuronales utilizadas

**Secciones con Codificación por Colores**
- ✅ Azul (primario): Análisis actual
- ✅ Verde: Recomendación positiva
- ✅ Gris (muted): Explicación técnica

---

### 3. KnowledgeGraph Component

**Ubicación**: Dashboard Estudiante → Pestaña "Progreso"

#### Características Implementadas

**Gráfico de Evolución Temporal**
- ✅ **AreaChart de Recharts** completamente funcional
- ✅ Eje X: Sesiones (S1, S2, S3, S4, S5)
- ✅ Eje Y: Dominio promedio (0-100%)
- ✅ **Gradiente de color** (azul degradado)
- ✅ **Tooltips interactivos**: Al pasar el mouse muestra valores exactos
- ✅ **CartesianGrid**: Grid de fondo para facilitar lectura
- ✅ **Análisis de tendencia**: Caja de texto indicando si la tendencia es positiva o negativa

**Dominio por Concepto**
- ✅ Lista de 5 conceptos con:
  - Nombre del concepto
  - Porcentaje de dominio
  - **Indicador de tendencia**:
    - ↗ (verde): Tendencia positiva
    - → (gris): Tendencia estable
    - ↘ (rojo): Tendencia negativa
  - **Barra de progreso visual**
  - **Alerta automática**: Si dominio < 60%, muestra "⚠️ Concepto requiere refuerzo"

**Responsive Design**
- ✅ Gráficos adaptativos que se ajustan al tamaño del contenedor
- ✅ Altura fija de 300px para óptima visualización

---

## 📚 Sistema de Recursos Educativos Funcional

### 4. ResourceViewer Component

**Ubicación**: Modal que se abre al hacer clic en "Iniciar" en cualquier recurso

#### Características Implementadas

**Header del Modal**
- ✅ Icono del tipo de recurso (Video/Ejercicio/Lectura)
- ✅ Título del recurso
- ✅ Concepto asociado y duración
- ✅ Botón de cerrar (X)

**Sección "Por qué este recurso"**
- ✅ Caja destacada con explicación detallada
- ✅ Ejemplo: "Concepto con bajo dominio detectado (45%). Este recurso cubre los fundamentos que necesitas reforzar."

**Contenido del Recurso**

**Tipo: Video**
- ✅ Vista de video simulada (aspect-ratio 16:9)
- ✅ Botón "Reproducir Video" con icono
- ✅ Al hacer clic: Simula progreso de 0 a 100% (10% cada segundo)

**Tipo: Lectura**
- ✅ Texto completo del artículo
- ✅ Formato markdown-style
- ✅ Botón "Leer Contenido Completo"
- ✅ Al hacer clic: Simula progreso de 0 a 100%

**Tipo: Ejercicio**
- ✅ Enunciado del ejercicio
- ✅ 4 opciones de respuesta (A, B, C, D)
- ✅ Hover effect en opciones
- ✅ Botón "Enviar Respuesta"
- ✅ Al hacer clic: Simula progreso de 0 a 100%

**Barra de Progreso**
- ✅ Aparece después de iniciar el recurso
- ✅ Animación de 0 a 100% en 10 segundos
- ✅ Porcentaje numérico visible

**Mensaje de Completado**
- ✅ Caja verde con icono de check
- ✅ "¡Recurso Completado!"
- ✅ "Tu estado de conocimiento se actualizará automáticamente"

**Botón de Confirmación**
- ✅ "Confirmar y Continuar" (solo visible al completar)
- ✅ Al hacer clic:
  - Cierra el modal
  - Marca el recurso como completado
  - Actualiza el contador de recursos completados
  - Incrementa la barra de progreso general

---

## 👨‍🏫 Sistema de Trazabilidad Docente Funcional

### 5. StudentDetailView Component

**Ubicación**: Dashboard Docente → Al hacer clic en icono de ojo (👁️) en cualquier estudiante

#### Características Implementadas

**Header**
- ✅ Nombre del estudiante
- ✅ Badge de nivel de riesgo (Alto/Medio/Bajo)
- ✅ Email del estudiante
- ✅ Botón de cerrar (X)

**Métricas Principales** (4 Cards)
- ✅ **Dominio Promedio**: 42% (rojo si <60%)
- ✅ **Engagement**: 35%
- ✅ **Conceptos en Riesgo**: 4
- ✅ **Última Actividad**: "Hace 2 días"

**Gráfico de Evolución**
- ✅ **LineChart de Recharts**
- ✅ Eje X: Semanas (S1-S5)
- ✅ Eje Y: Dominio (0-100%)
- ✅ Línea roja indicando evolución
- ✅ **Análisis de tendencia**: Caja roja con "Tendencia negativa: El dominio ha disminuido en las últimas 2 semanas. Se recomienda intervención."

**Gráfico de Dominio por Concepto**
- ✅ **BarChart de Recharts**
- ✅ Eje X: Conceptos (Intro IA, Redes N., etc.)
- ✅ Eje Y: Dominio (0-100%)
- ✅ Barras moradas (color institucional)

**Historial de Interacciones**
- ✅ Lista de últimas 10 actividades
- ✅ Cada interacción muestra:
  - Icono de resultado (✓ Completado / ⚠ Incorrecto)
  - Nombre del recurso
  - Badge del concepto
  - Icono de reloj con tiempo dedicado
  - Fecha y hora

**Recomendaciones de Intervención**
- ✅ Card amarilla con icono de alerta
- ✅ 3 recomendaciones específicas:
  1. Reforzar [concepto débil]
  2. Monitorear [concepto medio]
  3. Aumentar engagement
- ✅ Cada recomendación incluye justificación

**Botones de Acción**
- ✅ "Enviar Retroalimentación" (abre FeedbackDialog)
- ✅ "Cerrar" (cierra la vista)

---

### 6. FeedbackDialog Component

**Ubicación**: Dashboard Docente → Al hacer clic en icono de mensaje (💬) o desde StudentDetailView

#### Características Implementadas

**Header del Modal**
- ✅ "Enviar Retroalimentación a [Nombre del Estudiante]"
- ✅ Descripción: "Selecciona una categoría y personaliza el mensaje"

**Categorías de Mensaje** (4 opciones)
- ✅ **Motivación** (verde)
- ✅ **Preocupación** (amarillo)
- ✅ **Recurso Adicional** (azul)
- ✅ **Solicitar Reunión** (azul info)

**Plantillas Automáticas**
- ✅ Al seleccionar una categoría, se carga automáticamente una plantilla
- ✅ Plantilla personalizada con el nombre del estudiante
- ✅ Ejemplo (Motivación):
  ```
  Hola Ana,

  He notado tu excelente progreso en los últimos ejercicios. ¡Sigue así!
  Tu dedicación es admirable.

  Continúa con el buen trabajo.
  ```

**Área de Texto Editable**
- ✅ Textarea grande (min-height: 200px)
- ✅ Completamente editable
- ✅ Contador de caracteres
- ✅ Placeholder: "Escribe tu mensaje aquí..."

**Vista Previa**
- ✅ Aparece cuando hay texto escrito
- ✅ Muestra:
  - Avatar con iniciales del estudiante
  - Nombre completo
  - Rol: "Estudiante"
  - Badge de la categoría seleccionada
  - Contenido del mensaje con formato

**Proceso de Envío**
- ✅ Botón "Enviar Retroalimentación" con icono
- ✅ Estado disabled si no hay texto
- ✅ **Animación de envío**:
  1. Botón cambia a "Enviando..." (1.5 segundos)
  2. Modal cambia a pantalla de éxito con:
     - Icono de check verde grande
     - "¡Feedback Enviado!"
     - Nombre del destinatario
  3. Cierre automático después de 2 segundos

**Botón Cancelar**
- ✅ Cierra el modal sin enviar
- ✅ Limpia el formulario

---

## 🔔 Sistema de Notificaciones

**Ubicación**: Dashboard Estudiante → Header

#### Características Implementadas

**Icono de Campana**
- ✅ Badge rojo (punto) indicando alerta activa
- ✅ Click para mostrar/ocultar notificación

**Banner de Notificación**
- ✅ Caja amarilla con icono de campana
- ✅ Título: "Alerta de Aprendizaje"
- ✅ Mensaje: "Se detectó bajo rendimiento en Redes Neuronales. Te recomendamos revisar los recursos sugeridos."
- ✅ Botón de cerrar (✕)
- ✅ Al cerrar, desaparece el banner y el badge

---

## 📊 Sistema de Progreso Dinámico

### Actualización en Tiempo Real

**Dashboard Estudiante**
- ✅ **Contador de recursos completados**: Se incrementa al completar cada recurso
- ✅ **Barra de progreso general**: Se actualiza dinámicamente
- ✅ **Lista de recomendaciones**: Los recursos completados muestran "✓ Completado"
- ✅ **Opacidad reducida**: Los recursos completados se atenúan visualmente

**Ejemplo de Flujo**
1. Estado inicial: 12/18 recursos completados (67%)
2. Usuario completa un recurso
3. Nuevo estado: 13/18 recursos completados (72%)
4. Barra de progreso se anima al nuevo valor
5. Recurso se marca como completado con check verde

---

## 🎨 Sistema de Pestañas

**Ubicación**: Dashboard Estudiante

#### Características Implementadas

**TabsList**
- ✅ 3 pestañas: Resumen, Mapa de Atención, Progreso
- ✅ Diseño con fondo gris (muted)
- ✅ Pestaña activa: Fondo blanco + sombra

**TabsContent**
- ✅ Transición suave entre pestañas
- ✅ Contenido específico por pestaña:
  - **Resumen**: XAIExplanation
  - **Mapa de Atención**: AttentionHeatmap
  - **Progreso**: KnowledgeGraph

**Accesibilidad**
- ✅ Navegación por teclado (Tab + Arrow keys)
- ✅ Focus visible
- ✅ ARIA labels apropiados

---

## 📱 Responsive Design

### Breakpoints Implementados

**Desktop (lg: 1024px+)**
- ✅ Layout 70/30 (Main Panel / Side Panel)
- ✅ Gráficos a ancho completo
- ✅ Tablas con scroll horizontal si necesario

**Tablet (md: 768px - 1023px)**
- ✅ Layout apilado verticalmente
- ✅ Main Panel al 100%
- ✅ Side Panel al 100%

**Mobile (< 768px)**
- ✅ Todo en columna única
- ✅ Gráficos responsivos
- ✅ Tablas con scroll horizontal
- ✅ Modales a pantalla completa

---

## 🎯 Estados Interactivos

### Hover States
- ✅ Botones: Cambio de opacidad/color
- ✅ Filas de tabla: Fondo gris claro
- ✅ Cards de recursos: Borde primario
- ✅ Opciones de ejercicio: Fondo de acento

### Focus States
- ✅ Ring de enfoque visible (2px)
- ✅ Color primario (#4F46E5)
- ✅ Offset de 2px

### Active/Pressed States
- ✅ Botones: Reducción de opacidad al 80%
- ✅ Tabs: Fondo blanco + sombra

### Loading States
- ✅ Botones de envío: Texto cambia a "Enviando..."
- ✅ Disabled durante carga
- ✅ Animación de progreso en recursos

---

## ✅ Checklist de Funcionalidad Completa

### Dashboard Estudiante
- [x] Sistema de pestañas funcional
- [x] Mapa de calor de atención interactivo
- [x] Explicación XAI con modal de detalles
- [x] Gráficos de progreso con Recharts
- [x] Recursos que se pueden iniciar y completar
- [x] Progreso que se actualiza dinámicamente
- [x] Sistema de notificaciones
- [x] Contador de recursos actualizado en tiempo real

### Dashboard Docente
- [x] Tabla de estudiantes con ordenamiento por riesgo
- [x] Filtros funcionales (curso, semana)
- [x] Vista detallada de estudiante con gráficos
- [x] Sistema de feedback con plantillas
- [x] Envío de retroalimentación con animación
- [x] Exportación de reportes (simulada)
- [x] Semáforo de riesgo con 3 colores

### Autenticación
- [x] Login con validación en tiempo real
- [x] Registro con validación completa
- [x] Manejo de estados de error
- [x] Logout funcional

---

## 🔬 Datos de Prueba Realistas

### Estudiante Demo
- **Interacciones**: 6 registradas con timestamps
- **Conceptos**: 5 con métricas de dominio
- **Sesiones**: 5 con progreso temporal
- **Recursos**: 3 completos (video, lectura, ejercicio)

### Docente Demo
- **Estudiantes**: 6 con diferentes niveles de riesgo
- **Métricas por estudiante**: Dominio, engagement, conceptos en riesgo
- **Historial**: 10 interacciones recientes por estudiante

---

**Última actualización**: 15 de Mayo de 2026  
**Estado**: Maqueta 100% Funcional  
**Componentes XAI**: 3 completamente implementados  
**Componentes Interactivos**: 15+ componentes funcionales
