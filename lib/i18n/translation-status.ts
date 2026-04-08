export type TranslationStatus = "complete" | "partial" | "pending";

/**
 * Translation status for each page's EN version.
 * ES pages are always complete (source language).
 *
 * Update this map as you translate each page:
 * - "complete": fully translated, no banner shown
 * - "partial": partially translated or using ES content, banner shown
 * - "pending": not started, banner shown
 */
const EN_TRANSLATION_STATUS: Record<string, TranslationStatus> = {
  // ── Piloto — completas ──
  "/servicios/cloud/finops": "complete",
  "/nosotros": "complete",
  "/contacto": "complete",

  // ── Home ──
  "/": "partial",

  // ── Servicios hubs ──
  "/servicios": "partial",
  "/servicios/inteligencia-artificial": "partial",
  "/servicios/cloud": "partial",
  "/servicios/staff-augmentation": "partial",
  "/servicios/desarrollo-digital": "partial",

  // ── IA sub-pages ──
  "/servicios/inteligencia-artificial/agentes-ia": "pending",
  "/servicios/inteligencia-artificial/agentes-comerciales": "pending",
  "/servicios/inteligencia-artificial/automatizacion-procesos": "pending",
  "/servicios/inteligencia-artificial/gestion-contenido": "pending",
  "/servicios/inteligencia-artificial/marketing-crm": "pending",

  // ── Cloud sub-pages ──
  "/servicios/cloud/migracion-aws": "pending",
  "/servicios/cloud/infraestructura": "pending",
  "/servicios/cloud/seguridad": "pending",
  "/servicios/cloud/serverless": "pending",

  // ── Staff sub-pages ──
  "/servicios/staff-augmentation/desarrollo-software": "pending",
  "/servicios/staff-augmentation/datos-ia": "pending",
  "/servicios/staff-augmentation/devops-cloud": "pending",
  "/servicios/staff-augmentation/diseno-ux-ui": "pending",
  "/servicios/staff-augmentation/qa-seguridad": "pending",

  // ── Dev Digital sub-pages ──
  "/servicios/desarrollo-digital/apps-moviles": "pending",
  "/servicios/desarrollo-digital/ecommerce": "pending",
  "/servicios/desarrollo-digital/plataformas-web": "pending",

  // ── Industrias ──
  "/industrias/fintech": "pending",
  "/industrias/medios-entretenimiento": "pending",
  "/industrias/salud": "pending",
  "/industrias/retail-ecommerce": "pending",
  "/industrias/logistica": "pending",
  "/industrias/manufactura": "pending",

  // ── Nosotros sub-pages ──
  "/nosotros/historia": "pending",
  "/nosotros/equipo": "pending",
  "/nosotros/metodologia": "pending",
  "/nosotros/certificaciones": "pending",

  // ── Casos de éxito ──
  "/casos-de-exito": "pending",
  "/casos-de-exito/televisa": "pending",
  "/casos-de-exito/grupo-bolivar": "pending",
  "/casos-de-exito/two-maids": "pending",
  "/casos-de-exito/ab-inbev": "pending",
  "/casos-de-exito/cronica": "pending",
  "/casos-de-exito/pulzo": "pending",
  "/casos-de-exito/univision": "pending",

  // ── Blog ──
  "/blog": "pending",

  // ── Otros ──
  "/trabaja-con-nosotros": "pending",
  "/privacidad": "pending",
  "/soporte": "pending",
};

/**
 * Get translation status for a page.
 * Strips the /en prefix and locale segment from the pathname.
 */
export function getTranslationStatus(pathname: string): TranslationStatus {
  // Strip /en prefix
  const normalized = pathname.replace(/^\/en(\/|$)/, "/").replace(/\/$/, "") || "/";
  return EN_TRANSLATION_STATUS[normalized] ?? "pending";
}

/**
 * Check if the current page needs a translation banner (EN only, not complete).
 */
export function shouldShowTranslationBanner(pathname: string, locale: string): boolean {
  if (locale !== "en") return false;
  const status = getTranslationStatus(pathname);
  return status !== "complete";
}
