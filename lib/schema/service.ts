interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}

export function getServiceSchema({ name, description, url, serviceType }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `https://www.nivelics.com${url}`,
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
