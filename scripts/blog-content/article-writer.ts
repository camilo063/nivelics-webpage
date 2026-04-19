import fs from "node:fs";
import path from "node:path";
import type { Brief, GeneratedArticle, Locale } from "./types";

const BANNED_WORDS_ES = [
  "innovador",
  "disruptivo",
  "holístico",
  "holistico",
  "revolucionar",
  "revolucionario",
  "en la era digital",
  "desbloquear el potencial",
  "llevar al siguiente nivel",
  "soluciones vanguardistas",
  "vanguardista",
  "alinear sinergias",
];

const BANNED_WORDS_EN = [
  "innovative",
  "disruptive",
  "holistic",
  "revolutionize",
  "cutting-edge",
  "unlock the potential",
  "synergies",
  "leverage synergies",
];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  wordCount: number;
}

export function validateArticle(
  brief: Brief,
  article: GeneratedArticle,
  locale: Locale,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const wordCount = countWords(article.body);
  const minOk = Math.floor(brief.wordsMin * 0.8);
  const maxOk = Math.ceil(brief.wordsMax * 1.2);
  if (wordCount < minOk) errors.push(`word count ${wordCount} < 80% of target ${brief.wordsMin}`);
  if (wordCount > maxOk)
    warnings.push(`word count ${wordCount} > 120% of target ${brief.wordsMax}`);

  const bodyLower = article.body.toLowerCase();
  const banned = locale === "es" ? BANNED_WORDS_ES : BANNED_WORDS_EN;
  const hitBanned = banned.filter((w) => bodyLower.includes(w.toLowerCase()));
  if (hitBanned.length) errors.push(`banned words in body: ${hitBanned.join(", ")}`);

  const titleLower = article.title.toLowerCase();
  const titleBanned = banned.filter((w) => titleLower.includes(w.toLowerCase()));
  if (titleBanned.length) errors.push(`banned words in title: ${titleBanned.join(", ")}`);

  const h2Count = (article.body.match(/^##\s+/gm) ?? []).length;
  if (h2Count < brief.h2List.length) {
    errors.push(`body has ${h2Count} H2s but brief expects ${brief.h2List.length}`);
  }

  if (locale === "es" && brief.h2List.length) {
    const bodyH2s = extractBodyH2s(article.body).map((s) => normalize(s));
    const missing = brief.h2List
      .filter((h2) => !bodyH2s.some((b) => matchesH2(b, normalize(h2))))
      .slice(0, 3);
    if (missing.length > 2) {
      errors.push(`missing H2s: ${missing.join(" | ")}`);
    } else if (missing.length) {
      warnings.push(`weak H2 match: ${missing.join(" | ")}`);
    }
  }

  if (article.faqItems.length < 4) errors.push(`FAQ has ${article.faqItems.length} items (min 4)`);
  if (article.faqItems.length > 8)
    warnings.push(`FAQ has ${article.faqItems.length} items (max ~6)`);

  if (brief.ctaPrimary && !article.body.includes(brief.ctaPrimary.url)) {
    errors.push(`primary CTA URL missing from body: ${brief.ctaPrimary.url}`);
  }

  const linkHits = brief.internalLinks.filter((l) => l.startsWith("/") && article.body.includes(l));
  if (brief.internalLinks.filter((l) => l.startsWith("/")).length >= 2 && linkHits.length < 2) {
    warnings.push(`internal links hit ${linkHits.length} of ${brief.internalLinks.length}`);
  }

  if (!article.metaDescription || article.metaDescription.length > 165) {
    errors.push(`metaDescription missing or > 165 chars (${article.metaDescription?.length ?? 0})`);
  }

  return { ok: errors.length === 0, errors, warnings, wordCount };
}

export interface WriteOptions {
  outputDir: string;
  locale: Locale;
  force?: boolean;
}

export interface WriteResult {
  filePath: string;
  wrote: boolean;
  skipped: boolean;
}

export function writeArticle(
  brief: Brief,
  article: GeneratedArticle,
  opts: WriteOptions,
): WriteResult {
  const dir = path.join(opts.outputDir, opts.locale);
  fs.mkdirSync(dir, { recursive: true });
  const slug = opts.locale === "es" ? brief.slugEs : brief.slugEn;
  const filePath = path.join(dir, `${slug}.md`);
  const metaPath = path.join(dir, `${slug}.meta.json`);

  if (fs.existsSync(filePath) && !opts.force) {
    return { filePath, wrote: false, skipped: true };
  }

  const contents = buildMarkdown(brief, article, opts.locale);
  fs.writeFileSync(filePath, contents, "utf-8");

  const meta = {
    id: brief.id,
    dbSlug: brief.slugEs,
    localizedSlug: slug,
    locale: opts.locale,
    category: brief.category,
    isPillar: brief.isPillar,
    briefType: brief.type,
    title: article.title,
    h1: article.h1,
    metaDescription: article.metaDescription,
    body: article.body,
    faqItems: article.faqItems,
    schemaOrg: article.schemaOrg,
    verifyMarkers: article.verifyMarkers,
    redirectFrom: brief.redirectFrom,
    wordCount: countWords(article.body),
    readingTimeMinutes: Math.max(1, Math.round(countWords(article.body) / 220)),
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

  return { filePath, wrote: true, skipped: false };
}

export function articleExists(outputDir: string, brief: Brief, locale: Locale): boolean {
  const slug = locale === "es" ? brief.slugEs : brief.slugEn;
  return fs.existsSync(path.join(outputDir, locale, `${slug}.md`));
}

function buildMarkdown(brief: Brief, article: GeneratedArticle, locale: Locale): string {
  const esCanonical = `https://www.nivelics.com/blog/${brief.slugEs}`;
  // NOTE: current route uses the same slug for ES and EN (single `slug` column).
  // When slug_en is added, change enCanonical to use brief.slugEn.
  const enCanonical = `https://www.nivelics.com/en/blog/${brief.slugEs}`;
  const canonical = locale === "es" ? esCanonical : enCanonical;

  const frontmatter = {
    id: brief.id,
    title: article.title,
    slug: locale === "es" ? brief.slugEs : brief.slugEn,
    dbSlug: brief.slugEs,
    category: brief.category,
    locale,
    status: "draft",
    isPillar: brief.isPillar,
    briefType: brief.type,
    publishDate: null,
    canonicalUrl: canonical,
    hreflang: { es: esCanonical, en: enCanonical },
    author: "Equipo Nivelics",
    metaDescription: article.metaDescription,
    ogImage: null,
    schemaOrg: article.schemaOrg.length ? article.schemaOrg : brief.schemaOrg,
    redirectFrom: brief.redirectFrom,
    verifyMarkers: article.verifyMarkers,
    queryObjective: brief.queryObjective,
    wordCount: countWords(article.body),
  };

  const yaml = toYaml(frontmatter);
  const bodyWithoutFaq = stripTrailingFaq(article.body, locale);
  const faqSection = renderFaq(article.faqItems, locale);
  const h1 = article.h1.startsWith("# ") ? article.h1 : `# ${article.h1}`;
  return `---\n${yaml}---\n\n${h1}\n\n${bodyWithoutFaq.trim()}\n\n${faqSection}\n`;
}

function stripTrailingFaq(body: string, locale: Locale): string {
  const faqHeading =
    locale === "es"
      ? /\n\s*##\s+(preguntas frecuentes|faq)\b/i
      : /\n\s*##\s+(frequently asked questions|faq)\b/i;
  const m = body.match(faqHeading);
  if (!m || m.index === undefined) return body;
  return body.slice(0, m.index).trimEnd();
}

function renderFaq(items: Array<{ question: string; answer: string }>, locale: Locale): string {
  if (!items.length) return "";
  const heading = locale === "es" ? "## Preguntas frecuentes" : "## Frequently asked questions";
  const body = items.map((it) => `### ${it.question.trim()}\n\n${it.answer.trim()}`).join("\n\n");
  return `${heading}\n\n${body}`;
}

function toYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const lines: string[] = [];
  if (obj === null || obj === undefined) return `${pad}null\n`;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return (
      "\n" +
      obj
        .map((v) => {
          if (typeof v === "object" && v !== null) {
            return `${pad}- \n${toYaml(v, indent + 1)}`;
          }
          return `${pad}- ${yamlScalar(v)}`;
        })
        .join("\n")
    );
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v === null || v === undefined) {
        lines.push(`${pad}${k}: null`);
      } else if (Array.isArray(v)) {
        if (v.length === 0) {
          lines.push(`${pad}${k}: []`);
        } else {
          lines.push(`${pad}${k}:`);
          for (const item of v) {
            if (typeof item === "object" && item !== null) {
              const nested = toYaml(item, indent + 2).replace(/\n$/, "");
              lines.push(`${pad}  -\n${nested}`);
            } else {
              lines.push(`${pad}  - ${yamlScalar(item)}`);
            }
          }
        }
      } else if (typeof v === "object") {
        lines.push(`${pad}${k}:`);
        lines.push(toYaml(v, indent + 1).replace(/\n$/, ""));
      } else {
        lines.push(`${pad}${k}: ${yamlScalar(v)}`);
      }
    }
    return lines.join("\n") + "\n";
  }
  return `${pad}${yamlScalar(obj)}\n`;
}

function yamlScalar(v: unknown): string {
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (v === null || v === undefined) return "null";
  const s = String(v);
  if (s === "") return '""';
  if (/[:\-#?&*!|>'"%@`{}[\],\n]/.test(s) || /^\s|\s$/.test(s)) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return s;
}

function countWords(text: string): number {
  const stripped = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_>~|-]/g, " ");
  return stripped.split(/\s+/).filter(Boolean).length;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractBodyH2s(body: string): string[] {
  // Only real H2s — skip ## headings inside fenced code blocks.
  const lines = body.split("\n");
  const out: string[] = [];
  let inFence = false;
  for (const l of lines) {
    if (/^```/.test(l)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = l.match(/^##\s+(.+?)\s*$/);
    if (m) out.push(m[1]);
  }
  return out;
}

function matchesH2(bodyH2: string, briefH2: string): boolean {
  if (bodyH2 === briefH2) return true;
  // Significant content words (>4 chars). Body H2 must contain at least
  // 2 of the brief's significant words (or all if fewer than 3).
  const words = briefH2
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  if (!words.length) return bodyH2.includes(briefH2.slice(0, 20));
  const needed = Math.min(2, words.length);
  let hits = 0;
  for (const w of words) if (bodyH2.includes(w)) hits++;
  return hits >= needed;
}
