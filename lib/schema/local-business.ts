import { CONTACTO_FALLBACK, type ContactoSitio } from "@/lib/cms/contacto-shared";

const BASE = "https://www.nivelics.com";

/**
 * LocalBusiness + ContactPoint para /contacto.
 *
 * El correo, el teléfono y los perfiles sociales llegan por parámetro desde la
 * página (que sí puede hacer `await getContactoSitio()`), así que son los mismos
 * que se ven en pantalla y los mismos de Organization. El valor por defecto es
 * el respaldo de `lib/constants`, para no romper llamadas sin argumentos.
 */
export function getLocalBusinessSchema(
  locale: "es" | "en" = "es",
  contacto: ContactoSitio = CONTACTO_FALLBACK,
) {
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
    telephone: contacto.whatsappE164,
    email: contacto.email,
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
        telephone: contacto.whatsappE164,
        email: contacto.email,
        contactType: "sales",
        availableLanguage: ["Spanish", "English"],
        areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
      },
    ],
    parentOrganization: { "@id": `${BASE}/#organization` },
    sameAs: contacto.sameAs,
    availableLanguage: ["Spanish", "English"],
    areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
  };
}
