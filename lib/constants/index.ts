import { Brain, Cloud, Users, Code2, DollarSign, type LucideIcon } from "lucide-react";

export const SITE = {
  name: "Nivelics",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nivelics.com",
  description: "Transformación digital B2B. Inteligencia Artificial, Cloud & Staffing Premium.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "+573103926621",
  email: "contacto@nivelics.com",
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

export const METRICS = [
  { value: 200, suffix: "+", label: "Proyectos entregados" },
  { value: 13, suffix: "+", label: "Años de experiencia" },
  { value: 98, suffix: "%", label: "Retención de clientes" },
  { value: 50, suffix: "+", label: "Ingenieros especializados" },
] as const;
