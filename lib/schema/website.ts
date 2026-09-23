import type { Locale } from "@/lib/cms/types";

/**
 * El nodo `#website` del grafo. La descripción se sirve en el idioma de la página:
 * antes salía siempre en español, también en /en.
 */
export function getWebSiteSchema(locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.nivelics.com/#website",
    url: "https://www.nivelics.com",
    name: "Nivelics",
    description:
      locale === "en"
        ? "Digital transformation with AI, Cloud and premium staffing for LATAM and the USA"
        : "Transformación digital con IA, Cloud y Staffing Premium para LATAM y USA",
    publisher: { "@id": "https://www.nivelics.com/#organization" },
    inLanguage: ["es-CO", "en-US"],
    // Sin `potentialAction`/SearchAction: apuntaba a /blog?q=, un buscador que el
    // sitio no tiene. Declararlo hacía que Google intentara una búsqueda inexistente.
  };
}
