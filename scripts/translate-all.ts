/**
 * Traducción automática ES → EN de TODO el contenido en DB.
 *
 * Alcance: servicios (todos, hubs y subs), industrias (6), home_content.
 * Solo traduce campos _en vacíos — nunca sobrescribe traducciones existentes.
 * Detecta campos jsonb con claves *Es y traduce a *En automáticamente.
 *
 * Run:
 *   ANTHROPIC_API_KEY=... DATABASE_URL=... npx tsx scripts/translate-all.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const SYSTEM_PROMPT = `Eres un traductor B2B especializado en tecnología para LATAM y USA.
Empresa: Nivelics — consultoría de transformación digital B2B, Bogotá + Miami, fundada 2012.
Servicios: IA aplicada, Cloud (AWS/GCP/Azure), Staff Augmentation premium.
Slogan en inglés: "Transform faster."
Tono: ejecutivo, directo, concreto. Sin "innovative", "disruptive", "holistic", "cutting-edge", "synergize", "leverage", "revolutionize".
NO traducir: FinOps, DevOps, MLOps, SLA, ROI, API, CI/CD, IaC, AWS, GCP, Azure, Nivelics,
SARLAFT, PCI-DSS, SOC 2, HIPAA, HL7, FHIR, OXXO, PSE, Nequi, Pix, OR-tools, WMS, IIoT,
IEC 62443, Kafka, Terraform, Kubernetes, React, Next.js, TypeScript, Televisa, Univision, Pulzo, Crónica, Grupo Bolívar.
Preserva cifras y unidades (99.9%, <100ms, 5 días → 5 days, 40%, 13+ años → 13+ years).
Responde ÚNICAMENTE con el texto traducido. Sin comillas, sin explicaciones, sin preamble, sin markdown.
Si el texto ya está en inglés, devuélvelo igual sin cambios.`;

const RATE_DELAY_MS = 500;
let lastCallAt = 0;

async function translate(text: string | null | undefined, retries = 3): Promise<string> {
  if (!text || !text.trim()) return "";
  const sinceLast = Date.now() - lastCallAt;
  if (sinceLast < RATE_DELAY_MS) {
    await new Promise((r) => setTimeout(r, RATE_DELAY_MS - sinceLast));
  }
  lastCallAt = Date.now();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Traduce al inglés:\n\n${text}` }],
        }),
      });
      if (r.status === 429) {
        const wait = 60_000;
        console.warn(`\n[RATE] waiting ${wait / 1000}s (attempt ${attempt}/${retries})`);
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      if (!r.ok) {
        const body = await r.text();
        throw new Error(`HTTP ${r.status}: ${body}`);
      }
      const j = (await r.json()) as { content: Array<{ type: string; text: string }> };
      const block = j.content.find((c) => c.type === "text");
      if (!block) throw new Error("no text block in response");
      return block.text.trim();
    } catch (e) {
      if (attempt === retries) throw e;
      console.warn(`\n[retry ${attempt}] ${(e as Error).message}`);
      await new Promise((res) => setTimeout(res, 2000 * attempt));
    }
  }
  throw new Error("unreachable");
}

// Traduce un array jsonb detectando campos que terminan en 'Es' y completando sus 'En'.
async function translateArray(
  arr: Record<string, unknown>[] | null | undefined,
): Promise<{ result: Record<string, unknown>[]; changed: boolean }> {
  if (!arr?.length) return { result: arr ?? [], changed: false };
  let changed = false;
  const result = [] as Record<string, unknown>[];
  for (const item of arr) {
    const t = { ...item };
    for (const key of Object.keys(item)) {
      if (!key.endsWith("Es")) continue;
      const enKey = key.slice(0, -2) + "En";
      const esVal = item[key];
      const enVal = item[enKey];
      if (
        typeof esVal === "string" &&
        esVal.trim() &&
        (typeof enVal !== "string" || !enVal.trim())
      ) {
        t[enKey] = await translate(esVal);
        changed = true;
        process.stdout.write(".");
      }
    }
    result.push(t);
  }
  return { result, changed };
}

const report = {
  startedAt: new Date().toISOString(),
  completedAt: "",
  servicios: { rows: 0, fields: 0, errors: [] as string[] },
  industrias: { rows: 0, fields: 0, errors: [] as string[] },
  home: { fields: 0, errors: [] as string[] },
};

async function translateServicios(db: ReturnType<typeof drizzle>) {
  console.log("\n⚙  servicios");
  const rows = await db.select().from(schema.servicios);
  const pairs: Array<[string, string]> = [
    ["titleEs", "titleEn"],
    ["subtitleEs", "subtitleEn"],
    ["descriptionEs", "descriptionEn"],
    ["ctaPrimaryTextEs", "ctaPrimaryTextEn"],
    ["ctaSecondaryTextEs", "ctaSecondaryTextEn"],
    ["seoTitleEs", "seoTitleEn"],
    ["seoDescriptionEs", "seoDescriptionEn"],
    ["frameworkTitleEs", "frameworkTitleEn"],
    ["frameworkSubtitleEs", "frameworkSubtitleEn"],
    ["sectorsTitleEs", "sectorsTitleEn"],
  ];
  const jsonbFields = [
    "benefits",
    "processSteps",
    "metrics",
    "faqs",
    "frameworkPillars",
    "sectors",
    "hubMetrics",
  ] as const;

  for (const row of rows) {
    try {
      const updates: Record<string, unknown> = {};
      for (const [esK, enK] of pairs) {
        const r = row as Record<string, unknown>;
        if (typeof r[esK] === "string" && (r[esK] as string).trim()) {
          if (typeof r[enK] !== "string" || !(r[enK] as string).trim()) {
            updates[enK] = await translate(r[esK] as string);
            report.servicios.fields++;
          }
        }
      }
      for (const field of jsonbFields) {
        const arr = (row as Record<string, unknown>)[field] as
          | Record<string, unknown>[]
          | undefined;
        const { result, changed } = await translateArray(arr);
        if (changed) {
          updates[field] = result;
        }
      }
      if (Object.keys(updates).length > 0) {
        updates.translationStatusEn = "complete";
        updates.updatedAt = new Date();
        await db.update(schema.servicios).set(updates).where(eq(schema.servicios.id, row.id));
        report.servicios.rows++;
        console.log(`\n  [OK] ${row.slugEs}: ${Object.keys(updates).length - 2} fields`);
      }
    } catch (e) {
      const msg = `${row.slugEs}: ${(e as Error).message}`;
      report.servicios.errors.push(msg);
      console.error(`\n  [ERR] ${msg}`);
    }
  }
}

async function translateIndustrias(db: ReturnType<typeof drizzle>) {
  console.log("\n🏭 industrias");
  const rows = await db.select().from(schema.industrias);
  const pairs: Array<[string, string]> = [
    ["nameEs", "nameEn"],
    ["heroTitleEs", "heroTitleEn"],
    ["heroSubtitleEs", "heroSubtitleEn"],
    ["ctaTextEs", "ctaTextEn"],
    ["ctaTitleEs", "ctaTitleEn"],
    ["ctaPrimaryTextEs", "ctaPrimaryTextEn"],
    ["hubIntroTitleEs", "hubIntroTitleEn"],
    ["hubIntroSubtitleEs", "hubIntroSubtitleEn"],
    ["seoTitleEs", "seoTitleEn"],
    ["seoDescriptionEs", "seoDescriptionEn"],
  ];
  const jsonbFields = [
    "painPoints",
    "solutions",
    "differentiators",
    "metrics",
    "statHighlights",
    "regulations",
    "useCases",
    "playbook",
    "industryFaqs",
  ] as const;

  for (const row of rows) {
    try {
      const updates: Record<string, unknown> = {};
      for (const [esK, enK] of pairs) {
        const r = row as Record<string, unknown>;
        if (typeof r[esK] === "string" && (r[esK] as string).trim()) {
          if (typeof r[enK] !== "string" || !(r[enK] as string).trim()) {
            updates[enK] = await translate(r[esK] as string);
            report.industrias.fields++;
          }
        }
      }
      for (const field of jsonbFields) {
        const arr = (row as Record<string, unknown>)[field] as
          | Record<string, unknown>[]
          | undefined;
        const { result, changed } = await translateArray(arr);
        if (changed) {
          updates[field] = result;
        }
      }
      if (Object.keys(updates).length > 0) {
        updates.translationStatusEn = "complete";
        updates.updatedAt = new Date();
        await db.update(schema.industrias).set(updates).where(eq(schema.industrias.id, row.id));
        report.industrias.rows++;
        console.log(`\n  [OK] ${row.slugEs}: ${Object.keys(updates).length - 2} fields`);
      }
    } catch (e) {
      const msg = `${row.slugEs}: ${(e as Error).message}`;
      report.industrias.errors.push(msg);
      console.error(`\n  [ERR] ${msg}`);
    }
  }
}

async function translateHome(db: ReturnType<typeof drizzle>) {
  console.log("\n🏠 home_content");
  const rows = await db.select().from(schema.homeContent);
  if (rows.length === 0) return;
  const row = rows[0];
  const pairs: Array<[string, string]> = [
    ["heroBadgeEs", "heroBadgeEn"],
    ["heroTitleEs", "heroTitleEn"],
    ["heroSubtitleEs", "heroSubtitleEn"],
    ["heroCtaPrimaryEs", "heroCtaPrimaryEn"],
    ["heroCtaSecondaryEs", "heroCtaSecondaryEn"],
    ["servicesSectionTitleEs", "servicesSectionTitleEn"],
    ["casesSectionTitleEs", "casesSectionTitleEn"],
    ["finalCtaTitleEs", "finalCtaTitleEn"],
    ["finalCtaCopyEs", "finalCtaCopyEn"],
    ["processSectionTitleEs", "processSectionTitleEn"],
    ["processSectionSubtitleEs", "processSectionSubtitleEn"],
    ["industriasHubTitleEs", "industriasHubTitleEn"],
    ["industriasHubSubtitleEs", "industriasHubSubtitleEn"],
    ["industriasHubStatEs", "industriasHubStatEn"],
  ];
  try {
    const updates: Record<string, unknown> = {};
    for (const [esK, enK] of pairs) {
      const r = row as Record<string, unknown>;
      if (typeof r[esK] === "string" && (r[esK] as string).trim()) {
        if (typeof r[enK] !== "string" || !(r[enK] as string).trim()) {
          updates[enK] = await translate(r[esK] as string);
          report.home.fields++;
        }
      }
    }
    for (const field of ["faqs", "processSteps"] as const) {
      const arr = (row as Record<string, unknown>)[field] as Record<string, unknown>[] | undefined;
      const { result, changed } = await translateArray(arr);
      if (changed) {
        updates[field] = result;
      }
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await db.update(schema.homeContent).set(updates).where(eq(schema.homeContent.id, row.id));
      console.log(`\n  [OK] home: ${Object.keys(updates).length - 1} fields`);
    }
  } catch (e) {
    const msg = (e as Error).message;
    report.home.errors.push(msg);
    console.error(`\n  [ERR] home: ${msg}`);
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY required");
    process.exit(1);
  }
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  console.log("🌐 translate-all ES → EN");
  console.log("model: claude-sonnet-4-5-20250929");

  await translateServicios(db);
  await translateIndustrias(db);
  await translateHome(db);

  report.completedAt = new Date().toISOString();
  console.log("\n\n=== REPORT ===");
  console.log(JSON.stringify(report, null, 2));
  console.log("\n✅ done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
