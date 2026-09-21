import { absoluteUrl, ORGANIZATION_ID, webPageId } from "./webpage";

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
  const canonical = absoluteUrl(url, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name,
    description,
    url: canonical,
    serviceType,
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Nivelics SAS",
    },
    areaServed: ["CO", "MX", "US", "AR", "PE", "EC", "PA"],
    // Sin `offers`: no hay precio público por servicio. Un Offer con priceCurrency
    // pero sin price ni priceSpecification es inválido para Google y se descartaba
    // el nodo entero, así que se omite en lugar de inventar una cifra.
    mainEntityOfPage: { "@id": webPageId(url, locale) },
  };
}
