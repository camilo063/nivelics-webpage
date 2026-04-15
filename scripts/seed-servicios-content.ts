/**
 * Populates the 4 hub servicios records (IA, Cloud, Staff-Aug, Dev Digital) with
 * the copy extracted from their page.tsx files.
 *
 * Rule: only writes fields that are currently empty in DB — never overwrites
 * values already edited from the admin.
 *
 * Run:
 *   DATABASE_URL=... npx tsx scripts/seed-servicios-content.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

type Hub = {
  slug: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  ctaPrimaryTextEs: string;
  ctaPrimaryTextEn: string;
  ctaPrimaryUrl: string;
  ctaSecondaryTextEs: string;
  ctaSecondaryTextEn: string;
  ctaSecondaryUrl: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
};

const HUBS: Hub[] = [
  {
    slug: "inteligencia-artificial",
    titleEs: "Agentes IA que ejecutan tareas reales",
    titleEn: "AI agents that execute real tasks",
    subtitleEs:
      "No chatbots. Agentes autónomos integrados con tus sistemas que trabajan 24/7 y se miden con resultados reales.",
    subtitleEn:
      "Not chatbots. Autonomous agents integrated with your systems, working 24/7 and measured by real outcomes.",
    descriptionEs:
      "Construimos agentes IA en producción, no POCs. Se integran con tu CRM, ERP y canales (WhatsApp, correo, web) y generan impacto medible desde el primer mes.",
    descriptionEn:
      "We build production AI agents, not POCs. They integrate with your CRM, ERP and channels (WhatsApp, email, web) and deliver measurable impact from month one.",
    ctaPrimaryTextEs: "Ver casos de uso",
    ctaPrimaryTextEn: "See use cases",
    ctaPrimaryUrl: "#sub-services",
    ctaSecondaryTextEs: "Calcular mi ROI",
    ctaSecondaryTextEn: "Calculate my ROI",
    ctaSecondaryUrl: "/contacto",
    seoTitleEs: "IA Aplicada a Negocios | Agentes, Automatización y RAG",
    seoTitleEn: "Applied AI for Business | Agents, Automation and RAG",
    seoDescriptionEs:
      "Soluciones de IA generativa, MLOps y analítica avanzada para automatizar procesos y generar insights accionables.",
    seoDescriptionEn:
      "Generative AI, MLOps and advanced analytics to automate processes and generate actionable insights.",
  },
  {
    slug: "cloud",
    titleEs: "Cloud con gobierno real y 40% menos de costos",
    titleEn: "Cloud with real governance and 40% lower costs",
    subtitleEs:
      "Diseñamos, migramos y operamos tu infraestructura cloud con las mejores prácticas de la industria. FinOps desde el día uno.",
    subtitleEn:
      "We design, migrate and operate your cloud infrastructure with industry best practices. FinOps from day one.",
    descriptionEs:
      "Multi-cloud (AWS, GCP, Azure) con seguridad, gobierno de datos y optimización continua de costos. Operamos lo que construimos con SLAs escritos.",
    descriptionEn:
      "Multi-cloud (AWS, GCP, Azure) with security, data governance and continuous cost optimization. We operate what we build, backed by written SLAs.",
    ctaPrimaryTextEs: "Ver servicios Cloud",
    ctaPrimaryTextEn: "See Cloud services",
    ctaPrimaryUrl: "#sub-services",
    ctaSecondaryTextEs: "Auditar mi cloud",
    ctaSecondaryTextEn: "Audit my cloud",
    ctaSecondaryUrl: "/contacto",
    seoTitleEs: "Cloud · AWS · GCP · Azure | FinOps y Migración — Nivelics",
    seoTitleEn: "Cloud · AWS · GCP · Azure | FinOps and Migration — Nivelics",
    seoDescriptionEs:
      "Migración a cloud, FinOps, seguridad e infraestructura gestionada. Reducimos 40% los costos y mantenemos 99.9% de uptime.",
    seoDescriptionEn:
      "Cloud migration, FinOps, security and managed infrastructure. We cut costs by 40% while keeping 99.9% uptime.",
  },
  {
    slug: "staff-augmentation",
    titleEs: "Talento tech colombiano en 5 días hábiles",
    titleEn: "Colombian tech talent in 5 business days",
    subtitleEs:
      "Desarrolladores, data engineers y diseñadores validados e integrados en tu equipo. Sin riesgos laborales, sin costos ocultos.",
    subtitleEn:
      "Validated developers, data engineers and designers integrated into your team. No labor risks, no hidden costs.",
    descriptionEs:
      "Perfiles senior bilingües con filtro técnico previo. Garantía de reemplazo sin costo en menos de 10 días si el perfil no cumple. 40% de ahorro vs. contratar en USA o Europa.",
    descriptionEn:
      "Senior bilingual profiles with prior technical filter. No-cost replacement guarantee in under 10 days if the profile underperforms. 40% savings vs. hiring in the US or Europe.",
    ctaPrimaryTextEs: "Pedir perfiles",
    ctaPrimaryTextEn: "Request profiles",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver roles disponibles",
    ctaSecondaryTextEn: "See available roles",
    ctaSecondaryUrl: "#sub-services",
    seoTitleEs: "Staff Augmentation Premium | Ingenieros en 5 días — Nivelics",
    seoTitleEn: "Premium Staff Augmentation | Engineers in 5 days — Nivelics",
    seoDescriptionEs:
      "Ingenieros senior bilingües integrados a tu equipo en 5 días hábiles. Sin fricción laboral, con garantía de reemplazo.",
    seoDescriptionEn:
      "Senior bilingual engineers integrated into your team in 5 business days. No legal friction, with replacement guarantee.",
  },
  {
    slug: "desarrollo-digital",
    titleEs: "Del concepto a producción",
    titleEn: "From concept to production",
    subtitleEs:
      "Diseñamos y construimos apps móviles, plataformas web y e-commerce con arquitectura moderna y entregas cada 2 semanas.",
    subtitleEn:
      "We design and build mobile apps, web platforms and e-commerce with modern architecture and deliverables every 2 weeks.",
    descriptionEs:
      "Productos digitales listos para escalar: arquitectura moderna, demos quincenales, código 100% del cliente. No black boxes, no vendor lock-in.",
    descriptionEn:
      "Digital products ready to scale: modern architecture, bi-weekly demos, code 100% owned by the client. No black boxes, no vendor lock-in.",
    ctaPrimaryTextEs: "Ver servicios de desarrollo",
    ctaPrimaryTextEn: "See development services",
    ctaPrimaryUrl: "#sub-services",
    ctaSecondaryTextEs: "Cotizar mi proyecto",
    ctaSecondaryTextEn: "Quote my project",
    ctaSecondaryUrl: "/contacto",
    seoTitleEs: "Desarrollo Digital | Apps, Plataformas Web y E-commerce — Nivelics",
    seoTitleEn: "Digital Development | Apps, Web Platforms and E-commerce — Nivelics",
    seoDescriptionEs:
      "Desarrollo de apps móviles, plataformas web y e-commerce con arquitectura moderna y entregas quincenales.",
    seoDescriptionEn:
      "Mobile app, web platform and e-commerce development with modern architecture and bi-weekly deliverables.",
  },
];

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  let populatedCount = 0;
  for (const hub of HUBS) {
    const existing = await db.query.servicios.findFirst({
      where: eq(schema.servicios.slugEs, hub.slug),
    });
    if (!existing) {
      console.warn(`[WARN] servicio '${hub.slug}' does not exist — skipping`);
      continue;
    }
    const updates: Record<string, unknown> = {};
    const check = (key: keyof Hub) => {
      const current = (existing as Record<string, unknown>)[key];
      if (!current || (typeof current === "string" && current.trim() === "")) {
        updates[key] = hub[key];
      }
    };
    check("titleEs");
    check("titleEn");
    check("subtitleEs");
    check("subtitleEn");
    check("descriptionEs");
    check("descriptionEn");
    check("ctaPrimaryTextEs");
    check("ctaPrimaryTextEn");
    check("ctaPrimaryUrl");
    check("ctaSecondaryTextEs");
    check("ctaSecondaryTextEn");
    check("ctaSecondaryUrl");
    check("seoTitleEs");
    check("seoTitleEn");
    check("seoDescriptionEs");
    check("seoDescriptionEn");

    if (Object.keys(updates).length > 0) {
      await db
        .update(schema.servicios)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.servicios.slugEs, hub.slug));
      populatedCount += Object.keys(updates).length;
      console.log(`[OK] ${hub.slug} — ${Object.keys(updates).length} fields populated`);
    } else {
      console.log(`[SKIP] ${hub.slug} — already has content`);
    }
  }

  console.log(`\n✅ ${populatedCount} fields populated across ${HUBS.length} hubs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
