export type TranslationStatus = "complete" | "partial" | "pending" | "auto";

/**
 * Translation status for each page's EN version.
 * ES is the source language and is always considered complete.
 *
 * Status semantics:
 * - "complete": human-reviewed, publishable, no banner
 * - "auto":     AI-translated, publishable, no banner (admin may still flag for review)
 * - "partial":  partially translated or mixed ES/EN, banner shown
 * - "pending":  not translated yet, banner shown
 *
 * The public site treats "complete" and "auto" identically — both hide the banner.
 * Admin listings (ServiciosListClient, IndustriasListClient, etc.) distinguish them
 * via their own status badges so editors can prioritize human review of "auto" rows.
 *
 * Routes not listed here default to "complete" (optimistic: the DB is the source
 * of truth and content is expected to be fully translated before a new route ships).
 */
const EN_TRANSLATION_STATUS: Record<string, TranslationStatus> = {
  // ── Piloto — completas ──
  "/servicios/cloud/finops": "complete",
  "/nosotros": "complete",
  "/contacto": "complete",

  // ── Home ──
  "/": "complete",

  // ── Servicios hubs ──
  "/servicios": "complete",
  "/servicios/inteligencia-artificial": "complete",
  "/servicios/cloud": "complete",
  "/servicios/staff-augmentation": "complete",
  "/servicios/desarrollo-digital": "complete",

  // ── IA sub-pages ──
  "/servicios/inteligencia-artificial/agentes-ia": "complete",
  "/servicios/inteligencia-artificial/agentes-comerciales": "complete",
  "/servicios/inteligencia-artificial/automatizacion-procesos": "complete",
  "/servicios/inteligencia-artificial/gestion-contenido": "complete",
  "/servicios/inteligencia-artificial/marketing-crm": "complete",

  // ── Cloud sub-pages ──
  "/servicios/cloud/migracion-aws": "complete",
  "/servicios/cloud/infraestructura": "complete",
  "/servicios/cloud/seguridad": "complete",
  "/servicios/cloud/serverless": "complete",

  // ── Staff sub-pages ──
  "/servicios/staff-augmentation/desarrollo-software": "complete",
  "/servicios/staff-augmentation/datos-ia": "complete",
  "/servicios/staff-augmentation/devops-cloud": "complete",
  "/servicios/staff-augmentation/diseno-ux-ui": "complete",
  "/servicios/staff-augmentation/qa-seguridad": "complete",

  // ── Dev Digital sub-pages ──
  "/servicios/desarrollo-digital/apps-moviles": "complete",
  "/servicios/desarrollo-digital/ecommerce": "complete",
  "/servicios/desarrollo-digital/plataformas-web": "complete",
  "/servicios/desarrollo-digital/sitios-web-agentic": "complete",

  // ── Industrias ──
  "/industrias": "complete",
  "/industrias/fintech": "complete",
  "/industrias/medios-entretenimiento": "complete",
  "/industrias/salud": "complete",
  "/industrias/retail-ecommerce": "complete",
  "/industrias/logistica": "complete",
  "/industrias/manufactura": "complete",

  // ── Nosotros sub-pages ──
  "/nosotros/historia": "complete",
  "/nosotros/equipo": "complete",
  "/nosotros/metodologia": "complete",
  "/nosotros/certificaciones": "complete",

  // ── Casos de éxito ──
  "/casos-de-exito": "complete",
  "/casos-de-exito/televisa": "complete",
  "/casos-de-exito/grupo-bolivar": "complete",
  "/casos-de-exito/two-maids": "complete",
  "/casos-de-exito/ab-inbev": "complete",
  "/casos-de-exito/cronica": "complete",
  "/casos-de-exito/pulzo": "complete",
  "/casos-de-exito/univision": "complete",

  // ── Blog ──
  "/blog": "complete",

  // ── Productos ──
  "/productos": "complete",

  // ── Otros ──
  "/trabaja-con-nosotros": "complete",
  "/privacidad": "complete",
  "/soporte": "complete",
};

/**
 * Get the translation status for a page.
 * Strips the /en prefix and trailing slash from the pathname before lookup.
 */
export function getTranslationStatus(pathname: string): TranslationStatus {
  const normalized = pathname.replace(/^\/en(\/|$)/, "/").replace(/\/$/, "") || "/";
  return EN_TRANSLATION_STATUS[normalized] ?? "complete";
}

/**
 * Decide whether to render the public "translation in progress" banner.
 * Only fires on "pending" or "partial"; "auto" and "complete" are both publishable.
 */
export function shouldShowTranslationBanner(pathname: string, locale: string): boolean {
  if (locale !== "en") return false;
  const status = getTranslationStatus(pathname);
  return status === "pending" || status === "partial";
}
