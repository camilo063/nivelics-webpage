import { localizePath } from "@/lib/i18n/localize-path";

interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  /** En "en" la URL escrita con la ruta ES se traduce. */
  locale?: string;
}

export function getServiceSchema({
  name,
  description,
  url,
  serviceType,
  locale,
}: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `https://www.nivelics.com${locale === "en" ? localizePath(url, "en") : url}`,
    serviceType,
    provider: {
      "@type": "Organization",
      "@id": "https://www.nivelics.com/#organization",
      name: "Nivelics SAS",
    },
    areaServed: ["CO", "MX", "US", "AR", "PE", "EC", "PA"],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}
