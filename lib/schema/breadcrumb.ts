import { localizePath } from "@/lib/i18n/localize-path";

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Nombres genéricos que casi todas las páginas pasan en español. En /en se traducen aquí
// para no depender de que cada page.tsx tenga su rama por idioma.
const NAME_EN: Record<string, string> = {
  Inicio: "Home",
  Servicios: "Services",
  "Inteligencia Artificial": "Artificial Intelligence",
  "Desarrollo Digital": "Digital Development",
  Nosotros: "About",
  Industrias: "Industries",
  "Casos de Éxito": "Success Stories",
  "Casos de éxito": "Success Stories",
  Productos: "Products",
  Contacto: "Contact",
  Precios: "Pricing",
  Blog: "Blog",
  Equipo: "Team",
  Historia: "History",
  Metodología: "Methodology",
  Certificaciones: "Certifications",
  Privacidad: "Privacy",
  Soporte: "Support",
  "Trabaja con nosotros": "Careers",
  // Último eslabón de subpáginas que todavía pasan su nombre solo en español.
  "Migración a AWS": "AWS Migration",
  Infraestructura: "Infrastructure",
  "Seguridad Cloud": "Cloud Security",
  "Apps Moviles": "Mobile Apps",
  "Apps Móviles": "Mobile Apps",
  "Plataformas Web": "Web Platforms",
  "Datos e IA": "Data & AI",
  "DevOps e Infraestructura": "DevOps & Infrastructure",
  "QA y Ciberseguridad": "QA & Cybersecurity",
  "Desarrollo de Software": "Software Development",
  "Diseño UX/UI": "UX/UI Design",
};

/**
 * Acepta `getBreadcrumbSchema(items)` (ES, como siempre) o `getBreadcrumbSchema(locale, items)`.
 * En "en" las URLs escritas con la ruta ES se traducen y los nombres genéricos también.
 */
export function getBreadcrumbSchema(
  localeOrItems: "es" | "en" | string | BreadcrumbItem[],
  maybeItems?: BreadcrumbItem[],
) {
  const items = Array.isArray(localeOrItems) ? localeOrItems : (maybeItems ?? []);
  const isEn = localeOrItems === "en";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: isEn ? (NAME_EN[item.name] ?? item.name) : item.name,
      item: `https://www.nivelics.com${isEn ? localizePath(item.url, "en") : item.url}`,
    })),
  };
}
