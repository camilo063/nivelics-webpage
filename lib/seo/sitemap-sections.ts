import { getAllProductos, accentHex } from "@/lib/cms/productos";

export type SitemapLink = {
  label: string;
  labelEn: string;
  href: string;
  hrefEn: string;
  accent?: string;
};

export type SitemapSection = {
  id: string;
  label: string;
  labelEn: string;
  color: string;
  links: SitemapLink[];
};

const PRODUCTOS_FALLBACK: SitemapLink[] = [
  {
    label: "PAYWL",
    labelEn: "PAYWL",
    href: "/productos/paywl",
    hrefEn: "/en/products/paywl",
    accent: accentHex("cyan"),
  },
  {
    label: "Niveleads",
    labelEn: "Niveleads",
    href: "/productos/niveleads",
    hrefEn: "/en/products/niveleads",
    accent: accentHex("teal"),
  },
  {
    label: "Hirely",
    labelEn: "Hirely",
    href: "/productos/hirely",
    hrefEn: "/en/products/hirely",
    accent: accentHex("violet"),
  },
];

export async function getSitemapSections(): Promise<SitemapSection[]> {
  let productosLinks: SitemapLink[] = PRODUCTOS_FALLBACK;
  try {
    const productos = await getAllProductos();
    if (productos.length > 0) {
      productosLinks = productos.map((p) => ({
        label: p.name,
        labelEn: p.name,
        href: `/productos/${p.slugEs}`,
        hrefEn: `/en/products/${p.slugEn}`,
        accent: accentHex(p.accentColor ?? "cyan"),
      }));
    }
  } catch {
    // fallback already applied
  }

  return [
    {
      id: "servicios",
      label: "Servicios",
      labelEn: "Services",
      color: "#a78bfa",
      links: [
        {
          label: "Inteligencia Artificial",
          labelEn: "Artificial Intelligence",
          href: "/servicios/inteligencia-artificial",
          hrefEn: "/en/services/artificial-intelligence",
        },
        {
          label: "Agentes IA",
          labelEn: "AI Agents",
          href: "/servicios/inteligencia-artificial/agentes-ia",
          hrefEn: "/en/services/artificial-intelligence/ai-agents",
        },
        {
          label: "Automatización",
          labelEn: "Automation",
          href: "/servicios/inteligencia-artificial/automatizacion-procesos",
          hrefEn: "/en/services/artificial-intelligence/process-automation",
        },
        {
          label: "Cloud",
          labelEn: "Cloud",
          href: "/servicios/cloud",
          hrefEn: "/en/services/cloud",
        },
        {
          label: "FinOps",
          labelEn: "FinOps",
          href: "/servicios/cloud/finops",
          hrefEn: "/en/services/cloud/finops",
        },
        {
          label: "Migración AWS",
          labelEn: "AWS Migration",
          href: "/servicios/cloud/migracion-aws",
          hrefEn: "/en/services/cloud/aws-migration",
        },
        {
          label: "Staff Augmentation",
          labelEn: "Staff Augmentation",
          href: "/servicios/staff-augmentation",
          hrefEn: "/en/services/staff-augmentation",
        },
        {
          label: "Desarrollo de Software",
          labelEn: "Software Development",
          href: "/servicios/staff-augmentation/desarrollo-software",
          hrefEn: "/en/services/staff-augmentation/software-development",
        },
        {
          label: "Desarrollo Digital",
          labelEn: "Digital Development",
          href: "/servicios/desarrollo-digital",
          hrefEn: "/en/services/digital-development",
        },
        {
          label: "Sitios Agentic-First",
          labelEn: "Agentic-First Sites",
          href: "/servicios/desarrollo-digital/sitios-web-agentic",
          hrefEn: "/en/services/digital-development/agentic-websites",
        },
        {
          label: "E-commerce",
          labelEn: "E-commerce",
          href: "/servicios/desarrollo-digital/ecommerce",
          hrefEn: "/en/services/digital-development/ecommerce",
        },
      ],
    },
    {
      id: "productos",
      label: "Productos SaaS",
      labelEn: "SaaS Products",
      color: "#00d4ff",
      links: productosLinks,
    },
    {
      id: "industrias",
      label: "Industrias",
      labelEn: "Industries",
      color: "#fbbf24",
      links: [
        {
          label: "Fintech",
          labelEn: "Fintech",
          href: "/industrias/fintech",
          hrefEn: "/en/industries/fintech",
        },
        {
          label: "Medios & Entretenimiento",
          labelEn: "Media & Entertainment",
          href: "/industrias/medios-entretenimiento",
          hrefEn: "/en/industries/media-entertainment",
        },
        {
          label: "Salud",
          labelEn: "Healthcare",
          href: "/industrias/salud",
          hrefEn: "/en/industries/healthcare",
        },
        {
          label: "Retail y E-commerce",
          labelEn: "Retail & E-commerce",
          href: "/industrias/retail-ecommerce",
          hrefEn: "/en/industries/retail-ecommerce",
        },
        {
          label: "Logística",
          labelEn: "Logistics",
          href: "/industrias/logistica",
          hrefEn: "/en/industries/logistics",
        },
        {
          label: "Manufactura",
          labelEn: "Manufacturing",
          href: "/industrias/manufactura",
          hrefEn: "/en/industries/manufacturing",
        },
      ],
    },
    {
      id: "empresa",
      label: "Empresa y recursos",
      labelEn: "Company & resources",
      color: "#4ade80",
      links: [
        {
          label: "Nosotros",
          labelEn: "About us",
          href: "/nosotros",
          hrefEn: "/en/about",
        },
        {
          label: "Historia",
          labelEn: "History",
          href: "/nosotros/historia",
          hrefEn: "/en/about/history",
        },
        {
          label: "Equipo",
          labelEn: "Team",
          href: "/nosotros/equipo",
          hrefEn: "/en/about/team",
        },
        {
          label: "Casos de éxito",
          labelEn: "Success stories",
          href: "/casos-de-exito",
          hrefEn: "/en/success-stories",
        },
        {
          label: "Blog",
          labelEn: "Blog",
          href: "/blog",
          hrefEn: "/en/blog",
        },
        {
          label: "Contacto",
          labelEn: "Contact",
          href: "/contacto",
          hrefEn: "/en/contact",
        },
        {
          label: "Trabaja con nosotros",
          labelEn: "Careers",
          href: "/trabaja-con-nosotros",
          hrefEn: "/en/careers",
        },
      ],
    },
  ];
}
