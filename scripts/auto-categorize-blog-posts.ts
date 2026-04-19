/**
 * Auto-categorize blog posts with a null categoryId.
 *
 * Uses Claude (see lib/admin/categorize.ts) to pick the best category slug
 * from the active taxonomy. Dry-run by default — passes `--apply` to write
 * the assignments back to `blog_posts`.
 *
 * Run:
 *   node --env-file=.env.local --import tsx scripts/auto-categorize-blog-posts.ts
 *   node --env-file=.env.local --import tsx scripts/auto-categorize-blog-posts.ts --apply
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { and, eq, isNull } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";
import { classifyPost } from "../lib/admin/categorize";

const RATE_DELAY_MS = 600;
let lastCallAt = 0;

async function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const wait = RATE_DELAY_MS - (Date.now() - lastCallAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
  return fn();
}

async function main() {
  const apply = process.argv.includes("--apply");
  const databaseUrl = process.env.DATABASE_URL;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!databaseUrl) throw new Error("DATABASE_URL not set");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const categories = await db.select().from(schema.blogCategories);
  if (categories.length === 0) {
    console.error("No categories found in blog_categories. Aborting.");
    process.exit(1);
  }

  const uncategorized = await db
    .select({
      id: schema.blogPosts.id,
      slug: schema.blogPosts.slug,
      titleEs: schema.blogPosts.titleEs,
      excerptEs: schema.blogPosts.excerptEs,
      contentEs: schema.blogPosts.contentEs,
    })
    .from(schema.blogPosts)
    .where(and(isNull(schema.blogPosts.categoryId), isNull(schema.blogPosts.deletedAt)));

  console.log(`Mode: ${apply ? "APPLY (writing to DB)" : "DRY RUN (no writes)"}`);
  console.log(`Categories: ${categories.map((c) => c.slug).join(", ")}`);
  console.log(`Uncategorized posts: ${uncategorized.length}\n`);

  if (uncategorized.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  const candidates = categories.map((c) => ({
    slug: c.slug,
    nameEs: c.nameEs,
    nameEn: c.nameEn,
  }));

  let ok = 0;
  let skipped = 0;

  for (const post of uncategorized) {
    const title = post.titleEs || "";
    const excerpt = post.excerptEs || "";
    const content = post.contentEs || "";

    try {
      const result = await throttled(() =>
        classifyPost(apiKey, candidates, { title, excerpt, content }),
      );
      const match = categories.find((c) => c.slug === result.slug);
      if (!match) {
        console.warn(`  SKIP  /${post.slug} — no valid category returned`);
        skipped++;
        continue;
      }

      console.log(`  ${match.slug.padEnd(22)} → /${post.slug}   (${title.slice(0, 60)})`);

      if (apply) {
        await db
          .update(schema.blogPosts)
          .set({ categoryId: match.id, updatedAt: new Date() })
          .where(eq(schema.blogPosts.id, post.id));
      }
      ok++;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`  ERROR /${post.slug}: ${message}`);
      skipped++;
    }
  }

  console.log(`\nDone. ${ok} categorized, ${skipped} skipped.`);
  if (!apply) console.log("Re-run with --apply to persist changes.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
