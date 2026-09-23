/**
 * Quita de `servicios` las cifras que afirman resultados sin fuente.
 *
 * Decisión del dueño (2026-09-21): el sitio no publica porcentajes de ahorro, conteos de
 * proyectos entregados, ratings de tiendas ni SLAs que no existen en contrato. Las páginas
 * ya se limpiaron en código, pero el copy que se ve sale de la BD (`cms?.metrics?.length ?
 * … : fallback`), así que sin esto el cambio no llega al sitio.
 *
 * Qué se conserva: lo verificable o lo que es un compromiso real de servicio —
 * «100% propiedad del código», «100% bilingüe», «0% comisiones», «100% cifrado»,
 * «100% documentado», «13+ años desde 2012», «Monitoreo 24/7» en un servicio que sí se
 * contrata así.
 *
 * Qué se quita: «40% de ahorro vs. contratar en USA», «50+ proyectos entregados»,
 * «4.8 de rating en stores», «99.9% uptime garantizado», «<2s de carga», «30-40% de
 * reducción», «5x-10x ROI», «60% más rápido», «95% compliance», «70% menos costo»,
 * «10x más rápido» y los beneficios que repiten esas cifras.
 *
 * Cuando una banda queda con menos de 3 métricas, se deja VACÍA a propósito: la página
 * entonces usa su bloque cualitativo del código (ver los HIGHLIGHTS de ecommerce,
 * apps-moviles y plataformas-web). Sigue siendo editable desde el admin.
 *
 * También traduce lo que quedaba en español dentro de columnas compartidas: la
 * `seo_description` de 3 servicios que prometía porcentajes de ahorro, la `unit` de las
 * métricas («días») y la `duration` de los pasos de proceso, que se veía en /en.
 *
 * Idempotente. Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-servicios.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-servicios.ts
 *   node --import tsx scripts/seed-limpiar-cifras-servicios.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { servicios } from "@/lib/db/schema/admin";

/** Serializa con las claves ordenadas, para comparar contenido y no orden. */
function estable(value: unknown): string {
  return JSON.stringify(value, (_k, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort())
      : v,
  );
}

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Metric = { value: string; unit: string; labelEs: string; labelEn: string };
type Benefit = { icon: string; titleEs: string; titleEn: string; copyEs: string; copyEn: string };
type Faq = { questionEs: string; questionEn: string; answerEs: string; answerEn: string };
type ProcessStep = {
  number: number;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  duration: string;
  durationEn?: string;
};

/** Métricas a eliminar, identificadas por `value` + comienzo de la etiqueta ES. */
const DROP_METRICS: Record<string, Array<[string, string]>> = {
  "apps-moviles": [
    ["50+", "Apps entregadas"],
    ["4.8", "Rating promedio"],
  ],
  cloud: [["40%", "Ahorro promedio"]],
  "datos-ia": [["40%", "Ahorro promedio"]],
  "desarrollo-digital": [["50+", "Proyectos entregados"]],
  "desarrollo-software": [["40%", "Ahorro promedio"]],
  "devops-cloud": [["40%", "Ahorro promedio"]],
  "diseno-ux-ui": [["40%", "Ahorro promedio"]],
  ecommerce: [
    ["99.9", "Uptime garantizado"],
    ["<2s", "Tiempo de carga"],
  ],
  finops: [
    ["30-40%", "Reducción factura cloud"],
    ["5x-10x", "ROI del proyecto"],
    ["15-30%", "Recursos huérfanos"],
  ],
  infraestructura: [
    ["99.9%", "Disponibilidad"],
    ["50%", "Menos incidentes"],
  ],
  "migracion-aws": [
    ["60%", "Más rápido"],
    ["30%", "Ahorro desde día 1"],
  ],
  "plataformas-web": [
    ["50+", "Plataformas entregadas"],
    ["<2s", "Tiempo de carga"],
    ["99.9%", "Uptime"],
  ],
  "qa-seguridad": [["40%", "Ahorro promedio"]],
  "staff-augmentation": [["40%", "Ahorro promedio"]],
  seguridad: [["95%", "Compliance"]],
  serverless: [
    ["70%", "Menos costo"],
    ["10x", "Más rápido"],
  ],
};

/** Beneficios a reescribir, identificados por su título ES actual. */
const REWRITE_BENEFITS: Record<string, Record<string, Benefit>> = {
  cloud: {
    "30-40% reducción gasto cloud": {
      icon: "hex-chart",
      titleEs: "Menos gasto cloud con gobierno FinOps",
      titleEn: "Lower cloud spend with FinOps governance",
      copyEs: "Visibilidad por equipo y por servicio desde los primeros 90 días",
      copyEn: "Visibility per team and per service from the first 90 days",
    },
    "SLA de uptime 99.9%": {
      icon: "oct-monitor",
      titleEs: "Alta disponibilidad por diseño",
      titleEn: "High availability by design",
      copyEs: "Arquitectura redundante y observabilidad en la operación continua",
      copyEn: "Redundant architecture and observability in continuous operations",
    },
  },
  "staff-augmentation": {
    "40% ahorro vs. USA": {
      icon: "dia-target",
      titleEs: "Costo predecible frente a contratar en USA",
      titleEn: "Predictable cost compared with hiring in the USA",
      copyEs: "Tarifa mensual única, sin salario, prestaciones ni overhead de contratación local",
      copyEn: "A single monthly rate, with no salary, benefits or local hiring overhead",
    },
  },
  "desarrollo-software": {
    "Ahorro hasta 40% vs USA": {
      icon: "dia-target",
      titleEs: "Costo predecible frente a contratar en USA",
      titleEn: "Predictable cost compared with hiring in the USA",
      copyEs:
        "Tarifa mensual única en lugar de salario, prestaciones y overhead de contratación local",
      copyEn: "A single monthly rate instead of salary, benefits and local hiring overhead",
    },
  },
};

/** FAQs a reescribir, identificadas por su pregunta ES actual. */
const REWRITE_FAQS: Record<string, Record<string, Faq>> = {
  cloud: {
    "¿Cuánto puedo ahorrar con FinOps?": {
      questionEs: "¿Cuánto puedo ahorrar con FinOps?",
      questionEn: "How much can I save with FinOps?",
      answerEs:
        "Depende de qué tan optimizada esté hoy tu infraestructura: recursos sin uso, instancias sobredimensionadas, falta de reservas o de autoescalado. La auditoría inicial cuantifica el ahorro posible en tu cuenta antes de comprometer nada.",
      answerEn:
        "It depends on how optimized your infrastructure already is: idle resources, oversized instances, missing reservations or autoscaling. The initial audit quantifies the possible savings in your own account before you commit to anything.",
    },
  },
};

/** SEO descriptions que prometen ahorros sin fuente. */
const REWRITE_SEO: Record<string, { es: string; en: string }> = {
  cloud: {
    es: "AWS, GCP y Azure con gobierno real y FinOps: arquitectura, migración, seguridad y operación continua con los costos bajo control.",
    en: "AWS, GCP and Azure with real governance and FinOps: architecture, migration, security and continuous operations with costs under control.",
  },
  "staff-augmentation": {
    es: "Equipos de ingeniería on-demand con talento senior verificado y bilingüe: candidatos en 5 días hábiles y costo mensual predecible.",
    en: "On-demand engineering teams with verified senior bilingual talent: candidates in 5 business days and a predictable monthly cost.",
  },
  finops: {
    es: "Gobernanza y optimización financiera de la nube: visibilidad por equipo y servicio, y una auditoría inicial que cuantifica el ahorro posible.",
    en: "Cloud financial governance and optimization: visibility per team and service, and an initial audit that quantifies the possible savings.",
  },
};

/** Traducción de las duraciones del proceso, que se veían en español en /en. */
const DURATION_EN: Record<string, string> = {
  "1 semana": "1 week",
  "1–2 semanas": "1–2 weeks",
  "2 semanas": "2 weeks",
  "2–3 semanas": "2–3 weeks",
  "2–4 semanas": "2–4 weeks",
  "3-4 días": "3-4 days",
  "30 min": "30 min",
  Continuo: "Ongoing",
  "Día 5": "Day 5",
  "Día 6-10": "Days 6-10",
  MRR: "MRR",
  "MRR ongoing": "MRR ongoing",
  Mensual: "Monthly",
  Ongoing: "Ongoing",
  "Semana 1": "Week 1",
  "Semana 1-2": "Weeks 1-2",
  "Semana 2": "Week 2",
  "Semana 2-4": "Weeks 2-4",
  "Semana 3-4": "Weeks 3-4",
  "Semana 3-6": "Weeks 3-6",
  "Semana 5-6": "Weeks 5-6",
  "Semana 5-7": "Weeks 5-7",
  "Semana 6-8": "Weeks 6-8",
  "Semanas 2-3": "Weeks 2-3",
  "Semanas 3-N": "Weeks 3-N",
  "Semanas 4-8": "Weeks 4-8",
  "Última semana": "Final week",
};

const MIN_METRICS = 3;

function cleanRow(row: {
  slugEs: string;
  metrics: unknown;
  benefits: unknown;
  faqs?: unknown;
  processSteps?: unknown;
  seoDescriptionEs?: string | null;
  seoDescriptionEn?: string | null;
}) {
  const drops = DROP_METRICS[row.slugEs] ?? [];
  const rewrites = REWRITE_BENEFITS[row.slugEs] ?? {};
  const patch: {
    metrics?: Metric[];
    benefits?: Benefit[];
    faqs?: Faq[];
    processSteps?: ProcessStep[];
    seoDescriptionEs?: string;
    seoDescriptionEn?: string;
  } = {};

  const metrics = (row.metrics as Metric[] | null) ?? [];
  if (drops.length) {
    const kept = metrics.filter(
      (m) => !drops.some(([value, label]) => m.value === value && m.labelEs.startsWith(label)),
    );
    // Menos de 3 se ve pobre en la banda: mejor dejarla vacía y que mande el
    // bloque cualitativo del código.
    const next = kept.length >= MIN_METRICS ? kept : [];
    if (next.length !== metrics.length) patch.metrics = next;
  }

  const faqs = (row.faqs as Faq[] | null) ?? [];
  const faqRewrites = REWRITE_FAQS[row.slugEs] ?? {};
  if (Object.keys(faqRewrites).length) {
    const next = faqs.map((f) => faqRewrites[f.questionEs] ?? f);
    // Compara por contenido: el objeto de reemplazo trae las claves en otro orden que la
    // fila guardada, así que un JSON.stringify directo siempre difería y el modo
    // --fallbacks reescribía el archivo en cada corrida.
    if (estable(next) !== estable(faqs)) patch.faqs = next;
  }

  // `unit` no tiene variante por idioma: si dice «días», en /en se leía «5 días».
  // El label ya nombra la unidad en cada idioma, así que se vacía.
  const metricsNow = (patch.metrics ?? metrics) as Metric[];
  if (metricsNow.some((m) => m.unit && /[áéíóúñ]|días|años|semanas/i.test(m.unit))) {
    patch.metrics = metricsNow.map((m) =>
      m.unit && /[áéíóúñ]|días|años|semanas/i.test(m.unit) ? { ...m, unit: "" } : m,
    );
  }

  const seo = REWRITE_SEO[row.slugEs];
  if (seo) {
    if (row.seoDescriptionEs !== seo.es) patch.seoDescriptionEs = seo.es;
    if (row.seoDescriptionEn !== seo.en) patch.seoDescriptionEn = seo.en;
  }

  const steps = (row.processSteps as ProcessStep[] | null) ?? [];
  if (steps.some((p) => p.duration && DURATION_EN[p.duration] && !p.durationEn)) {
    patch.processSteps = steps.map((p) =>
      p.duration && DURATION_EN[p.duration] && !p.durationEn
        ? { ...p, durationEn: DURATION_EN[p.duration] }
        : p,
    );
  }

  const benefits = (row.benefits as Benefit[] | null) ?? [];
  if (Object.keys(rewrites).length) {
    const next = benefits.map((b) => rewrites[b.titleEs] ?? b);
    if (JSON.stringify(next) !== JSON.stringify(benefits)) patch.benefits = next;
  }

  return Object.keys(patch).length ? patch : null;
}

function describe(slug: string, patch: ReturnType<typeof cleanRow> & object): string {
  const parts: string[] = [];
  if (patch.metrics) {
    parts.push(
      patch.metrics.length === 0 ? "métricas vaciadas" : `${patch.metrics.length} métricas`,
    );
  }
  if (patch.benefits) parts.push("beneficios reescritos");
  if (patch.faqs) parts.push("FAQ reescrita");
  if (patch.processSteps) parts.push("duraciones EN");
  if (patch.seoDescriptionEs || patch.seoDescriptionEn) parts.push("SEO description");
  return `${slug}: ${parts.join(", ")}`;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/servicios.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let changed = 0;
  for (const row of rows) {
    const patch = cleanRow(row as never);
    if (!patch) continue;
    Object.assign(row, patch);
    changed++;
    console.log(`  ${describe(row.slugEs as string, patch)}`);
  }
  if (!changed) {
    console.log("• servicios.json: nada que limpiar");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/servicios.json: ${changed} filas`);
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
  const rows = await db.select().from(servicios);
  let changed = 0;
  for (const row of rows) {
    const patch = cleanRow(row as never);
    if (!patch) continue;
    changed++;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${describe(row.slugEs, patch)}`);
      continue;
    }
    await db
      .update(servicios)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(servicios.id, row.id));
    console.log(`✓ ${describe(row.slugEs, patch)}`);
  }
  console.log(
    changed === 0
      ? "\nNada que limpiar."
      : DRY_RUN
        ? "\nDry-run completo. Corre sin --dry-run para escribir."
        : "\nListo. Corre export-fallbacks.ts y revalida.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
