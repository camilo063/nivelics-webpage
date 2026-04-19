import { db } from "@/lib/db";
import { landingPages, blogPosts } from "@/lib/db/schema/admin";
import { eq, and, isNull } from "drizzle-orm";
import { getAllProductos } from "@/lib/cms/productos";

export const BASE = "https://www.nivelics.com";
export const STATIC_LAST_MOD = new Date("2026-04-01");

export type SiteUrl = {
  es: string;
  en: string;
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastModified?: Date;
};

// Única fuente de verdad. Cada entrada conoce su ruta ES y EN.
// En el sitemap de cada locale se emite la ruta correspondiente + hreflang al otro.
const SERVICIOS_MOD = new Date("2026-04-01");
const INDUSTRIAS_MOD = new Date("2026-04-01");
const NOSOTROS_MOD = new Date("2026-03-01");
const CASOS_MOD = new Date("2025-12-15");

const STATIC_URLS: SiteUrl[] = [
  { es: "/", en: "/en", priority: 1.0, changeFrequency: "weekly", lastModified: STATIC_LAST_MOD },

  // Servicios hubs
  {
    es: "/servicios",
    en: "/en/services",
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/inteligencia-artificial",
    en: "/en/services/artificial-intelligence",
    priority: 0.9,
    lastModified: SERVICIOS_MOD,
  },
  { es: "/servicios/cloud", en: "/en/services/cloud", priority: 0.9, lastModified: SERVICIOS_MOD },
  {
    es: "/servicios/staff-augmentation",
    en: "/en/services/staff-augmentation",
    priority: 0.9,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/desarrollo-digital",
    en: "/en/services/digital-development",
    priority: 0.9,
    lastModified: SERVICIOS_MOD,
  },

  // Subservicios IA
  {
    es: "/servicios/inteligencia-artificial/agentes-ia",
    en: "/en/services/artificial-intelligence/ai-agents",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/inteligencia-artificial/agentes-comerciales",
    en: "/en/services/artificial-intelligence/sales-agents",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/inteligencia-artificial/automatizacion-procesos",
    en: "/en/services/artificial-intelligence/process-automation",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/inteligencia-artificial/gestion-contenido",
    en: "/en/services/artificial-intelligence/content-management",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/inteligencia-artificial/marketing-crm",
    en: "/en/services/artificial-intelligence/marketing-crm",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },

  // Subservicios Cloud
  {
    es: "/servicios/cloud/finops",
    en: "/en/services/cloud/finops",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/cloud/migracion-aws",
    en: "/en/services/cloud/aws-migration",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/cloud/infraestructura",
    en: "/en/services/cloud/infrastructure",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/cloud/seguridad",
    en: "/en/services/cloud/security",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/cloud/serverless",
    en: "/en/services/cloud/serverless",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },

  // Subservicios Staff Augmentation
  {
    es: "/servicios/staff-augmentation/desarrollo-software",
    en: "/en/services/staff-augmentation/software-development",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/staff-augmentation/datos-ia",
    en: "/en/services/staff-augmentation/data-ai",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/staff-augmentation/devops-cloud",
    en: "/en/services/staff-augmentation/devops-cloud",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/staff-augmentation/diseno-ux-ui",
    en: "/en/services/staff-augmentation/ux-ui-design",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/staff-augmentation/qa-seguridad",
    en: "/en/services/staff-augmentation/qa-security",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },

  // Subservicios Desarrollo Digital
  {
    es: "/servicios/desarrollo-digital/sitios-web-agentic",
    en: "/en/services/digital-development/agentic-websites",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/desarrollo-digital/apps-moviles",
    en: "/en/services/digital-development/mobile-apps",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/desarrollo-digital/ecommerce",
    en: "/en/services/digital-development/ecommerce",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },
  {
    es: "/servicios/desarrollo-digital/plataformas-web",
    en: "/en/services/digital-development/web-platforms",
    priority: 0.85,
    lastModified: SERVICIOS_MOD,
  },

  // Industrias
  {
    es: "/industrias/fintech",
    en: "/en/industries/fintech",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },
  {
    es: "/industrias/medios-entretenimiento",
    en: "/en/industries/media-entertainment",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },
  {
    es: "/industrias/salud",
    en: "/en/industries/healthcare",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },
  {
    es: "/industrias/retail-ecommerce",
    en: "/en/industries/retail-ecommerce",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },
  {
    es: "/industrias/logistica",
    en: "/en/industries/logistics",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },
  {
    es: "/industrias/manufactura",
    en: "/en/industries/manufacturing",
    priority: 0.85,
    lastModified: INDUSTRIAS_MOD,
  },

  // Productos (hub) — lastModified set dynamically in getAllSiteUrls
  { es: "/productos", en: "/en/products", priority: 0.9, changeFrequency: "monthly" },

  // Nosotros
  { es: "/nosotros", en: "/en/about", priority: 0.7, lastModified: NOSOTROS_MOD },
  {
    es: "/nosotros/historia",
    en: "/en/about/history",
    priority: 0.6,
    changeFrequency: "yearly",
    lastModified: NOSOTROS_MOD,
  },
  { es: "/nosotros/equipo", en: "/en/about/team", priority: 0.6, lastModified: NOSOTROS_MOD },
  {
    es: "/nosotros/metodologia",
    en: "/en/about/methodology",
    priority: 0.6,
    changeFrequency: "yearly",
    lastModified: NOSOTROS_MOD,
  },
  {
    es: "/nosotros/certificaciones",
    en: "/en/about/certifications",
    priority: 0.6,
    changeFrequency: "yearly",
    lastModified: NOSOTROS_MOD,
  },

  // Casos de éxito
  { es: "/casos-de-exito", en: "/en/success-stories", priority: 0.8, lastModified: CASOS_MOD },
  {
    es: "/casos-de-exito/televisa",
    en: "/en/success-stories/televisa",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/grupo-bolivar",
    en: "/en/success-stories/grupo-bolivar",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/two-maids",
    en: "/en/success-stories/two-maids",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/ab-inbev",
    en: "/en/success-stories/ab-inbev",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/cronica",
    en: "/en/success-stories/cronica",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/pulzo",
    en: "/en/success-stories/pulzo",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },
  {
    es: "/casos-de-exito/univision",
    en: "/en/success-stories/univision",
    priority: 0.75,
    changeFrequency: "yearly",
    lastModified: CASOS_MOD,
  },

  // Utilitarios
  {
    es: "/blog",
    en: "/en/blog",
    priority: 0.6,
    changeFrequency: "weekly",
    lastModified: STATIC_LAST_MOD,
  },
  { es: "/contacto", en: "/en/contact", priority: 0.8, lastModified: NOSOTROS_MOD },
  { es: "/trabaja-con-nosotros", en: "/en/careers", priority: 0.6, lastModified: NOSOTROS_MOD },
  { es: "/soporte", en: "/en/support", priority: 0.5, lastModified: NOSOTROS_MOD },
  {
    es: "/privacidad",
    en: "/en/privacy",
    priority: 0.3,
    changeFrequency: "yearly",
    lastModified: new Date("2025-06-01"),
  },
];

async function getIndexableLandings() {
  if (!db) return [];
  try {
    return await db
      .select({ slug: landingPages.slug, updatedAt: landingPages.updatedAt })
      .from(landingPages)
      .where(and(eq(landingPages.status, "published"), eq(landingPages.noindex, false)));
  } catch {
    return [];
  }
}

const PRODUCTOS_FALLBACK = [
  { slugEs: "paywl", slugEn: "paywl", updatedAt: null as Date | null },
  { slugEs: "niveleads", slugEn: "niveleads", updatedAt: null as Date | null },
  { slugEs: "hirely", slugEn: "hirely", updatedAt: null as Date | null },
];

async function getBlogPostsForSitemap() {
  if (!db) return [];
  try {
    return await db
      .select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), isNull(blogPosts.deletedAt)));
  } catch {
    return [];
  }
}

async function getProductosForSitemap() {
  try {
    const data = await getAllProductos();
    if (!data || data.length === 0) return PRODUCTOS_FALLBACK;
    return data.map((p) => ({
      slugEs: p.slugEs,
      slugEn: p.slugEn,
      updatedAt: p.updatedAt ?? null,
    }));
  } catch (error) {
    console.error("[sitemap] Error fetching productos, using fallback:", error);
    return PRODUCTOS_FALLBACK;
  }
}

export async function getAllSiteUrls(): Promise<SiteUrl[]> {
  const [landings, productos, posts] = await Promise.all([
    getIndexableLandings(),
    getProductosForSitemap(),
    getBlogPostsForSitemap(),
  ]);

  const lastProductoUpdate = productos.reduce((latest, p) => {
    const d = p.updatedAt ? new Date(p.updatedAt) : STATIC_LAST_MOD;
    return d > latest ? d : latest;
  }, STATIC_LAST_MOD);

  const lastBlogUpdate = posts.reduce((latest, p) => {
    const d = p.updatedAt ?? p.createdAt;
    return d && d > latest ? d : latest;
  }, STATIC_LAST_MOD);

  const urls = STATIC_URLS.map((u) => {
    if (u.es === "/productos") {
      return { ...u, lastModified: lastProductoUpdate };
    }
    if (u.es === "/blog") {
      return { ...u, lastModified: lastBlogUpdate };
    }
    return u;
  });

  return [
    ...urls,
    ...landings.map((lp) => ({
      es: `/lp/${lp.slug}`,
      en: `/en/lp/${lp.slug}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
      lastModified: lp.updatedAt ?? undefined,
    })),
    ...productos.map((p) => ({
      es: `/productos/${p.slugEs}`,
      en: `/en/products/${p.slugEn}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    })),
    ...posts.map((p) => ({
      es: `/blog/${p.slug}`,
      en: `/en/blog/${p.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: p.updatedAt ?? p.createdAt ?? undefined,
    })),
  ];
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildLocaleSitemapXml(urls: SiteUrl[], locale: "es" | "en"): string {
  const entries = urls
    .map((u) => {
      const path = locale === "en" ? u.en : u.es;
      const loc = escapeXml(`${BASE}${path}`);
      const esLoc = escapeXml(`${BASE}${u.es}`);
      const enLoc = escapeXml(`${BASE}${u.en}`);
      const lastmod = (u.lastModified ?? STATIC_LAST_MOD).toISOString();
      const changefreq = u.changeFrequency ?? "monthly";
      const priority = (u.priority ?? 0.5).toFixed(2);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${esLoc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esLoc}" />
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}
