import { localizePath } from "@/lib/i18n/localize-path";

export const SCHEMA_BASE = "https://www.nivelics.com";
export const ORGANIZATION_ID = `${SCHEMA_BASE}/#organization`;
export const WEBSITE_ID = `${SCHEMA_BASE}/#website`;

/** URL absoluta del idioma servido a partir de una ruta escrita en español. */
export function absoluteUrl(esPath: string, locale?: string): string {
  const path = locale === "en" ? localizePath(esPath, "en") : esPath;
  return path === "/" ? SCHEMA_BASE : `${SCHEMA_BASE}${path}`;
}

/** `@id` estable de la WebPage de una ruta: siempre `<canonical>#webpage`. */
export function webPageId(esPath: string, locale?: string): string {
  return `${absoluteUrl(esPath, locale)}#webpage`;
}

export function inLanguageOf(locale?: string): string {
  return locale === "en" ? "en-US" : "es-CO";
}

interface WebPageInput {
  /** Ruta escrita en español (se traduce sola en `/en`). */
  url: string;
  locale?: string;
  name?: string;
  description?: string;
  /** `@id` de la entidad principal de la página (Service, Product, …). */
  aboutId?: string;
  /** Subtipo de WebPage cuando la página es un listado, un contacto, etc. */
  type?: string;
}

/**
 * WebPage canónica de una página: el nodo que enlaza el resto del grafo
 * (`isPartOf` → WebSite, `publisher` → Organization, `about` → entidad principal).
 * Una sola por página: si una página ya emite su propio subtipo (CollectionPage,
 * WebPage de industria…), ese subtipo usa este mismo `@id` y no se emite otra.
 */
export function getWebPageSchema({
  url,
  locale,
  name,
  description,
  aboutId,
  type = "WebPage",
}: WebPageInput) {
  const canonical = absoluteUrl(url, locale);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${canonical}#webpage`,
    url: canonical,
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    inLanguage: inLanguageOf(locale),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    ...(aboutId ? { about: { "@id": aboutId } } : {}),
  };
}
