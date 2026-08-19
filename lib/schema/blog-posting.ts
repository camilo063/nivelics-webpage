import type { MappedBlogPost } from "@/lib/cms";

interface BlogPostingOptions {
  locale: "es" | "en";
  categoryName?: string;
  /** Display name of the post's author. When absent, falls back to the Organization. */
  authorName?: string;
}

const HTML_TAG = /<[^>]+>/g;
const WHITESPACE = /\s+/g;

function stripHtml(s: string): string {
  return s.replace(HTML_TAG, " ").replace(WHITESPACE, " ").trim();
}

function wordCount(text: string): number {
  return stripHtml(text).split(/\s+/).filter(Boolean).length;
}

function isoOrUndefined(d: Date | null | undefined): string | undefined {
  return d ? new Date(d).toISOString() : undefined;
}

export function getBlogPostingSchema(post: MappedBlogPost, opts: BlogPostingOptions) {
  const { locale, categoryName, authorName } = opts;
  const slug = post.slug;
  const localePrefix = locale === "en" ? "/en" : "";
  const canonical = `https://www.nivelics.com${localePrefix}/blog/${slug}`;

  const datePublished = isoOrUndefined(post.publishedAt ?? post.createdAt);
  const dateModified = isoOrUndefined(post.updatedAt ?? post.publishedAt ?? post.createdAt);

  const words = wordCount(post.content);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.seoDescription || undefined,
    datePublished,
    dateModified,
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
          worksFor: {
            "@type": "Organization",
            name: "Nivelics",
            url: "https://www.nivelics.com",
          },
        }
      : {
          "@type": "Organization",
          name: "Nivelics",
          url: "https://www.nivelics.com",
        },
    publisher: {
      "@type": "Organization",
      name: "Nivelics",
      logo: {
        "@type": "ImageObject",
        url: "https://www.nivelics.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    image: post.coverImage || undefined,
    articleSection: categoryName || undefined,
    inLanguage: locale === "es" ? "es-CO" : "en-US",
    wordCount: words || undefined,
    keywords: post.tags && post.tags.length ? post.tags.join(", ") : undefined,
  };
}
