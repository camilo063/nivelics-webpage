/**
 * Seeds blog_posts + blog_categories from /content/generated/ markdown articles.
 *
 * Reads *.meta.json sidecars (written by scripts/blog-content/article-writer.ts),
 * pairs ES + EN by dbSlug, upserts by slug. Idempotent.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/seed-blog-posts.ts
 *   node --env-file=.env.local --import tsx scripts/seed-blog-posts.ts --publish-all
 *   node --env-file=.env.local --import tsx scripts/seed-blog-posts.ts --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { eq, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { blogCategories, blogPosts, adminUsers } from "../lib/db/schema/admin";

type ArticleMeta = {
  id: string;
  dbSlug: string;
  localizedSlug: string;
  locale: "es" | "en";
  category: string;
  isPillar: boolean;
  briefType: string;
  title: string;
  h1: string;
  metaDescription: string;
  body: string;
  faqItems: Array<{ question: string; answer: string }>;
  schemaOrg: string[];
  verifyMarkers: string[];
  redirectFrom: string[];
  wordCount: number;
  readingTimeMinutes: number;
};

const CATEGORY_NAMES: Record<string, { es: string; en: string }> = {
  "inteligencia-artificial": { es: "Inteligencia Artificial", en: "Artificial Intelligence" },
  cloud: { es: "Cloud", en: "Cloud" },
  "staff-augmentation": { es: "Staff Augmentation", en: "Staff Augmentation" },
  ciberseguridad: { es: "Ciberseguridad", en: "Cybersecurity" },
  desarrollo: { es: "Desarrollo", en: "Development" },
  industrias: { es: "Industrias", en: "Industries" },
};

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT_DIR = path.join(ROOT, "content", "generated");

function loadMeta(locale: "es" | "en"): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".meta.json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as ArticleMeta);
}

async function ensureCategory(slug: string): Promise<string> {
  const existing = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, slug))
    .limit(1);
  if (existing[0]) return existing[0].id;
  const names = CATEGORY_NAMES[slug] ?? { es: slug, en: slug };
  const [created] = await db
    .insert(blogCategories)
    .values({ slug, nameEs: names.es, nameEn: names.en })
    .returning({ id: blogCategories.id });
  console.log(`  ✓ created category ${slug} (${names.es})`);
  return created.id;
}

async function getDefaultAuthorId(): Promise<string> {
  const [first] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.isActive, true))
    .limit(1);
  if (!first) throw new Error("no active admin_users found — create one first");
  return first.id;
}

async function upsertPost(args: {
  dbSlug: string;
  es: ArticleMeta;
  en?: ArticleMeta;
  categoryId: string;
  authorId: string;
  publish: boolean;
}): Promise<void> {
  const { es, en, dbSlug, categoryId, authorId, publish } = args;
  const tags: string[] = [];
  const status = publish ? "published" : "draft";
  const translationStatusEn = en ? "complete" : "pending";
  const publishedAt = publish ? new Date() : null;

  const values = {
    slug: dbSlug,
    titleEs: es.title,
    titleEn: en?.title,
    excerptEs: es.metaDescription,
    excerptEn: en?.metaDescription,
    contentEs: es.body,
    contentEn: en?.body,
    authorId,
    categoryId,
    tags,
    seoTitleEs: es.title,
    seoTitleEn: en?.title,
    seoDescriptionEs: es.metaDescription,
    seoDescriptionEn: en?.metaDescription,
    readingTimeMinutes: es.readingTimeMinutes,
    status: status as "draft" | "published",
    translationStatusEn: translationStatusEn as "complete" | "pending",
    publishedAt,
  };

  await db
    .insert(blogPosts)
    .values(values)
    .onConflictDoUpdate({
      target: blogPosts.slug,
      set: {
        titleEs: values.titleEs,
        titleEn: values.titleEn,
        excerptEs: values.excerptEs,
        excerptEn: values.excerptEn,
        contentEs: values.contentEs,
        contentEn: values.contentEn,
        categoryId: values.categoryId,
        seoTitleEs: values.seoTitleEs,
        seoTitleEn: values.seoTitleEn,
        seoDescriptionEs: values.seoDescriptionEs,
        seoDescriptionEn: values.seoDescriptionEn,
        readingTimeMinutes: values.readingTimeMinutes,
        translationStatusEn: values.translationStatusEn,
        updatedAt: sql`now()`,
      },
    });
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const publishAll = args.has("--publish-all");

  if (!db) throw new Error("DATABASE_URL missing — did you run with --env-file=.env.local?");

  const esArticles = loadMeta("es");
  const enArticles = loadMeta("en");
  console.log(`Loaded ${esArticles.length} ES + ${enArticles.length} EN articles`);

  if (!esArticles.length) {
    console.log("No ES articles found under /content/generated/es — nothing to seed.");
    process.exit(0);
  }

  const enByDbSlug = new Map(enArticles.map((a) => [a.dbSlug, a]));
  const categoryIds = new Map<string, string>();
  const authorId = dryRun ? "dry-run-uuid" : await getDefaultAuthorId();

  let upserted = 0;
  let skipped = 0;

  for (const es of esArticles) {
    const en = enByDbSlug.get(es.dbSlug);
    if (!es.category) {
      console.warn(`  ⚠ ${es.dbSlug}: no category — skipping`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(
        `  [dry-run] would upsert ${es.dbSlug} (${es.category}) — ES=${es.wordCount}w, EN=${en ? `${en.wordCount}w` : "none"}`,
      );
      upserted++;
      continue;
    }

    let categoryId = categoryIds.get(es.category);
    if (!categoryId) {
      categoryId = await ensureCategory(es.category);
      categoryIds.set(es.category, categoryId);
    }

    await upsertPost({
      dbSlug: es.dbSlug,
      es,
      en,
      categoryId,
      authorId,
      publish: publishAll,
    });
    upserted++;
    console.log(
      `  ✓ ${es.dbSlug}  [${es.category}]  ES=${es.wordCount}w${en ? ` EN=${en.wordCount}w` : ""}`,
    );
  }

  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
