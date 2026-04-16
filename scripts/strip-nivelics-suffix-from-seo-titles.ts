/**
 * Strip trailing "| Nivelics" (or " - Nivelics") from seo_title_es/seo_title_en
 * across all content tables. The Next.js metadata template (`%s | Nivelics`)
 * adds it automatically, so hardcoding it causes duplication in SERPs.
 *
 * Run with: node --env-file=.env.local --import tsx scripts/strip-nivelics-suffix-from-seo-titles.ts
 */
import { db } from "@/lib/db";
import {
  blogPosts,
  casosExito,
  servicios,
  industrias,
  pagesGeneral,
  productos,
} from "@/lib/db/schema/admin";
import { eq } from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";

// Match " | Nivelics", " | nivelics", " - Nivelics" at the end (case-insensitive).
const SUFFIX_RE = /\s*[|\-–—]\s*Nivelics\s*$/i;

function strip(s: string | null | undefined): string | null {
  if (!s) return null;
  const cleaned = s.replace(SUFFIX_RE, "").trim();
  return cleaned.length ? cleaned : null;
}

type TableWithSeo = {
  name: string;
  // Drizzle tables are typed; we only care about id + seo title columns.
  // Using `any` here is pragmatic for a one-off script.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
};

async function processTable({ name, table }: TableWithSeo) {
  console.log(`\n─── ${name} ───`);
  const rows = await db!.select().from(table as PgTable);
  let updated = 0;
  for (const row of rows as Array<Record<string, unknown>>) {
    const id = row.id as string;
    const oldEs = row.seoTitleEs as string | null;
    const oldEn = row.seoTitleEn as string | null;
    const newEs = strip(oldEs);
    const newEn = strip(oldEn);

    const needsEs = oldEs != null && oldEs !== newEs;
    const needsEn = oldEn != null && oldEn !== newEn;
    if (!needsEs && !needsEn) continue;

    const patch: Record<string, string | null> = {};
    if (needsEs) patch.seoTitleEs = newEs;
    if (needsEn) patch.seoTitleEn = newEn;

    await db!
      .update(table as PgTable)
      .set(patch)
      .where(eq((table as unknown as { id: PgColumn }).id, id));

    if (needsEs) console.log(`  [${id}] ES: "${oldEs}" → "${newEs}"`);
    if (needsEn) console.log(`  [${id}] EN: "${oldEn}" → "${newEn}"`);
    updated++;
  }
  console.log(`  ${updated} row(s) updated in ${name}`);
}

async function main() {
  if (!db) {
    console.error("DB not initialized. Check .env.local");
    process.exit(1);
  }

  await processTable({ name: "blog_posts", table: blogPosts });
  await processTable({ name: "casos_exito", table: casosExito });
  await processTable({ name: "servicios", table: servicios });
  await processTable({ name: "industrias", table: industrias });
  await processTable({ name: "pages_general", table: pagesGeneral });
  await processTable({ name: "productos", table: productos });

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
