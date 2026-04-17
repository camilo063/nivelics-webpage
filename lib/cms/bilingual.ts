/**
 * Bilingual utility helpers for resolving *Es/*En fields from DB rows or jsonb items.
 * Companion to lib/cms/mappers.ts (which handles full-object mapping).
 * Use these helpers in components that render jsonb arrays (nav mega-menu,
 * footer columns, home whyUsItems, etc.) where per-item resolution is needed.
 */
import type { Locale } from "./types";

/** Returns the ES version if locale is 'es', EN version if 'en'. Falls back to ES if EN is empty. */
export function pickLocale(
  locale: Locale,
  es: string | null | undefined,
  en: string | null | undefined,
): string {
  if (locale === "en") {
    if (en && en.trim() !== "") return en;
    return es ?? "";
  }
  return es ?? "";
}

/**
 * Resolve a bilingual field from any object with *Es/*En keys.
 * Example: tItem(item, 'label', 'en') → item.labelEn ?? item.labelEs ?? ''.
 * Also supports snake_case (label_es, label_en).
 */
export function tItem<T extends Record<string, unknown>>(
  item: T,
  fieldBase: string,
  locale: Locale,
): string {
  if (!item) return "";
  const camelEn = `${fieldBase}En`;
  const camelEs = `${fieldBase}Es`;
  const snakeEn = `${fieldBase}_en`;
  const snakeEs = `${fieldBase}_es`;

  const valueEn = (item[camelEn] as string) ?? (item[snakeEn] as string);
  const valueEs = (item[camelEs] as string) ?? (item[snakeEs] as string);

  return pickLocale(locale, valueEs, valueEn);
}

/** Resolve a URL field: prefers `urlEn` when locale='en' and it's present, else `url`. */
export function tUrl<T extends Record<string, unknown>>(item: T, locale: Locale): string {
  const url = (item.url as string) ?? "";
  if (locale === "en") {
    const urlEn = (item.urlEn as string) ?? (item.url_en as string);
    if (urlEn && urlEn.trim() !== "") return urlEn;
  }
  return url;
}
