/**
 * Carga los 6 artículos de «Ingeniería de agentes» (ES + EN) y limpia el artículo
 * `agentes-ia-casos-uso-empresa-b2b`.
 *
 * Por qué no se usa seed-blog-posts.ts: aquel hace upsert de TODOS los .meta.json de
 * content/generated y pisaría los 46 artículos publicados, incluidas las ediciones hechas
 * en el admin. Este script solo toca los 6 slugs de content/agentes/articulos/ y el
 * artículo de la limpieza.
 *
 * Qué hace con cada artículo:
 *  - quita los comentarios <!-- DIAGRAMA/DIAGRAM --> (son el encargo del diseñador; si
 *    llegaran a la BD saldrían en el HTML de la página y en llms-full.txt);
 *  - quita el H1 del cuerpo (la página ya pinta el título como H1);
 *  - agrega al final «Preguntas frecuentes» y «Fuentes» a partir del frontmatter;
 *  - convierte markdown → HTML con marked (el formato que guarda el editor del admin);
 *  - portada y og:image = /blog/agentes/<slug>-cover.png (servidas desde /public).
 *
 * Estado: entra como BORRADOR salvo que pases --publish. Un artículo ya publicado conserva
 * su fecha de publicación.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-articulos-agentes.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-articulos-agentes.ts --publish
 *   node --import tsx scripts/seed-articulos-agentes.ts --fallbacks   (artículos + limpieza en data/fallbacks, sin BD)
 * Después:
 *   node --env-file=.env.local --import tsx scripts/export-fallbacks.ts
 *   y revalidar el sitio (admin → revalidar) o redesplegar: las páginas del blog cachean 24 h.
 */
import { randomUUID } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { marked } from "marked";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers, blogCategories, blogPosts } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISH = process.argv.includes("--publish");
const FALLBACKS = process.argv.includes("--fallbacks");

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, "content/agentes/articulos");
const CLEANUP_FILE = join(ROOT, "content/agentes/limpieza-agentes-ia-casos-uso.json");
const CATEGORY_SLUG = "inteligencia-artificial";
const WORDS_PER_MINUTE = 230;

marked.setOptions({ gfm: true, breaks: false });

type Locale = "es" | "en";

interface Frontmatter {
  slug: string;
  category: string;
  locale: Locale;
  title: string;
  metaDescription: string;
  tags: string[];
  coverAlt: string;
  faqItems: Array<{ question: string; answer: string }>;
  sources: string[];
}

interface Article {
  fm: Frontmatter;
  html: string;
  words: number;
}

const LABELS = {
  es: { faq: "Preguntas frecuentes", sources: "Fuentes" },
  en: { faq: "Frequently asked questions", sources: "Sources" },
};

/* ── lectura y transformación ────────────────────────────────────────────── */

function parseArticle(file: string, locale: Locale): Article {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: sin frontmatter`);
  const fm = parseYaml(match[1]) as Frontmatter;
  if (fm.locale !== locale) throw new Error(`${file}: locale ${fm.locale} ≠ carpeta ${locale}`);

  let body = match[2]
    // Encargo de diagramas: nunca debe llegar a la BD.
    .replace(/<!--[\s\S]*?-->\n?/g, "")
    // La página pinta el título como H1; el cuerpo empieza en la intro.
    .replace(/^\s*# .+\n+/, "");

  const labels = LABELS[locale];
  const faq = fm.faqItems.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n");
  const sources = fm.sources.map((url) => `- [${hostLabel(url)}](${url})`).join("\n");
  body = `${body.trim()}\n\n## ${labels.faq}\n\n${faq}\n\n## ${labels.sources}\n\n${sources}\n`;

  const html = marked.parse(body, { async: false }) as string;
  const words = body
    .replace(/[#*`>\[\]()|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (/<!--|DIAGRAMA|DIAGRAM:/.test(html))
    throw new Error(`${file}: quedó un comentario de diagrama`);
  return { fm, html, words };
}

/** Solo el dominio: con la ruta completa, una URL larga sin cortes desbordaba en móvil. */
function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function loadArticles(): Array<{ slug: string; es: Article; en: Article }> {
  const esFiles = readdirSync(join(ARTICLES_DIR, "es")).filter((f) => f.endsWith(".md"));
  return esFiles.map((name) => {
    const enFile = join(ARTICLES_DIR, "en", name);
    if (!existsSync(enFile)) throw new Error(`Falta la versión EN de ${name}`);
    const es = parseArticle(join(ARTICLES_DIR, "es", name), "es");
    const en = parseArticle(enFile, "en");
    if (es.fm.slug !== en.fm.slug) throw new Error(`${name}: slug ES ≠ EN`);
    const cover = join(ROOT, "public/blog/agentes", `${es.fm.slug}-cover.png`);
    if (!existsSync(cover)) throw new Error(`Falta la portada ${cover}`);
    return { slug: es.fm.slug, es, en };
  });
}

/* ── limpieza del artículo viejo ─────────────────────────────────────────── */

type CleanupField =
  | "contentEs"
  | "contentEn"
  | "excerptEs"
  | "excerptEn"
  | "seoDescriptionEs"
  | "seoDescriptionEn";

interface Cleanup {
  slug: string;
  replacements: Partial<Record<CleanupField, Array<{ old: string; new: string }>>>;
}

function loadCleanup(): Cleanup | null {
  if (!existsSync(CLEANUP_FILE)) return null;
  return JSON.parse(readFileSync(CLEANUP_FILE, "utf8")) as Cleanup;
}

/**
 * Aplica los reemplazos exactos. Si un fragmento no aparece exactamente una vez, no se
 * escribe nada: el artículo pudo haberse editado en el admin después de preparar el parche.
 */
function applyCleanup(
  row: Partial<Record<CleanupField, string | null>>,
  cleanup: Cleanup,
): Partial<Record<CleanupField, string>> | null {
  const out: Partial<Record<CleanupField, string>> = {};
  for (const [field, reps] of Object.entries(cleanup.replacements) as Array<
    [CleanupField, Array<{ old: string; new: string }>]
  >) {
    let value = row[field] ?? "";
    for (const r of reps) {
      const count = value.split(r.old).length - 1;
      if (count === 0 && value.includes(r.new)) continue; // ya aplicado
      if (count !== 1) {
        console.error(
          `✗ ${cleanup.slug}.${field}: el fragmento aparece ${count} veces:\n  «${r.old.slice(0, 90)}…»`,
        );
        return null;
      }
      value = value.replace(r.old, r.new);
    }
    out[field] = value;
  }
  return out;
}

/* ── BD ──────────────────────────────────────────────────────────────────── */

async function getCategoryId(): Promise<string> {
  const [cat] = await db!
    .select({ id: blogCategories.id })
    .from(blogCategories)
    .where(eq(blogCategories.slug, CATEGORY_SLUG))
    .limit(1);
  if (!cat) throw new Error(`No existe la categoría '${CATEGORY_SLUG}'`);
  return cat.id;
}

async function getAuthorId(): Promise<string> {
  const [first] = await db!
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.isActive, true))
    .limit(1);
  if (!first) throw new Error("No hay admin_users activos");
  return first.id;
}

async function seedArticles(): Promise<void> {
  const articles = loadArticles();
  const categoryId = await getCategoryId();
  const authorId = await getAuthorId();

  for (const { slug, es, en } of articles) {
    const [existing] = await db!
      .select({ id: blogPosts.id, status: blogPosts.status, publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    const cover = `/blog/agentes/${slug}-cover.png`;
    const status = PUBLISH ? "published" : (existing?.status ?? "draft");
    const values = {
      slug,
      titleEs: es.fm.title,
      titleEn: en.fm.title,
      excerptEs: es.fm.metaDescription,
      excerptEn: en.fm.metaDescription,
      contentEs: es.html,
      contentEn: en.html,
      coverImage: cover,
      coverImageAltEs: es.fm.coverAlt,
      coverImageAltEn: en.fm.coverAlt,
      ogImage: cover,
      categoryId,
      tags: es.fm.tags,
      seoTitleEs: es.fm.title,
      seoTitleEn: en.fm.title,
      seoDescriptionEs: es.fm.metaDescription,
      seoDescriptionEn: en.fm.metaDescription,
      readingTimeMinutes: Math.max(1, Math.round(es.words / WORDS_PER_MINUTE)),
      status: status as "draft" | "published",
      translationStatusEn: "complete" as const,
      deletedAt: null,
      // Un artículo ya publicado conserva su fecha real.
      publishedAt:
        status === "published"
          ? (existing?.publishedAt ?? new Date())
          : (existing?.publishedAt ?? null),
      updatedAt: new Date(),
    };

    const label = `${existing ? "actualizado" : "creado"} ${slug} [${status}] · ${values.readingTimeMinutes} min`;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${label}`);
      continue;
    }
    if (existing) {
      await db!.update(blogPosts).set(values).where(eq(blogPosts.id, existing.id));
    } else {
      await db!.insert(blogPosts).values({ ...values, authorId });
    }
    console.log(`✓ ${label}`);
  }
}

async function cleanupOldArticle(): Promise<void> {
  const cleanup = loadCleanup();
  if (!cleanup) {
    console.log("• sin archivo de limpieza — se omite");
    return;
  }
  const [row] = await db!.select().from(blogPosts).where(eq(blogPosts.slug, cleanup.slug)).limit(1);
  if (!row) {
    console.warn(`⚠ no existe '${cleanup.slug}' — se omite la limpieza`);
    return;
  }
  const patch = applyCleanup(row, cleanup);
  if (!patch) throw new Error("La limpieza no aplica limpio: revisar el parche contra la BD.");
  if (DRY_RUN) {
    console.log(`• [dry-run] limpieza de ${cleanup.slug}: ${Object.keys(patch).join(", ")}`);
    return;
  }
  await db!
    .update(blogPosts)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(blogPosts.id, row.id));
  console.log(`✓ limpieza de ${cleanup.slug}`);
}

/**
 * Lo mismo sobre data/fallbacks/ (modo sin BD): los 6 artículos como publicados + la
 * limpieza. Así el PR es coherente y se puede probar en local con USE_DB_FALLBACKS=true;
 * export-fallbacks.ts lo reemplaza luego por lo que quede en la BD.
 */
function applyToFallbacks(): void {
  const file = join(ROOT, "data/fallbacks/blog_posts.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  const categories = JSON.parse(
    readFileSync(join(ROOT, "data/fallbacks/blog_categories.json"), "utf8"),
  ) as Array<{ id: string; slug: string }>;
  const categoryId = categories.find((c) => c.slug === CATEGORY_SLUG)?.id;
  if (!categoryId) throw new Error(`'${CATEGORY_SLUG}' no está en blog_categories.json`);
  const authorId = rows.find((r) => r.authorId)?.authorId ?? null;
  const now = new Date().toISOString();

  for (const { slug, es, en } of loadArticles()) {
    const cover = `/blog/agentes/${slug}-cover.png`;
    const values = {
      slug,
      titleEs: es.fm.title,
      titleEn: en.fm.title,
      excerptEs: es.fm.metaDescription,
      excerptEn: en.fm.metaDescription,
      contentEs: es.html,
      contentEn: en.html,
      coverImage: cover,
      coverImageAltEs: es.fm.coverAlt,
      coverImageAltEn: en.fm.coverAlt,
      ogImage: cover,
      categoryId,
      authorId,
      tags: es.fm.tags,
      seoTitleEs: es.fm.title,
      seoTitleEn: en.fm.title,
      seoDescriptionEs: es.fm.metaDescription,
      seoDescriptionEn: en.fm.metaDescription,
      readingTimeMinutes: Math.max(1, Math.round(es.words / WORDS_PER_MINUTE)),
      status: "published",
      translationStatusEn: "complete",
      updatedAt: now,
      deletedAt: null,
    };
    const existing = rows.find((r) => r.slug === slug);
    if (existing) Object.assign(existing, values);
    else rows.unshift({ id: randomUUID(), ...values, createdAt: now, publishedAt: now });
  }
  console.log("✓ data/fallbacks/blog_posts.json: 6 artículos de agentes");

  const cleanup = loadCleanup();
  if (!cleanup) {
    writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
    return;
  }
  const row = rows.find((r) => r.slug === cleanup.slug) as
    | Record<string, string | null>
    | undefined;
  if (!row) {
    console.warn(`⚠ '${cleanup.slug}' no está en blog_posts.json`);
    writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
    return;
  }
  const patch = applyCleanup(row, cleanup);
  if (!patch) throw new Error("La limpieza no aplica limpio sobre blog_posts.json");
  Object.assign(row, patch);
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/blog_posts.json: limpieza de ${cleanup.slug}`);
}

async function main(): Promise<void> {
  if (FALLBACKS) {
    applyToFallbacks();
    process.exit(0);
  }
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }
  if (DRY_RUN) console.log("Modo --dry-run: no se escribe nada.\n");
  await seedArticles();
  await cleanupOldArticle();
  console.log(
    DRY_RUN
      ? "\nDry-run completo."
      : "\nListo. Corre export-fallbacks.ts y revalida el sitio (o redespliega).",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ el seed no llegó al final:", e);
  process.exit(1);
});
