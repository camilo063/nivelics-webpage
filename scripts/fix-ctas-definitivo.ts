/**
 * Fix missing CTAs for all servicios. Direct data, no API calls needed.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const db = drizzle(process.env.DATABASE_URL!, { schema });

const CTAS: Record<
  string,
  {
    ctaPrimaryTextEs: string;
    ctaPrimaryTextEn: string;
    ctaPrimaryUrl: string;
    ctaSecondaryTextEs?: string;
    ctaSecondaryTextEn?: string;
    ctaSecondaryUrl?: string;
  }
> = {
  "agentes-ia": {
    ctaPrimaryTextEs: "Agendar discovery",
    ctaPrimaryTextEn: "Book a discovery call",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver todos los servicios IA",
    ctaSecondaryTextEn: "View all AI services",
    ctaSecondaryUrl: "/servicios/inteligencia-artificial",
  },
  "agentes-comerciales": {
    ctaPrimaryTextEs: "Agendar demo",
    ctaPrimaryTextEn: "Book a demo",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver todos los servicios IA",
    ctaSecondaryTextEn: "View all AI services",
    ctaSecondaryUrl: "/servicios/inteligencia-artificial",
  },
  "automatizacion-procesos": {
    ctaPrimaryTextEs: "Agendar discovery",
    ctaPrimaryTextEn: "Book a discovery call",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver todos los servicios IA",
    ctaSecondaryTextEn: "View all AI services",
    ctaSecondaryUrl: "/servicios/inteligencia-artificial",
  },
  "gestion-contenido": {
    ctaPrimaryTextEs: "Agendar demo",
    ctaPrimaryTextEn: "Book a demo",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver todos los servicios IA",
    ctaSecondaryTextEn: "View all AI services",
    ctaSecondaryUrl: "/servicios/inteligencia-artificial",
  },
  "marketing-crm": {
    ctaPrimaryTextEs: "Agendar demo",
    ctaPrimaryTextEn: "Book a demo",
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: "Ver todos los servicios IA",
    ctaSecondaryTextEn: "View all AI services",
    ctaSecondaryUrl: "/servicios/inteligencia-artificial",
  },
  "migracion-aws": {
    ctaPrimaryTextEs: "Solicitar assessment",
    ctaPrimaryTextEn: "Request assessment",
    ctaPrimaryUrl: "/contacto",
  },
  infraestructura: {
    ctaPrimaryTextEs: "Solicitar diseño",
    ctaPrimaryTextEn: "Request design",
    ctaPrimaryUrl: "/contacto",
  },
  seguridad: {
    ctaPrimaryTextEs: "Solicitar auditoría",
    ctaPrimaryTextEn: "Request audit",
    ctaPrimaryUrl: "/contacto",
  },
  serverless: {
    ctaPrimaryTextEs: "Hablar con un experto",
    ctaPrimaryTextEn: "Talk to an expert",
    ctaPrimaryUrl: "/contacto",
  },
  "desarrollo-software": {
    ctaPrimaryTextEs: "Ver perfiles disponibles",
    ctaPrimaryTextEn: "View available profiles",
    ctaPrimaryUrl: "/contacto",
  },
  "diseno-ux-ui": {
    ctaPrimaryTextEs: "Ver perfiles disponibles",
    ctaPrimaryTextEn: "View available profiles",
    ctaPrimaryUrl: "/contacto",
  },
  "devops-cloud": {
    ctaPrimaryTextEs: "Ver perfiles disponibles",
    ctaPrimaryTextEn: "View available profiles",
    ctaPrimaryUrl: "/contacto",
  },
  "datos-ia": {
    ctaPrimaryTextEs: "Ver perfiles disponibles",
    ctaPrimaryTextEn: "View available profiles",
    ctaPrimaryUrl: "/contacto",
  },
  "qa-seguridad": {
    ctaPrimaryTextEs: "Ver perfiles disponibles",
    ctaPrimaryTextEn: "View available profiles",
    ctaPrimaryUrl: "/contacto",
  },
  "apps-moviles": {
    ctaPrimaryTextEs: "Cuéntanos tu proyecto",
    ctaPrimaryTextEn: "Tell us about your project",
    ctaPrimaryUrl: "/contacto",
  },
  "plataformas-web": {
    ctaPrimaryTextEs: "Cuéntanos tu proyecto",
    ctaPrimaryTextEn: "Tell us about your project",
    ctaPrimaryUrl: "/contacto",
  },
  ecommerce: {
    ctaPrimaryTextEs: "Cuéntanos tu proyecto",
    ctaPrimaryTextEn: "Tell us about your project",
    ctaPrimaryUrl: "/contacto",
  },
  "sitios-web-agentic": {
    ctaPrimaryTextEs: "Solicitar auditoría de tu sitio",
    ctaPrimaryTextEn: "Request a site audit",
    ctaPrimaryUrl: "/contacto",
  },
};

async function main() {
  console.log("=== Fix CTAs for servicios ===\n");

  for (const [slug, cta] of Object.entries(CTAS)) {
    const [existing] = await db
      .select()
      .from(schema.servicios)
      .where(eq(schema.servicios.slugEs, slug));
    if (!existing) {
      console.log(`SKIP: ${slug} not in DB`);
      continue;
    }

    if (existing.ctaPrimaryTextEs && existing.ctaPrimaryTextEs.trim() !== "") {
      console.log(`OK: ${slug} — CTA already set`);
      continue;
    }

    await db
      .update(schema.servicios)
      .set({
        ctaPrimaryTextEs: cta.ctaPrimaryTextEs,
        ctaPrimaryTextEn: cta.ctaPrimaryTextEn,
        ctaPrimaryUrl: cta.ctaPrimaryUrl,
        ctaSecondaryTextEs: cta.ctaSecondaryTextEs || null,
        ctaSecondaryTextEn: cta.ctaSecondaryTextEn || null,
        ctaSecondaryUrl: cta.ctaSecondaryUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.servicios.slugEs, slug));

    console.log(`✅ ${slug} — CTA set: "${cta.ctaPrimaryTextEs}"`);
  }

  // Verify
  console.log("\n=== Verification ===");
  const all = await db
    .select({
      slug: schema.servicios.slugEs,
      cta: schema.servicios.ctaPrimaryTextEs,
    })
    .from(schema.servicios)
    .where(eq(schema.servicios.deletedAt, null as unknown as Date));

  // Use raw query for null check
  const { rows } = await db.execute(
    sql`SELECT slug_es, cta_primary_text_es FROM servicios WHERE deleted_at IS NULL AND (cta_primary_text_es IS NULL OR cta_primary_text_es = '')`,
  );

  if (rows.length === 0) {
    console.log("✅ All servicios have CTAs set!");
  } else {
    console.log(`❌ ${rows.length} servicios still missing CTAs:`);
    for (const r of rows) console.log(`  - ${r.slug_es}`);
  }

  process.exit(0);
}

main().catch(console.error);
