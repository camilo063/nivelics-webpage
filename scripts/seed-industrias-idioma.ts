/**
 * Dos arreglos en la tabla `industrias`, los dos visibles en el sitio publicado:
 *
 * 1. Valor en inglés de las métricas. `metrics[].value` era uno solo para los dos idiomas,
 *    así que /en/industries/fintech mostraba «5 días» debajo de "To the first senior
 *    engineer integrated". Se llena `valueEn` solo donde el valor lleva palabras; «25%» o
 *    «<100ms» se quedan sin traducir, que es lo correcto.
 *
 * 2. Cifras ya retiradas del resto del sitio que sobrevivían en el texto largo: «13 años»
 *    (la antigüedad son 14+ desde 2012) y el «SLA 99.95%» del caso Televisa, que no
 *    corresponde a ningún SLA firmado.
 *
 * Idempotente: compara y solo escribe lo que difiere.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-industrias-idioma.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-industrias-idioma.ts
 *   node --import tsx scripts/seed-industrias-idioma.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { industrias } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Metric = { value: string; valueEn?: string; labelEs: string; labelEn: string };

/** Traducción del valor, por el valor en español tal como está guardado. */
const VALOR_EN: Record<string, string> = {
  "5 días": "5 days",
  "7 países": "7 countries",
  Alta: "High",
  Picos: "Peaks",
};

/** Reemplazos de texto largo, aplicados a cualquier campo string de la fila. */
const TEXTO: Array<[RegExp, string]> = [
  [/\bEn 13 años\b/g, "Desde 2012"],
  [/\bIn 13 years\b/g, "Since 2012"],
  [/\ben 13 años\b/g, "desde 2012"],
  [/\bin 13 years\b/g, "since 2012"],
  [/\b13 años entregando\b/g, "14 años entregando"],
  [/\b13 years delivering\b/g, "14 years delivering"],
  [
    /Caso Televisa\/N\+: millones de usuarios activos, SLA 99\.95%\./g,
    "Caso Televisa/N+: millones de usuarios activos y picos de eventos en vivo absorbidos.",
  ],
  [
    /Televisa\/N\+ Case: millions of active users, 99\.95% SLA\./g,
    "Televisa/N+ case: millions of active users and live-event peaks absorbed.",
  ],
];

/**
 * Campos que NO se recorren buscando texto: identificadores y fechas. El resto de la fila
 * sí, porque las frases retiradas viven repartidas en varios jsonb (`useCases`,
 * `industryFaqs`, `solutions`…) y una lista blanca ya se quedó corta una vez.
 */
const CAMPOS_EXCLUIDOS = new Set([
  "id",
  "slugEs",
  "slugEn",
  "casoDestacadoId",
  "createdAt",
  "updatedAt",
  "deletedAt",
]);

function limpiarTexto<T>(value: T): T {
  if (typeof value === "string") {
    let out: string = value;
    for (const [re, to] of TEXTO) out = out.replace(re, to);
    return out as unknown as T;
  }
  if (Array.isArray(value)) return value.map(limpiarTexto) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, limpiarTexto(v)]),
    ) as T;
  return value;
}

function distinto(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

/** Devuelve solo los campos de la fila que hay que reescribir. */
function patchDe(row: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  const metrics = (row.metrics as Metric[] | null) ?? [];
  const nuevas = metrics.map((m) => {
    const en = VALOR_EN[m.value];
    return en && m.valueEn !== en ? { ...m, valueEn: en } : m;
  });
  if (distinto(metrics, nuevas)) patch.metrics = nuevas;

  for (const [campo, valor] of Object.entries(row)) {
    if (CAMPOS_EXCLUIDOS.has(campo) || campo === "metrics" || valor instanceof Date) continue;
    const limpio = limpiarTexto(valor);
    if (distinto(valor, limpio)) patch[campo] = limpio;
  }
  return patch;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/industrias.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let tocadas = 0;
  for (const row of rows) {
    const patch = patchDe(row);
    if (!Object.keys(patch).length) continue;
    Object.assign(row, patch);
    tocadas++;
  }
  if (!tocadas) {
    console.log("• industrias.json: ya estaba al día");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/industrias.json: ${tocadas} industria(s)`);
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

  for (const row of await db.select().from(industrias)) {
    const patch = patchDe(row as unknown as Record<string, unknown>);
    if (!Object.keys(patch).length) {
      console.log(`• ${row.slugEs}: ya estaba al día`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slugEs}: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await db
      .update(industrias)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(industrias.id, row.id));
    console.log(`✓ ${row.slugEs}: ${Object.keys(patch).join(", ")}`);
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
