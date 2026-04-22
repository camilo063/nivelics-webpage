/**
 * Utilities for the contact-form `fromService` tag — a short slug that
 * identifies which page the user was on when they clicked a contact CTA.
 *
 * Two ways a value can arrive at /contacto:
 *   1. Explicit `?from=` query param (preferred — set by updated CTA components).
 *   2. document.referrer fallback (derived from pathname when the param is missing).
 */

const CATEGORY_ALIASES: Record<string, string> = {
  servicios: "",
  services: "",
  industrias: "industria",
  industries: "industria",
  productos: "producto",
  products: "producto",
  "casos-de-exito": "caso",
  "success-stories": "caso",
  nosotros: "nosotros",
  about: "nosotros",
  blog: "blog",
};

/**
 * Convert a pathname (with or without `/en` prefix) to a `fromService` slug.
 * Returns an empty string if the path doesn't match a known marketing section.
 */
export function deriveFromPath(pathname: string): string {
  if (!pathname) return "";
  const stripped = pathname
    .replace(/^\/en(?=\/|$)/, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
  if (!stripped) return "home";

  const [top, ...rest] = stripped.split("/");
  const alias = CATEGORY_ALIASES[top];
  if (alias === undefined) return stripped;

  // Servicios: drop the top-level name → 'cloud/finops'.
  if (alias === "") return rest.join("/") || "servicios";
  // Industrias/productos/casos: prefix the category → 'industria/fintech'.
  return rest.length ? `${alias}/${rest.join("/")}` : alias;
}

/**
 * Build a `/contacto` (or `/en/contact`) href with an optional `?from=` param.
 * Safe to call with any slug — URL-encodes value.
 */
export function buildContactHref(locale: "es" | "en", fromService?: string | null): string {
  const base = locale === "en" ? "/en/contact" : "/contacto";
  const trimmed = fromService?.trim();
  if (!trimmed) return base;
  return `${base}?from=${encodeURIComponent(trimmed)}`;
}
