/**
 * Constantes de endpoints del API Gateway alineadas al PRD SWARD v1.0.
 * Usar junto a `apiClient` de `@core/api/client`.
 */
export const ENDPOINTS = {
  // EP001 — Autenticación
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    passwordRecovery: '/auth/password-recovery',
    passwordReset: '/auth/password-reset',
  },

  // EP001 — Perfil de usuario
  users: {
    profile: '/users/me',
    updateProfile: '/users/me',
    list: '/admin/users',
    byId: (id: string) => `/admin/users/${id}`,
    updateStatus: (id: string) => `/admin/users/${id}/status`,
  },

  // EP002 — Integración Moodle
  moodle: {
    sync: '/moodle/sync',
    courses: '/moodle/courses',
    activities: (courseId: string) => `/moodle/courses/${courseId}/activities`,
  },

  // EP003 — Recomendaciones y estado de conocimiento (SAKT)
  student: {
    recommendations: '/student/recommendations',
    knowledgeState: '/student/knowledge-state',
    interactions: '/student/interactions',
    learningGaps: '/student/learning-gaps',
    learningPath: '/student/learning-path',
    resources: '/student/resources',
    resourceById: (id: string) => `/student/resources/${id}`,
    completeResource: (id: string) => `/student/resources/${id}/complete`,
  },

  // EP004 — XAI (Explicabilidad)
  xai: {
    attentionHeatmap: '/xai/attention-heatmap',
    explanation: '/xai/explanation',
    historicalComparison: '/xai/historical-comparison',
    progressChart: '/xai/progress-chart',
  },

  // EP005 — Docente
  teacher: {
    students: '/teacher/students',
    studentById: (id: string) => `/teacher/students/${id}`,
    studentKnowledgeState: (id: string) => `/teacher/students/${id}/knowledge-state`,
    alerts: '/teacher/alerts',
    dismissAlert: (id: string) => `/teacher/alerts/${id}/dismiss`,
    feedback: '/teacher/feedback',
    exportReport: '/teacher/reports/export',
    classProgress: '/teacher/class/progress',
  },

  // EP006 — Administración
  admin: {
    users: '/admin/users',
    userStatus: (id: string) => `/admin/users/${id}/status`,
    userRoles: (id: string) => `/admin/users/${id}/roles`,
    metrics: '/admin/metrics',
    logs: '/admin/logs',
    courses: '/courses',
    courseById: (id: string) => `/courses/${id}`,
    systemStatus: '/admin/system/status',
    systemMetrics: '/admin/system/metrics',
    modelConfig: '/admin/model/config',
    modelRetrain: '/admin/model/retrain',
  },
} as const;
