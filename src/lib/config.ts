/**
 * Application configuration and constants.
 * Use env vars for environment-specific values.
 */

export const STORAGE_KEYS = {
  FORM_SCHEMA: "formSchema",
} as const;

export const IS_DEV = import.meta.env?.DEV ?? true;

/** Show JSON editor switcher only in development */
export const SHOW_JSON_EDITORS = IS_DEV;
