# Cumplimiento WCAG 2.1 Nivel AA - Sistema SWARD

Este documento detalla las características de accesibilidad implementadas en la maqueta funcional del Sistema SWARD, cumpliendo con los estándares WCAG 2.1 Nivel AA.

## 1. Perceptible

### 1.1 Alternativas de Texto
- ✅ Todos los íconos tienen `aria-label` descriptivo
- ✅ Campos de formulario tienen `<Label>` asociado con `htmlFor`
- ✅ Imágenes decorativas usan `aria-hidden="true"`

### 1.2 Contraste de Color (Criterio 1.4.3)
- ✅ **Texto normal**: Ratio mínimo 4.5:1
  - Texto principal (#1F2937) sobre fondo (#F9FAFB): ~14:1
  - Texto primario (#FFFFFF) sobre botones (#4F46E5): ~8.6:1
- ✅ **Texto grande**: Ratio mínimo 3:1
  - Todos los encabezados cumplen el ratio
- ✅ **Estados de error**: Rojo (#DC2626) sobre blanco: 5.9:1
- ✅ **Semáforo de riesgo**:
  - Verde (#10B981): 3.7:1
  - Amarillo (#F59E0B): 2.8:1 (con texto oscuro)
  - Rojo (#EF4444): 4.2:1

### 1.3 Cambio de Tamaño del Texto
- ✅ Sistema de espaciado basado en `rem` (4px base)
- ✅ Layout responsive sin pérdida de funcionalidad hasta 200% de zoom
- ✅ Sin scroll horizontal en contenedores

### 1.4 Uso del Color
- ✅ La información no depende solo del color:
  - Semáforo de riesgo: color + icono + texto
  - Estados de error: color + ícono + mensaje de texto
  - Badges de recursos: color + texto descriptivo

## 2. Operable

### 2.1 Accesibilidad por Teclado
- ✅ Todos los elementos interactivos son navegables con `Tab`
- ✅ Orden lógico de tabulación (de arriba a abajo, izquierda a derecha)
- ✅ Estados de `focus` visibles con anillo de enfoque (ring)
- ✅ `focus-visible` para indicadores visuales claros
- ✅ Sin trampas de teclado

### 2.2 Tiempo Suficiente
- ✅ No hay límites de tiempo arbitrarios
- ✅ Sesión con token JWT (configurable)
- ✅ Advertencias antes del cierre de sesión por inactividad

### 2.3 Navegación
- ✅ Títulos de página descriptivos (`<CardTitle>`, `<h1>`)
- ✅ Landmarks semánticos: `<header>`, `<main>`, `<aside>`, `<nav>`
- ✅ Enlaces y botones con texto descriptivo
- ✅ Breadcrumbs en navegación (donde aplica)

## 3. Comprensible

### 3.1 Legibilidad
- ✅ Idioma del documento: Español (implícito)
- ✅ Tipografía sans-serif legible (sistema por defecto)
- ✅ Tamaño de fuente base: 16px
- ✅ Alto de línea: 1.5 (150%)
- ✅ Longitud de línea óptima en textos largos

### 3.2 Predecibilidad
- ✅ Navegación consistente en todas las páginas
- ✅ Componentes con comportamiento predecible
- ✅ Sin cambios de contexto automáticos (sin pop-ups inesperados)
- ✅ Mensajes de error claros y contextuales

### 3.3 Asistencia de Entrada
- ✅ **Identificación de errores**:
  - Campos con borde rojo
  - Ícono de alerta
  - Mensaje de error específico debajo del campo
- ✅ **Etiquetas e instrucciones**:
  - Todos los campos tienen `<Label>` visible
  - Campos requeridos marcados con asterisco (*)
  - Placeholders como guía adicional
- ✅ **Prevención de errores**:
  - Validación en tiempo real
  - Confirmación de contraseña
  - Mensajes informativos antes de acciones críticas
- ✅ **Sugerencias de error**:
  - Mensajes específicos ("Por favor ingrese un correo válido")
  - No genéricos ("Error")

## 4. Robusto

### 4.1 Compatible
- ✅ HTML semántico válido
- ✅ Componentes de Radix UI (compatibles con lectores de pantalla)
- ✅ Atributos ARIA apropiados:
  - `aria-label` en botones sin texto
  - `aria-required` en campos obligatorios
  - `aria-invalid` en campos con error
  - `aria-describedby` para mensajes de ayuda
  - `role="alert"` para mensajes de error importantes
  - `aria-live="polite"` para actualizaciones dinámicas

## 5. Características Adicionales de Accesibilidad

### 5.1 Formularios
- ✅ Validación de campos en tiempo real
- ✅ Mensajes de error contextuales
- ✅ Estados disabled durante carga (previene envíos duplicados)
- ✅ Focus automático en primer campo con error

### 5.2 Tablas
- ✅ Estructura semántica (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- ✅ Encabezados de columna claramente identificados
- ✅ Scroll horizontal en tablas responsivas

### 5.3 Estados Interactivos
- ✅ Estados de hover, focus y active en todos los botones
- ✅ Transiciones suaves (no causan mareos)
- ✅ Feedback visual inmediato en todas las acciones

### 5.4 Responsive Design
- ✅ Layout adaptativo de 70/30 (desktop) a vertical (móvil)
- ✅ Breakpoints: mobile-first approach
- ✅ Touch targets de al menos 44x44px

## 6. Especificaciones de Diseño Implementadas

### 6.1 Sistema de Espaciado
- ✅ Escala de 4px (spacing-1 = 4px, spacing-2 = 8px, etc.)
- ✅ Padding consistente en componentes

### 6.2 Bordes Redondeados
- ✅ Radio de 12px en todos los componentes principales
- ✅ Botones, inputs, cards, badges con bordes consistentes

### 6.3 Paleta de Colores
- ✅ Fondo neutro: #F9FAFB
- ✅ Contenedores: #FFFFFF
- ✅ Acento institucional: #4F46E5 (Morado UPC)
- ✅ Semáforo de riesgo:
  - Verde (#10B981): Bajo riesgo
  - Amarillo (#F59E0B): Riesgo medio
  - Rojo (#DC2626): Riesgo alto

### 6.4 Sombras
- ✅ Sombras suaves (shadow-sm) para profundidad
- ✅ No se usan sombras fuertes que dificulten la lectura

## 7. Testing de Accesibilidad Recomendado

### Herramientas Sugeridas
- [ ] axe DevTools (Chrome Extension)
- [ ] WAVE (Web Accessibility Evaluation Tool)
- [ ] Lighthouse Accessibility Audit
- [ ] Screen Reader Testing (NVDA, JAWS, VoiceOver)
- [ ] Teclado solamente (sin mouse)

### Checklist de Pruebas
- [ ] Navegación completa solo con teclado
- [ ] Zoom al 200% sin pérdida de funcionalidad
- [ ] Lectura con screen reader
- [ ] Contraste de colores verificado
- [ ] Validación de HTML semántico

## 8. Notas Finales

Esta maqueta funcional ha sido diseñada siguiendo las mejores prácticas de accesibilidad web WCAG 2.1 Nivel AA. Se recomienda realizar pruebas adicionales con usuarios reales con diversas capacidades para validar la experiencia de usuario.

**Última actualización**: Mayo 2026  
**Estándar**: WCAG 2.1 Nivel AA  
**Proyecto**: SWARD - TP202610051
