export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.nivelics.com/#website",
    url: "https://www.nivelics.com",
    name: "Nivelics",
    description: "Transformación digital con IA, Cloud y Staffing Premium para LATAM y USA",
    publisher: { "@id": "https://www.nivelics.com/#organization" },
    inLanguage: ["es", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.nivelics.com/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
