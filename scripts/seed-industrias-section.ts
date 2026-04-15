/**
 * Adds `industrias_section_*` fields to home_content and seeds defaults.
 *
 *   DATABASE_URL="..." npx tsx scripts/seed-industrias-section.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  await db.execute(sql`
    ALTER TABLE "home_content"
      ADD COLUMN IF NOT EXISTS "industrias_section_title_es" text,
      ADD COLUMN IF NOT EXISTS "industrias_section_title_en" text,
      ADD COLUMN IF NOT EXISTS "industrias_section_subtitle_es" text,
      ADD COLUMN IF NOT EXISTS "industrias_section_subtitle_en" text,
      ADD COLUMN IF NOT EXISTS "industrias_section_metrics" jsonb;
  `);
  console.log("[OK] columns ensured on home_content");

  const defaults: {
    industriasSectionTitleEs: string;
    industriasSectionTitleEn: string;
    industriasSectionSubtitleEs: string;
    industriasSectionSubtitleEn: string;
    industriasSectionMetrics: Array<{ value: string; labelEs: string; labelEn: string }>;
  } = {
    industriasSectionTitleEs: "13 años entregando tecnología en los sectores más exigentes",
    industriasSectionTitleEn: "13 years delivering technology in the most demanding sectors",
    industriasSectionSubtitleEs:
      "Integramos IA, Cloud y Staff Augmentation en un solo aliado con cuenta de resultados. Sin slides genéricos — profundidad de dominio y contratos con SLAs.",
    industriasSectionSubtitleEn:
      "We integrate AI, Cloud and Staff Augmentation in a single partner with accountability. No generic decks — domain depth and SLA-backed contracts.",
    industriasSectionMetrics: [
      {
        value: "7",
        labelEs: "Países con proyectos activos",
        labelEn: "Countries with active projects",
      },
      {
        value: "40%",
        labelEs: "Reducción promedio en costos cloud",
        labelEn: "Average cloud cost reduction",
      },
      {
        value: "5 días",
        labelEs: "Al primer candidato en Staff Augmentation",
        labelEn: "To first Staff Augmentation candidate",
      },
    ],
  };

  const existing = await db
    .select()
    .from(schema.homeContent)
    .where(eq(schema.homeContent.id, "main"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.homeContent).values({ id: "main", ...defaults });
    console.log("[OK] inserted home_content 'main' row with section defaults");
    return;
  }

  const row = existing[0];
  const patch: Partial<typeof defaults> = {};
  (Object.keys(defaults) as Array<keyof typeof defaults>).forEach((k) => {
    const current = row[k as keyof typeof row];
    const isEmpty =
      current === null ||
      current === undefined ||
      current === "" ||
      (Array.isArray(current) && current.length === 0);
    if (isEmpty) (patch as Record<string, unknown>)[k] = defaults[k];
  });

  if (Object.keys(patch).length === 0) {
    console.log("[OK] industrias section fields already set — nothing to do");
    return;
  }

  await db
    .update(schema.homeContent)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(schema.homeContent.id, "main"));

  console.log(`[OK] backfilled fields: ${Object.keys(patch).join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
