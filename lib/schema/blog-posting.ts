import type { MappedBlogPost } from "@/lib/cms";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/page-meta";
import { ORGANIZATION_ID, SCHEMA_BASE, WEBSITE_ID } from "@/lib/schema/webpage";

const BASE = SCHEMA_BASE;

interface BlogPostingOptions {
  locale: "es" | "en";
  categoryName?: string;
  /** Display name of the post's author. When absent, falls back to the Organization. */
  authorName?: string;
}

const HTML_TAG = /<[^>]+>/g;
const WHITESPACE = /\s+/g;

// Cuenta genérica del CMS: 48 de 52 posts la tienen como autor. No es una
// persona, así que firma la Organization en su lugar (no se inventa a nadie).
const GENERIC_AUTHOR_NAMES = new Set(["admin nivelics", "admin", "nivelics"]);

function stripHtml(s: string): string {
  return s.replace(HTML_TAG, " ").replace(WHITESPACE, " ").trim();
}

function wordCount(text: string): number {
  return stripHtml(text).split(/\s+/).filter(Boolean).length;
}

function isoOrUndefined(d: Date | null | undefined): string | undefined {
  return d ? new Date(d).toISOString() : undefined;
}

/** Cover images come from S3 (absolute) or /uploads (relative). schema.org quiere absoluta. */
function absoluteImage(src: string | null | undefined): string {
  if (!src) return DEFAULT_OG_IMAGE;
  const trimmed = src.trim();
  if (!trimmed) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${BASE}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export function getBlogPostingSchema(post: MappedBlogPost, opts: BlogPostingOptions) {
  const { locale, categoryName, authorName } = opts;
  const slug = post.slug;
  const localePrefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE}${localePrefix}/blog/${slug}`;

  const datePublished = isoOrUndefined(post.publishedAt ?? post.createdAt);
  // updatedAt es la fecha real de modificación. En filas migradas llega unos
  // milisegundos ANTES de createdAt; ahí se usa la de publicación para no
  // emitir un dateModified anterior al datePublished.
  const rawModified = isoOrUndefined(post.updatedAt) ?? datePublished;
  const dateModified =
    rawModified && datePublished && rawModified < datePublished ? datePublished : rawModified;

  const words = wordCount(post.content);

  const isGenericAuthor = authorName
    ? GENERIC_AUTHOR_NAMES.has(authorName.trim().toLowerCase())
    : true;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#blogposting`,
    headline: post.title,
    description: post.excerpt || post.seoDescription || undefined,
    datePublished,
    dateModified,
    author: isGenericAuthor
      ? {
          "@type": "Organization",
          "@id": ORGANIZATION_ID,
          name: "Nivelics",
          url: BASE,
        }
      : {
          "@type": "Person",
          name: authorName,
          worksFor: {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name: "Nivelics",
          },
        },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Nivelics",
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo.png`,
      },
    },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
    image: absoluteImage(post.coverImage),
    articleSection: categoryName || undefined,
    inLanguage: locale === "es" ? "es-CO" : "en-US",
    wordCount: words || undefined,
    keywords: post.tags && post.tags.length ? post.tags.join(", ") : undefined,
  };
}
