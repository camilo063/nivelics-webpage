import { absoluteUrl, inLanguageOf, ORGANIZATION_ID } from "./webpage";

interface CaseStudy {
  name: string;
  description: string;
  /** Ruta escrita en español: en "en" se traduce con el mapa de rutas. */
  url: string;
}

export function getCreativeWorkSchema(cases: CaseStudy[], locale?: string) {
  return cases.map((c) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(c.url, locale)}#case`,
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.url, locale),
    inLanguage: inLanguageOf(locale),
    author: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Nivelics SAS",
    },
  }));
}
