/**
 * Quita las cifras sin respaldo que quedaban fuera de la tabla `servicios`.
 *
 * `scripts/seed-limpiar-cifras-servicios.ts` solo toca esa tabla, así que la home y el hub
 * de servicios seguían publicando «40% de ahorro vs. contratar en USA» y «50+ proyectos
 * entregados» — las dos afirmaciones que el dueño mandó quitar.
 *
 *  1. `home_content.metrics`: fuera el 40% y el 50+. Entran dos datos que sí se pueden
 *     contar: las líneas de servicio y los servicios publicados.
 *  2. `home_content.industriasSectionMetrics`: fuera «40% de reducción promedio en costos».
 *  3. `home_content.faqs`: la respuesta de precios prometía «ahorro promedio del 40%».
 *  4. `servicios.hub_metrics` (fila `servicios`): fuera el 40%, y «13+ años» pasa a 14+,
 *     que es lo que va de 2012 a hoy. La home ya decía 14+ y las dos cifras convivían.
 *  5. `home_content.industriasHubStat*` y `industriasSectionTitle*`: decían «13 años
 *     entregando tecnología» en la misma página donde la banda dice 14+.
 *
 * Idempotente. Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-home.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-home.ts
 *   node --import tsx scripts/seed-limpiar-cifras-home.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { homeContent, servicios } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Metric = { value: string; unit?: string; labelEs: string; labelEn: string };
type HubMetric = { value: string; labelEs: string; labelEn: string };
type Faq = { questionEs: string; questionEn: string; answerEs: string; answerEn: string };

/** Sustitutos contables: 4 líneas de servicio y 23 servicios publicados en el sitemap. */
const HOME_METRICS: Metric[] = [
  {
    value: "14+",
    unit: "",
    labelEs: "Años — Fundados en 2012",
    labelEn: "Years — Founded in 2012",
  },
  {
    value: "7+",
    unit: "",
    labelEs: "Países — Colombia, USA, México y más",
    labelEn: "Countries — Colombia, USA, Mexico and more",
  },
  {
    value: "4",
    unit: "",
    labelEs: "Líneas de servicio integradas",
    labelEn: "Integrated service lines",
  },
  {
    value: "23",
    unit: "",
    labelEs: "Servicios especializados publicados",
    labelEn: "Specialized services published",
  },
];

const INDUSTRIAS_METRICS: HubMetric[] = [
  {
    value: "7",
    labelEs: "Países con proyectos activos",
    labelEn: "Countries with active projects",
  },
  {
    value: "4",
    labelEs: "Líneas de servicio integradas",
    labelEn: "Integrated service lines",
  },
  {
    value: "5 días",
    labelEs: "Al primer candidato en Staff Augmentation",
    labelEn: "To first Staff Augmentation candidate",
  },
];

const HUB_METRICS: HubMetric[] = [
  { value: "23", labelEs: "Soluciones especializadas", labelEn: "Specialized solutions" },
  { value: "14+", labelEs: "Años de experiencia", labelEn: "Years of experience" },
  {
    value: "7",
    labelEs: "Países con proyectos activos",
    labelEn: "Countries with active projects",
  },
];

const PRICING_FAQ = {
  es: "Los precios varían según el servicio. Staff Augmentation tiene un modelo mensual por recurso, con una tarifa única y predecible en lugar de salario, prestaciones y overhead de contratación. Cloud y FinOps combinan fee fijo y success fee sobre el ahorro logrado. IA aplicada varía según el alcance: en el discovery definimos alcance, arquitectura y costo.",
  en: "Pricing depends on the service. Staff Augmentation works on a monthly per-resource model, with a single predictable rate instead of salary, benefits and hiring overhead. Cloud and FinOps combine a fixed fee with a success fee on the savings achieved. Applied AI depends on scope: in discovery we define scope, architecture and cost.",
};

/** Textos largos de la home donde vivía «13 años»; la antigüedad son 14+ desde 2012. */
const CAMPOS_ANIOS = {
  industriasHubStatEs: 1,
  industriasHubStatEn: 1,
  industriasSectionTitleEs: 1,
  industriasSectionTitleEn: 1,
} as const;

function cleanHome(
  row: {
    metrics?: unknown;
    industriasSectionMetrics?: unknown;
    faqs?: unknown;
  } & Record<string, unknown>,
): Record<string, unknown> | null {
  const patch: Record<string, unknown> = {};
  const metrics = (row.metrics as Metric[] | null) ?? [];
  if (metrics.some((m) => m.value === "40%" || m.value === "50+")) patch.metrics = HOME_METRICS;

  const ind = (row.industriasSectionMetrics as HubMetric[] | null) ?? [];
  if (ind.some((m) => m.value === "40%")) patch.industriasSectionMetrics = INDUSTRIAS_METRICS;

  const faqs = (row.faqs as Faq[] | null) ?? [];
  if (faqs.some((f) => f.answerEs?.includes("40%"))) {
    patch.faqs = faqs.map((f) =>
      f.answerEs?.includes("40%")
        ? { ...f, answerEs: PRICING_FAQ.es, answerEn: PRICING_FAQ.en }
        : f,
    );
  }
  for (const campo of Object.keys(CAMPOS_ANIOS)) {
    const valor = row[campo];
    if (typeof valor !== "string") continue;
    const nuevo = valor.replace(/\b13 años\b/g, "14 años").replace(/\b13 years\b/g, "14 years");
    if (nuevo !== valor) patch[campo] = nuevo;
  }

  return Object.keys(patch).length ? patch : null;
}

function cleanHub(row: { hubMetrics?: unknown }): Record<string, unknown> | null {
  const hub = (row.hubMetrics as HubMetric[] | null) ?? [];
  if (!hub.length) return null;
  const needsFix = hub.some((m) => m.value === "40%" || m.value === "13+" || m.value === "19+");
  return needsFix ? { hubMetrics: HUB_METRICS } : null;
}

function applyToFallbacks(): void {
  const homeFile = join(process.cwd(), "data/fallbacks/home_content.json");
  const homeRows = JSON.parse(readFileSync(homeFile, "utf8")) as Array<Record<string, unknown>>;
  let homeChanged = 0;
  for (const row of homeRows) {
    const patch = cleanHome(row);
    if (!patch) continue;
    Object.assign(row, patch);
    homeChanged++;
  }
  if (homeChanged) {
    writeFileSync(homeFile, JSON.stringify(homeRows, null, 2) + "\n");
    console.log(`✓ data/fallbacks/home_content.json: ${homeChanged} fila(s)`);
  } else {
    console.log("• home_content.json: nada que limpiar");
  }

  const svcFile = join(process.cwd(), "data/fallbacks/servicios.json");
  const svcRows = JSON.parse(readFileSync(svcFile, "utf8")) as Array<Record<string, unknown>>;
  const hub = svcRows.find((r) => r.slugEs === "servicios");
  const hubPatch = hub ? cleanHub(hub) : null;
  if (hubPatch && hub) {
    Object.assign(hub, hubPatch);
    writeFileSync(svcFile, JSON.stringify(svcRows, null, 2) + "\n");
    console.log("✓ data/fallbacks/servicios.json: hub_metrics");
  } else {
    console.log("• servicios.json: hub_metrics ya estaba");
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

  const homeRows = await db.select().from(homeContent);
  for (const row of homeRows) {
    const patch = cleanHome(row as never);
    if (!patch) {
      console.log(`• home_content ${row.id}: nada que limpiar`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`• [dry-run] home_content ${row.id}: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await db
      .update(homeContent)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(homeContent.id, row.id));
    console.log(`✓ home_content ${row.id}: ${Object.keys(patch).join(", ")}`);
  }

  const [hub] = await db.select().from(servicios).where(eq(servicios.slugEs, "servicios")).limit(1);
  const hubPatch = hub ? cleanHub(hub as never) : null;
  if (!hubPatch) {
    console.log("• servicios.hub_metrics: nada que limpiar");
  } else if (DRY_RUN) {
    console.log("• [dry-run] servicios.hub_metrics: sin 40%, años a 14+");
  } else {
    await db
      .update(servicios)
      .set({ ...hubPatch, updatedAt: new Date() })
      .where(eq(servicios.id, hub!.id));
    console.log("✓ servicios.hub_metrics: sin 40%, años a 14+");
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
