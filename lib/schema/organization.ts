export function getOrganizationSchema() {
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
    description:
      "Empresa colombiana de transformación digital B2B especializada en Inteligencia Artificial aplicada, Cloud computing y Staff Augmentation premium.",
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
    telephone: "+57-310-3926621",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+57-310-3926621",
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: ["https://www.linkedin.com/company/nivelics", "https://www.nivelics.com/en"],
    availableLanguage: ["Spanish", "English"],
    areaServed: ["CO", "US", "MX", "SV", "PA", "EC", "PE", "AR"],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Great Place to Work Colombia 2022",
    },
    knowsAbout: [
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
    serviceType: [
      "Inteligencia Artificial aplicada",
      "Cloud Computing",
      "Staff Augmentation",
      "Desarrollo de Software",
      "Transformación Digital",
    ],
    slogan: "Transforma más rápido.",
  };
}
