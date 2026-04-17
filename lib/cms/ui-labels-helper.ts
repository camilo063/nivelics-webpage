import type { Locale } from "./types";

/**
 * Client-safe helpers for resolving `ui_labels` entries.
 * Pure functions — no DB access, no imports that pull server modules.
 * The server-side fetcher `getAllUiLabels()` lives in `./ui-labels`.
 */

export type UiLabelMap = Record<string, { es: string; en: string }>;

/**
 * Resolve a UI label for the given locale. In development, missing keys return
 * a visible `[MISSING_LABEL: key]` placeholder so the issue surfaces immediately.
 * In production, missing keys return an empty string to avoid breaking the UI.
 */
export function uiLabel(labels: UiLabelMap, key: string, locale: Locale): string {
  const entry = labels[key];
  if (!entry) {
    if (process.env.NODE_ENV === "development") return `[MISSING_LABEL: ${key}]`;
    return "";
  }
  return locale === "en" ? entry.en : entry.es;
}
