/**
 * Enrichment script: Extracts FAQs, metrics, and benefits from hardcoded page.tsx files
 * and updates the servicios table with missing content.
 * Then translates all new ES content to EN using Anthropic API.
 *
 * Usage:
 *   DATABASE_URL="..." ANTHROPIC_API_KEY="..." npx tsx scripts/enrich-services-from-pages.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!DATABASE_URL) {
  console.error("DATABASE_URL required");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY required");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

let totalTranslated = 0;
let totalUpdated = 0;
let totalErrors = 0;
const errors: string[] = [];

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translate(text: string, ctx: string): Promise<string> {
  if (!text || text.trim() === "") return "";
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system:
            "You translate content for Nivelics (nivelics.com), a Colombian B2B tech company (AI, Cloud, Staff Augmentation). Tone: direct, confident, results-first. Do NOT translate: Staff Augmentation, FinOps, Nearshoring, Cloud, Sprint, KPI, SLA, ROI. Return ONLY the translation.",
          messages: [{ role: "user", content: `Translate ES→EN. Context: ${ctx}\n\n${text}` }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const d = await res.json();
      totalTranslated++;
      await delay(4000);
      return d.content?.[0]?.text || "";
    } catch (e) {
      if (i === 2) {
        errors.push(`${ctx}: ${(e as Error).message}`);
        totalErrors++;
        return "";
      }
      await delay(3000);
    }
  }
  return "";
}

// ─── Page reading ────────────────────────────────────────

const BASE = path.resolve(__dirname, "..");
const PAGES = path.join(BASE, "app", "[locale]", "(marketing)");

function readPageFile(relPath: string): string {
  const fp = path.join(PAGES, relPath, "page.tsx");
  if (!fs.existsSync(fp)) {
    console.log(`  WARN: ${relPath}/page.tsx not found`);
    return "";
  }
  return fs.readFileSync(fp, "utf-8");
}

// ─── Extractors ─────────────────────────────────────────

function extractFAQs(src: string): Array<{ questionEs: string; answerEs: string }> {
  const results: Array<{ questionEs: string; answerEs: string }> = [];
  // Find all question/answer pairs in FAQAccordion
  const faqSection = src.match(/FAQAccordion[\s\S]*?faqs=\{\[\s*([\s\S]*?)\]\s*\}/);
  if (!faqSection) return results;

  const block = faqSection[1];
  // Match each FAQ object
  const faqPattern = /\{\s*question:\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
  const answerPattern =
    /answer:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g;

  const questions: string[] = [];
  const answers: string[] = [];

  let m;
  while ((m = faqPattern.exec(block)) !== null) {
    questions.push((m[1] || m[2] || m[3]).replace(/\\"/g, '"'));
  }
  while ((m = answerPattern.exec(block)) !== null) {
    answers.push((m[1] || m[2] || m[3]).replace(/\\"/g, '"'));
  }

  for (let i = 0; i < questions.length; i++) {
    results.push({ questionEs: questions[i], answerEs: answers[i] || "" });
  }
  return results;
}

function extractMetricsBar(src: string): Array<{ value: string; labelEs: string }> {
  const results: Array<{ value: string; labelEs: string }> = [];
  const section = src.match(/MetricsBar[\s\S]*?metrics=\{\[\s*([\s\S]*?)\]\s*\}/);
  if (!section) return results;

  const block = section[1];
  // Match { value: "X", label: "Y" } or with sublabel
  const pattern = /value:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"(?:[\s\S]*?sublabel:\s*"([^"]*)")?/g;
  let m;
  while ((m = pattern.exec(block)) !== null) {
    const label = m[3] ? `${m[2]} — ${m[3]}` : m[2];
    results.push({ value: m[1], labelEs: label });
  }
  return results;
}

function extractSEO(src: string): { titleEs: string; descEs: string } {
  const title = src.match(/title:\s*"([^"]+)"/)?.[1] || "";
  // Get description from metadata
  const desc = src.match(/description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1] || "";
  return { titleEs: title, descEs: desc };
}

// ─── Service map ────────────────────────────────────────

const SERVICE_PATHS: Record<string, string> = {
  "inteligencia-artificial": "servicios/inteligencia-artificial",
  "agentes-ia": "servicios/inteligencia-artificial/agentes-ia",
  "agentes-comerciales": "servicios/inteligencia-artificial/agentes-comerciales",
  "automatizacion-procesos": "servicios/inteligencia-artificial/automatizacion-procesos",
  "gestion-contenido": "servicios/inteligencia-artificial/gestion-contenido",
  "marketing-crm": "servicios/inteligencia-artificial/marketing-crm",
  cloud: "servicios/cloud",
  finops: "servicios/cloud/finops",
  "migracion-aws": "servicios/cloud/migracion-aws",
  infraestructura: "servicios/cloud/infraestructura",
  seguridad: "servicios/cloud/seguridad",
  serverless: "servicios/cloud/serverless",
  "staff-augmentation": "servicios/staff-augmentation",
  "desarrollo-software": "servicios/staff-augmentation/desarrollo-software",
  "diseno-ux-ui": "servicios/staff-augmentation/diseno-ux-ui",
  "devops-cloud": "servicios/staff-augmentation/devops-cloud",
  "datos-ia": "servicios/staff-augmentation/datos-ia",
  "qa-seguridad": "servicios/staff-augmentation/qa-seguridad",
  "desarrollo-digital": "servicios/desarrollo-digital",
  "apps-moviles": "servicios/desarrollo-digital/apps-moviles",
  "plataformas-web": "servicios/desarrollo-digital/plataformas-web",
  ecommerce: "servicios/desarrollo-digital/ecommerce",
  "sitios-web-agentic": "servicios/desarrollo-digital/sitios-web-agentic",
};

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log("=== Enrich Services from Hardcoded Pages ===\n");

  for (const [slugEs, pagePath] of Object.entries(SERVICE_PATHS)) {
    console.log(`\nProcessing: ${slugEs}`);

    // Get current record
    const existing = await db
      .select()
      .from(schema.servicios)
      .where(eq(schema.servicios.slugEs, slugEs))
      .limit(1);
    if (existing.length === 0) {
      console.log("  Not in DB, skipping");
      continue;
    }
    const svc = existing[0];

    // Read page
    const src = readPageFile(pagePath);
    if (!src) continue;

    // Extract content
    const faqs = extractFAQs(src);
    const metrics = extractMetricsBar(src);
    const seo = extractSEO(src);

    console.log(`  Found: ${faqs.length} FAQs, ${metrics.length} metrics`);

    const updates: Record<string, unknown> = {};

    // FAQs — only fill if empty
    if (faqs.length > 0 && (!svc.faqs || (svc.faqs as unknown[]).length === 0)) {
      console.log(`  Translating ${faqs.length} FAQs...`);
      const translatedFaqs = [];
      for (const f of faqs) {
        const qEn = await translate(f.questionEs, `FAQ Q for ${slugEs}`);
        const aEn = await translate(f.answerEs, `FAQ A for ${slugEs}`);
        translatedFaqs.push({
          questionEs: f.questionEs,
          questionEn: qEn,
          answerEs: f.answerEs,
          answerEn: aEn,
        });
      }
      updates.faqs = translatedFaqs;
    }

    // Metrics — only fill if empty
    if (metrics.length > 0 && (!svc.metrics || (svc.metrics as unknown[]).length === 0)) {
      console.log(`  Translating ${metrics.length} metrics...`);
      const translatedMetrics = [];
      for (const m of metrics) {
        const labelEn = await translate(m.labelEs, `metric for ${slugEs}`);
        translatedMetrics.push({ value: m.value, unit: "", labelEs: m.labelEs, labelEn });
      }
      updates.metrics = translatedMetrics;
    }

    // SEO — only fill if empty
    if (seo.titleEs && (!svc.seoTitleEs || svc.seoTitleEs.trim() === "")) {
      updates.seoTitleEs = seo.titleEs;
      updates.seoTitleEn = await translate(seo.titleEs, `SEO title for ${slugEs}`);
    }
    if (seo.descEs && (!svc.seoDescriptionEs || svc.seoDescriptionEs.trim() === "")) {
      updates.seoDescriptionEs = seo.descEs;
      updates.seoDescriptionEn = await translate(seo.descEs, `SEO desc for ${slugEs}`);
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.servicios).set(updates).where(eq(schema.servicios.slugEs, slugEs));
      console.log(`  Updated: ${Object.keys(updates).length - 2} content fields`);
      totalUpdated++;
    } else {
      console.log("  Already complete");
    }
  }

  console.log("\n========================================");
  console.log("  ENRICHMENT COMPLETE");
  console.log("========================================");
  console.log(`Services updated: ${totalUpdated}`);
  console.log(`Fields translated: ${totalTranslated}`);
  console.log(`Errors: ${totalErrors}`);
  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const e of errors) console.log(`  - ${e}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
