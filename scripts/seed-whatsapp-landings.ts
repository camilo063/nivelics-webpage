/**
 * Cambia el WhatsApp viejo (310 392 6621) por el oficial (311 214 6459) en los
 * bloques de las landings guardadas en `landing_pages`.
 *
 * El resto del sitio ya sale de `site_config` vía `getContactoSitio()`, pero las
 * landings guardan el número dentro del jsonb de cada bloque (B18, «Footer
 * Mínimo»), así que ninguna fuente única las alcanza: hay que reescribirlas.
 * El valor por defecto de los bloques nuevos vive en `lib/admin/landing-blocks.ts`
 * y ya quedó con el número oficial.
 *
 * Idempotente: solo escribe las filas donde aparece el número viejo.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-whatsapp-landings.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-whatsapp-landings.ts
 *   node --import tsx scripts/seed-whatsapp-landings.ts --fallbacks   (data/fallbacks, sin BD)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

const VIEJO = /573103926621/g;
const NUEVO = "573112146459";

/** Reemplaza el número en cualquier string anidado del jsonb. */
function reemplazar<T>(value: T): T {
  if (typeof value === "string") return value.replace(VIEJO, NUEVO) as T;
  if (Array.isArray(value)) return value.map(reemplazar) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, reemplazar(v)]),
    ) as T;
  return value;
}

function tieneViejo(value: unknown): boolean {
  return JSON.stringify(value ?? null).includes("573103926621");
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/landing_pages.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as unknown[];
  if (!tieneViejo(rows)) {
    console.log("• landing_pages.json: ya no está el número viejo");
    return;
  }
  writeFileSync(file, JSON.stringify(reemplazar(rows), null, 2) + "\n");
  console.log("✓ data/fallbacks/landing_pages.json: WhatsApp oficial");
}

async function main(): Promise<void> {
  if (FALLBACKS) {
    applyToFallbacks();
    process.exit(0);
  }
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }

  const rows = await db.select().from(landingPages);
  let tocadas = 0;
  for (const row of rows) {
    if (!tieneViejo(row.blocks)) continue;
    tocadas++;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slug}: bloques con el WhatsApp viejo`);
      continue;
    }
    await db
      .update(landingPages)
      .set({ blocks: reemplazar(row.blocks), updatedAt: new Date() })
      .where(eq(landingPages.id, row.id));
    console.log(`✓ ${row.slug}: WhatsApp oficial en los bloques`);
  }

  if (!tocadas) console.log(`• ${rows.length} landings revisadas: ninguna traía el número viejo`);
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
