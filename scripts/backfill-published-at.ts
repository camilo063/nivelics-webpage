/**
 * Rellena `blog_posts.published_at` en los artículos publicados que no lo tienen.
 *
 * 46 de los 52 artículos publicados son anteriores a esa columna y la traen en NULL. Como
 * consecuencia, `BlogPosting.datePublished` y la fecha visible caían a `created_at` por
 * código, y el orden de los listados dependía de un `coalesce`. Con la columna rellena, la
 * fecha que ve Google es la misma que muestra la página y no depende de un respaldo.
 *
 * Usa `created_at` (cuándo entró el artículo al CMS), que es el dato real que existe: no
 * inventa fechas ni las adelanta para simular frescura.
 *
 * Idempotente: solo toca filas con `published_at IS NULL`.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/backfill-published-at.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/backfill-published-at.ts
 */
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");

async function main(): Promise<void> {
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }

  const rows = await db
    .select({ id: blogPosts.id, slug: blogPosts.slug, createdAt: blogPosts.createdAt })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        isNull(blogPosts.deletedAt),
        isNull(blogPosts.publishedAt),
      ),
    );

  if (!rows.length) {
    console.log("• Nada que rellenar: todos los artículos publicados tienen published_at.");
    process.exit(0);
  }

  console.log(`${rows.length} artículos publicados sin published_at.`);
  for (const row of rows) {
    const date = row.createdAt;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slug} → ${date.toISOString().slice(0, 10)}`);
      continue;
    }
    // `updatedAt` no se toca: es la señal de última modificación del contenido.
    await db.update(blogPosts).set({ publishedAt: date }).where(eq(blogPosts.id, row.id));
    console.log(`✓ ${row.slug} → ${date.toISOString().slice(0, 10)}`);
  }

  console.log(
    DRY_RUN
      ? "\nDry-run completo. Corre sin --dry-run para escribir."
      : "\nListo. Corre export-fallbacks.ts y revalida el blog.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
