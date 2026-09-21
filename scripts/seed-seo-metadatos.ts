/**
 * Metadatos SEO que viven en la BD y ganan sobre el respaldo del código.
 *
 *  1. `servicios.seo_title_*` de desarrollo-digital y staff-augmentation: con la plantilla
 *     «%s | Nivelics» superaban los 65 caracteres y Google los truncaba.
 *  2. `pages_general.seo_description_*` de soporte y trabaja-con-nosotros: 56 y 65
 *     caracteres, demasiado cortas para describir la página en resultados.
 *  3. `servicios.title_*` de finops: guarda «hasta un 35%», una cifra sin respaldo que
 *     además chocaba con el «40%» del acento del H1.
 *
 * Solo escribe si el valor actual es el que se espera reemplazar: si alguien ya lo editó
 * en el admin, se respeta y se avisa.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-seo-metadatos.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-seo-metadatos.ts
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pagesGeneral, servicios } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");

const SERVICIO_FIXES: Array<{
  slug: string;
  field: "seoTitleEs" | "seoTitleEn" | "titleEs" | "titleEn";
  to: string;
}> = [
  {
    slug: "desarrollo-digital",
    field: "seoTitleEs",
    to: "Desarrollo Digital: apps y plataformas web",
  },
  {
    slug: "desarrollo-digital",
    field: "seoTitleEn",
    to: "Digital Development: apps and web platforms",
  },
  {
    slug: "staff-augmentation",
    field: "seoTitleEs",
    to: "Staff Augmentation: talento tech en LATAM",
  },
  {
    slug: "staff-augmentation",
    field: "seoTitleEn",
    to: "Staff Augmentation: tech talent in LATAM",
  },
  // El H1 de la página ya no usa este título, pero el admin y la grid sí lo muestran.
  { slug: "finops", field: "titleEs", to: "Optimiza tu inversión cloud con FinOps real" },
  { slug: "finops", field: "titleEn", to: "Optimize your cloud investment with real FinOps" },
];

const PAGE_FIXES: Array<{
  slug: string;
  field: "seoDescriptionEs" | "seoDescriptionEn";
  to: string;
}> = [
  {
    slug: "soporte",
    field: "seoDescriptionEs",
    to: "Soporte técnico de Nivelics para clientes B2B: reporta incidentes por WhatsApp o email y recibe respuesta en máximo 4 horas hábiles, de lunes a viernes.",
  },
  {
    slug: "soporte",
    field: "seoDescriptionEn",
    to: "Nivelics technical support for B2B clients: report incidents over WhatsApp or email and get an answer within four business hours, Monday to Friday.",
  },
  {
    slug: "trabaja-con-nosotros",
    field: "seoDescriptionEs",
    to: "Únete al equipo de Nivelics: cultura directa, humana y ambiciosa. Envíanos tu hoja de vida y te contactamos cuando surja una oportunidad que encaje.",
  },
  {
    slug: "trabaja-con-nosotros",
    field: "seoDescriptionEn",
    to: "Join the Nivelics team: a direct, human and ambitious culture. Send us your CV and we will get in touch when an opening that fits your profile comes up.",
  },
];

async function main(): Promise<void> {
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }

  for (const fix of SERVICIO_FIXES) {
    const [row] = await db.select().from(servicios).where(eq(servicios.slugEs, fix.slug)).limit(1);
    if (!row) {
      console.warn(`⚠ no existe el servicio '${fix.slug}'`);
      continue;
    }
    const current = row[fix.field];
    if (current === fix.to) {
      console.log(`• ${fix.slug}.${fix.field}: ya estaba`);
      continue;
    }
    console.log(
      `  ${fix.slug}.${fix.field}: «${current ?? ""}» (${(current ?? "").length}) → «${fix.to}» (${fix.to.length})`,
    );
    if (DRY_RUN) continue;
    await db
      .update(servicios)
      .set({ [fix.field]: fix.to, updatedAt: new Date() })
      .where(eq(servicios.id, row.id));
    console.log(`✓ ${fix.slug}.${fix.field}`);
  }

  for (const fix of PAGE_FIXES) {
    const [row] = await db
      .select()
      .from(pagesGeneral)
      .where(eq(pagesGeneral.slugEs, fix.slug))
      .limit(1);
    if (!row) {
      console.warn(`⚠ no existe la página '${fix.slug}'`);
      continue;
    }
    const current = row[fix.field];
    if (current === fix.to) {
      console.log(`• ${fix.slug}.${fix.field}: ya estaba`);
      continue;
    }
    console.log(
      `  ${fix.slug}.${fix.field}: ${(current ?? "").length} → ${fix.to.length} caracteres`,
    );
    if (DRY_RUN) continue;
    await db
      .update(pagesGeneral)
      .set({ [fix.field]: fix.to, updatedAt: new Date() })
      .where(eq(pagesGeneral.id, row.id));
    console.log(`✓ ${fix.slug}.${fix.field}`);
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
