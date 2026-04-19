/**
 * Normalize blog_posts.content_es / content_en from markdown → HTML.
 *
 * Only touches rows where the content appears to be markdown (no HTML tags
 * and contains markdown signals). HTML rows and empty rows are skipped.
 *
 * Dry-run by default. Pass --apply to write to DB.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/normalize-blog-content.ts
 *   node --env-file=.env.local --import tsx scripts/normalize-blog-content.ts --apply
 */
import { marked } from "marked";
import { db } from "../lib/db";
import { blogPosts } from "../lib/db/schema/admin";
import { eq, isNull } from "drizzle-orm";

const HTML_SIGNAL = /<\s*(h[1-6]|p|ul|ol|table|blockquote|div|section|article|pre|strong|em|a\s)/i;
const MD_SIGNAL = /(^|\n)(##\s|\*\*[^*]+\*\*|^- |^\d+\.\s|```)/;

marked.setOptions({ gfm: true, breaks: false });

type Transition = "skip-html" | "skip-empty" | "converted" | "plain-wrap";

function shouldConvert(s: string | null | undefined): Transition {
  if (!s || !s.trim()) return "skip-empty";
  if (HTML_SIGNAL.test(s)) return "skip-html";
  if (MD_SIGNAL.test(s)) return "converted";
  return "plain-wrap";
}

function transform(s: string, t: Transition): string {
  if (t === "converted") return marked.parse(s, { async: false }) as string;
  if (t === "plain-wrap") {
    // wrap plain text as paragraphs split by double newline
    const paragraphs = s
      .split(/\n{2,}/)
      .map((p) => `<p>${p.trim().replace(/\n/g, " ")}</p>`)
      .join("\n");
    return paragraphs;
  }
  return s;
}

async function main() {
  const apply = process.argv.includes("--apply");
  if (!db) throw new Error("DATABASE_URL missing");

  const rows = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      contentEs: blogPosts.contentEs,
      contentEn: blogPosts.contentEn,
    })
    .from(blogPosts)
    .where(isNull(blogPosts.deletedAt));

  const counts = {
    "skip-html": 0,
    "skip-empty": 0,
    converted: 0,
    "plain-wrap": 0,
  } as Record<Transition, number>;

  let changed = 0;

  for (const r of rows) {
    const tEs = shouldConvert(r.contentEs);
    const tEn = shouldConvert(r.contentEn);
    counts[tEs]++;
    counts[tEn]++;

    const touch = tEs !== "skip-html" && tEs !== "skip-empty";
    const touchEn = tEn !== "skip-html" && tEn !== "skip-empty";
    if (!touch && !touchEn) continue;

    const newEs = touch ? transform(r.contentEs!, tEs) : r.contentEs;
    const newEn = touchEn ? transform(r.contentEn!, tEn) : r.contentEn;

    const esInfo = touch ? `ES ${tEs} (${r.contentEs!.length}→${newEs!.length})` : `ES ${tEs}`;
    const enInfo = touchEn ? `EN ${tEn} (${r.contentEn!.length}→${newEn!.length})` : `EN ${tEn}`;
    console.log(`  ${apply ? "✓" : "·"} ${r.slug}  | ${esInfo}  | ${enInfo}`);

    if (apply) {
      await db
        .update(blogPosts)
        .set({
          contentEs: newEs,
          contentEn: newEn,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, r.id));
    }
    changed++;
  }

  console.log("");
  console.log(`Summary (rows × 2 locales):`);
  console.log(`  converted (markdown→HTML): ${counts.converted}`);
  console.log(`  plain-wrap (plain→<p>):    ${counts["plain-wrap"]}`);
  console.log(`  skip-html:                 ${counts["skip-html"]}`);
  console.log(`  skip-empty:                ${counts["skip-empty"]}`);
  console.log("");
  console.log(
    apply
      ? `Applied. ${changed} posts updated.`
      : `Dry-run. ${changed} posts would be updated. Re-run with --apply to commit.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
