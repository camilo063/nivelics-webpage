/**
 * Quita de las páginas de industria y de las landings las cifras retiradas: las promesas
 * de uptime sin SLA firmado y el ahorro cloud del 30–40%.
 *
 * El dueño confirmó (2026-09-21) que no hay SLA de disponibilidad comprometido con
 * clientes, así que «99.95%», «99.9%» y «99.5%» no se pueden publicar como resultado.
 * Aparecían en tres páginas de industria y en una landing.
 *
 * Lo que entra en su lugar describe la arquitectura o el servicio, que sí es verificable:
 * alta disponibilidad por diseño, success fee sobre el ahorro. El hecho se conserva, la
 * cifra no. En fintech además se corrige «13 años» a 14+, que es lo que va desde 2012.
 *
 * Las demás métricas de industria (conversión, on-time delivery, costo por contacto…) son
 * afirmaciones aparte, todavía sin revisar por el dueño: NO se tocan aquí.
 *
 * Idempotente: solo escribe donde todavía está la cifra.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-uptime.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-uptime.ts
 *   node --import tsx scripts/seed-limpiar-uptime.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { industrias, landingPages } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Metric = { value: string; valueEn?: string; labelEs: string; labelEn: string };

// `valueEn` va aquí también: si no, una reejecución desde cero en la que este script corra
// DESPUÉS de seed-industrias-idioma.ts reemplazaba la métrica por un objeto sin el valor en
// inglés, y /en volvía a mostrar «Alta» y «Picos». Con esto el orden deja de importar.
const REEMPLAZO: Record<string, Metric> = {
  manufactura: {
    value: "Alta",
    valueEn: "High",
    labelEs: "Disponibilidad de la plataforma MES por diseño de arquitectura",
    labelEn: "MES platform availability by architectural design",
  },
  "retail-ecommerce": {
    value: "Picos",
    valueEn: "Peaks",
    labelEs: "Arquitectura dimensionada para Black Friday y Hot Sale",
    labelEn: "Architecture sized for Black Friday and Hot Sale peaks",
  },
  fintech: {
    value: "Alta",
    valueEn: "High",
    labelEs: "Disponibilidad en sistemas de pago por diseño de arquitectura",
    labelEn: "Payment system availability by architectural design",
  },
};

/**
 * Otras cifras ya retiradas del resto del sitio que sobrevivían en una industria.
 * Se indexan por la etiqueta en español, que es lo que identifica la métrica.
 */
const POR_ETIQUETA: Record<string, Metric> = {
  "Reducción costo cloud por FinOps": {
    value: "Success fee",
    labelEs: "FinOps cobrado sobre el ahorro efectivamente logrado",
    labelEn: "FinOps billed on the savings actually achieved",
  },
  "Incidentes de exposición de datos en 13 años": {
    value: "0",
    labelEs: "Incidentes de exposición de datos desde 2012",
    labelEn: "Data exposure incidents since 2012",
  },
};

/** ¿La métrica es la promesa de uptime que hay que reemplazar? */
function esUptime(m: Metric): boolean {
  return /uptime/i.test(`${m.labelEs} ${m.labelEn}`) || /^99\.\d+%$/.test(m.value);
}

function limpiarMetrics(slug: string, metrics: unknown): Metric[] | null {
  const lista = (metrics as Metric[] | null) ?? [];
  const nuevo = REEMPLAZO[slug];
  const salida = lista.map((m) => {
    if (nuevo && esUptime(m)) return nuevo;
    return POR_ETIQUETA[m.labelEs] ?? m;
  });
  return JSON.stringify(salida) === JSON.stringify(lista) ? null : salida;
}

/** El texto de la landing repetía el uptime de Televisa en prosa, ES y EN. */
const TEXTO: Array<[RegExp, string]> = [
  [
    /millones de usuarios, 99\.9% de uptime en eventos en vivo y 40% menos time-to-market/g,
    "millones de usuarios, picos de tráfico en eventos en vivo y 40% menos time-to-market",
  ],
  [
    /millions of users, 99\.9% uptime during live events and 40% faster time-to-market/g,
    "millions of users, live-event traffic peaks and 40% faster time-to-market",
  ],
  [
    /99\.9% de uptime en eventos en vivo y plataforma escalable a millones de usuarios/g,
    "Plataforma escalable a millones de usuarios, preparada para picos de eventos en vivo",
  ],
  [
    /99\.9% uptime during live events and a platform scaling to millions of users/g,
    "A platform that scales to millions of users, built for live-event traffic peaks",
  ],
  // La misma afirmación de ahorro que se retiró del resto del sitio.
  [
    /Compara costos reales: contratar en USA vs\. staff augmentation nearshore\. 40% de ahorro, 5 días para candidatos, garantía de reemplazo\./g,
    "Compara costos reales: contratar en USA vs. staff augmentation nearshore. Primer candidato en 5 días y garantía de reemplazo.",
  ],
];

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

function cambio(antes: unknown, despues: unknown): boolean {
  return JSON.stringify(antes) !== JSON.stringify(despues);
}

function applyToFallbacks(): void {
  const indFile = join(process.cwd(), "data/fallbacks/industrias.json");
  const inds = JSON.parse(readFileSync(indFile, "utf8")) as Array<Record<string, unknown>>;
  let n = 0;
  for (const row of inds) {
    const metrics = limpiarMetrics(row.slugEs as string, row.metrics);
    if (!metrics) continue;
    row.metrics = metrics;
    n++;
  }
  if (n) {
    writeFileSync(indFile, JSON.stringify(inds, null, 2) + "\n");
    console.log(`✓ data/fallbacks/industrias.json: ${n} industria(s)`);
  } else {
    console.log("• industrias.json: ya estaba al día");
  }

  const lpFile = join(process.cwd(), "data/fallbacks/landing_pages.json");
  const lps = JSON.parse(readFileSync(lpFile, "utf8")) as unknown[];
  const limpias = limpiarTexto(lps);
  if (cambio(lps, limpias)) {
    writeFileSync(lpFile, JSON.stringify(limpias, null, 2) + "\n");
    console.log("✓ data/fallbacks/landing_pages.json: uptime y 40% fuera");
  } else {
    console.log("• landing_pages.json: ya estaba al día");
  }
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
    const metrics = limpiarMetrics(row.slugEs, row.metrics);
    if (!metrics) {
      console.log(`• ${row.slugEs}: sin cifras retiradas`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slugEs}: métrica retirada → cualitativa`);
      continue;
    }
    await db
      .update(industrias)
      .set({ metrics, updatedAt: new Date() })
      .where(eq(industrias.id, row.id));
    console.log(`✓ ${row.slugEs}: métrica retirada → cualitativa`);
  }

  for (const row of await db.select().from(landingPages)) {
    const blocks = limpiarTexto(row.blocks);
    const meta = limpiarTexto(row.metaDescription);
    if (!cambio(row.blocks, blocks) && !cambio(row.metaDescription, meta)) continue;
    if (DRY_RUN) {
      console.log(`• [dry-run] landing ${row.slug}: uptime / 40% fuera`);
      continue;
    }
    await db
      .update(landingPages)
      .set({ blocks, metaDescription: meta, updatedAt: new Date() })
      .where(eq(landingPages.id, row.id));
    console.log(`✓ landing ${row.slug}: uptime / 40% fuera`);
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
