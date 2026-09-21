export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.nivelics.com/#website",
    url: "https://www.nivelics.com",
    name: "Nivelics",
    description: "Transformación digital con IA, Cloud y Staffing Premium para LATAM y USA",
    publisher: { "@id": "https://www.nivelics.com/#organization" },
    inLanguage: ["es-CO", "en-US"],
    // Sin `potentialAction`/SearchAction: apuntaba a /blog?q=, un buscador que el
    // sitio no tiene. Declararlo hacía que Google intentara una búsqueda inexistente.
  };
}
