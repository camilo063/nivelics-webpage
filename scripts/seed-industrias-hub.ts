/**
 * Adds the 6 hub fields to home_content (ALTER ... ADD COLUMN IF NOT EXISTS) and
 * seeds default ES/EN copy on the existing 'main' row (or inserts it).
 *
 * Idempotent: safe to re-run. Will only update fields that are NULL/empty.
 *
 *   DATABASE_URL="..." npx tsx scripts/seed-industrias-hub.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  // 1) Add columns if missing.
  await db.execute(sql`
    ALTER TABLE "home_content"
      ADD COLUMN IF NOT EXISTS "industrias_hub_title_es" text,
      ADD COLUMN IF NOT EXISTS "industrias_hub_title_en" text,
      ADD COLUMN IF NOT EXISTS "industrias_hub_subtitle_es" text,
      ADD COLUMN IF NOT EXISTS "industrias_hub_subtitle_en" text,
      ADD COLUMN IF NOT EXISTS "industrias_hub_stat_es" text,
      ADD COLUMN IF NOT EXISTS "industrias_hub_stat_en" text;
  `);
  console.log("[OK] columns ensured on home_content");

  const defaults = {
    industriasHubTitleEs: "Tecnología que entiende tu industria",
    industriasHubTitleEn: "Technology that understands your industry",
    industriasHubSubtitleEs:
      "Cada sector tiene sus propias reglas, regulación y comportamientos de usuario. Traemos el expertise de dominio para que no gastes los primeros 3 meses explicándonos tu negocio.",
    industriasHubSubtitleEn:
      "Each sector has its own rules, regulations and user behaviors. We bring domain expertise so you don't spend the first 3 months explaining your business to us.",
    industriasHubStatEs:
      "13 años entregando tecnología en los sectores más exigentes de LATAM y USA",
    industriasHubStatEn:
      "13 years delivering technology in the most demanding sectors in LATAM and USA",
  };

  // 2) Seed defaults only when NULL (does not overwrite admin edits).
  const existing = await db
    .select()
    .from(schema.homeContent)
    .where(eq(schema.homeContent.id, "main"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.homeContent).values({ id: "main", ...defaults });
    console.log("[OK] inserted home_content 'main' row with hub defaults");
    return;
  }

  const row = existing[0];
  const patch: Partial<typeof defaults> = {};
  (Object.keys(defaults) as Array<keyof typeof defaults>).forEach((k) => {
    if (!row[k]) patch[k] = defaults[k];
  });

  if (Object.keys(patch).length === 0) {
    console.log("[OK] hub fields already set — nothing to do");
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
