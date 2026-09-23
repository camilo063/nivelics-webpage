/**
 * Última pasada de la limpieza de cifras: las superficies que faltaban.
 *
 *  A-1 / M-2  `servicios.desarrollo-digital`: `metrics[0].value` decía «13+» al lado de la
 *             banda de la misma página que ya dice 14+, y el `seoDescription` (o sea la
 *             meta description y el og:description de ES y EN) decía «13 años».
 *  A-4        `nav_config.megaMenu`: el ítem de Historia decía «13 años construyendo
 *             tecnología en LATAM», en la cabecera de todas las rutas.
 *  A-5        Landings: el «40% de ahorro» sobrevivía en `finops-aws`,
 *             `staffing-vs-contratar` y `staff-augmentation-colombia` (metaTitle,
 *             metaDescription, h1, subtítulo, métricas y el resultado del caso), y el
 *             «13+ años» en el trust badge de cinco landings.
 *  M-4        `industrias.medios-entretenimiento`: una métrica citaba como fuente
 *             «Nivelics benchmark con clientes en medios», que no es una fuente externa.
 *  B-4        `casos_exito.cronica.titleEn` perdía el nombre del cliente, a diferencia de
 *             los otros seis casos.
 *
 * Idempotente: compara y solo escribe lo que difiere.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-resto.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-resto.ts
 *   node --import tsx scripts/seed-limpiar-cifras-resto.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { casosExito, industrias, landingPages, navConfig, servicios } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

function distinto(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

/** Reemplazos de texto que se aplican a cualquier string anidado de una fila. */
type Regla = [RegExp, string];

function reemplazar<T>(value: T, reglas: Regla[]): T {
  if (typeof value === "string") {
    let out: string = value;
    for (const [re, to] of reglas) out = out.replace(re, to);
    return out as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => reemplazar(v, reglas)) as T;
  if (value && typeof value === "object" && !(value instanceof Date))
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, reemplazar(v, reglas)]),
    ) as T;
  return value;
}

// ─── A-1 / M-2 ───────────────────────────────────────────
const DESARROLLO_DIGITAL: Regla[] = [
  // `reemplazar()` recorre los strings sueltos del objeto, no su JSON: el patrón no puede
  // llevar las comillas. Con ellas nunca casaba y el valor se quedó en «13+».
  [/^13\+$/g, "14+"],
  [/\b13 años de proyectos\b/g, "14 años de proyectos"],
  [/\b13 years of projects\b/g, "14 years of projects"],
];

// ─── A-4 ─────────────────────────────────────────────────
const NAV: Regla[] = [
  [/\b13 años construyendo tecnología\b/g, "14 años construyendo tecnología"],
  [/\b13 years building technology\b/g, "14 years building technology"],
];

// ─── A-5 ─────────────────────────────────────────────────
const LANDINGS: Regla[] = [
  // Antigüedad. En el trust badge va pegada a la palabra; en las métricas de dos landings
  // va sola en `valor`, con el texto en `label` aparte, así que hace falta el patrón exacto.
  [/\b13\+ años\b/g, "14+ años"],
  [/\b13\+ years\b/g, "14+ years"],
  [/^13\+$/g, "14+"],
  // finops-aws: el «hasta un 40%» que ya se quitó del resto del sitio.
  [
    /FinOps AWS \| Reduce tu Factura Cloud hasta 40% \| Nivelics/g,
    "FinOps AWS | Optimiza tu factura cloud | Nivelics",
  ],
  [
    /Reduce tu factura de AWS hasta un 40% en 6 semanas\./g,
    "Sabemos dónde se va tu factura de AWS. En 6 semanas te lo mostramos.",
  ],
  [/Reducción promedio en gasto cloud/g, "Pagas sobre el ahorro logrado"],
  // staffing-vs-contratar
  [
    /Antes de pagar un recruiter y esperar 3 meses, compara los costos reales\. Spoiler: la diferencia es del 40%\./g,
    "Antes de pagar un recruiter y esperar 3 meses, compara los costos reales y decide con números tuyos.",
  ],
  [/Ahorro promedio vs\. contratar en USA/g, "Garantía de reemplazo sin costo adicional"],
  [
    /3 ingenieros senior en 10 días\. -40% vs\. su costo local anterior\./g,
    "3 ingenieros senior integrados en 10 días, sin proceso de reclutamiento propio.",
  ],
  // staff-augmentation-colombia
  [
    /Candidatos en 5 días hábiles\. -40% vs\. costos USA\. Great Place to Work 2022\./g,
    "Candidatos en 5 días hábiles, con garantía de reemplazo. Great Place to Work 2022.",
  ],
  [/Ahorro vs\. contratar en USA o Europa/g, "Garantía de reemplazo sin costo"],
  [
    /-40% en costos de desarrollo\. Equipo escalado en 10 días\./g,
    "Equipo escalado en 10 días, sin abrir un proceso de contratación local.",
  ],
];

/** Las métricas que quedan sin etiqueta coherente tras cambiar el label. */
const VALORES_METRICA: Record<string, string> = {
  "Pagas sobre el ahorro logrado": "Success fee",
  "Garantía de reemplazo sin costo adicional": "30 días",
  "Garantía de reemplazo sin costo": "30 días",
};

/** Ajusta el valor de las métricas cuya etiqueta se acaba de reescribir. */
function ajustarMetricas<T>(value: T): T {
  if (Array.isArray(value)) return value.map(ajustarMetricas) as T;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.label === "string" && VALORES_METRICA[obj.label]) {
      return { ...obj, valor: VALORES_METRICA[obj.label] } as T;
    }
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, ajustarMetricas(v)])) as T;
  }
  return value;
}

function limpiarLanding<T extends Record<string, unknown>>(row: T): Partial<T> {
  const patch: Record<string, unknown> = {};
  for (const campo of ["metaTitle", "metaDescription", "blocks"] as const) {
    if (!(campo in row)) continue;
    let limpio = reemplazar(row[campo], LANDINGS);
    if (campo === "blocks") limpio = ajustarMetricas(limpio);
    if (distinto(row[campo], limpio)) patch[campo] = limpio;
  }
  return patch as Partial<T>;
}

// ─── M-4 ─────────────────────────────────────────────────
const FUENTE_SIN_RESPALDO = "Nivelics benchmark con clientes en medios";

function limpiarIndustria(row: Record<string, unknown>): Record<string, unknown> {
  const stats = row.statHighlights as Array<Record<string, unknown>> | null;
  if (!stats?.some((s) => s.source === FUENTE_SIN_RESPALDO)) return {};
  // Sin fuente externa la cifra no se publica: se quita la métrica entera.
  return { statHighlights: stats.filter((s) => s.source !== FUENTE_SIN_RESPALDO) };
}

// ─── B-4 ─────────────────────────────────────────────────
const CRONICA_TITLE_EN = "Crónica: News Platform Modernization";

function applyToFallbacks(): void {
  const dir = join(process.cwd(), "data/fallbacks");
  const leer = (f: string) => JSON.parse(readFileSync(join(dir, f), "utf8"));
  const guardar = (f: string, d: unknown) =>
    writeFileSync(join(dir, f), JSON.stringify(d, null, 2) + "\n");

  const svc = leer("servicios.json") as Array<Record<string, unknown>>;
  const dd = svc.find((r) => r.slugEs === "desarrollo-digital");
  if (dd) {
    const limpio = reemplazar(dd, DESARROLLO_DIGITAL);
    if (distinto(dd, limpio)) {
      Object.assign(dd, limpio);
      guardar("servicios.json", svc);
      console.log("✓ servicios.json: desarrollo-digital a 14+");
    } else console.log("• servicios.json: desarrollo-digital ya estaba al día");
  }

  const nav = leer("nav_config.json") as Array<Record<string, unknown>>;
  const navLimpio = reemplazar(nav, NAV);
  if (distinto(nav, navLimpio)) {
    guardar("nav_config.json", navLimpio);
    console.log("✓ nav_config.json: mega-menú a 14 años");
  } else console.log("• nav_config.json: el mega-menú ya estaba al día");

  const lps = leer("landing_pages.json") as Array<Record<string, unknown>>;
  let n = 0;
  for (const lp of lps) {
    const patch = limpiarLanding(lp);
    if (!Object.keys(patch).length) continue;
    Object.assign(lp, patch);
    n++;
  }
  if (n) {
    guardar("landing_pages.json", lps);
    console.log(`✓ landing_pages.json: ${n} landing(s)`);
  } else console.log("• landing_pages.json: ya estaban al día");

  const inds = leer("industrias.json") as Array<Record<string, unknown>>;
  let m = 0;
  for (const ind of inds) {
    const patch = limpiarIndustria(ind);
    if (!Object.keys(patch).length) continue;
    Object.assign(ind, patch);
    m++;
  }
  if (m) {
    guardar("industrias.json", inds);
    console.log(`✓ industrias.json: ${m} industria(s)`);
  } else console.log("• industrias.json: ya estaban al día");

  const casos = leer("casos_exito.json") as Array<Record<string, unknown>>;
  const cronica = casos.find((c) => c.slug === "cronica");
  if (cronica && cronica.titleEn !== CRONICA_TITLE_EN) {
    cronica.titleEn = CRONICA_TITLE_EN;
    guardar("casos_exito.json", casos);
    console.log("✓ casos_exito.json: título EN de Crónica");
  } else console.log("• casos_exito.json: Crónica ya estaba al día");
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

  const [dd] = await db
    .select()
    .from(servicios)
    .where(eq(servicios.slugEs, "desarrollo-digital"))
    .limit(1);
  if (dd) {
    const limpio = reemplazar(dd as unknown as Record<string, unknown>, DESARROLLO_DIGITAL);
    if (!distinto(dd, limpio)) console.log("• desarrollo-digital: ya estaba al día");
    else if (DRY_RUN) console.log("• [dry-run] desarrollo-digital: 13+ → 14+");
    else {
      await db
        .update(servicios)
        .set({
          metrics: (limpio as { metrics: never }).metrics,
          seoDescriptionEs: (limpio as { seoDescriptionEs: string }).seoDescriptionEs,
          seoDescriptionEn: (limpio as { seoDescriptionEn: string }).seoDescriptionEn,
          updatedAt: new Date(),
        })
        .where(eq(servicios.id, dd.id));
      console.log("✓ desarrollo-digital: 13+ → 14+ en metrics y seoDescription");
    }
  }

  const [nav] = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  const navLimpio = nav ? reemplazar(nav.megaMenu, NAV) : null;
  if (!nav || !distinto(nav.megaMenu, navLimpio))
    console.log("• nav_config.megaMenu: ya estaba al día");
  else if (DRY_RUN) console.log("• [dry-run] nav_config.megaMenu: 13 años → 14 años");
  else {
    await db
      .update(navConfig)
      .set({ megaMenu: navLimpio as never, updatedAt: new Date() })
      .where(eq(navConfig.id, "main"));
    console.log("✓ nav_config.megaMenu: 13 años → 14 años");
  }

  for (const lp of await db.select().from(landingPages)) {
    const patch = limpiarLanding(lp as unknown as Record<string, unknown>);
    if (!Object.keys(patch).length) continue;
    if (DRY_RUN) {
      console.log(`• [dry-run] landing ${lp.slug}: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await db
      .update(landingPages)
      .set({ ...(patch as Record<string, never>), updatedAt: new Date() })
      .where(eq(landingPages.id, lp.id));
    console.log(`✓ landing ${lp.slug}: ${Object.keys(patch).join(", ")}`);
  }

  for (const ind of await db.select().from(industrias)) {
    const patch = limpiarIndustria(ind as unknown as Record<string, unknown>);
    if (!Object.keys(patch).length) continue;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${ind.slugEs}: fuente sin respaldo fuera`);
      continue;
    }
    await db
      .update(industrias)
      .set({ ...(patch as Record<string, never>), updatedAt: new Date() })
      .where(eq(industrias.id, ind.id));
    console.log(`✓ ${ind.slugEs}: fuente sin respaldo fuera`);
  }

  const [cronica] = await db
    .select()
    .from(casosExito)
    .where(eq(casosExito.slug, "cronica"))
    .limit(1);
  if (!cronica || cronica.titleEn === CRONICA_TITLE_EN) console.log("• cronica: ya estaba al día");
  else if (DRY_RUN) console.log("• [dry-run] cronica.titleEn");
  else {
    await db
      .update(casosExito)
      .set({ titleEn: CRONICA_TITLE_EN, updatedAt: new Date() })
      .where(eq(casosExito.id, cronica.id));
    console.log("✓ cronica.titleEn");
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
