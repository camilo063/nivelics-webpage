import { CONTACTO_FALLBACK, type ContactoSitio } from "@/lib/cms/contacto-shared";

type SchemaLocale = "es" | "en";

/** `description` y `knowsAbout` son texto: se emiten en el idioma servido. El
 *  resto de campos (nombre, sedes, contacto, credenciales) no depende del idioma. */
const DESCRIPTION: Record<SchemaLocale, string> = {
  es: "Empresa colombiana de transformación digital B2B especializada en Inteligencia Artificial aplicada, Cloud computing y Staff Augmentation premium.",
  en: "Colombian B2B digital transformation company specialized in applied Artificial Intelligence, Cloud computing and premium Staff Augmentation.",
};

const SERVICE_TYPES: Record<SchemaLocale, string[]> = {
  es: [
    "Inteligencia Artificial aplicada",
    "Cloud Computing",
    "Staff Augmentation",
    "Desarrollo de Software",
    "Transformación Digital",
  ],
  en: [
    "Applied Artificial Intelligence",
    "Cloud Computing",
    "Staff Augmentation",
    "Software Development",
    "Digital Transformation",
  ],
};

const SLOGAN: Record<SchemaLocale, string> = {
  es: "Transforma más rápido.",
  en: "Transform faster.",
};

const KNOWS_ABOUT: Record<SchemaLocale, string[]> = {
  es: [
    "Inteligencia Artificial",
    "Cloud Computing",
    "Staff Augmentation",
    "FinOps",
    "DevOps",
    "Desarrollo Digital",
    "Machine Learning",
    "MLOps",
    "AWS",
    "GCP",
    "Azure",
  ],
  en: [
    "Artificial Intelligence",
    "Cloud Computing",
    "Staff Augmentation",
    "FinOps",
    "DevOps",
    "Digital Development",
    "Machine Learning",
    "MLOps",
    "AWS",
    "GCP",
    "Azure",
  ],
};

/**
 * Los datos de contacto (correo, teléfono, sedes y perfiles sociales) llegan por
 * parámetro desde el Server Component que renderiza el JSON-LD, porque solo él
 * puede hacer `await getContactoSitio()`. El valor por defecto es el respaldo de
 * `lib/constants`, para que la firma siga siendo compatible con quien la llame
 * sin argumentos.
 */
export function getOrganizationSchema(
  contacto: ContactoSitio = CONTACTO_FALLBACK,
  // Opcional y "es" por defecto: quien llame sin idioma sigue obteniendo el español.
  locale: string = "es",
) {
  const lang: SchemaLocale = locale === "en" ? "en" : "es";
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": "https://www.nivelics.com/#organization",
    name: "Nivelics SAS",
    alternateName: "Nivelics",
    url: "https://www.nivelics.com",
    logo: "https://www.nivelics.com/logo.png",
    foundingDate: "2012",
    founder: [
      { "@type": "Person", name: "Camilo Andrés Villanueva Niño" },
      { "@type": "Person", name: "Jonathan Olarte" },
    ],
    description: DESCRIPTION[lang],
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
    telephone: contacto.whatsappE164,
    email: contacto.email,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contacto.whatsappE164,
      email: contacto.email,
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
    // Solo perfiles externos: el mirror /en es la misma entidad y ya se declara
    // con hreflang, no es un `sameAs`. Salen de site_config (LinkedIn/Instagram);
    // si el admin deja uno vacío, simplemente no se emite.
    sameAs: contacto.sameAs,
    availableLanguage: ["Spanish", "English"],
    areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Great Place to Work Colombia 2022",
    },
    knowsAbout: KNOWS_ABOUT[lang],
    serviceType: SERVICE_TYPES[lang],
    slogan: SLOGAN[lang],
  };
}
