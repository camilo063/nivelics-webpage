const BASE = "https://www.nivelics.com";

/**
 * LocalBusiness + ContactPoint para /contacto.
 * Datos reales alineados con lib/schema/organization.ts (sedes Bogotá/Miami,
 * teléfono y email corporativos).
 */
export function getLocalBusinessSchema(locale: "es" | "en" = "es") {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE}/#localbusiness`,
    name: "Nivelics SAS",
    alternateName: "Nivelics",
    url: isEn ? `${BASE}/en/contact` : `${BASE}/contacto`,
    logo: `${BASE}/logo.png`,
    image: `${BASE}/og/nivelics-home.jpg`,
    description: isEn
      ? "Colombian B2B digital transformation company: applied AI, Cloud computing and premium Staff Augmentation."
      : "Empresa colombiana de transformación digital B2B: Inteligencia Artificial aplicada, Cloud computing y Staff Augmentation premium.",
    foundingDate: "2012",
    telephone: "+57-310-3926621",
    email: "contacto@nivelics.com",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Calle 26 No. 69-76, Torre 1, Piso 16",
        addressLocality: "Bogotá",
        addressCountry: "CO",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Miami",
        addressRegion: "FL",
        addressCountry: "US",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+57-310-3926621",
        email: "contacto@nivelics.com",
        contactType: "sales",
        availableLanguage: ["Spanish", "English"],
        areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
      },
    ],
    parentOrganization: { "@id": `${BASE}/#organization` },
    sameAs: ["https://www.linkedin.com/company/nivelics", "https://www.instagram.com/nivelics"],
    availableLanguage: ["Spanish", "English"],
    areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
  };
}
