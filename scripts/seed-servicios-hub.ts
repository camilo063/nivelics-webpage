/**
 * Seeds the "servicios" hub record in the servicios table.
 * - Creates a new row with slugEs='servicios', serviceType='hub' if missing.
 * - Updates hub-specific fields (hubMetrics, frameworkPillars, sectors, etc.) if already present.
 *
 * Safe to re-run: never touches other hubs (IA, Cloud, Staff, Dev).
 * EN fields are populated here because the brand framework is fixed — the translation
 * script won't need to revisit these.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const hubMetrics = [
  { value: "19+", labelEs: "Soluciones especializadas", labelEn: "Specialized solutions" },
  { value: "13+", labelEs: "Años de experiencia", labelEn: "Years of experience" },
  {
    value: "7",
    labelEs: "Países con proyectos activos",
    labelEn: "Countries with active projects",
  },
  { value: "40%", labelEs: "Reducción de costos cloud", labelEn: "Cloud cost reduction" },
];

const frameworkPillars = [
  {
    letter: "I",
    colorClass: "text-ia",
    borderClass: "border-violet-500/20",
    titleEs: "Inteligencia Artificial",
    titleEn: "Artificial Intelligence",
    descEs:
      "Agentes, automatización y analítica avanzada que miden su propio ROI. No chatbots — producción real.",
    descEn:
      "Agents, automation and advanced analytics that measure their own ROI. Not chatbots — real production.",
  },
  {
    letter: "C",
    colorClass: "text-cloud",
    borderClass: "border-blue-500/20",
    titleEs: "Cloud",
    titleEn: "Cloud",
    descEs:
      "Infraestructura multi-cloud con gobierno, seguridad y FinOps desde el día 1. AWS, GCP y Azure certificados.",
    descEn:
      "Multi-cloud infrastructure with governance, security and FinOps from day 1. AWS, GCP and Azure certified.",
  },
  {
    letter: "S",
    colorClass: "text-primary",
    borderClass: "border-cyan-500/20",
    titleEs: "Staffing Premium",
    titleEn: "Premium Staffing",
    descEs:
      "Perfiles senior bilingües validados e integrados a tu equipo sin relación laboral directa. Candidatos en 5 días.",
    descEn:
      "Validated bilingual senior profiles integrated into your team without direct employment. Candidates in 5 days.",
  },
];

const sectors = [
  { slug: "fintech", icon: "💳", labelEs: "Fintech", labelEn: "Fintech" },
  {
    slug: "medios-entretenimiento",
    icon: "▶",
    labelEs: "Medios y Entretenimiento",
    labelEn: "Media & Entertainment",
  },
  { slug: "salud", icon: "♥", labelEs: "Salud", labelEn: "Healthcare" },
  {
    slug: "retail-ecommerce",
    icon: "🛒",
    labelEs: "Retail y E-commerce",
    labelEn: "Retail & E-commerce",
  },
  { slug: "logistica", icon: "🚚", labelEs: "Logística", labelEn: "Logistics" },
  { slug: "manufactura", icon: "⚙", labelEs: "Manufactura", labelEn: "Manufacturing" },
];

const HUB_FIELDS = {
  hubMetrics,
  frameworkTitleEs: "Por qué el marco I+C+S funciona",
  frameworkTitleEn: "Why the I+C+S framework works",
  frameworkSubtitleEs:
    "La mayoría contrata IA, Cloud y Talento por separado. Nosotros los integramos en un solo aliado con responsabilidad end-to-end.",
  frameworkSubtitleEn:
    "Most companies hire AI, Cloud and Talent separately. We integrate them into a single partner with end-to-end accountability.",
  frameworkPillars,
  sectorsTitleEs: "Sectores donde entregamos resultados",
  sectorsTitleEn: "Sectors where we deliver results",
  sectors,
  translationStatusEn: "complete" as const,
};

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  const existing = await db.query.servicios.findFirst({
    where: eq(schema.servicios.slugEs, "servicios"),
  });

  if (existing) {
    await db
      .update(schema.servicios)
      .set({ ...HUB_FIELDS, updatedAt: new Date() })
      .where(eq(schema.servicios.slugEs, "servicios"));
    console.log("[OK] hub 'servicios' updated with framework fields");
    return;
  }

  await db.insert(schema.servicios).values({
    slugEs: "servicios",
    slugEn: "services",
    serviceType: "hub",
    accentColor: "dev",
    icon: "layers",
    titleEs: "Nuestros Servicios",
    titleEn: "Our Services",
    subtitleEs: "Marco estratégico I+C+S",
    subtitleEn: "I+C+S Strategic Framework",
    descriptionEs:
      "Combinamos Inteligencia Artificial, Cloud y Staffing Premium para impulsar tu transformación digital.",
    descriptionEn:
      "We combine Artificial Intelligence, Cloud and Premium Staffing to drive your digital transformation.",
    sortOrder: -1,
    status: "published",
    ...HUB_FIELDS,
  });
  console.log("[OK] hub 'servicios' created");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
