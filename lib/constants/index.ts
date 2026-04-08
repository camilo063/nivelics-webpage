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
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  href: string;
}

export const SERVICES: ServiceDef[] = [
  {
    slug: "inteligencia-artificial",
    label: "Inteligencia Artificial",
    shortLabel: "IA",
    description:
      "Implementamos soluciones de IA generativa, MLOps y analítica avanzada para automatizar procesos y generar insights accionables.",
    icon: Brain,
    color: "var(--ia)",
    gradient: "var(--grad-ia)",
    href: "/servicios/inteligencia-artificial",
  },
  {
    slug: "cloud",
    label: "Cloud",
    shortLabel: "Cloud",
    description:
      "Arquitectura multi-cloud, migración, DevOps y optimización de costos con enfoque FinOps.",
    icon: Cloud,
    color: "var(--cloud)",
    gradient: "var(--grad-cloud)",
    href: "/servicios/cloud",
  },
  {
    slug: "staff-augmentation",
    label: "Staff Augmentation",
    shortLabel: "Staffing",
    description:
      "Equipos de ingeniería on-demand con talento senior verificado. Escalá tu capacidad sin comprometer calidad.",
    icon: Users,
    color: "var(--staffing)",
    gradient: "var(--grad-staffing)",
    href: "/servicios/staff-augmentation",
  },
  {
    slug: "desarrollo-digital",
    label: "Desarrollo Digital",
    shortLabel: "Dev",
    description:
      "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles y arquitectura moderna.",
    icon: Code2,
    color: "var(--dev)",
    gradient: "var(--grad-cloud)",
    href: "/servicios/desarrollo-digital",
  },
  {
    slug: "finops",
    label: "FinOps",
    shortLabel: "FinOps",
    description:
      "Optimización y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento.",
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
