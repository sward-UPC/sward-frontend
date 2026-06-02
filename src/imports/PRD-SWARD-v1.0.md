# Product Requirements Document (PRD)

## Sistema Web Distribuido de Recomendación Adaptativa y Explicable de Recursos Educativos Basado en DKT con Trazabilidad y Control Docente para el Aprendizaje Autónomo en Estudiantes de Lima Metropolitana

---

**Código de Proyecto:** TP202610051  
**Versión del Documento:** 1.0  
**Fecha:** 11 de mayo de 2026  
**Estado:** En revisión  
**Clasificación:** Académico — Taller de Proyecto 1 / UPC  

---

| Campo | Detalle |
|---|---|
| **Jefe de Proyecto** | Vittorio Marcelo Eduardo Espinoza |
| **Jefe de Desarrollo** | Alex Ramon Alberto Avila Asto |
| **Product Owner** | Mori Yzaguirre, Daniel Enrique |
| **Especialidad** | Ingeniería de Software |
| **Institución** | Universidad Peruana de Ciencias Aplicadas (UPC) |
| **Metodología** | Scrum + Modelo C4 |
| **Stack Principal** | React.js · FastAPI · PostgreSQL · pyKT (SAKT) · AWS |

---

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| 1.0 | 11/05/2026 | Vittorio Eduardo / Alex Avila | Elaboración inicial del PRD a partir del Project Charter v1.4 y el Plan de Dirección v1.1 |

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Contexto y Planteamiento del Problema](#2-contexto-y-planteamiento-del-problema)
3. [Objetivos del Producto](#3-objetivos-del-producto)
4. [Usuarios y Stakeholders](#4-usuarios-y-stakeholders)
5. [Alcance del Producto](#5-alcance-del-producto)
6. [Arquitectura del Sistema](#6-arquitectura-del-sistema)
7. [Épicas y Requerimientos Funcionales](#7-épicas-y-requerimientos-funcionales)
8. [Requerimientos No Funcionales](#8-requerimientos-no-funcionales)
9. [Requerimientos de Negocio y Calidad](#9-requerimientos-de-negocio-y-calidad)
10. [Historias de Usuario Detalladas](#10-historias-de-usuario-detalladas)
11. [Criterios de Aceptación del Producto](#11-criterios-de-aceptación-del-producto)
12. [Modelo de Datos](#12-modelo-de-datos)
13. [Integraciones Externas](#13-integraciones-externas)
14. [Métricas de Éxito del Producto](#14-métricas-de-éxito-del-producto)
15. [Plan de Lanzamiento y Hitos](#15-plan-de-lanzamiento-e-hitos)
16. [Riesgos del Producto](#16-riesgos-del-producto)
17. [Restricciones y Exclusiones](#17-restricciones-y-exclusiones)
18. [Presupuesto y Recursos](#18-presupuesto-y-recursos)
19. [Estándares de Calidad](#19-estándares-de-calidad)
20. [Glosario y Siglario](#20-glosario-y-siglario)

---

## 1. Resumen Ejecutivo

### 1.1 Descripción del Producto

El presente documento define los requerimientos completos del **SWARD** (*Sistema Web Distribuido de Recomendación Adaptativa y Explicable de Recursos Educativos*), una plataforma tecnológica de aprendizaje adaptativo orientada a fortalecer el aprendizaje autónomo de estudiantes universitarios de Lima Metropolitana.

SWARD integra técnicas de **Deep Knowledge Tracing (DKT)** —específicamente el modelo **Self-Attentive Knowledge Tracing (SAKT)** implementado mediante la librería **pyKT**— con mecanismos de **Inteligencia Artificial Explicable (XAI)** para generar recomendaciones personalizadas de recursos educativos, junto con un **dashboard de trazabilidad docente** que permite el seguimiento en tiempo real del progreso académico.

### 1.2 Propuesta de Valor

| Dimensión | Propuesta de Valor |
|---|---|
| **Para el estudiante** | Recomendaciones adaptadas a su estado de conocimiento real, con explicaciones comprensibles sobre el porqué de cada sugerencia |
| **Para el docente** | Visibilidad en tiempo real del progreso individual, alertas de riesgo académico y herramientas de trazabilidad pedagógica |
| **Para la institución** | Demostración de viabilidad del uso de IA explicable en educación superior peruana, alineada con objetivos de innovación educativa |

### 1.3 Problema Central

Los estudiantes universitarios de Lima Metropolitana carecen de herramientas que:

- Modelen dinámicamente su estado de conocimiento individual.
- Recomienden recursos educativos personalizados con justificaciones comprensibles.
- Brinden al docente trazabilidad en tiempo real del progreso académico.

Los sistemas LMS tradicionales (Moodle, Canvas) no incorporan mecanismos avanzados de personalización ni explicabilidad, restringiendo la efectividad del aprendizaje autónomo (*Jain et al., 2024; Bai et al., 2024; Zou & Kuek, 2025*).

---

## 2. Contexto y Planteamiento del Problema

### 2.1 Contexto Educativo

La transformación digital en la educación superior ha masificado el uso de plataformas LMS; sin embargo, estas siguen siendo predominantemente estáticas y centradas en distribución de contenidos, sin adaptar el aprendizaje a las características individuales del estudiante (*Jain et al., 2024*).

En Perú, esta problemática se acentúa por:

- La **limitada disponibilidad** de herramientas que modelen el conocimiento individual.
- La **ausencia de explicabilidad** en las recomendaciones generadas por IA, que reduce la confianza del usuario.
- La **falta de trazabilidad** efectiva que permita al docente intervenir oportunamente.
- Los contenidos **estandarizados** que no se adaptan al nivel de dominio del estudiante (*Brusilovsky, 2001; Jain et al., 2024*).

### 2.2 Tabla de Problema-Causa-Solución

| Problema | Causas Identificadas | Solución Propuesta |
|---|---|---|
| Estudiantes no reciben recomendaciones personalizadas | LMS sin modelos adaptativos; contenidos estandarizados | Motor de recomendación SAKT/pyKT |
| Recomendaciones de IA no son comprensibles | Ausencia de mecanismos XAI en plataformas educativas | Módulo XAI con mapas de atención y lenguaje natural |
| Docentes sin visibilidad del progreso individual | LMS sin dashboards de trazabilidad avanzada | Dashboard docente en tiempo real |
| Brechas de conocimiento no detectadas oportunamente | Ausencia de modelado del estado de conocimiento | Módulo SAKT que detecta brechas por concepto |

### 2.3 Marco Teórico Resumido

- **Knowledge Tracing (KT):** Modela el estado de conocimiento del estudiante a lo largo del tiempo. Evoluciona desde BKT hasta modelos deep learning como DKT y SAKT.
- **Self-Attentive Knowledge Tracing (SAKT):** Incorpora mecanismos de atención que identifican qué interacciones pasadas influyen en el desempeño actual, mejorando precisión e interpretabilidad (*Pandey & Karypis, 2019; Yamkovenko et al., 2025*).
- **Explainable AI (XAI):** Garantiza que estudiantes y docentes comprendan las recomendaciones del sistema, incrementando confianza y facilitando decisiones pedagógicas informadas (*Bai et al., 2024; Gunning & Aha, 2019*).
- **pyKT:** Librería Python que provee implementaciones estandarizadas de modelos KT (DKT, SAKT) compatibles con PyTorch (*Liu et al., 2022*).

---

## 3. Objetivos del Producto

### 3.1 Objetivo General

Desarrollar un Sistema Web Distribuido de Recomendación Adaptativa y Explicable de Recursos Educativos Basado en DKT con Trazabilidad y Control Docente para el Aprendizaje Autónomo en Estudiantes de Lima Metropolitana.

### 3.2 Objetivos Específicos

| Código | Objetivo Específico | Indicador de Éxito |
|---|---|---|
| **OE1** | Investigar tecnologías de comunicación en tiempo real, arquitectura de software, modelos de predicción, mecanismos de IA, recursos educativos y métodos de control docente | Acta de conformidad aprobada por el asesor especializado |
| **OE2** | Diseñar la arquitectura del sistema web distribuido | Aprobación del acta de conformidad sobre la arquitectura (modelo C4) |
| **OE3** | Desarrollar el sistema web distribuido con módulo SAKT (pyKT), motor de recomendación adaptativa, módulo XAI y dashboard de trazabilidad docente | Aprobación del acta de conformidad del asesor sobre el desarrollo |
| **OE4** | Validar el sistema propuesto mediante pruebas con usuarios reales | Acta de conformidad + aceptación de al menos el 80% de usuarios expertos |

### 3.3 Metas Cuantitativas del Producto

| Métrica | Meta Mínima |
|---|---|
| AUC del modelo SAKT | ≥ 0.75 |
| System Usability Scale (SUS) | ≥ 70 puntos |
| Tiempo de respuesta del sistema | ≤ 3 segundos |
| Latencia del módulo XAI (inferencia) | ≤ 500 ms |
| Usuarios piloto — estudiantes | ≥ 10 |
| Usuarios piloto — docentes | ≥ 2 |
| Aceptación de usuarios expertos | ≥ 80% |

---

## 4. Usuarios y Stakeholders

### 4.1 Usuarios Primarios

#### Estudiante Universitario de Lima Metropolitana

- **Descripción:** Alumno de pregrado que usa la plataforma para gestionar su aprendizaje autónomo.
- **Necesidades:**
  - Recibir recomendaciones personalizadas según su nivel de conocimiento real.
  - Comprender el porqué de cada recomendación.
  - Monitorear su progreso académico con indicadores visuales.
  - Identificar brechas de conocimiento y áreas de mejora.
- **Pain Points:**
  - No sabe qué recursos estudiar ni en qué orden.
  - No entiende qué tan lejos está de dominar un concepto.
  - No recibe retroalimentación sobre su progreso entre sesiones.

#### Docente Universitario de Lima Metropolitana

- **Descripción:** Profesor que utiliza la plataforma para monitorear y apoyar pedagógicamente a sus estudiantes.
- **Necesidades:**
  - Visualizar en tiempo real el estado de conocimiento individual de cada estudiante.
  - Identificar estudiantes en riesgo académico para intervención oportuna.
  - Exportar reportes de progreso grupal.
  - Agregar comentarios o retroalimentación personalizada.
- **Pain Points:**
  - No tiene visibilidad del trabajo autónomo de sus estudiantes entre clases.
  - No puede identificar quién necesita ayuda urgente sin evaluaciones formales.

### 4.2 Usuario Secundario

#### Administrador del Sistema

- **Descripción:** Responsable técnico de la plataforma (puede ser el equipo de desarrollo en el contexto académico).
- **Necesidades:**
  - Gestionar usuarios, roles y configuraciones del sistema.
  - Monitorear servicios en AWS y métricas operativas.
  - Activar/desactivar cuentas y mantener seguridad.

### 4.3 Stakeholders

| Stakeholder | Rol | Entregables de Interés | Estrategia de Gestión |
|---|---|---|---|
| **Comité de Proyectos** | Evaluador académico | Project Charter, Plan de Dirección, informe final de tesis, sustentación | Presentar entregables claros; cumplir hitos establecidos |
| **Asesor de Tesis** | Supervisor y validador técnico-académico | Requerimientos, diseño, arquitectura, avances de desarrollo, validaciones | Comunicación semanal; validar entregables clave antes de cierre |
| **Universidad (UPC)** | Entidad académica | Proyecto de tesis completo; producto tecnológico | Cumplir lineamientos académicos y estándares de calidad |
| **Estudiantes universitarios** | Usuarios finales | Plataforma web; recomendaciones; reportes de progreso | Involucrar en pruebas piloto; recoger feedback |
| **Docentes universitarios** | Usuarios clave de validación | Dashboard de trazabilidad; reportes de desempeño | Validar necesidades; asegurar valor pedagógico |
| **Equipo del Proyecto** | Ejecutores | Todos los entregables | Coordinar actividades; cumplir cronograma |
| **AWS / GitHub / Moodle** | Proveedores tecnológicos | Infraestructura; repositorios; integración de datos | Asegurar disponibilidad; mantener alternativas locales |

---

## 5. Alcance del Producto

### 5.1 Dentro del Alcance

El producto incluye el análisis, diseño, desarrollo, integración y validación de los siguientes componentes:

**Frontend (React.js)**
- Interfaz de usuario responsiva y accesible desde navegadores web modernos.
- Vistas de registro, login, dashboard de estudiante, recomendaciones, progreso, XAI y configuración de perfil.
- Dashboard docente con visualizaciones de trazabilidad.
- Panel administrativo.

**Backend (FastAPI)**
- APIs RESTful para autenticación (JWT), gestión de usuarios, interacciones, recomendaciones y reportes.
- Lógica de negocio del sistema.
- Integración con módulo de IA.

**Base de Datos (PostgreSQL)**
- Almacenamiento persistente de usuarios, roles, interacciones, historial de aprendizaje, recomendaciones y configuraciones.

**Módulo de Knowledge Tracing (SAKT / pyKT)**
- Implementación del modelo SAKT mediante la librería pyKT.
- Estimación del estado de conocimiento del estudiante por concepto.
- Detección de brechas de conocimiento en tiempo real.

**Motor de Recomendación Adaptativa**
- Generación de recomendaciones personalizadas (mínimo 3 por sesión).
- Selección de recursos según nivel de dominio actual.
- Actualización de recomendaciones tras cada interacción completada.

**Módulo de Explicabilidad XAI**
- Visualización de mapas de calor de atención del modelo SAKT.
- Explicaciones en lenguaje natural del porqué de cada recomendación.
- Almacenamiento de visualizaciones históricas en AWS S3.

**Dashboard de Trazabilidad Docente**
- Estado de conocimiento por estudiante y concepto en tiempo real.
- Listado de estudiantes ordenado por nivel de riesgo académico.
- Alertas automáticas de bajo dominio.
- Exportación de reportes en PDF.
- Comentarios y retroalimentación personalizada.

**Integración con Moodle**
- Conexión con la API REST de Moodle para recolección de interacciones académicas.
- Sincronización y almacenamiento estructurado de logs de aprendizaje.

**Infraestructura (AWS)**
- Despliegue del sistema en entorno cloud (EC2, RDS, S3).
- Configuración de CI/CD básico.

### 5.2 Fuera del Alcance (Exclusiones)

| Exclusión | Justificación |
|---|---|
| Aplicación móvil nativa (Android/iOS) | Fuera del alcance; sistema limitado a plataforma web |
| Despliegue en producción a escala institucional | Prototipo académico de validación |
| Entrenamiento del modelo SAKT desde cero | Se usa pyKT con modelos pre-entrenados |
| Modelos de IA adicionales (LLMs conversacionales, analítica predictiva avanzada) | Fuera del enfoque definido |
| Integración con múltiples LMS | Solo Moodle o simulaciones de su API |
| Videoconferencia, aulas virtuales síncronas, mensajería en tiempo real | No contemplado |
| Generación de contenido educativo propio | Solo recomendación de recursos existentes |
| Redes sociales o foros entre estudiantes | No contemplado |
| Entrenamiento continuo automatizado del modelo en producción | Fuera del alcance académico |
| Soporte técnico y mantenimiento post-proyecto | No contemplado |
| Integración con ERP, sistemas administrativos o plataformas financieras | Fuera del alcance |
| Escalabilidad a miles de usuarios concurrentes | Enfoque académico de prototipo |

---

## 6. Arquitectura del Sistema

### 6.1 Visión General — Modelo C4

El sistema sigue el **Modelo C4** de Simon Brown para documentación de arquitectura.

#### Nivel 1 — Contexto del Sistema

```
[Estudiante] ──────────────────────────────────────────┐
                                                        │
[Docente] ────────────────► [SWARD Web Platform] ◄─────┤
                                                        │
[Administrador] ───────────────────────────────────────┘
                                    │
                           [Moodle LMS API]
```

- El **estudiante** interactúa con la plataforma para recibir recomendaciones y visualizar su progreso.
- El **docente** accede al dashboard de trazabilidad.
- El **administrador** gestiona usuarios y monitorea el sistema.
- **Moodle** provee los datos de interacción académica del estudiante.

#### Nivel 2 — Contenedores

| Contenedor | Tecnología | Responsabilidad |
|---|---|---|
| **Web Frontend** | React.js | Interfaz de usuario; vistas de estudiante, docente y admin |
| **API Backend** | FastAPI (Python) | Lógica de negocio; endpoints REST; autenticación JWT |
| **Base de Datos** | PostgreSQL (AWS RDS) | Persistencia de datos: usuarios, interacciones, recomendaciones |
| **Motor de IA (KT + Recomendación)** | pyKT / SAKT / Python | Inferencia del estado de conocimiento; generación de recomendaciones |
| **Módulo XAI** | Python / Attention Maps | Generación de mapas de atención y explicaciones en lenguaje natural |
| **Almacenamiento de Archivos** | AWS S3 | Almacenamiento de visualizaciones XAI históricas; recursos educativos |
| **Servidor de Aplicaciones** | AWS EC2 | Hospedaje del backend y motor de IA |
| **LMS Externo** | Moodle REST API | Fuente de datos de interacciones académicas |

#### Nivel 3 — Componentes del Backend (FastAPI)

| Componente | Función |
|---|---|
| **Auth Module** | Registro, login, JWT, control de sesiones, roles |
| **User Management** | Gestión de perfiles de estudiantes, docentes y administradores |
| **Interaction Collector** | Recepción y almacenamiento de interacciones desde Moodle |
| **KT Engine Connector** | Invoca el modelo SAKT/pyKT y retorna estado de conocimiento |
| **Recommendation Engine** | Genera recomendaciones personalizadas basadas en KT |
| **XAI Generator** | Produce mapas de atención y explicaciones textuales |
| **Teacher Dashboard API** | Endpoints para trazabilidad, alertas y reportes docentes |
| **Admin API** | Gestión de usuarios, monitoreo y configuración del sistema |
| **Audit Logger** | Registro de auditoría de acciones administrativas |

#### Nivel 3 — Componentes del Motor de IA

| Componente | Función |
|---|---|
| **Data Preprocessor** | Limpieza y formateo de logs de interacción para el modelo |
| **SAKT Model (pyKT)** | Inferencia del estado de conocimiento; predicción de dominio por concepto |
| **Knowledge State Updater** | Actualiza el estado del estudiante tras cada nueva interacción |
| **Gap Detector** | Identifica conceptos con dominio por debajo del umbral definido |
| **Resource Ranker** | Ordena recursos educativos por relevancia para el estado actual |
| **Attention Map Generator** | Genera mapas de calor de atención del modelo SAKT |
| **NL Explainer** | Convierte pesos de atención en explicaciones en lenguaje natural |

### 6.2 Stack Tecnológico Completo

| Capa | Tecnología | Versión/Notas |
|---|---|---|
| **Frontend** | React.js | SPA; diseño responsivo |
| **Backend** | FastAPI (Python) | REST API; Pydantic para validación |
| **Base de Datos** | PostgreSQL | AWS RDS |
| **ORM** | SQLAlchemy | Gestión de modelos de datos |
| **Autenticación** | JWT (JSON Web Tokens) | Tokens de sesión seguros |
| **Motor de KT** | pyKT + SAKT | Librería Python sobre PyTorch |
| **Deep Learning** | PyTorch | Base del modelo SAKT |
| **Visualización XAI** | Matplotlib / Seaborn / Custom | Mapas de atención |
| **Caché** | Redis | Caché de heatmaps XAI frecuentes |
| **Almacenamiento Cloud** | AWS S3 | Visualizaciones históricas XAI |
| **Servidor** | AWS EC2 | Despliegue del sistema |
| **Base de Datos Cloud** | AWS RDS | PostgreSQL gestionado |
| **Control de Versiones** | GitHub | CI/CD y gestión del código fuente |
| **Contenerización** | Docker | Entorno local de contingencia |
| **LMS Integrado** | Moodle REST API | Fuente de interacciones del estudiante |
| **IDE** | Visual Studio Code | Entorno de desarrollo |

### 6.3 Diagrama de Flujo Principal

```
Estudiante
    │
    ▼
[Login (JWT)] ──── [Perfil & Configuración]
    │
    ▼
[Integración Moodle] ──► [Recolección de Interacciones]
    │                              │
    │                              ▼
    │                    [Almacenamiento en PostgreSQL]
    │                              │
    ▼                              ▼
[Motor SAKT/pyKT] ◄──── [Preprocesamiento de Datos]
    │
    ├──► [Estado de Conocimiento por Concepto]
    │              │
    │              ├──► [Detección de Brechas]
    │              └──► [Motor de Recomendación]
    │                          │
    │                          ▼
    │              [Recursos Recomendados (≥ 3)]
    │
    └──► [Generador XAI]
              │
              ├──► [Mapa de Calor de Atención]
              └──► [Explicación en Lenguaje Natural]
                              │
                              ▼
                    [Dashboard Estudiante]
                    
Docente
    │
    ▼
[Dashboard Docente]
    ├── [Estado de conocimiento en tiempo real]
    ├── [Listado por riesgo académico]
    ├── [Alertas automáticas]
    ├── [Historial de interacciones por estudiante]
    ├── [Exportación PDF]
    └── [Retroalimentación personalizada]
```

---

## 7. Épicas y Requerimientos Funcionales

El sistema se organiza en **6 épicas funcionales** con un total de **55 historias de usuario**.

### EP001 — Gestión de Acceso y Usuarios (HU-001 a HU-010)

**Objetivo:** Gestionar el acceso seguro al sistema para estudiantes, docentes y administradores.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-001-01 | El sistema debe permitir el registro de estudiantes con correo institucional y contraseña |
| RF-001-02 | El sistema debe permitir el inicio de sesión con autenticación JWT para todos los roles |
| RF-001-03 | El sistema debe permitir el cierre de sesión seguro, incluyendo cierre en todos los dispositivos |
| RF-001-04 | El sistema debe permitir el registro de docentes con verificación de rol institucional |
| RF-001-05 | El sistema debe controlar el acceso por rol (estudiante, docente, administrador) |
| RF-001-06 | El administrador debe poder gestionar roles y permisos de usuario |
| RF-001-07 | El sistema debe validar el formato y unicidad del correo electrónico al registro |
| RF-001-08 | El sistema debe permitir la recuperación de contraseña por correo electrónico |
| RF-001-09 | El sistema debe permitir la edición del perfil académico del estudiante |
| RF-001-10 | El sistema debe bloquear el acceso tras 5 intentos fallidos de login |

### EP002 — Integración con Moodle (HU-011 a HU-018)

**Objetivo:** Integrar el sistema con Moodle para recolectar y almacenar las interacciones de aprendizaje.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-002-01 | El sistema debe conectarse a la API REST de Moodle para recolectar interacciones automáticamente |
| RF-002-02 | El sistema debe registrar cada interacción del estudiante con recursos educativos |
| RF-002-03 | El sistema debe almacenar los logs de interacción en PostgreSQL con persistencia y trazabilidad |
| RF-002-04 | El sistema debe sincronizar los datos de Moodle en tiempo real o near-real-time |
| RF-002-05 | El sistema debe registrar fecha y hora de cada interacción para análisis temporal |
| RF-002-06 | Los docentes deben poder visualizar el catálogo de recursos de Moodle en el sistema |
| RF-002-07 | El sistema debe validar la completitud y consistencia de los datos de Moodle antes de procesarlos |
| RF-002-08 | El sistema debe manejar errores de conexión con Moodle sin interrumpir el servicio principal |

### EP003 — Knowledge Tracing y Recomendación Adaptativa (HU-019 a HU-028)

**Objetivo:** Implementar el motor de Knowledge Tracing (SAKT/pyKT) y el sistema de recomendación adaptativa.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-003-01 | El sistema debe procesar el historial de interacciones mediante el modelo SAKT para estimar el estado de conocimiento por concepto |
| RF-003-02 | El sistema debe actualizar el estado de conocimiento del estudiante tras cada nueva interacción |
| RF-003-03 | El sistema debe identificar automáticamente las brechas de conocimiento del estudiante |
| RF-003-04 | El sistema debe seleccionar los recursos más adecuados según el estado de conocimiento actual |
| RF-003-05 | El sistema debe generar al menos 3 recomendaciones de recursos personalizadas por sesión |
| RF-003-06 | El sistema debe visualizar los conceptos con dominio deficiente al estudiante |
| RF-003-07 | El sistema debe calcular la probabilidad de dominio de cada concepto por estudiante |
| RF-003-08 | El sistema debe permitir filtrar recomendaciones por tipo de recurso (video, lectura, ejercicio) |
| RF-003-09 | El sistema debe actualizar las recomendaciones cuando el estudiante completa un recurso |
| RF-003-10 | El sistema debe mostrar al estudiante su historial de recursos recomendados y completados |

### EP004 — Explicabilidad XAI (HU-029 a HU-036)

**Objetivo:** Proveer explicaciones XAI visuales y textuales de las recomendaciones generadas al estudiante.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-004-01 | El sistema debe visualizar el mapa de calor de atención del modelo SAKT para cada recomendación |
| RF-004-02 | El sistema debe generar una explicación en lenguaje natural del porqué de cada recurso recomendado |
| RF-004-03 | El sistema debe mostrar el nivel de dominio por concepto en un gráfico de progreso |
| RF-004-04 | El sistema debe mostrar qué conceptos previos están relacionados con el recurso recomendado |
| RF-004-05 | El sistema debe generar visualizaciones XAI con latencia máxima de 500 ms |
| RF-004-06 | El sistema debe mostrar un resumen de la sesión de aprendizaje al finalizarla |
| RF-004-07 | El sistema debe permitir comparar el progreso actual con sesiones anteriores en gráfico histórico |
| RF-004-08 | El sistema debe guardar las visualizaciones XAI en AWS S3 para referencia histórica |

### EP005 — Dashboard de Trazabilidad Docente (HU-037 a HU-045)

**Objetivo:** Ofrecer al docente un dashboard de trazabilidad y control del progreso estudiantil.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-005-01 | El sistema debe mostrar en tiempo real el estado de conocimiento de cada estudiante por concepto |
| RF-005-02 | El sistema debe listar estudiantes ordenados por nivel de riesgo académico (indicadores de colores) |
| RF-005-03 | El sistema debe generar alertas automáticas cuando un estudiante presente bajo dominio en un concepto clave |
| RF-005-04 | El sistema debe permitir filtrar el dashboard por curso, semana o concepto específico |
| RF-005-05 | El sistema debe visualizar el historial de interacciones de un estudiante específico |
| RF-005-06 | El sistema debe permitir exportar el reporte de progreso grupal en formato PDF |
| RF-005-07 | El sistema debe mostrar qué recursos fueron más utilizados y mejor valorados |
| RF-005-08 | El sistema debe calcular métricas de engagement estudiantil (frecuencia de uso, recursos completados) |
| RF-005-09 | El sistema debe permitir al docente agregar comentarios o retroalimentación desde el dashboard |

### EP006 — Administración y Seguridad (HU-046 a HU-055)

**Objetivo:** Administrar usuarios, seguridad y operación del sistema en producción.

| Código RF | Requerimiento Funcional |
|---|---|
| RF-006-01 | El administrador debe poder iniciar sesión en el panel administrativo |
| RF-006-02 | El administrador debe poder visualizar la lista de usuarios registrados con rol y estado |
| RF-006-03 | El administrador debe poder activar o desactivar cuentas de usuario |
| RF-006-04 | El sistema debe autenticar todos los usuarios con JWT |
| RF-006-05 | El sistema debe cifrar toda la comunicación con HTTPS |
| RF-006-06 | El sistema debe registrar auditoría de cambios administrativos |
| RF-006-07 | El administrador debe poder monitorear servicios AWS (EC2, RDS, S3) |
| RF-006-08 | El sistema debe aplicar validación de inputs con Pydantic en todos los endpoints |
| RF-006-09 | El administrador debe poder visualizar métricas de uso del sistema |
| RF-006-10 | El sistema debe restringir el panel administrativo solo a cuentas autorizadas |

---

## 8. Requerimientos No Funcionales

### 8.1 Rendimiento

| Código RNF | Requerimiento | Métrica |
|---|---|---|
| RNF-PERF-01 | Tiempo de respuesta del sistema | ≤ 3 segundos en operaciones principales |
| RNF-PERF-02 | Latencia del módulo de inferencia SAKT | < 500 ms en inferencia |
| RNF-PERF-03 | Latencia del caché XAI (Redis) | < 50 ms para heatmaps ya calculados |
| RNF-PERF-04 | Tiempo de sincronización con Moodle | Near-real-time durante sesión activa |

### 8.2 Seguridad

| Código RNF | Requerimiento |
|---|---|
| RNF-SEC-01 | Autenticación mediante JWT con expiración configurable |
| RNF-SEC-02 | Comunicación cifrada con HTTPS/TLS |
| RNF-SEC-03 | Validación estricta de inputs con Pydantic en todos los endpoints |
| RNF-SEC-04 | Control de acceso basado en roles (RBAC): estudiante / docente / administrador |
| RNF-SEC-05 | Bloqueo de cuenta tras 5 intentos fallidos de login |
| RNF-SEC-06 | Registro de auditoría de acciones administrativas |
| RNF-SEC-07 | Aplicación de OWASP Top 10 en pruebas de seguridad del backend |

### 8.3 Usabilidad y Accesibilidad

| Código RNF | Requerimiento |
|---|---|
| RNF-USA-01 | La interfaz debe cumplir principios de accesibilidad WCAG 2.1 |
| RNF-USA-02 | La interfaz debe ser intuitiva (sin capacitación extensa para uso básico) |
| RNF-USA-03 | El sistema debe ser responsivo y funcionar en navegadores web modernos (Chrome, Firefox, Edge, Safari) |
| RNF-USA-04 | Las visualizaciones de progreso y XAI deben ser claras, interpretables y sin ambigüedad |

### 8.4 Confiabilidad y Disponibilidad

| Código RNF | Requerimiento |
|---|---|
| RNF-REL-01 | El sistema debe manejar errores de conexión con Moodle sin interrumpir el servicio |
| RNF-REL-02 | El sistema debe funcionar sin errores críticos en todas las pruebas de integración |
| RNF-REL-03 | El sistema debe mantener entorno local Docker como contingencia ante fallos de AWS |
| RNF-REL-04 | Las visualizaciones XAI deben entregarse con carga progresiva si la latencia supera 500 ms |

### 8.5 Mantenibilidad y Escalabilidad

| Código RNF | Requerimiento |
|---|---|
| RNF-MNT-01 | La arquitectura debe ser modular para permitir mantenimiento independiente por componente |
| RNF-MNT-02 | El código debe seguir buenas prácticas y convenciones (legibilidad, Code Review) |
| RNF-MNT-03 | El sistema debe usar GitHub para control de versiones y trazabilidad del código |
| RNF-MNT-04 | La arquitectura debe permitir escalabilidad horizontal futura (microservicios) |

### 8.6 Portabilidad

| Código RNF | Requerimiento |
|---|---|
| RNF-POR-01 | El sistema debe poder desplegarse en contenedores Docker para ejecución local |
| RNF-POR-02 | El sistema debe ser compatible con infraestructura AWS (EC2, RDS, S3) |

---

## 9. Requerimientos de Negocio y Calidad

### 9.1 Requerimientos de Negocio

| Código | Descripción |
|---|---|
| RN-01 | El sistema debe mejorar la efectividad del aprendizaje autónomo en estudiantes universitarios de Lima Metropolitana |
| RN-02 | El sistema debe permitir a los docentes tener visibilidad y trazabilidad del progreso académico de sus estudiantes |
| RN-03 | El sistema debe proporcionar recomendaciones personalizadas de recursos educativos basadas en el estado de conocimiento del estudiante |
| RN-04 | El sistema debe generar valor académico demostrando la viabilidad del uso de IA explicable en educación superior |
| RN-05 | El sistema debe alinearse con los objetivos de innovación educativa y transformación digital en universidades |

### 9.2 Requerimientos de Transición

| Código | Descripción |
|---|---|
| RT-01 | Configuración del entorno de desarrollo (backend, frontend, BD, IA) |
| RT-02 | Integración del sistema con datos simulados o reales de Moodle |
| RT-03 | Capacitación de usuarios (estudiantes y docentes) en el uso del sistema |
| RT-04 | Pruebas piloto con al menos 10 estudiantes y 2 docentes |
| RT-05 | Migración inicial o carga de datos para pruebas del sistema |

### 9.3 Requerimientos del Proyecto

| Código | Descripción |
|---|---|
| RP-01 | El proyecto debe desarrollarse bajo metodología ágil Scrum |
| RP-02 | El proyecto debe completarse en dos ciclos académicos (TP1 y TP2) |
| RP-03 | El equipo estará conformado por dos integrantes |
| RP-04 | Se deben cumplir los hitos definidos en el Project Charter |
| RP-05 | Se debe elaborar documentación técnica y académica completa |
| RP-06 | Se debe presentar un MVP funcional del sistema |

### 9.4 Requerimientos de Calidad

| Código | Descripción | Métrica |
|---|---|---|
| RQ-01 | Precisión mínima del modelo SAKT | AUC ≥ 0.75 |
| RQ-02 | Usabilidad mínima del sistema | SUS ≥ 70% |
| RQ-03 | Pruebas de integración sin errores críticos | 0 errores críticos |
| RQ-04 | Coherencia de recomendaciones con el desempeño del usuario | Validación cualitativa con usuarios |
| RQ-05 | Cumplimiento de estándar de calidad de software | ISO/IEC 25010 |
| RQ-06 | Documentación validada | Aprobación por asesor |

---

## 10. Historias de Usuario Detalladas

A continuación se presenta el listado completo de las 55 historias de usuario organizadas por épica, con sus criterios de aceptación principales.

### EP001 — Gestión de Acceso y Usuarios

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-001 | Estudiante | Registrarme con correo institucional y contraseña | Acceder a las funcionalidades personalizadas | 1 | Alta |
| HU-002 | Estudiante | Iniciar sesión con mis credenciales | Acceder a mi perfil y recomendaciones | 1 | Alta |
| HU-003 | Estudiante | Cerrar sesión de forma segura | Proteger mi información académica | 1 | Media |
| HU-004 | Docente | Registrarme con rol de docente | Gestionar y monitorear el progreso de estudiantes | 1 | Alta |
| HU-005 | Docente | Iniciar sesión con credenciales docentes | Acceder al dashboard de trazabilidad | 1 | Alta |
| HU-006 | Administrador | Gestionar roles de usuario | Asegurar acceso controlado por rol | 1 | Alta |
| HU-007 | Sistema | Validar formato de correo al registro | Garantizar datos correctos | 1 | Alta |
| HU-008 | Sistema | Verificar unicidad del correo | Evitar cuentas duplicadas | 1 | Alta |
| HU-009 | Estudiante | Recuperar contraseña por correo | Poder acceder si la olvido | 1 | Media |
| HU-010 | Estudiante | Editar perfil académico | Mantener datos actualizados | 1 | Media |

**Criterios de aceptación seleccionados:**

**HU-001:**
- **Escenario 1 — Registro exitoso:** Dado que el estudiante ingresa correo válido y contraseña segura, cuando presione "Registrarse", el sistema crea la cuenta, envía correo de confirmación y redirige al perfil.
- **Escenario 2 — Correo ya registrado:** Dado que el correo ya existe, el sistema muestra "El correo ya se encuentra registrado. Intente iniciar sesión."
- **Escenario 3 — Campos incompletos:** Dado que hay campos vacíos, el sistema resalta en rojo y muestra "Por favor complete todos los campos requeridos."

**HU-002:**
- **Escenario 1 — Login exitoso:** Dado que las credenciales son correctas, el sistema autentica con JWT y redirige al dashboard de recomendaciones.
- **Escenario 2 — Contraseña incorrecta:** El sistema muestra "Credenciales inválidas. Verifique su correo y contraseña."
- **Escenario 3 — Cuenta inactiva:** El sistema muestra "Tu cuenta está inactiva. Contacta al administrador."

**HU-003:**
- **Escenario 1 — Cierre exitoso:** El sistema invalida el token JWT, limpia la sesión y redirige al inicio de sesión.
- **Escenario 2 — Sesión expirada:** Cuando el JWT expire por inactividad, el sistema cierra sesión y notifica al usuario.
- **Escenario 3 — Cierre en todos los dispositivos:** El sistema invalida todos los tokens JWT activos del usuario.

---

### EP002 — Integración con Moodle

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-011 | Sistema | Conectar a la API REST de Moodle | Recolectar interacciones automáticamente | 2 | Alta |
| HU-012 | Sistema | Registrar cada interacción con recursos | Construir historial de aprendizaje para SAKT | 2 | Alta |
| HU-013 | Sistema | Almacenar logs en PostgreSQL | Garantizar persistencia y trazabilidad | 2 | Alta |
| HU-014 | Sistema | Sincronizar datos de Moodle en tiempo real | Mantener estado de conocimiento actualizado | 2 | Alta |
| HU-015 | Sistema | Registrar fecha y hora de cada interacción | Permitir análisis temporal del progreso | 2 | Media |
| HU-016 | Docente | Visualizar recursos de Moodle en el sistema | Asegurar que recomendaciones usen catálogo institucional | 2 | Media |
| HU-017 | Sistema | Validar datos de interacción de Moodle | Evitar errores en pipeline de inferencia SAKT | 2 | Alta |
| HU-018 | Sistema | Manejar errores de conexión con Moodle | Garantizar disponibilidad ante fallos de integración | 2 | Media |

---

### EP003 — Knowledge Tracing y Recomendación Adaptativa

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-019 | Sistema | Procesar historial con modelo SAKT | Estimar estado de conocimiento por concepto | 3 | Alta |
| HU-020 | Sistema | Actualizar estado de conocimiento tras cada interacción | Mantener predicciones actualizadas | 3 | Alta |
| HU-021 | Sistema | Identificar brechas de conocimiento | Generar recomendaciones orientadas a cerrarlas | 3 | Alta |
| HU-022 | Sistema | Seleccionar recursos adecuados al estado actual | Personalizar recomendación por nivel de dominio | 4 | Alta |
| HU-023 | Estudiante | Recibir ≥ 3 recomendaciones por sesión | Optimizar tiempo de estudio | 4 | Alta |
| HU-024 | Estudiante | Visualizar conceptos a reforzar | Enfocar estudio autónomo en áreas de mayor necesidad | 4 | Alta |
| HU-025 | Sistema | Calcular probabilidad de dominio por concepto | Ordenar recomendaciones por prioridad | 4 | Alta |
| HU-026 | Estudiante | Filtrar recomendaciones por tipo de recurso | Elegir formato preferido de aprendizaje | 4 | Media |
| HU-027 | Sistema | Actualizar recomendaciones al completar un recurso | Reflejar siempre el estado de conocimiento más reciente | 4 | Alta |
| HU-028 | Estudiante | Ver historial de recursos recomendados y completados | Hacer seguimiento del progreso autónomo | 4 | Media |

---

### EP004 — Explicabilidad XAI

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-029 | Estudiante | Ver mapa de calor de atención del SAKT | Comprender qué interacciones pasadas influyen en la recomendación | 5 | Alta |
| HU-030 | Estudiante | Recibir explicación en lenguaje natural del porqué de cada recurso | Confiar en las sugerencias y tomar decisiones informadas | 5 | Alta |
| HU-031 | Estudiante | Ver nivel de dominio por concepto en gráfico | Entender mi estado de conocimiento de forma visual | 5 | Alta |
| HU-032 | Estudiante | Ver conceptos previos relacionados al recurso recomendado | Planificar mejor mi aprendizaje | 5 | Media |
| HU-033 | Sistema | Generar visualizaciones XAI con latencia < 500 ms | Garantizar experiencia fluida en tiempo real | 5 | Alta |
| HU-034 | Estudiante | Ver resumen de sesión al finalizarla | Reflexionar sobre avance y planificar próxima sesión | 5 | Media |
| HU-035 | Estudiante | Comparar progreso actual con sesiones anteriores | Identificar evolución en aprendizaje autónomo | 5 | Media |
| HU-036 | Sistema | Guardar visualizaciones XAI para referencia histórica | Permitir análisis retrospectivo del aprendizaje | 5 | Baja |

**Criterios de aceptación seleccionados:**

**HU-033:**
- **Escenario 1 — Visualización dentro del límite:** En carga normal, cuando se solicite el heatmap XAI, el sistema lo genera y entrega en < 500 ms.
- **Escenario 2 — Latencia excedida:** Si supera 500 ms, el sistema entrega con carga progresiva y registra alerta en logs.
- **Escenario 3 — Caché Redis:** Si el mismo heatmap fue solicitado antes, el sistema lo sirve desde Redis en < 50 ms.

---

### EP005 — Dashboard de Trazabilidad Docente

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-037 | Docente | Ver estado de conocimiento de cada estudiante en tiempo real | Monitorear progreso individual y detectar brechas | 6 | Alta |
| HU-038 | Docente | Ver listado de estudiantes ordenado por riesgo académico | Identificar quiénes requieren intervención urgente | 6 | Alta |
| HU-039 | Docente | Recibir alertas cuando un estudiante presente bajo dominio | Intervenir a tiempo | 6 | Alta |
| HU-040 | Docente | Filtrar dashboard por curso, semana o concepto | Analizar con el nivel de detalle requerido | 6 | Media |
| HU-041 | Docente | Ver historial de interacciones de un estudiante específico | Entender proceso de aprendizaje individual | 6 | Alta |
| HU-042 | Docente | Exportar reporte de progreso grupal en PDF | Compartir análisis con coordinación académica | 6 | Media |
| HU-043 | Docente | Ver recursos más utilizados y mejor valorados | Tomar decisiones sobre el material del curso | 6 | Media |
| HU-044 | Sistema | Calcular métricas de engagement estudiantil | Proveer indicadores cuantitativos de autonomía | 6 | Alta |
| HU-045 | Docente | Agregar comentarios o retroalimentación desde el dashboard | Mantener comunicación pedagógica personalizada | 6 | Media |

**Criterios de aceptación seleccionados:**

**HU-037:**
- **Escenario 1 — Dashboard en tiempo real:** Con sincronización activa, muestra tabla con estudiantes, conceptos y dominio (rojo < 60%, amarillo 60–80%, verde > 80%).
- **Escenario 2 — Estudiante sin actividad:** Muestra estado "Sin actividad" en gris con fecha del último acceso.
- **Escenario 3 — Datos desactualizados:** Muestra últimos datos con indicador "Actualizado hace X min" y alerta de sincronización.

**HU-038:**
- **Escenario 1 — Listado ordenado por riesgo:** Muestra estudiantes con mayor cantidad de brechas primero, con indicadores de colores.

---

### EP006 — Administración y Seguridad

| ID | Como... | Quiero... | Para... | Sprint | Prioridad |
|---|---|---|---|---|---|
| HU-046 | Administrador | Iniciar sesión en el panel administrativo | Gestionar usuarios, roles y configuraciones | 7 | Alta |
| HU-047 | Administrador | Ver lista de usuarios con rol y estado | Monitorear uso y adopción del sistema | 7 | Alta |
| HU-048 | Administrador | Activar o desactivar cuentas de usuario | Controlar acceso según políticas institucionales | 7 | Alta |
| HU-049 | Sistema | Autenticar usuarios con JWT | Garantizar seguridad de sesiones | 7 | Alta |
| HU-050 | Sistema | Cifrar comunicación con HTTPS | Proteger privacidad de datos de interacción | 7 | Alta |
| HU-051 | Sistema | Registrar auditoría de cambios administrativos | Mantener trazabilidad de acciones | 7 | Media |
| HU-052 | Administrador | Monitorear servicios AWS (EC2, RDS, S3) | Asegurar disponibilidad y rendimiento | 7 | Alta |
| HU-053 | Sistema | Validar inputs con Pydantic en todos los endpoints | Prevenir inyecciones y errores de formato | 7 | Alta |
| HU-054 | Administrador | Ver métricas de uso del sistema | Analizar comportamiento operativo y planificar escalabilidad | 7 | Media |
| HU-055 | Sistema | Restringir panel administrativo a cuentas autorizadas | Garantizar que solo el admin pueda modificar configuración | 7 | Alta |

---

## 11. Criterios de Aceptación del Producto

| Entregable / Componente | Criterios de Aceptación |
|---|---|
| **Documento de Requerimientos** | Contiene RN, RF, RNF, RT, RP y RQ sin ambigüedades; aprobado por el asesor |
| **Arquitectura C4** | Representa correctamente los 4 niveles (Context, Containers, Components, Code) incluyendo integraciones; validado por el asesor |
| **Diseño de Base de Datos** | Modelo ER correcto, sin redundancias, con integridad referencial y probado mediante conexión funcional con backend |
| **Diseño UI/UX** | Mockups claros e intuitivos; cumple principios de usabilidad; validación cualitativa con usuarios piloto |
| **Backend (FastAPI)** | Implementa correctamente todos los endpoints; maneja JWT; responde en ≤ 3 segundos |
| **Frontend (React.js)** | Permite interacción completa del usuario; muestra datos, reportes y recomendaciones sin errores críticos |
| **Módulo SAKT (pyKT)** | Implementa correctamente el modelo; genera predicciones coherentes del estado de conocimiento |
| **Motor de Recomendación** | Genera recomendaciones personalizadas coherentes con el historial y estado de conocimiento del usuario |
| **Módulo XAI** | Presenta visualizaciones interpretables (mapas de atención) con latencia < 500 ms |
| **Dashboard Docente** | Permite visualizar progreso en tiempo real con métricas claras e interpretables |
| **Plataforma Web Integrada** | Funciona de manera integrada (frontend + backend + BD + IA) sin fallos críticos; flujo completo habilitado |
| **Reportes de Progreso** | Presenta información clara mediante gráficos y estadísticas |
| **Pruebas del Sistema** | Pruebas unitarias, de integración y funcionales ejecutadas con 0 errores críticos |
| **Validación con Usuarios** | Pruebas con ≥ 10 estudiantes y ≥ 2 docentes; retroalimentación documentada |
| **Desempeño del Modelo IA** | AUC ≥ 0.75 en pruebas con datos piloto |
| **Usabilidad** | SUS ≥ 70 puntos |
| **Documentación Técnica** | Describe claramente arquitectura, componentes, tecnologías y funcionamiento |
| **Informe Final de Tesis** | Cumple lineamientos académicos UPC; aprobado por asesor y jurado |

---

## 12. Modelo de Datos

### 12.1 Entidades Principales

| Entidad | Descripción | Atributos Clave |
|---|---|---|
| **User** | Usuarios del sistema (estudiantes, docentes, admins) | id, email, password_hash, role, is_active, created_at |
| **StudentProfile** | Perfil académico del estudiante | user_id, full_name, institution, career, semester |
| **TeacherProfile** | Perfil del docente | user_id, full_name, institution, verification_code |
| **Course** | Cursos registrados en el sistema | id, name, moodle_course_id, teacher_id |
| **Concept** | Conceptos o habilidades académicas trazadas | id, name, course_id, description |
| **Resource** | Recursos educativos disponibles | id, title, type (video/lectura/ejercicio), url, concept_id, moodle_resource_id |
| **Interaction** | Interacciones del estudiante con recursos | id, student_id, resource_id, concept_id, is_correct, timestamp, source (moodle/manual) |
| **KnowledgeState** | Estado de conocimiento estimado por SAKT | id, student_id, concept_id, mastery_probability, updated_at |
| **Recommendation** | Recomendaciones generadas por el motor | id, student_id, resource_id, session_id, rank, generated_at, completed_at |
| **XAIVisualization** | Visualizaciones XAI almacenadas | id, recommendation_id, student_id, heatmap_s3_url, nl_explanation, generated_at |
| **LearningSession** | Sesiones de aprendizaje del estudiante | id, student_id, started_at, ended_at, summary_generated |
| **TeacherFeedback** | Retroalimentación del docente al estudiante | id, teacher_id, student_id, message, created_at |
| **AuditLog** | Registro de auditoría administrativa | id, admin_id, action, target_entity, target_id, timestamp |

### 12.2 Relaciones Clave

- Un **User** puede ser `StudentProfile` o `TeacherProfile` (relación 1:1).
- Un **TeacherProfile** puede gestionar múltiples **Courses**.
- Un **Course** contiene múltiples **Concepts**; cada Concept puede tener múltiples **Resources**.
- Una **Interaction** pertenece a un estudiante, un recurso y un concepto específico.
- El **KnowledgeState** se calcula por (student_id, concept_id) y se actualiza con cada nueva Interaction.
- Una **Recommendation** genera una **XAIVisualization** asociada.
- Las interacciones se agrupan en **LearningSessions**.

---

## 13. Integraciones Externas

### 13.1 Moodle REST API

| Parámetro | Detalle |
|---|---|
| **Propósito** | Recolectar interacciones académicas del estudiante (recursos vistos, ejercicios resueltos, actividades completadas) |
| **Protocolo** | REST / HTTP |
| **Autenticación** | Token de servicio Moodle |
| **Endpoints Principales** | `core_user_get_users`, `mod_quiz_get_attempts_access_information`, `core_course_get_contents` |
| **Frecuencia de Sincronización** | En tiempo real durante sesión activa; batch nocturno como respaldo |
| **Fallback** | Mock Moodle API para desarrollo y pruebas; modo degradado sin recomendaciones si Moodle no responde |
| **Datos Recolectados** | user_id, course_id, resource_id, event_type, timestamp, is_correct (cuando aplica) |

### 13.2 AWS Services

| Servicio | Uso en el Sistema |
|---|---|
| **EC2** | Hospedaje del backend FastAPI y motor de IA |
| **RDS (PostgreSQL)** | Base de datos relacional gestionada |
| **S3** | Almacenamiento de visualizaciones XAI históricas; backups del sistema |
| **Redis (ElastiCache)** | Caché de heatmaps XAI frecuentes para reducir latencia |

### 13.3 pyKT / SAKT

| Parámetro | Detalle |
|---|---|
| **Librería** | pyKT (*Liu et al., 2022*) |
| **Modelo** | Self-Attentive Knowledge Tracing (SAKT) |
| **Framework** | PyTorch |
| **Input** | Secuencia de interacciones: (concept_id, is_correct)[] |
| **Output** | Probabilidad de dominio por concepto: {concept_id: float 0–1} |
| **Modo de Uso** | Modelos pre-entrenados con fine-tuning en datos piloto |
| **Cold Start** | Onboarding con cuestionario de diagnóstico inicial para nuevos estudiantes |

---

## 14. Métricas de Éxito del Producto

### 14.1 Métricas Técnicas del Modelo IA

| Métrica | Descripción | Meta |
|---|---|---|
| **AUC (Area Under Curve)** | Capacidad del modelo SAKT para predecir correctamente el dominio del estudiante | ≥ 0.75 |
| **Latencia de inferencia** | Tiempo que tarda el modelo en generar una predicción | < 500 ms |
| **Coherencia de recomendaciones** | Evaluación cualitativa de si las recomendaciones corresponden al estado real del estudiante | Validación con usuarios |

### 14.2 Métricas de Usabilidad

| Métrica | Instrumento | Meta |
|---|---|---|
| **System Usability Scale (SUS)** | Encuesta SUS post-prueba con usuarios piloto | ≥ 70 puntos |
| **Tasa de adopción** | % de usuarios que completan el flujo de uso básico en la prueba piloto | ≥ 80% |

### 14.3 Métricas Operativas del Sistema

| Métrica | Meta |
|---|---|
| Tiempo de respuesta promedio del sistema | ≤ 3 segundos |
| Disponibilidad del sistema durante pruebas | ≥ 95% |
| Errores críticos en pruebas de integración | 0 |
| Cobertura de pruebas unitarias | ≥ 70% |

### 14.4 Métricas Académicas

| Métrica | Meta |
|---|---|
| Usuarios piloto estudiantes | ≥ 10 |
| Usuarios piloto docentes | ≥ 2 |
| Aceptación de usuarios expertos | ≥ 80% |
| Aprobación del asesor en entregables clave | 100% de hitos validados |

---

## 15. Plan de Lanzamiento e Hitos

El proyecto se desarrolla en **dos ciclos académicos (TP1 y TP2)** bajo metodología Scrum con sprints de dos semanas. El proyecto inicia el **30/03/2026** y finaliza el **27/11/2026**.

### 15.1 Fases del Proyecto

| Fase | Descripción | EDT |
|---|---|---|
| **1 — Inicio** | Definición del alcance, stakeholders, Project Charter | 1.1 – 1.4 |
| **2 — Análisis** | Revisión de literatura, benchmarking, requerimientos | 2.1 – 2.5 |
| **3 — Diseño** | Arquitectura C4, base de datos, UI/UX, diseño SAKT y XAI | 3.1 – 3.5 |
| **4 — Desarrollo** | Backend, frontend, BD, KT, recomendación, XAI, dashboard, integración | 4.1 – 4.9 |
| **5 — Pruebas y Validación** | Pruebas unitarias, integración, funcionales, piloto, métricas | 5.1 – 5.6 |
| **6 — Cierre** | Documentación, tesis, sustentación | 6.1 – 6.4 |

### 15.2 Hitos del Proyecto

| Nº | Hito | Semana | Entregables |
|---|---|---|---|
| H1 | Resultados de benchmarking y aprobación del Project Charter | S2 | Project Charter aprobado, Backlog inicial, Cronograma |
| H2 | Diseño de arquitectura C4 | S4 | Diagramas C4 (Context, Containers, Components) |
| H3 | Infraestructura en la nube y modelo de datos | S8 | Entorno AWS activo, PostgreSQL configurado, estructura backend |
| H4 | Acceso seguro y gestión de usuarios operativo | S10 | Módulo de autenticación y gestión de perfiles funcional |
| H5 | Integración con Moodle y trazabilidad de interacciones | S12 | Conexión Moodle activa, logs almacenados |
| H6 | Knowledge Tracing y recomendación adaptativa funcionando | S16 | Modelo SAKT integrado, recomendaciones generadas, flujo MVP disponible |
| H7 | Explicabilidad de recomendaciones e interpretación del progreso | S18 | Mapas de atención, explicaciones NL, visualización de progreso |
| H8 | Dashboard docente de trazabilidad y monitoreo | S20 | Dashboard con estado de conocimiento, alertas y métricas de engagement |
| H9 | Refactorización y optimización de arquitectura | S21 | Backend y BD optimizados, modularidad y mantenibilidad mejoradas |
| H10 | Mejora del motor de recomendación y seguridad | S22 | Motor afinado, seguridad OWASP reforzada, auditoría activa |
| H11 | Validación integral con usuarios | S24 | Pruebas con ≥ 10 estudiantes y ≥ 2 docentes, ajustes documentados |
| H12 | Cierre: escalabilidad, documentación y entrega final | S25 | Informe de resultados, propuesta de continuidad, producto funcional entregado |

### 15.3 Sprints Planificados

| Sprint | Épica Principal | Historias de Usuario |
|---|---|---|
| Sprint 0 | Configuración e infraestructura | Entorno AWS, pyKT, GitHub, backlog |
| Sprint 1 | EP001 — Gestión de usuarios | HU-001 a HU-010 |
| Sprint 2 | EP002 — Integración Moodle | HU-011 a HU-018 |
| Sprint 3 | EP003 (KT) | HU-019 a HU-021 |
| Sprint 4 | EP003 (Recomendación) | HU-022 a HU-028 |
| Sprint 5 | EP004 — XAI | HU-029 a HU-036 |
| Sprint 6 | EP005 — Dashboard Docente | HU-037 a HU-045 |
| Sprint 7 | EP006 — Administración y Seguridad | HU-046 a HU-055 |
| Sprints 8-9 | Refactorización, optimización y pruebas técnicas | — |
| Sprint 10 | Validación con usuarios y ajustes | — |
| Sprint 11 | Documentación final y cierre | — |

---

## 16. Riesgos del Producto

| ID | Riesgo | Probabilidad | Impacto | Nivel | Plan de Mitigación |
|---|---|---|---|---|---|
| R1 | Fallas en la integración de módulos (frontend, backend, BD, IA) | Media | Alta | **Alto** | Integración progresiva por módulos; pruebas continuas desde etapas tempranas |
| R2 | Errores en el modelo SAKT o resultados con AUC < 0.75 | Media | Alta | **Alto** | Usar modelos pre-entrenados (pyKT); validar iterativamente con datos piloto; ajustar hiperparámetros |
| R3 | Cold start del modelo SAKT por insuficiencia de datos iniciales | Alta (60%) | Alta | **Alto** | Inicializar con pesos pre-entrenados del dataset pyKT; diseñar cuestionario de diagnóstico inicial de onboarding |
| R4 | Baja adopción del sistema (estudiantes o docentes) | Media (40%) | Alta | **Alto** | Pruebas de usabilidad tempranas (Sprint 3-4); ajustar interfaces con retroalimentación continua; meta SUS ≥ 70 |
| R5 | Retrasos por carga académica del equipo | Alta (70%) | Media | **Alto** | Sprints con margen de contingencia del 20%; priorizar MVP (SAKT + recomendación + dashboard) |
| R6 | Cambios en el alcance durante el desarrollo | Media | Alta | **Alto** | Definir y congelar el alcance; validar cambios con asesor antes de implementar |
| R7 | Retrasos en la integración con la API de Moodle | Media (50%) | Media | **Medio** | Implementar Mock Moodle API para no bloquear el pipeline KT durante desarrollo |
| R8 | Curva de aprendizaje en nuevas tecnologías | Media | Media | **Medio** | Capacitación previa; uso de documentación oficial; asignación de tiempo en Sprint 0 |
| R9 | Problemas en la base de datos (diseño o integridad) | Baja | Alta | **Medio** | Diseño ER validado antes del desarrollo; pruebas de integridad con backend |
| R10 | Interrupciones en servicios AWS | Baja (20%) | Alta | **Medio** | Mantener entorno Docker local como contingencia; respaldos de pesos del modelo SAKT |
| R11 | Baja calidad de datos para pruebas del modelo | Media | Media | **Medio** | Generar datos simulados (mock); complementar con datos reales cuando sea posible |
| R12 | Vulnerabilidades de seguridad en el backend | Baja (20%) | Alta | **Medio** | JWT + HTTPS + Pydantic + pruebas OWASP Top 10 antes de cada despliegue |

---

## 17. Restricciones y Exclusiones

### 17.1 Restricciones

| Restricción | Descripción |
|---|---|
| **Recursos humanos** | El equipo está conformado por dos integrantes, limitando el desarrollo paralelo de módulos complejos |
| **Presupuesto reducido** | Se priorizan herramientas open source (pyKT, FastAPI, React.js, Moodle) y créditos académicos de AWS |
| **Volumen de datos inicial** | El cold start del modelo puede limitar la precisión en las primeras iteraciones |
| **Alcance académico** | El entregable es un prototipo funcional orientado a validación académica, no un producto comercial |
| **Plazo académico** | El proyecto debe completarse en dos ciclos académicos (TP1 y TP2) de UPC |

### 17.2 Suposiciones

| Suposición | Descripción |
|---|---|
| **Disponibilidad de datos** | El sistema recolectará logs de interacción mediante Moodle o datos simulados suficientes para ajustar SAKT |
| **Compatibilidad de pyKT** | La librería pyKT provee implementaciones funcionales de SAKT compatibles con PyTorch, sin necesidad de implementar el modelo desde cero |
| **Participación de usuarios** | Al menos 10 estudiantes y 2 docentes participarán en las pruebas piloto |
| **Infraestructura AWS** | Los servicios EC2, RDS y S3 son suficientes para despliegue y ejecución del prototipo |
| **Estabilidad tecnológica** | FastAPI, React.js, pyKT y la API de Moodle no presentarán cambios disruptivos durante el desarrollo |

---

## 18. Presupuesto y Recursos

### 18.1 Presupuesto del Proyecto

| Nº | Descripción | Cantidad / Unidad | Costo Unitario (S/) | Costo Total (S/) |
|---|---|---|---|---|
| 1 | Arquitecto de Software (Junior) | 10 meses | 1,200.00 | 12,000.00 |
| 2 | Desarrollador Backend (Junior) | 10 meses | 1,200.00 | 12,000.00 |
| 3 | Desarrollador Frontend (Junior) | 10 meses | 1,200.00 | 12,000.00 |
| 4 | Desarrollador DevOps (Junior) | 10 meses | 1,200.00 | 12,000.00 |
| 5 | Gestión (PM, PO, SM) | 10 meses | 300.00 | 3,000.00 |
| 6 | Laptops Lenovo ThinkPad | 2 unidades | 3,500.00 | 7,000.00 |
| 7 | Software Open Source | — | 0.00 | 0.00 |
| 8 | Internet | 10 meses | 100.00 | 1,000.00 |
| 9 | Electricidad | 10 meses | 50.00 | 500.00 |
| 10 | Hosting y Dominio | 1 global | 100.00 | 100.00 |
| 11 | Contingencia (5% del subtotal) | 1 global | — | 2,880.00 |
| | **Costo Base** | | | **S/ 57,600.00** |
| | **Reserva de Contingencia** | | | **S/ 2,880.00** |
| | **Reserva de Gestión (5%)** | | | **S/ 3,024.00** |
| | **TOTAL ESTIMADO** | | | **S/ 63,504.00** |

### 18.2 Equipo del Proyecto

| Rol | Integrante | Responsabilidades Principales |
|---|---|---|
| **Project Manager** | Vittorio Marcelo Eduardo Espinoza | Planificación, control, coordinación con stakeholders y asesor |
| **Scrum Master** | Alex Ramon Alberto Avila Asto | Gestión del proceso Scrum; facilitación de ceremonias; eliminación de impedimentos |
| **Product Owner** | Mori Yzaguirre, Daniel Enrique | Priorización del backlog; representación de usuarios finales |
| **Backend Developer** | Alex Avila Asto | Lógica del servidor, APIs, integración con BD |
| **Frontend Developer** | Vittorio Espinoza Eduardo | Interfaz de usuario, UI/UX, integración con APIs |
| **Software Architect** | Vittorio Espinoza Eduardo | Arquitectura técnica, selección de tecnologías, escalabilidad |
| **DevOps Developer** | Alex Avila Asto | CI/CD, infraestructura en la nube, monitoreo |

### 18.3 Recursos Tecnológicos

| Tipo | Recurso | Descripción |
|---|---|---|
| **Físico** | Laptops Lenovo ThinkPad (x2) | Desarrollo, pruebas y ejecución del sistema |
| **Físico** | Conexión a Internet | Acceso a herramientas, repositorios y servicios cloud |
| **Tecnológico** | Visual Studio Code | IDE principal |
| **Tecnológico** | Python / FastAPI / React.js | Lenguajes y frameworks de desarrollo |
| **Tecnológico** | PostgreSQL | Base de datos relacional |
| **Tecnológico** | pyKT (SAKT) | Motor de Knowledge Tracing |
| **Tecnológico** | Moodle | LMS para integración o simulación de datos |
| **Tecnológico** | AWS (EC2, RDS, S3) | Infraestructura cloud |
| **Tecnológico** | GitHub | Control de versiones y CI/CD |
| **Tecnológico** | Docker | Contenerización y entorno local de contingencia |
| **Tecnológico** | Redis | Caché de visualizaciones XAI |

---

## 19. Estándares de Calidad

### 19.1 Estándares Aplicados

| Estándar | Aplicación en el Proyecto |
|---|---|
| **ISO/IEC 25010** | Marco de calidad de producto de software: funcionalidad, usabilidad, fiabilidad, eficiencia, mantenibilidad y portabilidad. Referencia para evaluación de calidad del sistema |
| **ISO/IEC 19796-1** | Marco de calidad para e-learning: estructura el diseño, desarrollo, implementación y evaluación de la plataforma educativa |
| **WCAG 2.1** | Pautas de accesibilidad web: garantiza que la plataforma sea usable por personas con diferentes capacidades |
| **OWASP Top 10** | Estándar de seguridad web: referencia para pruebas de seguridad del backend FastAPI |

### 19.2 Procedimientos de Calidad

| Procedimiento | Descripción |
|---|---|
| **Revisión de Requerimientos** | Validación de que los requisitos estén completos, claros y alineados con los objetivos antes de iniciar el desarrollo |
| **Code Review** | Evaluación del código desarrollado: calidad, buenas prácticas, legibilidad y ausencia de errores críticos |
| **Control de Versiones** | GitHub para registrar cambios, asegurar trazabilidad y evitar pérdida de información |
| **Pruebas Unitarias** | Validación individual de cada componente del sistema |
| **Pruebas de Integración** | Verificación de la interacción entre módulos (frontend, backend, BD, IA) |
| **Pruebas Funcionales** | Evaluación del cumplimiento de requisitos mediante casos de prueba formales |
| **Validación del Modelo IA** | Evaluación del desempeño del modelo SAKT mediante AUC y coherencia de recomendaciones |
| **Pruebas de Usabilidad (SUS)** | Evaluación de la experiencia del usuario con la escala SUS |
| **Validación con Usuarios** | Pruebas piloto con estudiantes y docentes reales; retroalimentación documentada |
| **Auditorías de Calidad** | Revisión periódica de entregables para verificar cumplimiento de estándares |
| **Gestión de No Conformidades** | Registro y acciones correctivas para errores o incumplimientos detectados |
| **Mejora Continua** | Mejoras iterativas basadas en retroalimentación del equipo, usuarios y asesor en cada sprint |
| **Validación Final del Sistema** | Verificación integral de que el sistema cumple todos los requisitos antes de la entrega final |

### 19.3 Métricas de Calidad por Entregable

| Entregable | Métrica de Calidad |
|---|---|
| Plataforma web (Frontend + Backend) | Tiempo de respuesta ≤ 3 segundos en operaciones principales |
| Backend (APIs) | Disponibilidad de endpoints sin errores críticos |
| Frontend | Visualización correcta; navegación fluida; 0 errores críticos |
| Base de datos | Integridad de datos sin inconsistencias |
| Módulo SAKT | AUC ≥ 0.75 |
| Motor de recomendación | Coherencia con estado de conocimiento del usuario |
| Módulo XAI | Visualización clara e interpretable; latencia < 500 ms |
| Dashboard docente | Visualización efectiva del progreso con métricas comprensibles |
| Pruebas del sistema | 0 errores críticos en unitarias, integración y funcionales |
| Usabilidad | SUS ≥ 70 puntos |
| Documentación técnica | Claridad, coherencia y descripción correcta del sistema |
| Informe final de tesis | Cumplimiento de lineamientos UPC; aprobado por asesor |

---

## 20. Glosario y Siglario

### 20.1 Glosario

| Término | Definición |
|---|---|
| **Aprendizaje Autónomo** | Capacidad del estudiante para gestionar, regular y dirigir su propio proceso de aprendizaje de manera independiente |
| **Sistema Adaptativo** | Sistema que ajusta dinámicamente el contenido o las recomendaciones en función del perfil, historial y estado de conocimiento del usuario |
| **Knowledge Tracing (KT)** | Proceso de modelado del estado de conocimiento del estudiante a lo largo del tiempo a partir de sus interacciones con el sistema |
| **Deep Knowledge Tracing (DKT)** | Modelo de KT basado en redes LSTM (Long Short-Term Memory) que captura patrones temporales de aprendizaje |
| **Self-Attentive Knowledge Tracing (SAKT)** | Modelo de KT basado en mecanismos de auto-atención que identifica qué interacciones pasadas influyen más en el desempeño actual del estudiante |
| **pyKT** | Librería Python que provee implementaciones estandarizadas de modelos de Knowledge Tracing (DKT, SAKT) compatibles con PyTorch |
| **Explainable AI (XAI)** | Inteligencia Artificial Explicable; conjunto de técnicas y métodos que hacen comprensibles las decisiones de los modelos de IA para usuarios no técnicos |
| **Mapa de Calor de Atención** | Visualización gráfica que representa los pesos de atención del modelo SAKT, indicando qué interacciones pasadas del estudiante son más relevantes para la predicción actual |
| **Trazabilidad** | Capacidad del sistema para registrar, monitorear y auditar todas las interacciones del estudiante, permitiendo al docente reconstruir el historial de aprendizaje |
| **Cold Start** | Problema que surge cuando un sistema de recomendación debe generar predicciones para un usuario sin historial de interacciones previas |
| **Pipeline** | Secuencia de procesos de tratamiento de datos o inferencia que se ejecutan en cadena para transformar entradas en salidas |
| **Sprint** | Iteración de desarrollo ágil de duración fija (2 semanas) en Scrum, al final del cual se entrega un incremento potencialmente desplegable |
| **MVP** | Minimum Viable Product; versión mínima del producto con funcionalidades esenciales suficientes para ser validada por usuarios finales |
| **LMS** | Learning Management System; Sistema de Gestión del Aprendizaje (e.g., Moodle, Canvas) |
| **AUC** | Area Under the Curve; métrica de evaluación de clasificación que mide la capacidad discriminativa del modelo |
| **SUS** | System Usability Scale; escala de 10 ítems para medir la usabilidad percibida de un sistema |
| **JWT** | JSON Web Token; estándar para la transmisión segura de información entre partes como un token firmado digitalmente |

### 20.2 Siglario

| Sigla | Significado |
|---|---|
| **SWARD** | Sistema Web de Recomendación Adaptativa y Distribuida |
| **DKT** | Deep Knowledge Tracing |
| **SAKT** | Self-Attentive Knowledge Tracing |
| **KT** | Knowledge Tracing |
| **XAI** | Explainable Artificial Intelligence |
| **LMS** | Learning Management System |
| **ML** | Machine Learning |
| **API** | Application Programming Interface |
| **AWS** | Amazon Web Services |
| **MVP** | Minimum Viable Product |
| **UPC** | Universidad Peruana de Ciencias Aplicadas |
| **AUC** | Area Under the Curve |
| **SUS** | System Usability Scale |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **C4** | Context, Containers, Components, Code (Modelo de arquitectura) |
| **JWT** | JSON Web Token |
| **RBAC** | Role-Based Access Control |
| **TP1** | Taller de Proyecto 1 |
| **TP2** | Taller de Proyecto 2 |
| **OG** | Objetivo General |
| **OE** | Objetivo Específico |
| **RF** | Requerimiento Funcional |
| **RNF** | Requerimiento No Funcional |
| **RN** | Requerimiento de Negocio |
| **RQ** | Requerimiento de Calidad |
| **RT** | Requerimiento de Transición |
| **RP** | Requerimiento del Proyecto |

---

## Referencias Bibliográficas

Bai, Y., Zhao, J., Wei, T., Cai, Q., & He, L. (2024). *A survey of explainable knowledge tracing*. arXiv. https://arxiv.org/pdf/2403.07279

Bautista, M., Alfaro, S., & Wong, L. (2024). Framework for the adaptive learning of higher education students in virtual classes in Peru using CRISP-DM and Machine Learning. *Journal of Computer Science and Software Programming*, 10(3), 522–534.

Brusilovsky, P. (2001). Adaptive hypermedia. *User Modeling and User-Adapted Interaction*, 11, 87–110. https://doi.org/10.1023/A:1011143116306

Gunning, D., & Aha, D. W. (2019). DARPA's Explainable Artificial Intelligence (XAI) Program. *AI Magazine*, 40(2), 44–58. https://doi.org/10.1609/aimag.v40i2.2850

Jain, S., Prabha, C., Nandan, D., & Bhosale, S. (2024). Comparative analysis of frequently used e-learning platforms. *Frontiers in Education*, 9, 1431531. https://doi.org/10.3389/feduc.2024.1431531

Liu, Z., Liu, Q., Chen, J., Xu, S., Zhang, S., Su, Y., & Zhang, S. (2022). pyKT: A Python library to benchmark deep learning based knowledge tracing models. *Advances in Neural Information Processing Systems*, 35. https://arxiv.org/abs/2206.11460

Pandey, S., & Karypis, G. (2019). A Self-Attentive Model for Knowledge Tracing. *Proceedings of the 12th International Conference on Educational Data Mining*. https://arxiv.org/abs/1907.06837

Viberg, O., Hatakka, M., Bälter, O., & Mavroudi, A. (2018). The current landscape of learning analytics in higher education. *Computers in Human Behavior*, 89, 98–110. https://doi.org/10.1016/j.chb.2018.07.027

Yamkovenko, B., Hogg, C. A. R., Miller-Vedam, M., Grimaldi, P., & Wells, W. (2025). Practical evaluation of deep knowledge tracing models for use in learning platforms. *Proceedings of the 18th International Conference on Educational Data Mining (EDM 2025)*.

Zou, Y., & Kuek, F. (2025). Digital learning in the 21st century: Trends, challenges, and innovations in technology integration. *Frontiers in Education*, 10. https://doi.org/10.3389/feduc.2025.1562391

---

*Documento preparado siguiendo normas APA 7ª edición.*  
*TP202610051 — Universidad Peruana de Ciencias Aplicadas (UPC) — Taller de Proyecto 1 — 2026*
