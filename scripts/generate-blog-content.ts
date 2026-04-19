/**
 * Blog content generation pipeline — 40 briefs → 80 bilingual articles.
 *
 * Reads docs/seo/briefs-pillars-1-5.md + docs/seo/briefs-standard-1-35.md,
 * calls Anthropic API per brief × locale, writes /content/generated/{locale}/{slug}.md.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/generate-blog-content.ts --dry-run --only-pillars
 *   node --env-file=.env.local --import tsx scripts/generate-blog-content.ts --brief=P5 --lang=es
 *   node --env-file=.env.local --import tsx scripts/generate-blog-content.ts --only-pillars --lang=both
 *   node --env-file=.env.local --import tsx scripts/generate-blog-content.ts --only-standard --lang=both
 *
 * Flags:
 *   --only-pillars       process only P1-P5
 *   --only-standard      process only B1-B35
 *   --brief=<id>         process a single brief (P5 or B12)
 *   --lang=es|en|both    default: both
 *   --force              regenerate even if .md exists
 *   --dry-run            parse briefs + show plan, no API calls
 *   --max=<n>            cap number of articles processed (for testing)
 */
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { parseAllBriefs } from "./blog-content/brief-parser";
import { buildSystemPrompt, buildUserPrompt, extractJson } from "./blog-content/prompt-builder";
import {
  articleExists,
  validateArticle,
  writeArticle,
  type ValidationResult,
} from "./blog-content/article-writer";
import type { Brief, GeneratedArticle, GenerationResult, Locale } from "./blog-content/types";

const MODEL = "claude-opus-4-7";
const MAX_TOKENS_PILLAR = 16000;
const MAX_TOKENS_STANDARD = 8000;
const MAX_ATTEMPTS = 3;
const DELAY_BETWEEN_CALLS_MS = 2000;
const COST_CEILING_USD = 40;

// Opus 4.7 pricing per 1M tokens
const PRICE_IN = 15 / 1_000_000;
const PRICE_OUT = 75 / 1_000_000;

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BRIEF_FILES = [
  path.join(ROOT, "docs/seo/briefs-pillars-1-5.md"),
  path.join(ROOT, "docs/seo/briefs-standard-1-35.md"),
];
const OUTPUT_DIR = path.join(ROOT, "content/generated");
const LOG_PATH = "/tmp/blog-generation.log";
const REPORT_PATH = "/tmp/blog-generation-report.md";

type Flags = {
  onlyPillars: boolean;
  onlyStandard: boolean;
  brief?: string;
  lang: "es" | "en" | "both";
  force: boolean;
  dryRun: boolean;
  max?: number;
};

function parseFlags(): Flags {
  const args = process.argv.slice(2);
  const flags: Flags = {
    onlyPillars: false,
    onlyStandard: false,
    lang: "both",
    force: false,
    dryRun: false,
  };
  for (const arg of args) {
    if (arg === "--only-pillars") flags.onlyPillars = true;
    else if (arg === "--only-standard") flags.onlyStandard = true;
    else if (arg === "--force") flags.force = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg.startsWith("--brief=")) flags.brief = arg.slice(8).trim();
    else if (arg.startsWith("--lang=")) {
      const v = arg.slice(7).trim();
      if (v === "es" || v === "en" || v === "both") flags.lang = v;
      else throw new Error(`invalid --lang=${v}`);
    } else if (arg.startsWith("--max=")) {
      flags.max = parseInt(arg.slice(6), 10);
    } else {
      console.warn(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

function filterBriefs(briefs: Brief[], flags: Flags): Brief[] {
  let out = briefs;
  if (flags.onlyPillars) out = out.filter((b) => b.isPillar);
  if (flags.onlyStandard) out = out.filter((b) => !b.isPillar);
  if (flags.brief) out = out.filter((b) => b.id.toLowerCase() === flags.brief!.toLowerCase());
  return out;
}

function locales(flags: Flags): Locale[] {
  if (flags.lang === "es") return ["es"];
  if (flags.lang === "en") return ["en"];
  return ["es", "en"];
}

function log(line: string): void {
  const stamped = `[${new Date().toISOString()}] ${line}`;
  fs.appendFileSync(LOG_PATH, stamped + "\n");
  console.log(line);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAnthropic(
  client: Anthropic,
  system: string,
  user: string,
  maxTokens: number,
): Promise<{ text: string; inTokens: number; outTokens: number; stopReason: string | null }> {
  let lastErr: unknown;
  let backoffMs = 2000;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      });
      const content = resp.content
        .filter((c): c is Anthropic.TextBlock => c.type === "text")
        .map((c) => c.text)
        .join("");
      return {
        text: content,
        inTokens: resp.usage.input_tokens,
        outTokens: resp.usage.output_tokens,
        stopReason: resp.stop_reason,
      };
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("rate");
      const isOverload = msg.includes("529") || msg.toLowerCase().includes("overload");
      // Permanent errors — don't waste retries: credit/billing, auth, bad request.
      const isPermanent =
        msg.includes("credit balance") ||
        msg.includes("authentication") ||
        msg.includes("invalid_api_key") ||
        (msg.includes("400") && !isRateLimit && !isOverload);
      if (isPermanent) {
        log(`  ✗ permanent error — not retrying: ${msg.slice(0, 120)}`);
        break;
      }
      if (attempt < MAX_ATTEMPTS && (isRateLimit || isOverload)) {
        log(
          `  ⚠ attempt ${attempt}/${MAX_ATTEMPTS} failed (${msg.slice(0, 100)}) — backing off ${backoffMs}ms`,
        );
        await sleep(backoffMs);
        backoffMs *= 2;
        continue;
      }
      if (attempt < MAX_ATTEMPTS) {
        log(`  ⚠ attempt ${attempt}/${MAX_ATTEMPTS} failed (${msg.slice(0, 100)}) — retrying`);
        await sleep(1000);
        continue;
      }
      break;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function generateOne(
  client: Anthropic,
  brief: Brief,
  locale: Locale,
  flags: Flags,
): Promise<GenerationResult> {
  if (!flags.force && articleExists(OUTPUT_DIR, brief, locale)) {
    return { brief, locale, attempts: 0, skipped: true };
  }

  const system = buildSystemPrompt(locale);
  const user = buildUserPrompt(brief, locale);
  const maxTokens = brief.isPillar ? MAX_TOKENS_PILLAR : MAX_TOKENS_STANDARD;

  let lastValidation: ValidationResult | undefined;
  let lastArticle: GeneratedArticle | undefined;
  let totalIn = 0;
  let totalOut = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const reinforcement =
      attempt > 1 && lastValidation
        ? `\n\nIMPORTANTE: intento anterior falló validación. Errores: ${lastValidation.errors.join("; ")}. Respeta todas las reglas esta vez.`
        : "";

    const { text, inTokens, outTokens, stopReason } = await callAnthropic(
      client,
      system,
      user + reinforcement,
      maxTokens,
    );
    totalIn += inTokens;
    totalOut += outTokens;
    if (stopReason === "max_tokens") {
      log(`  ⚠ attempt ${attempt}: hit max_tokens (${maxTokens}) — response truncated`);
    }

    let article: GeneratedArticle;
    try {
      article = extractJson<GeneratedArticle>(text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const dumpPath = `/tmp/blog-gen-raw-${brief.id}-${locale}-a${attempt}.txt`;
      fs.writeFileSync(dumpPath, text);
      log(`  ⚠ attempt ${attempt}: JSON parse failed — ${msg}`);
      log(`    first 300 chars: ${text.slice(0, 300).replace(/\n/g, "\\n")}`);
      log(`    full raw dumped to ${dumpPath}`);
      continue;
    }

    // Apply brief's intended slug always (protect from LLM changing it)
    article.slug = locale === "es" ? brief.slugEs : brief.slugEn;

    const validation = validateArticle(brief, article, locale);
    lastValidation = validation;
    lastArticle = article;

    if (validation.ok) {
      const wr = writeArticle(brief, article, { outputDir: OUTPUT_DIR, locale });
      log(
        `  ✓ ${brief.id} ${locale} — ${validation.wordCount}w, attempt ${attempt}, in=${totalIn} out=${totalOut}`,
      );
      if (validation.warnings.length) {
        log(`    warnings: ${validation.warnings.join("; ")}`);
      }
      return {
        brief,
        locale,
        article,
        attempts: attempt,
        tokensIn: totalIn,
        tokensOut: totalOut,
        wordCount: validation.wordCount,
        filePath: wr.filePath,
      };
    }

    log(
      `  ✗ ${brief.id} ${locale} attempt ${attempt}: ${validation.errors.slice(0, 2).join("; ")}`,
    );
  }

  return {
    brief,
    locale,
    article: lastArticle,
    attempts: MAX_ATTEMPTS,
    tokensIn: totalIn,
    tokensOut: totalOut,
    error: "validation failed after all attempts",
    validationErrors: lastValidation?.errors,
  };
}

function printPlan(briefs: Brief[], locs: Locale[]): void {
  console.log("\n── Plan ──");
  for (const b of briefs) {
    const locsStr = locs.join("+");
    console.log(
      `  ${b.id.padEnd(4)} ${b.isPillar ? "PILLAR   " : "standard "} ${b.category.padEnd(24)} ${b.slugEs}  [${locsStr}]`,
    );
  }
  console.log(`\nTotal briefs: ${briefs.length}`);
  console.log(`Total articles to generate: ${briefs.length * locs.length}`);
}

function printParseSample(briefs: Brief[]): void {
  if (!briefs.length) return;
  console.log("\n── First parsed brief (sample) ──");
  const b = briefs[0];
  console.log(`id: ${b.id}`);
  console.log(`title: ${b.title}`);
  console.log(`isPillar: ${b.isPillar}`);
  console.log(`type: ${b.type}`);
  console.log(`slugEs: ${b.slugEs}`);
  console.log(`slugEn: ${b.slugEn}`);
  console.log(`category: ${b.category}`);
  console.log(`query: ${b.queryObjective.slice(0, 120)}`);
  console.log(`words: ${b.wordsMin}–${b.wordsMax}`);
  console.log(`H2s (${b.h2List.length}):`);
  for (const h of b.h2List.slice(0, 4)) console.log(`  - ${h}`);
  if (b.h2List.length > 4) console.log(`  ... (+${b.h2List.length - 4})`);
  console.log(`mustCover (${b.mustCover.length}):`);
  for (const m of b.mustCover.slice(0, 3)) console.log(`  - ${m.slice(0, 120)}`);
  console.log(`verifyItems (${b.verifyItems.length})`);
  console.log(
    `CTA primary: ${b.ctaPrimary ? `"${b.ctaPrimary.text}" → ${b.ctaPrimary.url}` : "(none)"}`,
  );
  console.log(`internalLinks (${b.internalLinks.length}):`);
  for (const l of b.internalLinks.slice(0, 3)) console.log(`  - ${l}`);
  console.log(`redirectFrom (${b.redirectFrom.length})`);
  console.log(`schemaOrg: ${b.schemaOrg.join(", ")}`);
}

function writeReport(results: GenerationResult[], startedAt: number): void {
  const totalIn = results.reduce((s, r) => s + (r.tokensIn ?? 0), 0);
  const totalOut = results.reduce((s, r) => s + (r.tokensOut ?? 0), 0);
  const cost = totalIn * PRICE_IN + totalOut * PRICE_OUT;
  const ok = results.filter((r) => r.article && !r.error && !r.skipped);
  const failed = results.filter((r) => r.error);
  const skipped = results.filter((r) => r.skipped);
  const byLocale = {
    es: ok.filter((r) => r.locale === "es").length,
    en: ok.filter((r) => r.locale === "en").length,
  };

  const lines: string[] = [];
  lines.push(`# Blog generation report`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Duration: ${Math.round((Date.now() - startedAt) / 1000)}s`);
  lines.push("");
  lines.push(`## Counts`);
  lines.push(`- Success: ${ok.length} (ES ${byLocale.es} + EN ${byLocale.en})`);
  lines.push(`- Failed: ${failed.length}`);
  lines.push(`- Skipped (already existed): ${skipped.length}`);
  lines.push("");
  lines.push(`## Tokens & cost`);
  lines.push(`- Input tokens: ${totalIn.toLocaleString()}`);
  lines.push(`- Output tokens: ${totalOut.toLocaleString()}`);
  lines.push(`- Estimated cost: $${cost.toFixed(2)} USD`);
  lines.push("");
  if (failed.length) {
    lines.push(`## Failed`);
    for (const r of failed) {
      lines.push(`- **${r.brief.id} ${r.locale}** — ${r.error}`);
      if (r.validationErrors?.length) {
        for (const e of r.validationErrors) lines.push(`  - ${e}`);
      }
    }
    lines.push("");
  }
  lines.push(`## [VERIFICAR] markers to review before publish`);
  for (const r of ok) {
    if (!r.article?.verifyMarkers?.length) continue;
    lines.push(`### ${r.brief.id} ${r.locale} — ${r.brief.slugEs}`);
    for (const v of r.article.verifyMarkers) lines.push(`- ${v}`);
  }

  fs.writeFileSync(REPORT_PATH, lines.join("\n"), "utf-8");
  console.log(`\nReport: ${REPORT_PATH}`);
}

async function main() {
  const flags = parseFlags();
  const briefs = filterBriefs(parseAllBriefs(BRIEF_FILES), flags);
  const locs = locales(flags);

  if (!briefs.length) {
    console.log("No briefs matched filters.");
    process.exit(0);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!flags.dryRun) fs.writeFileSync(LOG_PATH, `# run ${new Date().toISOString()}\n`);

  printParseSample(briefs);
  printPlan(briefs, locs);

  if (flags.dryRun) {
    console.log("\n--dry-run: no API calls made.");
    process.exit(0);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set — run with --env-file=.env.local");
  const client = new Anthropic({ apiKey });

  const startedAt = Date.now();
  const results: GenerationResult[] = [];
  let processed = 0;
  let runningCost = 0;
  const total = briefs.length * locs.length;

  outer: for (const brief of briefs) {
    for (const locale of locs) {
      if (flags.max && processed >= flags.max) break outer;
      processed++;
      console.log(`\n[${processed}/${total}] ${brief.id} (${locale}) — ${brief.slugEs}`);
      try {
        const result = await generateOne(client, brief, locale, flags);
        results.push(result);
        runningCost += (result.tokensIn ?? 0) * PRICE_IN + (result.tokensOut ?? 0) * PRICE_OUT;
        if (runningCost > COST_CEILING_USD) {
          log(
            `\n✗ Cost ceiling $${COST_CEILING_USD} exceeded ($${runningCost.toFixed(2)}) — aborting.`,
          );
          break outer;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log(`  ✗ ${brief.id} ${locale} — fatal: ${msg}`);
        results.push({
          brief,
          locale,
          attempts: MAX_ATTEMPTS,
          error: msg,
        });
      }
      await sleep(DELAY_BETWEEN_CALLS_MS);
    }
  }

  writeReport(results, startedAt);
  console.log(
    `\nDone. Cost so far: $${runningCost.toFixed(2)} USD across ${results.length} attempts.`,
  );
  process.exit(results.some((r) => r.error) ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
