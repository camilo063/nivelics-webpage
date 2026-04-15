/**
 * ES → EN translation agent for industrias + home_content.
 *
 * Reads every _es field that has content and its matching _en is empty/null,
 * calls Anthropic with brand-tone guidance, and writes the _en back.
 *
 * Run:
 *   ANTHROPIC_API_KEY=... DATABASE_URL=... npx tsx scripts/translate-industrias-es-to-en.ts
 *
 * Uses direct HTTP to Anthropic (no SDK dependency).
 * Safe to re-run: skips fields that already have EN content.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as fs from "fs/promises";
import * as path from "path";
import * as schema from "../lib/db/schema/admin";

const report = {
  startedAt: new Date().toISOString(),
  completedAt: "" as string,
  sections: {
    industrias: { rows: 0, fieldsTranslated: 0, errors: [] as string[] },
    servicios_hub: { rows: 0, fieldsTranslated: 0, errors: [] as string[] },
    home_content: { rows: 0, fieldsTranslated: 0, errors: [] as string[] },
  },
  skipped: [] as Array<{ table: string; id: string; field: string; reason: string }>,
};

const SYSTEM_PROMPT = `You are a bilingual B2B copy translator for Nivelics, a Latin American digital
transformation firm (AI + Cloud + Premium Staffing) with offices in Bogotá and Miami,
serving clients in LATAM and USA.

Tone: executive, direct, benefit-led. No filler. No buzzwords ("innovative", "disruptive",
"holistic", "cutting-edge", "synergize", "leverage", "revolutionize") — avoid them in EN as
Nivelics avoids them in ES.

Rules:
- Keep proper nouns verbatim: Nivelics, AWS, GCP, Azure, Kafka, PostgreSQL, etc.
- Keep technical standards verbatim: PCI-DSS, HIPAA, FHIR, GDPR, ISO 27001, OPC-UA, IEC 62443, etc.
- Keep metrics and numbers verbatim (99.9%, <100ms, 5 days, 40%, 13+ years).
- Translate idiomatically for a US business reader.
- Translate "2 semanas" → "2 weeks", "48 horas" → "48 hours", "30 min" → "30 min".
- Do NOT add or remove information. Do NOT add phrases like "In today's fast-paced world".
- Return ONLY the translated text. No commentary, no quotes, no prefix, no markdown.`;

const RATE_DELAY_MS = 13_000;
let lastCallAt = 0;
async function translate(text: string, retries = 3): Promise<string> {
  if (!text || !text.trim()) return "";
  const sinceLast = Date.now() - lastCallAt;
  if (sinceLast < RATE_DELAY_MS) {
    await new Promise((res) => setTimeout(res, RATE_DELAY_MS - sinceLast));
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
          max_tokens: 1200,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Translate to English:\n\n${text}` }],
        }),
      });
      if (r.status === 429) {
        console.warn(`[RATE] waiting 60s (attempt ${attempt}/${retries})`);
        await new Promise((res) => setTimeout(res, 60_000));
        continue;
      }
      if (!r.ok) {
        const body = await r.text();
        throw new Error(`HTTP ${r.status}: ${body}`);
      }
      const j = (await r.json()) as { content: Array<{ type: string; text: string }> };
      const block = j.content.find((c) => c.type === "text");
      if (!block) throw new Error("no text in response");
      return block.text.trim();
    } catch (e) {
      if (attempt === retries) throw e;
      console.warn(`[RETRY ${attempt}] ${(e as Error).message}`);
      await new Promise((res) => setTimeout(res, 2000 * attempt));
    }
  }
  throw new Error("unreachable");
}

async function translateIfEmpty(es: string | null | undefined, en: string | null | undefined) {
  if (!es) return en ?? "";
  if (en && en.trim()) return en;
  return translate(es);
}

type PainPoint = {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  statEs?: string;
  statEn?: string;
};
type LabelItem = { value: string; labelEs: string; labelEn: string; source?: string };
type Regulation = {
  code: string;
  nameEs: string;
  nameEn: string;
  descEs?: string;
  descEn?: string;
};
type UseCase = {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  outcomeEs?: string;
  outcomeEn?: string;
};
type Playbook = {
  number: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
};
type FAQ = { questionEs: string; questionEn: string; answerEs: string; answerEn: string };
type ProcessStep = {
  number: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  durationEs: string;
  durationEn: string;
};

async function translateIndustria(
  row: typeof schema.industrias.$inferSelect,
  db: ReturnType<typeof drizzle>,
) {
  let translated = 0;

  const painPoints: PainPoint[] = (row.painPoints as PainPoint[] | null) ?? [];
  for (const pp of painPoints) {
    if (!pp.titleEn && pp.titleEs) {
      pp.titleEn = await translate(pp.titleEs);
      translated++;
    }
    if (!pp.descEn && pp.descEs) {
      pp.descEn = await translate(pp.descEs);
      translated++;
    }
    if (pp.statEs && !pp.statEn) {
      pp.statEn = await translate(pp.statEs);
      translated++;
    }
  }

  const metrics: LabelItem[] = (row.metrics as LabelItem[] | null) ?? [];
  for (const m of metrics) {
    if (!m.labelEn && m.labelEs) {
      m.labelEn = await translate(m.labelEs);
      translated++;
    }
  }

  const statHighlights: LabelItem[] = (row.statHighlights as LabelItem[] | null) ?? [];
  for (const s of statHighlights) {
    if (!s.labelEn && s.labelEs) {
      s.labelEn = await translate(s.labelEs);
      translated++;
    }
  }

  const regulations: Regulation[] = (row.regulations as Regulation[] | null) ?? [];
  for (const r of regulations) {
    if (!r.nameEn && r.nameEs) {
      r.nameEn = await translate(r.nameEs);
      translated++;
    }
    if (r.descEs && !r.descEn) {
      r.descEn = await translate(r.descEs);
      translated++;
    }
  }

  const useCases: UseCase[] = (row.useCases as UseCase[] | null) ?? [];
  for (const u of useCases) {
    if (!u.titleEn && u.titleEs) {
      u.titleEn = await translate(u.titleEs);
      translated++;
    }
    if (!u.descEn && u.descEs) {
      u.descEn = await translate(u.descEs);
      translated++;
    }
    if (u.outcomeEs && !u.outcomeEn) {
      u.outcomeEn = await translate(u.outcomeEs);
      translated++;
    }
  }

  const playbook: Playbook[] = (row.playbook as Playbook[] | null) ?? [];
  for (const p of playbook) {
    if (!p.titleEn && p.titleEs) {
      p.titleEn = await translate(p.titleEs);
      translated++;
    }
    if (!p.descEn && p.descEs) {
      p.descEn = await translate(p.descEs);
      translated++;
    }
  }

  const industryFaqs: FAQ[] = (row.industryFaqs as FAQ[] | null) ?? [];
  for (const f of industryFaqs) {
    if (!f.questionEn && f.questionEs) {
      f.questionEn = await translate(f.questionEs);
      translated++;
    }
    if (!f.answerEn && f.answerEs) {
      f.answerEn = await translate(f.answerEs);
      translated++;
    }
  }

  const ctaTitleEn = await translateIfEmpty(row.ctaTitleEs, row.ctaTitleEn);
  const ctaPrimaryTextEn = await translateIfEmpty(row.ctaPrimaryTextEs, row.ctaPrimaryTextEn);
  const hubIntroTitleEn = await translateIfEmpty(row.hubIntroTitleEs, row.hubIntroTitleEn);
  const hubIntroSubtitleEn = await translateIfEmpty(row.hubIntroSubtitleEs, row.hubIntroSubtitleEn);
  const heroTitleEn = row.heroTitleEn?.trim()
    ? row.heroTitleEn
    : row.heroTitleEs
      ? await translate(row.heroTitleEs)
      : null;
  const heroSubtitleEn = row.heroSubtitleEn?.trim()
    ? row.heroSubtitleEn
    : row.heroSubtitleEs
      ? await translate(row.heroSubtitleEs)
      : null;

  await db
    .update(schema.industrias)
    .set({
      painPoints,
      metrics,
      statHighlights,
      regulations,
      useCases,
      playbook,
      industryFaqs,
      ctaTitleEn: ctaTitleEn || null,
      ctaPrimaryTextEn: ctaPrimaryTextEn || null,
      hubIntroTitleEn: hubIntroTitleEn || null,
      hubIntroSubtitleEn: hubIntroSubtitleEn || null,
      heroTitleEn,
      heroSubtitleEn,
      translationStatusEn: "complete",
      updatedAt: new Date(),
    })
    .where(eq(schema.industrias.id, row.id));

  report.sections.industrias.rows++;
  report.sections.industrias.fieldsTranslated += translated;
  console.log(`[OK] ${row.slugEs}: ${translated} fields translated`);
}

type FrameworkPillar = {
  letter: string;
  colorClass: string;
  borderClass: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
};
type Sector = { slug: string; icon: string; labelEs: string; labelEn: string };
type HubMetric = { value: string; labelEs: string; labelEn: string };

async function translateServicioHub(
  row: typeof schema.servicios.$inferSelect,
  db: ReturnType<typeof drizzle>,
) {
  let translated = 0;

  const frameworkPillars: FrameworkPillar[] =
    (row.frameworkPillars as FrameworkPillar[] | null) ?? [];
  for (const p of frameworkPillars) {
    if (!p.titleEn && p.titleEs) {
      p.titleEn = await translate(p.titleEs);
      translated++;
    }
    if (!p.descEn && p.descEs) {
      p.descEn = await translate(p.descEs);
      translated++;
    }
  }

  const sectors: Sector[] = (row.sectors as Sector[] | null) ?? [];
  for (const s of sectors) {
    if (!s.labelEn && s.labelEs) {
      s.labelEn = await translate(s.labelEs);
      translated++;
    }
  }

  const hubMetrics: HubMetric[] = (row.hubMetrics as HubMetric[] | null) ?? [];
  for (const m of hubMetrics) {
    if (!m.labelEn && m.labelEs) {
      m.labelEn = await translate(m.labelEs);
      translated++;
    }
  }

  const frameworkTitleEn = await translateIfEmpty(row.frameworkTitleEs, row.frameworkTitleEn);
  const frameworkSubtitleEn = await translateIfEmpty(
    row.frameworkSubtitleEs,
    row.frameworkSubtitleEn,
  );
  const sectorsTitleEn = await translateIfEmpty(row.sectorsTitleEs, row.sectorsTitleEn);
  if (!row.frameworkTitleEn?.trim() && row.frameworkTitleEs) translated++;
  if (!row.frameworkSubtitleEn?.trim() && row.frameworkSubtitleEs) translated++;
  if (!row.sectorsTitleEn?.trim() && row.sectorsTitleEs) translated++;

  await db
    .update(schema.servicios)
    .set({
      frameworkPillars,
      sectors,
      hubMetrics,
      frameworkTitleEn: frameworkTitleEn || null,
      frameworkSubtitleEn: frameworkSubtitleEn || null,
      sectorsTitleEn: sectorsTitleEn || null,
      translationStatusEn: "complete",
      updatedAt: new Date(),
    })
    .where(eq(schema.servicios.id, row.id));

  report.sections.servicios_hub.rows++;
  report.sections.servicios_hub.fieldsTranslated += translated;
  console.log(`[OK] hub ${row.slugEs}: ${translated} fields translated`);
}

async function translateHome(db: ReturnType<typeof drizzle>) {
  const rows = await db.select().from(schema.homeContent);
  if (rows.length === 0) return;
  const row = rows[0];

  const processSteps: ProcessStep[] = (row.processSteps as ProcessStep[] | null) ?? [];
  let translated = 0;
  for (const s of processSteps) {
    if (!s.titleEn && s.titleEs) {
      s.titleEn = await translate(s.titleEs);
      translated++;
    }
    if (!s.descEn && s.descEs) {
      s.descEn = await translate(s.descEs);
      translated++;
    }
    if (!s.durationEn && s.durationEs) {
      s.durationEn = await translate(s.durationEs);
      translated++;
    }
  }

  const processSectionTitleEn = await translateIfEmpty(
    row.processSectionTitleEs,
    row.processSectionTitleEn,
  );
  const processSectionSubtitleEn = await translateIfEmpty(
    row.processSectionSubtitleEs,
    row.processSectionSubtitleEn,
  );

  await db
    .update(schema.homeContent)
    .set({
      processSteps,
      processSectionTitleEn: processSectionTitleEn || null,
      processSectionSubtitleEn: processSectionSubtitleEn || null,
      translationStatusEn: "complete",
      updatedAt: new Date(),
    })
    .where(eq(schema.homeContent.id, row.id));

  report.sections.home_content.rows++;
  report.sections.home_content.fieldsTranslated += translated;
  console.log(`[OK] home_content: ${translated} fields translated`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is required");
    process.exit(1);
  }
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  const industrias = await db.select().from(schema.industrias);
  for (const row of industrias) {
    try {
      await translateIndustria(row, db);
    } catch (e) {
      const msg = `${row.slugEs}: ${(e as Error).message}`;
      report.sections.industrias.errors.push(msg);
      console.error(`[ERR] ${msg}`);
    }
  }

  const hubs = await db
    .select()
    .from(schema.servicios)
    .where(eq(schema.servicios.serviceType, "hub"));
  for (const row of hubs) {
    try {
      await translateServicioHub(row, db);
    } catch (e) {
      const msg = `${row.slugEs}: ${(e as Error).message}`;
      report.sections.servicios_hub.errors.push(msg);
      console.error(`[ERR] hub ${msg}`);
    }
  }

  try {
    await translateHome(db);
  } catch (e) {
    const msg = (e as Error).message;
    report.sections.home_content.errors.push(msg);
    console.error("[ERR] home:", msg);
  }

  report.completedAt = new Date().toISOString();
  const out = path.join(
    process.cwd(),
    "scripts",
    `translation-report-session-b-${Date.now()}.json`,
  );
  await fs.writeFile(out, JSON.stringify(report, null, 2));
  console.log(`\n✅ Translation pass finished. Report: ${out}`);
  console.log(JSON.stringify(report.sections, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
