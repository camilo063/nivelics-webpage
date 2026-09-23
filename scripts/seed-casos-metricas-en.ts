/**
 * Llena `casos_exito.metric_{1,2,3}_value_en` y quita de los casos las dos cifras que el
 * dueño mandó retirar del sitio.
 *
 * 1. Valor en inglés. Las etiquetas de las métricas ya eran bilingües, pero el valor era
 *    uno solo, así que en /en se leía «+10 años» debajo de "Long-term partnership" y
 *    «<10 días» debajo de "Team scaled". Solo se traduce el valor que lleva palabras: una
 *    cifra como «25%» o «+100» se queda vacía y el mapper reusa el valor de siempre.
 *
 * 2. Cifras sin respaldo (decisión del dueño, 2026-09-21):
 *    - two-maids: «40% — Ahorro vs contratación USA». Es la misma afirmación que se quitó
 *      de la home y de las páginas de servicio; aquí sobrevivía dentro del caso.
 *    - televisa: «99.9% — Uptime en eventos en vivo». No hay SLA firmado que lo sostenga.
 *    En los dos casos entra una métrica cualitativa que sí describe lo entregado, y se
 *    reescribe el párrafo de resultados, que repetía la cifra en prosa.
 *
 * Las otras cifras de los casos (25%, 85%, 50%, 40% de time-to-market) son resultados
 * atribuidos a un cliente concreto, no promesas del sitio: NO se tocan aquí.
 *
 * Idempotente: compara campo por campo y solo escribe lo que difiere.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-casos-metricas-en.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-casos-metricas-en.ts
 *   node --import tsx scripts/seed-casos-metricas-en.ts --fallbacks   (data/fallbacks, sin BD)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { casosExito } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Campos = Record<string, string>;

const POR_CASO: Record<string, Campos> = {
  pulzo: {
    metric1ValueEn: "10+ years",
    metric2ValueEn: "Millions",
    metric3ValueEn: "Continuous",
  },
  univision: {
    metric1ValueEn: "Embedded",
    metric2ValueEn: "Improved",
  },
  "ab-inbev": {
    metric3ValueEn: "Improved",
  },
  cronica: {
    metric1ValueEn: "High traffic",
    metric2ValueEn: "AI",
  },
  "two-maids": {
    metric1ValueEn: "<10 days",
    // Sustituye el «40% — Ahorro vs contratación USA».
    metric2Value: "Senior",
    metric2ValueEn: "Senior",
    metric2LabelEs: "Ingenieros integrados al equipo del cliente",
    metric2LabelEn: "Engineers embedded in the client's team",
    resultsEs:
      "Equipo escalado en menos de 10 días, ingenieros senior integrados al equipo de Two Maids y una plataforma que gestiona más de 100 franquicias.",
    resultsEn:
      "Team scaled in under 10 days, senior engineers embedded in the Two Maids team and a platform that manages more than 100 franchises.",
  },
  televisa: {
    metric1ValueEn: "Millions",
    // Sustituye el «99.9% — Uptime en eventos en vivo».
    metric2Value: "En vivo",
    metric2ValueEn: "Live",
    metric2LabelEs: "Arquitectura para picos de eventos en directo",
    metric2LabelEn: "Architecture built for live event traffic",
    resultsEs:
      "Plataforma escalable a millones de usuarios, preparada para los picos de tráfico de eventos noticiosos en vivo, y 40% más rápido en time-to-market.",
    resultsEn:
      "A platform that scales to millions of users, built for the traffic peaks of live news events, and 40% faster time-to-market.",
  },
};

/** Solo los campos que difieren de lo que ya está guardado. */
function diff(row: Record<string, unknown>, esperado: Campos): Campos {
  const patch: Campos = {};
  for (const [k, v] of Object.entries(esperado)) {
    if ((row[k] ?? "") !== v) patch[k] = v;
  }
  return patch;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/casos_exito.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let tocadas = 0;
  for (const row of rows) {
    const esperado = POR_CASO[row.slug as string];
    if (!esperado) continue;
    const patch = diff(row, esperado);
    if (!Object.keys(patch).length) continue;
    Object.assign(row, patch);
    tocadas++;
  }
  if (!tocadas) {
    console.log("• casos_exito.json: ya estaba al día");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/casos_exito.json: ${tocadas} caso(s)`);
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

  for (const [slug, esperado] of Object.entries(POR_CASO)) {
    const [row] = await db.select().from(casosExito).where(eq(casosExito.slug, slug)).limit(1);
    if (!row) {
      console.warn(`⚠ no existe el caso '${slug}'`);
      continue;
    }
    const patch = diff(row as unknown as Record<string, unknown>, esperado);
    if (!Object.keys(patch).length) {
      console.log(`• ${slug}: ya estaba al día`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`• [dry-run] ${slug}: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await db
      .update(casosExito)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(casosExito.id, row.id));
    console.log(`✓ ${slug}: ${Object.keys(patch).join(", ")}`);
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
