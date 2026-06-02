export const RESOURCE_TYPES = ["video", "exercise", "reading"] as const;
export const RESOURCE_DIFFICULTIES = ["Básico", "Intermedio", "Avanzado"] as const;
export const RISK_LEVELS = ["high", "medium", "low"] as const;
export const USER_ROLES = ["student", "teacher", "admin"] as const;

export const ATTENTION_THRESHOLDS = {
  HIGH: 80,
  MEDIUM_HIGH: 60,
  MEDIUM: 40,
} as const;

export const MASTERY_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
} as const;

export const DOMAIN_RADAR_THRESHOLDS = {
  HIGH: 75,
  MEDIUM: 55,
} as const;
