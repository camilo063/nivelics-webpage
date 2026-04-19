import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { isNull, and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { blogPosts } from "../lib/db/schema/admin";

const CSV_PATH = join(process.cwd(), "docs/seo/legacy-urls-gsc-2026-04-12.csv");
const OUT_DIR = join(process.cwd(), "docs/seo/buckets");

type LegacyBlog = {
  legacyUrl: string;
  legacyPath: string;
  locale: "es" | "en";
  legacySlug: string;
};

const lines = readFileSync(CSV_PATH, "utf-8").trim().split("\n").slice(1);
const legacyBlog: LegacyBlog[] = [];

for (const line of lines) {
  const url = line.split(",")[0];
  const path = url.replace(/^https?:\/\/[^/]+/, "");

  if (path.startsWith("/en/blog/")) {
    const slug = path.slice("/en/blog/".length).replace(/\/$/, "").trim();
    if (slug) legacyBlog.push({ legacyUrl: url, legacyPath: path, locale: "en", legacySlug: slug });
  } else if (path === "/en/blogs") {
    // hub redirect — skip here, handled elsewhere
  } else if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length).replace(/\/$/, "").trim();
    if (slug) legacyBlog.push({ legacyUrl: url, legacyPath: path, locale: "es", legacySlug: slug });
  }
}

console.log(`Legacy blog URLs parsed: ${legacyBlog.length}`);

async function main() {
  if (!db) {
    console.error("DB not connected — DATABASE_URL missing");
    process.exit(1);
  }

  const posts = await db
    .select({
      slug: blogPosts.slug,
      titleEs: blogPosts.titleEs,
      titleEn: blogPosts.titleEn,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")));

  console.log(`Published posts in DB: ${posts.length}`);

  const dbSlugs = new Set(posts.map((p) => p.slug));
  const dbSlugList = posts.map((p) => p.slug);

  // Tokenize: split slug on hyphens, lowercase, remove stopwords
  const STOP_ES = new Set([
    "de",
    "la",
    "el",
    "los",
    "las",
    "un",
    "una",
    "y",
    "o",
    "en",
    "a",
    "que",
    "del",
    "al",
    "con",
    "para",
    "por",
    "su",
    "sus",
    "lo",
    "mi",
    "tu",
    "te",
    "es",
    "son",
    "como",
    "cuando",
    "donde",
    "mas",
    "mas",
    "pero",
    "tambien",
  ]);
  const STOP_EN = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "of",
    "in",
    "to",
    "for",
    "with",
    "on",
    "at",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "how",
    "why",
    "what",
    "when",
    "where",
    "your",
    "you",
    "my",
    "our",
    "it",
    "its",
    "this",
    "that",
  ]);

  function tokenize(slug: string, locale: "es" | "en"): Set<string> {
    const stops = locale === "es" ? STOP_ES : STOP_EN;
    return new Set(
      slug
        .toLowerCase()
        .split("-")
        .filter((w) => w.length > 2 && !stops.has(w)),
    );
  }

  function jaccard(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) return 0;
    const inter = [...a].filter((x) => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    return inter / union;
  }

  function normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  type Mapping = {
    legacyUrl: string;
    legacyPath: string;
    newPath: string;
    type: "direct" | "rename" | "hub";
    confidence: "high" | "medium" | "low";
    matchedDbSlug?: string;
    matchedTitle?: string;
    jaccardScore?: number;
  };

  const mappings: Mapping[] = [];

  for (const legacy of legacyBlog) {
    const hubPath = legacy.locale === "es" ? "/blog" : "/en/blog";

    // 1. Exact slug match
    if (dbSlugs.has(legacy.legacySlug)) {
      mappings.push({
        legacyUrl: legacy.legacyUrl,
        legacyPath: legacy.legacyPath,
        newPath: legacy.legacyPath,
        type: "direct",
        confidence: "high",
        matchedDbSlug: legacy.legacySlug,
      });
      continue;
    }

    // 2. Case-insensitive exact match (e.g. Nivelics vs nivelics)
    const ciMatch = dbSlugList.find((s) => s.toLowerCase() === legacy.legacySlug.toLowerCase());
    if (ciMatch) {
      mappings.push({
        legacyUrl: legacy.legacyUrl,
        legacyPath: legacy.legacyPath,
        newPath: `${legacy.locale === "es" ? "/blog" : "/en/blog"}/${ciMatch}`,
        type: "rename",
        confidence: "high",
        matchedDbSlug: ciMatch,
      });
      continue;
    }

    // 3. Fuzzy: slug-to-slug Jaccard + slug-to-normalized-title Jaccard
    const legacyTokens = tokenize(legacy.legacySlug, legacy.locale);
    let bestScore = 0;
    let bestSlug: string | undefined;
    let bestTitle: string | undefined;

    for (const post of posts) {
      const dbSlugTokens = tokenize(post.slug, legacy.locale);
      const slugScore = jaccard(legacyTokens, dbSlugTokens);

      const titleToCheck = legacy.locale === "es" ? post.titleEs : (post.titleEn ?? post.titleEs);
      const titleSlugish = normalizeTitle(titleToCheck);
      const titleTokens = tokenize(titleSlugish, legacy.locale);
      const titleScore = jaccard(legacyTokens, titleTokens);

      const score = Math.max(slugScore, titleScore);
      if (score > bestScore) {
        bestScore = score;
        bestSlug = post.slug;
        bestTitle = titleToCheck;
      }
    }

    if (bestSlug && bestScore >= 0.5) {
      mappings.push({
        legacyUrl: legacy.legacyUrl,
        legacyPath: legacy.legacyPath,
        newPath: `${legacy.locale === "es" ? "/blog" : "/en/blog"}/${bestSlug}`,
        type: "rename",
        confidence: bestScore >= 0.7 ? "high" : "medium",
        matchedDbSlug: bestSlug,
        matchedTitle: bestTitle,
        jaccardScore: Number(bestScore.toFixed(3)),
      });
    } else {
      mappings.push({
        legacyUrl: legacy.legacyUrl,
        legacyPath: legacy.legacyPath,
        newPath: hubPath,
        type: "hub",
        confidence: "low",
        ...(bestSlug
          ? {
              matchedDbSlug: bestSlug,
              matchedTitle: bestTitle,
              jaccardScore: Number(bestScore.toFixed(3)),
            }
          : {}),
      });
    }
  }

  // Stats
  const stats = {
    total: mappings.length,
    direct: mappings.filter((m) => m.type === "direct").length,
    rename: mappings.filter((m) => m.type === "rename").length,
    hub: mappings.filter((m) => m.type === "hub").length,
    es: mappings.filter((m) => m.legacyPath.startsWith("/blog/")).length,
    en: mappings.filter((m) => m.legacyPath.startsWith("/en/blog/")).length,
    highConf: mappings.filter((m) => m.confidence === "high").length,
    mediumConf: mappings.filter((m) => m.confidence === "medium").length,
    lowConf: mappings.filter((m) => m.confidence === "low").length,
  };

  console.log("\nMapping stats:");
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(12)} ${v}`);

  // Write CSV output
  const header = "legacy_url,new_url,type,confidence,matched_db_slug,matched_title,jaccard";
  const rows = mappings.map((m) => {
    const title = (m.matchedTitle ?? "").replace(/"/g, '""');
    return [
      m.legacyPath,
      m.newPath,
      m.type,
      m.confidence,
      m.matchedDbSlug ?? "",
      `"${title}"`,
      m.jaccardScore ?? "",
    ].join(",");
  });

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "blog-mapping.csv"), [header, ...rows].join("\n") + "\n");

  console.log(`\nWrote ${mappings.length} rows to docs/seo/buckets/blog-mapping.csv`);

  // Dump medium/low confidence + hub cases for manual review
  const review = mappings.filter((m) => m.confidence !== "high" || m.type === "hub");
  console.log(`\nCases needing review: ${review.length}`);
  if (review.length > 0 && review.length <= 60) {
    for (const m of review) {
      console.log(
        `  [${m.type}/${m.confidence}] ${m.legacyPath} -> ${m.newPath}` +
          (m.matchedTitle ? `  (best: "${m.matchedTitle.slice(0, 60)}" @ ${m.jaccardScore})` : ""),
      );
    }
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
