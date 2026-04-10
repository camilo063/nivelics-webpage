/**
 * Autonomous ES -> EN translation agent for nivelics.com
 *
 * Usage:
 *   npx tsx scripts/translate-all-content.ts
 *   npx tsx scripts/translate-all-content.ts --dry-run
 *
 * Requirements:
 *   - DATABASE_URL env var
 *   - ANTHROPIC_API_KEY env var
 *
 * The script:
 * 1. Reads all content from the DB
 * 2. For each _en field that is empty and translation_status_en != 'complete'
 * 3. Calls Anthropic API with brand context
 * 4. Saves result in the corresponding _en field
 * 5. Sets translation_status_en = 'auto'
 * 6. Generates a report of everything translated
 *
 * Rules:
 * - NEVER overwrites fields where translation_status_en = 'complete'
 * - Empty ES fields => leave EN field empty
 * - Preserves HTML/JSON structure in rich text
 * - Does NOT translate slugs
 * - Preserves numeric metrics exactly
 * - Rate limited: 3s between API calls
 * - Resumable: safe to re-run
 * - Legal texts flagged for human review
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq, isNull, ne, or, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";
import * as fs from "fs/promises";

// ─── Config ─────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is required");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });
const DRY_RUN = process.argv.includes("--dry-run");
const RATE_LIMIT_MS = 13000; // 5 req/min limit → 12s+ between calls
const MAX_RETRIES = 2;

// ─── Brand Context ──────────────────────────────────────

const BRAND_CONTEXT = `You are translating content for Nivelics (nivelics.com), a Colombian B2B tech company founded in 2012 with offices in Bogota and Miami.

Company positioning: "The only company in LATAM that integrates Applied AI, Cloud with real governance and Premium Staffing in one partner — with 13 years of delivered projects."

Target audience for English content:
- CTOs and VP Engineering at US companies seeking nearshore talent
- CEOs and General Managers in LATAM seeking a reliable tech partner
- Technology Directors with cloud cost challenges

Tone guidelines:
- Direct, confident, results-first
- Human, not corporate
- Ambitious for the client (we transform businesses, not just resolve tickets)
- AVOID: "innovative", "cutting-edge", "end-to-end solutions", "disruptive", "leverage"
- USE: specific metrics, real case references, concrete promises

Do NOT translate these terms — keep them in English:
Staff Augmentation, FinOps, Nearshoring, Cloud, Sprint, Roadmap, KPI, SLA, ROI, CRM, ERP, DevOps, CI/CD, IaC, CDN, API, SaaS, B2B, LLM, RAG, MLOps, NLP

Translate faithfully while adapting for US B2B business culture.
Return ONLY the translated text, no explanations, no quotes around it.`;

// ─── Types ──────────────────────────────────────────────

type FieldType =
  | "title"
  | "description"
  | "body"
  | "seo_title"
  | "seo_description"
  | "cta"
  | "bio"
  | "label"
  | "faq_q"
  | "faq_a";

interface TranslationReport {
  startedAt: string;
  completedAt?: string;
  total: number;
  translated: number;
  skipped: number;
  errors: Array<{ table: string; id: string; field: string; error: string }>;
  sections: Record<string, { translated: number; skipped: number; errors: number }>;
  needsHumanReview: Array<{ table: string; id: string; reason: string }>;
}

const report: TranslationReport = {
  startedAt: new Date().toISOString(),
  total: 0,
  translated: 0,
  skipped: 0,
  errors: [],
  sections: {},
  needsHumanReview: [],
};

// ─── Helpers ────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(msg: string) {
  const prefix = DRY_RUN ? "[DRY RUN] " : "";
  console.log(`${prefix}${msg}`);
}

function sectionReport(section: string) {
  if (!report.sections[section]) {
    report.sections[section] = { translated: 0, skipped: 0, errors: 0 };
  }
  return report.sections[section];
}

// ─── Translation via Anthropic API ──────────────────────

const FIELD_INSTRUCTIONS: Record<FieldType, string> = {
  seo_title: "This is an SEO title tag. Max 60 characters. Include main keyword naturally.",
  seo_description: "This is an SEO meta description. 140-155 characters. Include a call to action.",
  cta: "This is a call-to-action button or link text. Keep it short, direct and action-oriented.",
  title: "This is a page or section heading. Keep it punchy and compelling.",
  description: "This is body copy or description text. Maintain the same level of detail.",
  body: "This is long-form rich text content. Preserve any HTML tags or markdown formatting exactly.",
  bio: "This is a professional biography. Adapt for US business culture.",
  label: "This is a short label or metric descriptor. Keep it concise.",
  faq_q: "This is a FAQ question. Make it natural in American English.",
  faq_a: "This is a FAQ answer. Maintain the same information density and specifics.",
};

async function translateText(
  textEs: string,
  fieldType: FieldType,
  contentContext: string,
): Promise<string> {
  if (!textEs || textEs.trim() === "") return "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: BRAND_CONTEXT,
          messages: [
            {
              role: "user",
              content: `Translate this ${contentContext} ${fieldType.replace("_", " ")} from Spanish to English:\n\n${textEs}\n\nNote: ${FIELD_INSTRUCTIONS[fieldType]}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`API ${response.status}: ${JSON.stringify(err)}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.type === "text" ? data.content[0].text.trim() : "";
      if (!text) throw new Error("Empty response from API");
      return text;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        log(`  Retry ${attempt + 1}/${MAX_RETRIES} after error: ${(err as Error).message}`);
        await delay(5000);
      } else {
        throw err;
      }
    }
  }
  return ""; // unreachable
}

// ─── JSONB array translator ─────────────────────────────

interface JsonbFieldMapping {
  esKey: string;
  enKey: string;
  fieldType: FieldType;
}

async function translateJsonbArray<T extends Record<string, unknown>>(
  items: T[] | null | undefined,
  mappings: JsonbFieldMapping[],
  context: string,
): Promise<T[] | null> {
  if (!items || items.length === 0) return items as T[] | null;

  const translated = [];
  for (const item of items) {
    const copy = { ...item };
    for (const m of mappings) {
      const esVal = item[m.esKey] as string | undefined;
      const enVal = item[m.enKey] as string | undefined;

      report.total++;
      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        const translation = await translateText(esVal, m.fieldType, context);
        (copy as Record<string, unknown>)[m.enKey] = translation;
        await delay(RATE_LIMIT_MS);
      }
      report.translated++;
    }
    translated.push(copy as T);
  }
  return translated;
}

// ═══════════════════════════════════════════════════════
// SECTION TRANSLATORS
// ═══════════════════════════════════════════════════════

// ─── 1. HOME CONTENT ────────────────────────────────────

async function translateHomeContent() {
  const section = "home_content";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const [home] = await db
    .select()
    .from(schema.homeContent)
    .where(eq(schema.homeContent.id, "main"))
    .limit(1);
  if (!home) {
    log("  No home content found, skipping");
    return;
  }

  const fields: Array<{ es: keyof typeof home; en: keyof typeof home; type: FieldType }> = [
    { es: "heroBadgeEs", en: "heroBadgeEn", type: "label" },
    { es: "heroTitleEs", en: "heroTitleEn", type: "title" },
    { es: "heroSubtitleEs", en: "heroSubtitleEn", type: "description" },
    { es: "heroCtaPrimaryEs", en: "heroCtaPrimaryEn", type: "cta" },
    { es: "heroCtaSecondaryEs", en: "heroCtaSecondaryEn", type: "cta" },
    { es: "servicesSectionTitleEs", en: "servicesSectionTitleEn", type: "title" },
    { es: "casesSectionTitleEs", en: "casesSectionTitleEn", type: "title" },
    { es: "finalCtaTitleEs", en: "finalCtaTitleEn", type: "title" },
    { es: "finalCtaCopyEs", en: "finalCtaCopyEn", type: "description" },
  ];

  const updates: Record<string, string> = {};

  for (const f of fields) {
    report.total++;
    const esVal = home[f.es] as string | null;
    const enVal = home[f.en] as string | null;

    if (enVal && enVal.trim() !== "") {
      report.skipped++;
      s.skipped++;
      continue;
    }
    if (!esVal || esVal.trim() === "") {
      report.skipped++;
      s.skipped++;
      continue;
    }

    if (!DRY_RUN) {
      try {
        updates[f.en as string] = await translateText(esVal, f.type, "home page");
        await delay(RATE_LIMIT_MS);
        report.translated++;
        s.translated++;
      } catch (err) {
        report.errors.push({
          table: section,
          id: "main",
          field: f.en as string,
          error: (err as Error).message,
        });
        s.errors++;
      }
    } else {
      report.translated++;
      s.translated++;
    }
  }

  // Translate metrics JSONB
  if (home.metrics) {
    const translatedMetrics = await translateJsonbArray(
      home.metrics,
      [{ esKey: "labelEs", enKey: "labelEn", fieldType: "label" }],
      "home page metric",
    );
    if (translatedMetrics && !DRY_RUN) {
      updates.metrics = translatedMetrics as unknown as string;
    }
  }

  // Translate FAQs JSONB
  if (home.faqs) {
    const translatedFaqs = await translateJsonbArray(
      home.faqs,
      [
        { esKey: "questionEs", enKey: "questionEn", fieldType: "faq_q" },
        { esKey: "answerEs", enKey: "answerEn", fieldType: "faq_a" },
      ],
      "home page FAQ",
    );
    if (translatedFaqs && !DRY_RUN) {
      updates.faqs = translatedFaqs as unknown as string;
    }
  }

  if (Object.keys(updates).length > 0 && !DRY_RUN) {
    await db.update(schema.homeContent).set(updates).where(eq(schema.homeContent.id, "main"));
    log(`  Updated ${Object.keys(updates).length} fields`);
  }
}

// ─── 2. SERVICIOS ───────────────────────────────────────

async function translateServicios() {
  const section = "servicios";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const services = await db
    .select()
    .from(schema.servicios)
    .where(ne(schema.servicios.translationStatusEn, "complete"));

  for (const svc of services) {
    log(`  Service: ${svc.slugEs}`);

    const fields: Array<{ es: keyof typeof svc; en: keyof typeof svc; type: FieldType }> = [
      { es: "titleEs", en: "titleEn", type: "title" },
      { es: "subtitleEs", en: "subtitleEn", type: "description" },
      { es: "descriptionEs", en: "descriptionEn", type: "description" },
      { es: "ctaPrimaryTextEs", en: "ctaPrimaryTextEn", type: "cta" },
      { es: "ctaSecondaryTextEs", en: "ctaSecondaryTextEn", type: "cta" },
      { es: "seoTitleEs", en: "seoTitleEn", type: "seo_title" },
      { es: "seoDescriptionEs", en: "seoDescriptionEn", type: "seo_description" },
    ];

    const updates: Record<string, unknown> = {};

    for (const f of fields) {
      report.total++;
      const esVal = svc[f.es] as string | null;
      const enVal = svc[f.en] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[f.en as string] = await translateText(esVal, f.type, `service "${svc.slugEs}"`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: svc.id,
            field: f.en as string,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    // Translate JSONB arrays
    if (svc.benefits) {
      const translated = await translateJsonbArray(
        svc.benefits,
        [
          { esKey: "titleEs", enKey: "titleEn", fieldType: "title" },
          { esKey: "copyEs", enKey: "copyEn", fieldType: "description" },
        ],
        `service "${svc.slugEs}" benefit`,
      );
      if (translated) updates.benefits = translated;
    }

    if (svc.processSteps) {
      const translated = await translateJsonbArray(
        svc.processSteps,
        [
          { esKey: "titleEs", enKey: "titleEn", fieldType: "title" },
          { esKey: "descEs", enKey: "descEn", fieldType: "description" },
        ],
        `service "${svc.slugEs}" process step`,
      );
      if (translated) updates.processSteps = translated;
    }

    if (svc.metrics) {
      const translated = await translateJsonbArray(
        svc.metrics,
        [{ esKey: "labelEs", enKey: "labelEn", fieldType: "label" }],
        `service "${svc.slugEs}" metric`,
      );
      if (translated) updates.metrics = translated;
    }

    if (svc.faqs) {
      const translated = await translateJsonbArray(
        svc.faqs,
        [
          { esKey: "questionEs", enKey: "questionEn", fieldType: "faq_q" },
          { esKey: "answerEs", enKey: "answerEn", fieldType: "faq_a" },
        ],
        `service "${svc.slugEs}" FAQ`,
      );
      if (translated) updates.faqs = translated;
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.servicios).set(updates).where(eq(schema.servicios.id, svc.id));
      log(`    Updated ${Object.keys(updates).length - 2} content fields`);
    } else if (svc.translationStatusEn === "pending" && !DRY_RUN) {
      // All EN fields already present but status was pending — fix it
      await db
        .update(schema.servicios)
        .set({ translationStatusEn: "auto", updatedAt: new Date() })
        .where(eq(schema.servicios.id, svc.id));
      log(`    Status fixed: pending -> auto (EN fields already present)`);
    }
  }
}

// ─── 3. INDUSTRIAS ──────────────────────────────────────

async function translateIndustrias() {
  const section = "industrias";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const industries = await db
    .select()
    .from(schema.industrias)
    .where(ne(schema.industrias.translationStatusEn, "complete"));

  for (const ind of industries) {
    log(`  Industry: ${ind.slugEs}`);

    const fields: Array<{ es: keyof typeof ind; en: keyof typeof ind; type: FieldType }> = [
      { es: "nameEs", en: "nameEn", type: "title" },
      { es: "heroTitleEs", en: "heroTitleEn", type: "title" },
      { es: "heroSubtitleEs", en: "heroSubtitleEn", type: "description" },
      { es: "ctaTextEs", en: "ctaTextEn", type: "cta" },
      { es: "seoTitleEs", en: "seoTitleEn", type: "seo_title" },
      { es: "seoDescriptionEs", en: "seoDescriptionEn", type: "seo_description" },
    ];

    const updates: Record<string, unknown> = {};

    for (const f of fields) {
      report.total++;
      const esVal = ind[f.es] as string | null;
      const enVal = ind[f.en] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[f.en as string] = await translateText(esVal, f.type, `industry "${ind.slugEs}"`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: ind.id,
            field: f.en as string,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    // Translate JSONB arrays
    const jsonbMappings = [
      { esKey: "titleEs", enKey: "titleEn", fieldType: "title" as FieldType },
      { esKey: "descEs", enKey: "descEn", fieldType: "description" as FieldType },
    ];

    if (ind.painPoints) {
      const translated = await translateJsonbArray(
        ind.painPoints,
        jsonbMappings,
        `industry "${ind.slugEs}" pain point`,
      );
      if (translated) updates.painPoints = translated;
    }
    if (ind.solutions) {
      const translated = await translateJsonbArray(
        ind.solutions,
        jsonbMappings,
        `industry "${ind.slugEs}" solution`,
      );
      if (translated) updates.solutions = translated;
    }
    if (ind.differentiators) {
      const translated = await translateJsonbArray(
        ind.differentiators,
        jsonbMappings,
        `industry "${ind.slugEs}" differentiator`,
      );
      if (translated) updates.differentiators = translated;
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.industrias).set(updates).where(eq(schema.industrias.id, ind.id));
      log(`    Updated ${Object.keys(updates).length - 2} content fields`);
    } else if (ind.translationStatusEn === "pending" && !DRY_RUN) {
      await db
        .update(schema.industrias)
        .set({ translationStatusEn: "auto", updatedAt: new Date() })
        .where(eq(schema.industrias.id, ind.id));
      log(`    Status fixed: pending -> auto`);
    }
  }
}

// ─── 4. CASOS DE EXITO ──────────────────────────────────

async function translateCasosExito() {
  const section = "casos_exito";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const cases = await db
    .select()
    .from(schema.casosExito)
    .where(ne(schema.casosExito.translationStatusEn, "complete"));

  for (const caso of cases) {
    log(`  Case: ${caso.slug}`);

    const fields: Array<{ es: keyof typeof caso; en: keyof typeof caso; type: FieldType }> = [
      { es: "titleEs", en: "titleEn", type: "title" },
      { es: "challengeEs", en: "challengeEn", type: "description" },
      { es: "solutionEs", en: "solutionEn", type: "description" },
      { es: "resultsEs", en: "resultsEn", type: "description" },
      { es: "metric1LabelEs", en: "metric1LabelEn", type: "label" },
      { es: "metric2LabelEs", en: "metric2LabelEn", type: "label" },
      { es: "metric3LabelEs", en: "metric3LabelEn", type: "label" },
      { es: "testimonialQuoteEs", en: "testimonialQuoteEn", type: "body" },
      { es: "seoTitleEs", en: "seoTitleEn", type: "seo_title" },
      { es: "seoDescriptionEs", en: "seoDescriptionEn", type: "seo_description" },
    ];

    const updates: Record<string, unknown> = {};

    for (const f of fields) {
      report.total++;
      const esVal = caso[f.es] as string | null;
      const enVal = caso[f.en] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[f.en as string] = await translateText(esVal, f.type, `case study "${caso.slug}"`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: caso.id,
            field: f.en as string,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    // Flag testimonials for human review
    if (caso.testimonialQuoteEs) {
      report.needsHumanReview.push({
        table: section,
        id: caso.id,
        reason: `Testimonial quote from ${caso.testimonialAuthor || "unknown"} — verify translation accuracy`,
      });
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.casosExito).set(updates).where(eq(schema.casosExito.id, caso.id));
      log(`    Updated ${Object.keys(updates).length - 2} content fields`);
    } else if (caso.translationStatusEn === "pending" && !DRY_RUN) {
      await db
        .update(schema.casosExito)
        .set({ translationStatusEn: "auto", updatedAt: new Date() })
        .where(eq(schema.casosExito.id, caso.id));
      log(`    Status fixed: pending -> auto`);
    }
  }
}

// ─── 5. BLOG POSTS ──────────────────────────────────────

async function translateBlogPosts() {
  const section = "blog_posts";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const posts = await db
    .select()
    .from(schema.blogPosts)
    .where(ne(schema.blogPosts.translationStatusEn, "complete"));

  for (const post of posts) {
    log(`  Blog: ${post.slug}`);

    const fields: Array<{ es: keyof typeof post; en: keyof typeof post; type: FieldType }> = [
      { es: "titleEs", en: "titleEn", type: "title" },
      { es: "excerptEs", en: "excerptEn", type: "description" },
      { es: "contentEs", en: "contentEn", type: "body" },
      { es: "coverImageAltEs", en: "coverImageAltEn", type: "label" },
      { es: "seoTitleEs", en: "seoTitleEn", type: "seo_title" },
      { es: "seoDescriptionEs", en: "seoDescriptionEn", type: "seo_description" },
    ];

    const updates: Record<string, unknown> = {};

    for (const f of fields) {
      report.total++;
      const esVal = post[f.es] as string | null;
      const enVal = post[f.en] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[f.en as string] = await translateText(esVal, f.type, `blog post "${post.slug}"`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: post.id,
            field: f.en as string,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.blogPosts).set(updates).where(eq(schema.blogPosts.id, post.id));
      log(`    Updated ${Object.keys(updates).length - 2} content fields`);
    } else if (post.translationStatusEn === "pending" && !DRY_RUN) {
      await db
        .update(schema.blogPosts)
        .set({ translationStatusEn: "auto", updatedAt: new Date() })
        .where(eq(schema.blogPosts.id, post.id));
      log(`    Status fixed: pending -> auto`);
    }
  }
}

// ─── 6. BLOG CATEGORIES ────────────────────────────────

async function translateBlogCategories() {
  const section = "blog_categories";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const cats = await db
    .select()
    .from(schema.blogCategories)
    .where(isNull(schema.blogCategories.nameEn));

  for (const cat of cats) {
    report.total++;
    if (!cat.nameEs) {
      report.skipped++;
      s.skipped++;
      continue;
    }

    if (!DRY_RUN) {
      try {
        const nameEn = await translateText(cat.nameEs, "label", "blog category");
        await db
          .update(schema.blogCategories)
          .set({ nameEn })
          .where(eq(schema.blogCategories.id, cat.id));
        await delay(RATE_LIMIT_MS);
        report.translated++;
        s.translated++;
      } catch (err) {
        report.errors.push({
          table: section,
          id: cat.id,
          field: "nameEn",
          error: (err as Error).message,
        });
        s.errors++;
      }
    } else {
      report.translated++;
      s.translated++;
    }
  }
}

// ─── 7. TEAM MEMBERS ───────────────────────────────────

async function translateTeamMembers() {
  const section = "team_members";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const members = await db.select().from(schema.teamMembers);

  for (const m of members) {
    log(`  Team: ${m.name}`);

    const updates: Record<string, unknown> = {};

    // Role
    report.total++;
    if (!m.roleEn && m.roleEs) {
      if (!DRY_RUN) {
        try {
          updates.roleEn = await translateText(m.roleEs, "label", `team member "${m.name}" role`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: m.id,
            field: "roleEn",
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    } else {
      report.skipped++;
      s.skipped++;
    }

    // Bio
    report.total++;
    if (!m.bioEn && m.bioEs) {
      if (!DRY_RUN) {
        try {
          updates.bioEn = await translateText(m.bioEs, "bio", `team member "${m.name}" biography`);
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: m.id,
            field: "bioEn",
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    } else {
      report.skipped++;
      s.skipped++;
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      await db.update(schema.teamMembers).set(updates).where(eq(schema.teamMembers.id, m.id));
    }
  }
}

// ─── 8. HISTORIA ITEMS ─────────────────────────────────

async function translateHistoria() {
  const section = "historia_items";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const items = await db.select().from(schema.historiaItems);

  for (const item of items) {
    const updates: Record<string, unknown> = {};

    // Title
    report.total++;
    if (!item.titleEn && item.titleEs) {
      if (!DRY_RUN) {
        try {
          updates.titleEn = await translateText(
            item.titleEs,
            "title",
            `history milestone ${item.year}`,
          );
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: item.id,
            field: "titleEn",
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    } else {
      report.skipped++;
      s.skipped++;
    }

    // Description
    report.total++;
    if (!item.descriptionEn && item.descriptionEs) {
      if (!DRY_RUN) {
        try {
          updates.descriptionEn = await translateText(
            item.descriptionEs,
            "description",
            `history milestone ${item.year}`,
          );
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: item.id,
            field: "descriptionEn",
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    } else {
      report.skipped++;
      s.skipped++;
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      await db
        .update(schema.historiaItems)
        .set(updates)
        .where(eq(schema.historiaItems.id, item.id));
    }
  }
}

// ─── 9. CERTIFICACIONES ────────────────────────────────

async function translateCertificaciones() {
  const section = "certificaciones";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const certs = await db.select().from(schema.certificaciones);

  for (const cert of certs) {
    const updates: Record<string, unknown> = {};

    for (const [es, en, ft] of [
      ["nameEs", "nameEn", "title"],
      ["descriptionEs", "descriptionEn", "description"],
    ] as const) {
      report.total++;
      const esVal = cert[es as keyof typeof cert] as string | null;
      const enVal = cert[en as keyof typeof cert] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[en] = await translateText(esVal, ft as FieldType, "certification");
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: cert.id,
            field: en,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      await db
        .update(schema.certificaciones)
        .set(updates)
        .where(eq(schema.certificaciones.id, cert.id));
    }
  }
}

// ─── 10. PAGES GENERAL ─────────────────────────────────

async function translatePagesGeneral() {
  const section = "pages_general";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const pages = await db
    .select()
    .from(schema.pagesGeneral)
    .where(ne(schema.pagesGeneral.translationStatusEn, "complete"));

  for (const page of pages) {
    log(`  Page: ${page.slugEs}`);

    const fields: Array<{ es: keyof typeof page; en: keyof typeof page; type: FieldType }> = [
      { es: "titleEs", en: "titleEn", type: "title" },
      { es: "seoTitleEs", en: "seoTitleEn", type: "seo_title" },
      { es: "seoDescriptionEs", en: "seoDescriptionEn", type: "seo_description" },
    ];

    const updates: Record<string, unknown> = {};

    for (const f of fields) {
      report.total++;
      const esVal = page[f.es] as string | null;
      const enVal = page[f.en] as string | null;

      if (enVal && enVal.trim() !== "") {
        report.skipped++;
        s.skipped++;
        continue;
      }
      if (!esVal || esVal.trim() === "") {
        report.skipped++;
        s.skipped++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          updates[f.en as string] = await translateText(
            esVal,
            f.type,
            `general page "${page.slugEs}"`,
          );
          await delay(RATE_LIMIT_MS);
          report.translated++;
          s.translated++;
        } catch (err) {
          report.errors.push({
            table: section,
            id: page.id,
            field: f.en as string,
            error: (err as Error).message,
          });
          s.errors++;
        }
      } else {
        report.translated++;
        s.translated++;
      }
    }

    // Flag privacy page for legal review
    if (page.pageType === "privacy") {
      report.needsHumanReview.push({
        table: section,
        id: page.id,
        reason: "Privacy policy — requires legal review of translation",
      });
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      updates.translationStatusEn = "auto";
      updates.updatedAt = new Date();
      await db.update(schema.pagesGeneral).set(updates).where(eq(schema.pagesGeneral.id, page.id));
      log(`    Updated ${Object.keys(updates).length - 2} content fields`);
    } else if (page.translationStatusEn === "pending" && !DRY_RUN) {
      await db
        .update(schema.pagesGeneral)
        .set({ translationStatusEn: "auto", updatedAt: new Date() })
        .where(eq(schema.pagesGeneral.id, page.id));
      log(`    Status fixed: pending -> auto`);
    }
  }
}

// ─── 11. SITE CONFIG ────────────────────────────────────

async function translateSiteConfig() {
  const section = "site_config";
  log(`\nTranslating ${section}...`);
  const s = sectionReport(section);

  const [config] = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, "main"))
    .limit(1);
  if (!config) return;

  const updates: Record<string, unknown> = {};

  for (const [es, en, ft] of [["taglineEs", "taglineEn", "description"]] as const) {
    report.total++;
    const esVal = config[es as keyof typeof config] as string | null;
    const enVal = config[en as keyof typeof config] as string | null;

    if (enVal && enVal.trim() !== "") {
      report.skipped++;
      s.skipped++;
      continue;
    }
    if (!esVal || esVal.trim() === "") {
      report.skipped++;
      s.skipped++;
      continue;
    }

    if (!DRY_RUN) {
      try {
        updates[en] = await translateText(esVal, ft as FieldType, "site config");
        await delay(RATE_LIMIT_MS);
        report.translated++;
        s.translated++;
      } catch (err) {
        report.errors.push({
          table: section,
          id: "main",
          field: en,
          error: (err as Error).message,
        });
        s.errors++;
      }
    } else {
      report.translated++;
      s.translated++;
    }
  }

  if (Object.keys(updates).length > 0 && !DRY_RUN) {
    await db.update(schema.siteConfig).set(updates).where(eq(schema.siteConfig.id, "main"));
  }
}

// ─── 12. MEDIA ALT TEXT ─────────────────────────────────

async function translateMediaAlt() {
  const section = "media";
  log(`\nTranslating ${section} alt text...`);
  const s = sectionReport(section);

  const items = await db.select().from(schema.media).where(isNull(schema.media.altEn));

  for (const item of items) {
    report.total++;
    if (!item.altEs) {
      report.skipped++;
      s.skipped++;
      continue;
    }

    if (!DRY_RUN) {
      try {
        const altEn = await translateText(item.altEs, "label", "image alt text");
        await db.update(schema.media).set({ altEn }).where(eq(schema.media.id, item.id));
        await delay(RATE_LIMIT_MS);
        report.translated++;
        s.translated++;
      } catch (err) {
        report.errors.push({
          table: section,
          id: item.id,
          field: "altEn",
          error: (err as Error).message,
        });
        s.errors++;
      }
    } else {
      report.translated++;
      s.translated++;
    }
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

async function main() {
  console.log("=== Nivelics Translation Agent ES -> EN ===");
  if (DRY_RUN) console.log("*** DRY RUN MODE — no DB writes, no API calls ***\n");

  try {
    // Priority 1: High-traffic pages
    await translateHomeContent();
    await translateServicios();

    // Priority 2: Case studies
    await translateCasosExito();

    // Priority 3: Industries
    await translateIndustrias();

    // Priority 4: About
    await translateTeamMembers();
    await translateHistoria();
    await translateCertificaciones();

    // Priority 5: Blog
    await translateBlogPosts();
    await translateBlogCategories();

    // Priority 6: General pages
    await translatePagesGeneral();
    await translateSiteConfig();

    // Priority 7: Media
    await translateMediaAlt();

    // ── Generate Report ──
    report.completedAt = new Date().toISOString();

    console.log("\n========================================");
    console.log("  TRANSLATION REPORT");
    console.log("========================================");
    console.log(`Started:    ${report.startedAt}`);
    console.log(`Completed:  ${report.completedAt}`);
    console.log(`Total fields processed: ${report.total}`);
    console.log(`Translated: ${report.translated}`);
    console.log(`Skipped (already had EN): ${report.skipped}`);
    console.log(`Errors: ${report.errors.length}`);

    console.log("\nBy section:");
    for (const [section, data] of Object.entries(report.sections)) {
      console.log(
        `  ${section}: ${data.translated} translated, ${data.skipped} skipped, ${data.errors} errors`,
      );
    }

    if (report.needsHumanReview.length > 0) {
      console.log(`\nNeeds human review (${report.needsHumanReview.length}):`);
      for (const item of report.needsHumanReview) {
        console.log(`  - [${item.table}] ${item.reason}`);
      }
    }

    if (report.errors.length > 0) {
      console.log(`\nErrors (${report.errors.length}):`);
      for (const err of report.errors) {
        console.log(`  - [${err.table}/${err.id}] ${err.field}: ${err.error}`);
      }
    }

    // Save report to file
    const reportPath = `scripts/translation-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);

    console.log("\nDone.");
  } catch (err) {
    console.error("\nTranslation agent failed:", err);
    // Save partial report
    report.completedAt = new Date().toISOString();
    const reportPath = `scripts/translation-report-partial-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.error(`Partial report saved to: ${reportPath}`);
    process.exit(1);
  }

  process.exit(0);
}

main();
