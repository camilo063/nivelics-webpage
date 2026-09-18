/**
 * Línea «Ingeniería de agentes» en el hub de IA.
 *
 * Qué escribe (todo idempotente, se puede correr dos veces):
 *
 *  1. Hub `inteligencia-artificial`: subtítulo y descripción (tenían un «2» y un «3» sueltos
 *     al final), SEO (el título llevaba «|» y con la plantilla salía «… | … | Nivelics»),
 *     marco de 7 capas, FAQs y beneficios SIN cifras. Vacía `metrics` y `hub_metrics`.
 *  2. Las 4 filas de la línea: `agentes-ia` (se reescribe: pasa de agente de ventas a
 *     ingeniería de agentes) + 3 nuevas: integracion-sistemas-mcp, ia-privada-on-premise,
 *     agentops-gobierno-agentes. La grid del hub lee de esta tabla y solo cae al código si
 *     la consulta vuelve vacía: sin estas filas las páginas existen pero nadie llega a ellas.
 *  3. Las 4 hermanas (agentes-comerciales, automatizacion-procesos, gestion-contenido,
 *     marketing-crm): quita las cifras sin respaldo de métricas, beneficios, FAQs y SEO.
 *     Esas páginas muestran `faqs` de la BD cuando existen, así que limpiar solo el código
 *     no bastaba. Solo se reemplazan los textos listados abajo; el resto de la fila no se toca.
 *  4. `sort_order` de las 8 subpáginas (las 4 de agentes primero).
 *  5. `nav_config.mega_menu`: la columna de IA con las 8 entradas y una métrica sin cifras
 *     de resultados (antes: «50% reducción de costos operativos»).
 *
 * Las páginas de la línea NO leen estas filas (el copy vive en lib/content/agentes.ts); se
 * escriben para que el admin, la grid del hub, /servicios y llms.txt digan lo mismo.
 *
 * Correr:
 *   node --import tsx scripts/seed-servicios-agentes.ts --fallbacks   (solo data/fallbacks, sin BD)
 *   node --env-file=.env.local --import tsx scripts/seed-servicios-agentes.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-servicios-agentes.ts
 * Después:
 *   node --env-file=.env.local --import tsx scripts/export-fallbacks.ts
 */
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { servicios, navConfig } from "@/lib/db/schema/admin";
import {
  AGENT_SERVICES,
  HARNESS_FRAMEWORK,
  IA_HUB,
  type AgentService,
} from "@/lib/content/agentes";

const DRY_RUN = process.argv.includes("--dry-run");
/** Aplica lo mismo sobre data/fallbacks/*.json (sin BD), para que el PR ya los traiga. */
const FALLBACKS = process.argv.includes("--fallbacks");
const HUB_SLUG = "inteligencia-artificial";

type Faq = { questionEs: string; questionEn: string; answerEs: string; answerEn: string };
type Benefit = { icon: string; titleEs: string; titleEn: string; copyEs: string; copyEn: string };

/* ── 1. Hub ──────────────────────────────────────────────────────────────── */

const HUB_PATCH = {
  subtitleEs: IA_HUB.es.subtitle,
  subtitleEn: IA_HUB.en.subtitle,
  descriptionEs: IA_HUB.es.description,
  descriptionEn: IA_HUB.en.description,
  seoTitleEs: IA_HUB.es.seoTitle,
  seoTitleEn: IA_HUB.en.seoTitle,
  seoDescriptionEs: IA_HUB.es.seoDescription,
  seoDescriptionEn: IA_HUB.en.seoDescription,
  ctaPrimaryTextEs: "Ver soluciones",
  ctaPrimaryTextEn: "See our solutions",
  ctaPrimaryUrl: "#sub-services",
  ctaSecondaryTextEs: "Hablar con un experto",
  ctaSecondaryTextEn: "Talk to an expert",
  ctaSecondaryUrl: "/contacto",
  metrics: [],
  hubMetrics: [],
  benefits: IA_HUB.es.principles.slice(0, 3).map((p, i) => ({
    icon: ["oct-scan", "dia-check", "oct-lock"][i],
    titleEs: p,
    titleEn: IA_HUB.en.principles[i],
    copyEs: "",
    copyEn: "",
  })),
  faqs: zipFaqs(IA_HUB.es.faqs, IA_HUB.en.faqs),
  frameworkTitleEs: HARNESS_FRAMEWORK.es.title,
  frameworkTitleEn: HARNESS_FRAMEWORK.en.title,
  frameworkSubtitleEs: HARNESS_FRAMEWORK.es.subtitle,
  frameworkSubtitleEn: HARNESS_FRAMEWORK.en.subtitle,
  frameworkPillars: HARNESS_FRAMEWORK.es.layers.map((l, i) => ({
    letter: l.letter,
    colorClass: "text-ia",
    borderClass: "border-violet-500/20",
    titleEs: l.title,
    titleEn: HARNESS_FRAMEWORK.en.layers[i].title,
    descEs: l.description,
    descEn: HARNESS_FRAMEWORK.en.layers[i].description,
  })),
};

/* ── 2. Las 4 filas de la línea ──────────────────────────────────────────── */

const AGENT_ROWS: Array<{ service: AgentService; icon: string; sortOrder: number }> = [
  { service: AGENT_SERVICES.agentesIa, icon: "dia-pulse", sortOrder: 1 },
  { service: AGENT_SERVICES.mcp, icon: "hex-nodes", sortOrder: 2 },
  { service: AGENT_SERVICES.iaPrivada, icon: "oct-lock", sortOrder: 3 },
  { service: AGENT_SERVICES.agentops, icon: "oct-monitor", sortOrder: 4 },
];

function agentRow({ service, icon, sortOrder }: (typeof AGENT_ROWS)[number]) {
  const { es, en } = service;
  return {
    slugEs: service.slug,
    slugEn: service.path.en.split("/").pop() as string,
    serviceType: "sub" as const,
    accentColor: "ia" as const,
    icon,
    // `title` es la etiqueta de la card del hub y del admin, no el H1 de la página.
    titleEs: es.name,
    titleEn: en.name,
    subtitleEs: es.seoDescription,
    subtitleEn: en.seoDescription,
    descriptionEs: es.subtitle,
    descriptionEn: en.subtitle,
    benefits: es.solutions.map((s, i) => ({
      icon: s.icon,
      titleEs: s.title,
      titleEn: en.solutions[i].title,
      copyEs: s.description,
      copyEn: en.solutions[i].description,
    })),
    processSteps: es.process.map((p, i) => ({
      number: i + 1,
      titleEs: p.title,
      titleEn: en.process[i].title,
      descEs: p.description,
      descEn: en.process[i].description,
      duration: p.duration,
    })),
    metrics: [],
    faqs: zipFaqs(es.faqs, en.faqs),
    ctaPrimaryTextEs: es.ctaPrimary.label,
    ctaPrimaryTextEn: en.ctaPrimary.label,
    ctaPrimaryUrl: "/contacto",
    ctaSecondaryTextEs: es.ctaSecondary.label,
    ctaSecondaryTextEn: en.ctaSecondary.label,
    ctaSecondaryUrl: "#soluciones",
    seoTitleEs: es.seoTitle,
    seoTitleEn: en.seoTitle,
    seoDescriptionEs: es.seoDescription,
    seoDescriptionEn: en.seoDescription,
    sortOrder,
    status: "published" as const,
    translationStatusEn: "complete" as const,
  };
}

/* ── 3. Hermanas: solo los textos con cifras ─────────────────────────────── */

const SIBLING_SORT: Record<string, number> = {
  "agentes-comerciales": 5,
  "automatizacion-procesos": 6,
  "gestion-contenido": 7,
  "marketing-crm": 8,
};

/** FAQ a reemplazar, identificada por su pregunta ES actual en la BD. */
const FAQ_FIXES: Record<string, Record<string, Faq>> = {
  "agentes-comerciales": {
    "¿Se integra con mi CRM actual?": {
      questionEs: "¿Se integra con mi CRM actual?",
      questionEn: "Does it integrate with my current CRM?",
      answerEs:
        "Sí. Tenemos conectores pre-construidos para Odoo, HubSpot, Salesforce y Pipedrive. Para otros CRMs, construimos la integración como parte del proyecto.",
      answerEn:
        "Yes. We have pre-built connectors for Odoo, HubSpot, Salesforce and Pipedrive. For other CRMs, we build the integration as part of the project.",
    },
    "¿En cuánto tiempo veo resultados?": {
      questionEs: "¿Cuándo empiezo a ver resultados?",
      questionEn: "When will I start seeing results?",
      answerEs:
        "El plazo se define en el discovery, según tus canales, tu CRM y el alcance del piloto. Una vez en producción, medimos el impacto en tu pipeline con tus propios datos y ajustamos el scoring a medida que llegan casos reales.",
      answerEn:
        "The timeline is set in discovery, based on your channels, your CRM and the scope of the pilot. Once in production, we measure the impact on your pipeline with your own data and tune the scoring as real cases come in.",
    },
  },
  "automatizacion-procesos": {
    "¿Cuánto tiempo toma implementar la automatización?": {
      questionEs: "¿Cuánto tiempo toma implementar la automatización?",
      questionEn: "How long does it take to implement automation?",
      answerEs:
        "El plazo se define en el discovery: ahí mapeamos el proceso actual, identificamos cuellos de botella y definimos el alcance del MVP.",
      answerEn:
        "The timeline is set in discovery: that is where we map the current process, identify bottlenecks and define the MVP scope.",
    },
    "¿Cómo se mide el ROI de la automatización?": {
      questionEs: "¿Cómo se mide el ROI de la automatización?",
      questionEn: "How is automation ROI measured?",
      answerEs:
        "Medimos tiempo de ejecución, errores, volumen procesado y costo por transacción antes y después, con tus propios datos. Definimos la línea base en el discovery para que el impacto se pueda comparar.",
      answerEn:
        "We measure execution time, errors, volume processed and cost per transaction before and after, with your own data. We set the baseline in discovery so the impact can be compared.",
    },
    "¿Qué pasa con los empleados que hacían esas tareas?": {
      questionEs: "¿Qué pasa con los empleados que hacían esas tareas?",
      questionEn: "What happens to the employees who were doing those tasks?",
      answerEs:
        "La automatización libera a tu equipo de tareas repetitivas para que se enfoquen en trabajo de mayor valor: análisis, estrategia, relaciones con clientes. Tú defines cómo se redistribuye ese tiempo.",
      answerEn:
        "Automation frees your team from repetitive tasks so they can focus on higher-value work: analysis, strategy, client relationships. You decide how that time is redistributed.",
    },
  },
  "gestion-contenido": {
    "¿Cuánto cuesta la generación de contenido con IA?": {
      questionEs: "¿Cuánto cuesta la generación de contenido con IA?",
      questionEn: "What does AI content generation cost?",
      answerEs:
        "El modelo incluye una implementación inicial y un cargo mensual según el volumen de producción. En el discovery definimos el precio según tu volumen y necesidades.",
      answerEn:
        "The model includes an initial implementation and a monthly fee based on production volume. In discovery we set the price according to your volume and needs.",
    },
  },
  "marketing-crm": {
    "¿Cuánto mejora la conversión realmente?": {
      questionEs: "¿Cómo se mide el impacto en la conversión?",
      questionEn: "How is the impact on conversion measured?",
      answerEs:
        "Definimos una línea base con tus datos actuales y comparamos contra ella: tasa de conversión, costo por lead calificado y atribución por touchpoint. El impacto depende de tu volumen actual y de la madurez de tus datos, por eso lo medimos en tu operación y no lo prometemos de antemano.",
      answerEn:
        "We set a baseline with your current data and compare against it: conversion rate, cost per qualified lead and attribution by touchpoint. The impact depends on your current volume and data maturity, which is why we measure it in your operation instead of promising it up front.",
    },
    "¿Necesito mucho historial de datos para empezar?": {
      questionEs: "¿Necesito mucho historial de datos para empezar?",
      questionEn: "Do I need a lot of historical data to get started?",
      answerEs:
        "No necesariamente. En el discovery revisamos el historial de CRM y email marketing que tienes y definimos con qué modelos se puede empezar. Mientras más datos históricos, mejor la predicción.",
      answerEn:
        "Not necessarily. In discovery we review the CRM and email marketing history you have and decide which models you can start with. The more historical data, the better the prediction.",
    },
  },
};

/** Beneficio a reemplazar, identificado por su título ES actual en la BD. */
const BENEFIT_FIXES: Record<string, Record<string, Benefit>> = {
  "automatizacion-procesos": {
    "50% reducción tiempo operativo": {
      icon: "clock",
      titleEs: "Menos tiempo en tareas repetitivas",
      titleEn: "Less time on repetitive tasks",
      copyEs: "Medido contra una línea base con tus propios datos",
      copyEn: "Measured against a baseline built from your own data",
    },
  },
  "gestion-contenido": {
    "10x más volumen de contenido": {
      icon: "arc-doc",
      titleEs: "Más volumen con el mismo equipo",
      titleEn: "More volume with the same team",
      copyEs: "Artículos, landing pages y descripciones optimizados para SEO",
      copyEn: "SEO-optimized articles, landing pages and descriptions",
    },
  },
};

const SEO_FIXES: Record<string, { seoDescriptionEs?: string; seoDescriptionEn?: string }> = {
  "automatizacion-procesos": {
    seoDescriptionEs:
      "Automatizamos procesos en finanzas, RRHH y logística sobre tus sistemas actuales, con registro completo de cada ejecución.",
    seoDescriptionEn:
      "We automate finance, HR and logistics processes on top of your current systems, with a full log of every run.",
  },
};

/* ── helpers ─────────────────────────────────────────────────────────────── */

function zipFaqs(
  es: Array<{ question: string; answer: string }>,
  en: Array<{ question: string; answer: string }>,
): Faq[] {
  return es.map((f, i) => ({
    questionEs: f.question,
    questionEn: en[i].question,
    answerEs: f.answer,
    answerEn: en[i].answer,
  }));
}

async function write(label: string, fn: () => Promise<unknown>): Promise<void> {
  if (DRY_RUN) {
    console.log(`• [dry-run] ${label}`);
    return;
  }
  await fn();
  console.log(`✓ ${label}`);
}

/* ── pasos ───────────────────────────────────────────────────────────────── */

async function seedHub(): Promise<string> {
  const hub = await db!
    .select({ id: servicios.id })
    .from(servicios)
    .where(eq(servicios.slugEs, HUB_SLUG))
    .limit(1);
  if (!hub[0]) throw new Error(`No existe el hub '${HUB_SLUG}' — abortando sin escribir nada.`);
  await write(`hub ${HUB_SLUG}: copy, SEO, marco de 7 capas, FAQs, sin métricas`, () =>
    db!
      .update(servicios)
      .set({ ...HUB_PATCH, updatedAt: new Date() })
      .where(eq(servicios.id, hub[0].id)),
  );
  return hub[0].id;
}

async function seedAgentRows(hubId: string): Promise<void> {
  for (const entry of AGENT_ROWS) {
    const row = agentRow(entry);
    const existing = await db!
      .select({ id: servicios.id })
      .from(servicios)
      .where(eq(servicios.slugEs, row.slugEs))
      .limit(1);
    const payload = { ...row, parentId: hubId, updatedAt: new Date() };
    if (existing[0]) {
      // `publishedAt` no va en el update: una segunda corrida borraría la fecha real.
      await write(`servicios: fila actualizada (${row.slugEs})`, () =>
        db!.update(servicios).set(payload).where(eq(servicios.id, existing[0].id)),
      );
    } else {
      await write(`servicios: fila creada (${row.slugEs})`, () =>
        db!.insert(servicios).values({ ...payload, publishedAt: new Date() }),
      );
    }
  }
}

async function cleanSiblings(): Promise<void> {
  for (const [slug, sortOrder] of Object.entries(SIBLING_SORT)) {
    const found = await db!.select().from(servicios).where(eq(servicios.slugEs, slug)).limit(1);
    const row = found[0];
    if (!row) {
      console.warn(`⚠ no existe '${slug}' — se omite`);
      continue;
    }
    const faqFixes = FAQ_FIXES[slug] ?? {};
    const benefitFixes = BENEFIT_FIXES[slug] ?? {};
    const faqs = (row.faqs ?? []).map((f) => faqFixes[f.questionEs] ?? f);
    const benefits = (row.benefits ?? []).map((b) => benefitFixes[b.titleEs] ?? b);

    const missingFaqs = Object.keys(faqFixes).filter(
      (q) => !(row.faqs ?? []).some((f) => f.questionEs === q),
    );
    for (const q of missingFaqs) {
      console.log(`  · ${slug}: la FAQ «${q}» ya no está en la BD (¿ya se corrigió?)`);
    }

    await write(
      `${slug}: sin métricas, ${Object.keys(faqFixes).length} FAQs y ${Object.keys(benefitFixes).length} beneficios corregidos, sort ${sortOrder}`,
      () =>
        db!
          .update(servicios)
          .set({
            metrics: [],
            faqs,
            benefits,
            sortOrder,
            ...(SEO_FIXES[slug] ?? {}),
            updatedAt: new Date(),
          })
          .where(eq(servicios.id, row.id)),
    );
  }
}

type NavItem = Record<string, string>;
type MegaMenuColumn = { url?: string; items?: NavItem[] } & Record<string, unknown>;
type MegaMenuSection = { columns?: MegaMenuColumn[] };

async function seedNav(): Promise<void> {
  const nav = readNav();

  const row = await db!.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  if (!row[0]?.megaMenu) {
    console.warn(
      "⚠ nav_config sin mega_menu — actualizar la columna de IA desde /admin/navegacion",
    );
    return;
  }
  const menu = row[0].megaMenu as MegaMenuSection[];
  const iaColumn = menu
    .flatMap((section) => section.columns ?? [])
    .find((col) => col.url === "/servicios/inteligencia-artificial");
  if (!iaColumn) {
    console.warn("⚠ no se encontró la columna de IA en el mega-menú — actualizarla a mano");
    return;
  }
  iaColumn.items = nav.items;
  Object.assign(iaColumn, nav.column);

  await write("nav_config: columna de IA con 8 entradas y métrica sin cifras de resultados", () =>
    db!
      .update(navConfig)
      .set({ megaMenu: menu, updatedAt: new Date() })
      .where(eq(navConfig.id, "main")),
  );
}

function readNav(): { items: NavItem[]; column: Record<string, string> } {
  return JSON.parse(readFileSync(join(process.cwd(), "lib/content/agentes-nav.json"), "utf8"));
}

/** Mismo resultado que la corrida contra la BD, escrito en los JSON del modo sin BD. */
function applyToFallbacks(): void {
  const serviciosPath = join(process.cwd(), "data/fallbacks/servicios.json");
  const navPath = join(process.cwd(), "data/fallbacks/nav_config.json");
  type Row = Record<string, unknown> & { id: string; slugEs: string };
  const rows = JSON.parse(readFileSync(serviciosPath, "utf8")) as Row[];
  const now = new Date().toISOString();

  const hub = rows.find((r) => r.slugEs === HUB_SLUG);
  if (!hub) throw new Error(`No existe el hub '${HUB_SLUG}' en servicios.json`);
  Object.assign(hub, HUB_PATCH, { updatedAt: now });

  for (const entry of AGENT_ROWS) {
    const row = agentRow(entry);
    const existing = rows.find((r) => r.slugEs === row.slugEs);
    if (existing) Object.assign(existing, row, { parentId: hub.id, updatedAt: now });
    else {
      // Mismas columnas que exporta export-fallbacks.ts: se toma una fila hermana como molde
      // para que el mapper no reciba `undefined` donde espera `null`.
      const template = rows.find((r) => r.slugEs === "agentes-comerciales") ?? {};
      const blank = Object.fromEntries(Object.keys(template).map((k) => [k, null]));
      rows.push({
        ...blank,
        ...row,
        id: randomUUID(),
        parentId: hub.id,
        hubMetrics: null,
        frameworkPillars: null,
        sectors: null,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        deletedAt: null,
      } as Row);
    }
  }

  for (const [slug, sortOrder] of Object.entries(SIBLING_SORT)) {
    const row = rows.find((r) => r.slugEs === slug);
    if (!row) continue;
    const faqFixes = FAQ_FIXES[slug] ?? {};
    const benefitFixes = BENEFIT_FIXES[slug] ?? {};
    Object.assign(row, {
      metrics: [],
      faqs: ((row.faqs as Faq[] | null) ?? []).map((f) => faqFixes[f.questionEs] ?? f),
      benefits: ((row.benefits as Benefit[] | null) ?? []).map((b) => benefitFixes[b.titleEs] ?? b),
      sortOrder,
      ...(SEO_FIXES[slug] ?? {}),
      updatedAt: now,
    });
  }
  writeFileSync(serviciosPath, JSON.stringify(rows, null, 2) + "\n");
  console.log("✓ data/fallbacks/servicios.json");

  const navRows = JSON.parse(readFileSync(navPath, "utf8")) as Array<{
    megaMenu?: MegaMenuSection[];
  }>;
  const nav = readNav();
  const iaColumn = (navRows[0]?.megaMenu ?? [])
    .flatMap((section) => section.columns ?? [])
    .find((col) => col.url === "/servicios/inteligencia-artificial");
  if (iaColumn) {
    iaColumn.items = nav.items;
    Object.assign(iaColumn, nav.column);
    writeFileSync(navPath, JSON.stringify(navRows, null, 2) + "\n");
    console.log("✓ data/fallbacks/nav_config.json");
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
  if (DRY_RUN) console.log("Modo --dry-run: no se escribe nada.\n");
  const hubId = await seedHub();
  await seedAgentRows(hubId);
  await cleanSiblings();
  await seedNav();
  console.log(
    DRY_RUN
      ? "\nDry-run completo. Corre sin --dry-run para escribir."
      : "\nListo. Ahora corre export-fallbacks.ts para refrescar data/fallbacks/.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ el seed no llegó al final:", e);
  process.exit(1);
});
