/**
 * Quita de la línea de tiempo de /nosotros/historia los conteos de equipo y de proyectos
 * que no tienen fuente, y alinea el número de países con el resto del sitio.
 *
 * Son las mismas afirmaciones que ya se retiraron de la home, del hub de servicios y de
 * los /llms*.txt (decisión del dueño, 2026-09-21): «+20 ingenieros dedicados», «equipo
 * supera las 40 personas», «+200 proyectos entregados» y «+50 ingenieros». La línea de
 * 2026 además decía «8 países» mientras todo lo demás dice 7+.
 *
 * El hito se conserva: lo que se va es la cifra, no el año ni el hecho.
 *
 * Idempotente: se indexa por año y solo escribe si el texto difiere.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-historia.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-historia.ts
 *   node --import tsx scripts/seed-limpiar-cifras-historia.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { historiaItems } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

const POR_ANIO: Record<number, { descriptionEs: string; descriptionEn: string }> = {
  2018: {
    descriptionEs:
      "Lanzamos nuestra línea de staffing premium con ingenieros dedicados por cliente.",
    descriptionEn:
      "We launched our premium staffing line with engineers dedicated to a single client.",
  },
  2020: {
    descriptionEs:
      "Clientes en México, Perú, Chile y Centroamérica. El equipo crece con la operación regional.",
    descriptionEn:
      "Clients in Mexico, Peru, Chile and Central America. The team grows with the regional operation.",
  },
  2025: {
    descriptionEs: "Expansión a Argentina (Crónica), primer cliente del Cono Sur.",
    descriptionEn: "Expansion to Argentina (Crónica), our first Southern Cone client.",
  },
  2026: {
    descriptionEs: "Presencia en 7+ países y consolidación del marco estratégico I+C+S.",
    descriptionEn: "Presence in 7+ countries and consolidation of the I+C+S strategic framework.",
  },
};

function diff(
  row: { descriptionEs?: string | null; descriptionEn?: string | null },
  esperado: { descriptionEs: string; descriptionEn: string },
): Partial<typeof esperado> {
  const patch: Partial<typeof esperado> = {};
  if ((row.descriptionEs ?? "") !== esperado.descriptionEs)
    patch.descriptionEs = esperado.descriptionEs;
  if ((row.descriptionEn ?? "") !== esperado.descriptionEn)
    patch.descriptionEn = esperado.descriptionEn;
  return patch;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/historia_items.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let tocadas = 0;
  for (const row of rows) {
    const esperado = POR_ANIO[row.year as number];
    if (!esperado) continue;
    const patch = diff(row, esperado);
    if (!Object.keys(patch).length) continue;
    Object.assign(row, patch);
    tocadas++;
  }
  if (!tocadas) {
    console.log("• historia_items.json: ya estaba al día");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/historia_items.json: ${tocadas} hito(s)`);
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

  for (const [anio, esperado] of Object.entries(POR_ANIO)) {
    const rows = await db
      .select()
      .from(historiaItems)
      .where(eq(historiaItems.year, Number(anio)));
    if (!rows.length) {
      console.warn(`⚠ no hay hito del año ${anio}`);
      continue;
    }
    for (const row of rows) {
      const patch = diff(row, esperado);
      if (!Object.keys(patch).length) {
        console.log(`• ${anio}: ya estaba al día`);
        continue;
      }
      if (DRY_RUN) {
        console.log(`• [dry-run] ${anio}: ${Object.keys(patch).join(", ")}`);
        continue;
      }
      await db.update(historiaItems).set(patch).where(eq(historiaItems.id, row.id));
      console.log(`✓ ${anio}: ${Object.keys(patch).join(", ")}`);
    }
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
