/**
 * Audit blog_posts.content_es / content_en format distribution.
 *
 * Classifies each post as HTML, Markdown, or plain text and writes a
 * summary + per-row list to /tmp/blog-content-audit.txt.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/audit-blog-content.ts
 */
import fs from "node:fs";
import { db } from "../lib/db";
import { blogPosts } from "../lib/db/schema/admin";
import { isNull } from "drizzle-orm";

type Format = "html" | "markdown" | "plain" | "empty";

const HTML_SIGNAL = /<\s*(h[1-6]|p|ul|ol|table|blockquote|div|section|article|pre|strong|em|a\s)/i;
const MD_SIGNAL = /(^|\n)(##\s|\*\*[^*]+\*\*|^- |^\d+\.\s|```)/;

function classify(s: string | null | undefined): Format {
  if (!s || !s.trim()) return "empty";
  if (HTML_SIGNAL.test(s)) return "html";
  if (MD_SIGNAL.test(s)) return "markdown";
  return "plain";
}

async function main() {
  if (!db) throw new Error("DATABASE_URL missing");

  const rows = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      titleEs: blogPosts.titleEs,
      contentEs: blogPosts.contentEs,
      contentEn: blogPosts.contentEn,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(isNull(blogPosts.deletedAt));

  const lines: string[] = [];
  const countEs: Record<Format, number> = { html: 0, markdown: 0, plain: 0, empty: 0 };
  const countEn: Record<Format, number> = { html: 0, markdown: 0, plain: 0, empty: 0 };

  lines.push(`# Blog content audit — ${new Date().toISOString()}`);
  lines.push(`Total posts: ${rows.length}`);
  lines.push("");
  lines.push(`| ID | slug | status | ES format | ES len | EN format | EN len |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);

  for (const r of rows) {
    const fEs = classify(r.contentEs);
    const fEn = classify(r.contentEn);
    countEs[fEs]++;
    countEn[fEn]++;
    lines.push(
      `| \`${r.id.slice(0, 8)}\` | \`${r.slug}\` | ${r.status} | ${fEs} | ${r.contentEs?.length ?? 0} | ${fEn} | ${r.contentEn?.length ?? 0} |`,
    );
  }

  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("**Español:**");
  lines.push(`- HTML: ${countEs.html}`);
  lines.push(`- Markdown: ${countEs.markdown}`);
  lines.push(`- Plain: ${countEs.plain}`);
  lines.push(`- Empty: ${countEs.empty}`);
  lines.push("");
  lines.push("**English:**");
  lines.push(`- HTML: ${countEn.html}`);
  lines.push(`- Markdown: ${countEn.markdown}`);
  lines.push(`- Plain: ${countEn.plain}`);
  lines.push(`- Empty: ${countEn.empty}`);

  const output = lines.join("\n");
  fs.writeFileSync("/tmp/blog-content-audit.txt", output, "utf-8");
  console.log(output);
  console.log("\nReport: /tmp/blog-content-audit.txt");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
