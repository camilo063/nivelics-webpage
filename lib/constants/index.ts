import { Brain, Cloud, Users, Code2, DollarSign, type LucideIcon } from "lucide-react";

/**
 * ÚLTIMO RESPALDO de los datos de contacto, no la fuente de verdad.
 *
 * La fuente única es la fila `main` de `site_config` (Admin → Configuración):
 * `emailContact`, `phoneWhatsapp`, `addressBogota`, `addressMiami`,
 * `linkedinUrl`, `instagramUrl`. Todo el sitio —páginas, pie y JSON-LD— los lee
 * a través de `getContactoSitio()` (lib/cms/contacto.ts).
 *
 * Los valores de abajo solo se usan si la BD no responde y el fallback de
 * `data/fallbacks/site_config.json` tampoco trae el campo. Si cambian los datos
 * oficiales, se cambian en el admin; esto se actualiza únicamente para que el
 * modo degradado no publique un dato viejo.
 */
export const SITE = {
  name: "Nivelics",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nivelics.com",
  description: "Transformación digital B2B. Inteligencia Artificial, Cloud & Staffing Premium.",
  whatsapp: "+573112146459",
  email: "hola@nivelics.com",
  linkedin: "https://www.linkedin.com/company/nivelics",
  instagram: "https://www.instagram.com/nivelics",
  founded: 2012,
  locations: ["Bogotá, Colombia", "Miami, FL"],
} as const;

export interface ServiceDef {
  slug: string;
  label: string;
  labelEn: string;
  shortLabel: string;
  description: string;
  descriptionEn: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  href: string;
}

export const SERVICES: ServiceDef[] = [
  {
    slug: "inteligencia-artificial",
    label: "Inteligencia Artificial",
    labelEn: "Artificial Intelligence",
    shortLabel: "IA",
    description:
      "Diseñamos, integramos y operamos agentes de IA en producción: con verificación independiente, guardrails, observabilidad y la opción de correr sobre tu propia infraestructura.",
    descriptionEn:
      "We design, integrate and run AI agents in production: with independent verification, guardrails, observability and the option to run on your own infrastructure.",
    icon: Brain,
    color: "var(--ia)",
    gradient: "var(--grad-ia)",
    href: "/servicios/inteligencia-artificial",
  },
  {
    slug: "cloud",
    label: "Cloud",
    labelEn: "Cloud",
    shortLabel: "Cloud",
    description:
      "Arquitectura multi-cloud, migración, DevOps y optimización de costos con enfoque FinOps.",
    descriptionEn:
      "Multi-cloud architecture, migration, DevOps and cost optimization with a FinOps approach.",
    icon: Cloud,
    color: "var(--cloud)",
    gradient: "var(--grad-cloud)",
    href: "/servicios/cloud",
  },
  {
    slug: "staff-augmentation",
    label: "Staff Augmentation",
    labelEn: "Staff Augmentation",
    shortLabel: "Staffing",
    description:
      "Equipos de ingeniería on-demand con talento senior verificado. Escala tu capacidad sin comprometer calidad.",
    descriptionEn:
      "On-demand engineering teams with verified senior talent. Scale your capacity without compromising quality.",
    icon: Users,
    color: "var(--staffing)",
    gradient: "var(--grad-staffing)",
    href: "/servicios/staff-augmentation",
  },
  {
    slug: "desarrollo-digital",
    label: "Desarrollo Digital",
    labelEn: "Digital Development",
    shortLabel: "Dev",
    description:
      "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles y arquitectura moderna.",
    descriptionEn:
      "Digital products, web and mobile applications built with agile methods and modern architecture.",
    icon: Code2,
    color: "var(--dev)",
    gradient: "var(--grad-cloud)",
    href: "/servicios/desarrollo-digital",
  },
  {
    slug: "finops",
    label: "FinOps",
    labelEn: "FinOps",
    shortLabel: "FinOps",
    description:
      "Optimización y gobernanza financiera de la nube. Reducimos costos sin perder rendimiento.",
    descriptionEn:
      "Financial optimization and governance of your cloud spend without losing performance.",
    icon: DollarSign,
    color: "var(--finops)",
    gradient: "var(--grad-cta)",
    href: "/servicios/cloud/finops",
  },
];

export const NAVIGATION = [
  { label: "Servicios", href: "/servicios" },
  { label: "Industrias", href: "/industrias/fintech" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Casos de Éxito", href: "/casos-de-exito" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const INDUSTRIES = [
  { label: "Fintech", href: "/industrias/fintech" },
  { label: "Medios y Entretenimiento", href: "/industrias/medios-entretenimiento" },
  { label: "Salud", href: "/industrias/salud" },
  { label: "Retail y E-commerce", href: "/industrias/retail-ecommerce" },
  { label: "Logística", href: "/industrias/logistica" },
  { label: "Manufactura", href: "/industrias/manufactura" },
] as const;

// `labelEn` es la etiqueta del mirror /en (la usa /nosotros). `label` sigue siendo
// la española para quien no distingue idioma.
// Solo cifras contables: «200+ proyectos», «98% de retención» y «50+ ingenieros» se
// quitaron por no tener fuente. Los años salen de 2012, la fundación.
export const METRICS = [
  { value: 14, suffix: "+", label: "Años de experiencia", labelEn: "Years of experience" },
  { value: 7, suffix: "+", label: "Países con proyectos", labelEn: "Countries with projects" },
  { value: 4, suffix: "", label: "Líneas de servicio", labelEn: "Service lines" },
  { value: 23, suffix: "", label: "Servicios especializados", labelEn: "Specialized services" },
] as const;
