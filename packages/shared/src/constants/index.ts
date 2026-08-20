export const LOCALES = ["ru", "en"] as const;

export const DEFAULT_LOCALE = "ru" as const;

export const AUTOSAVE_DEBOUNCE_MS = 2000;

export const AI_PROVIDERS = ["openai", "anthropic", "custom"] as const;

export const DEFAULT_AI_MODEL = "gpt-4o-mini";

export const MAX_CHAPTER_TITLE_LENGTH = 200;

export const MAX_PROJECT_TITLE_LENGTH = 200;

export const LOGIN_RATE_LIMIT_MAX = 5;

export const LOGIN_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export const AI_DAILY_QUOTA = 50;

export const PLOT_METHODS = ["blank", "three-act", "heros-journey", "beat-sheet"] as const;

export const RELATIONSHIP_TYPES = [
  "family",
  "ally",
  "enemy",
  "romantic",
  "mentor",
  "other",
] as const;
