import { getAllBlogPostsLight } from "@/lib/cms/queries";
import { isLegacyShadowedBlogSlug } from "@/lib/seo/sitemap-urls";

const BASE = "https://www.nivelics.com";
const MAX_ITEMS = 50;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of published blog posts for a locale. */
export async function buildRssFeed(locale: "es" | "en"): Promise<string> {
  let posts: Awaited<ReturnType<typeof getAllBlogPostsLight>> = [];
  try {
    posts = await getAllBlogPostsLight();
  } catch {
    posts = [];
  }

  const prefix = locale === "en" ? "/en" : "";
  const selfUrl = `${BASE}${prefix}/feed.xml`;
  const blogUrl = `${BASE}${prefix}/blog`;
  const channelTitle =
    locale === "en"
      ? "Nivelics Blog — AI, Cloud & Staffing"
      : "Blog de Nivelics — IA, Cloud y Staffing";
  const channelDescription =
    locale === "en"
      ? "Guides and analysis on applied AI, cloud with real governance and premium staff augmentation for LATAM and the US."
      : "Guías y análisis sobre IA aplicada, cloud con gobierno real y staff augmentation premium para LATAM y USA.";

  // published_at is NULL for migrated rows — fall back to createdAt so the
  // feed is never empty. Posts whose URL is shadowed by a legacy redirect
  // (next.config.ts) are excluded: a feed must not announce URLs that 3xx.
  const items = posts
    .map((p) => ({ ...p, feedDate: p.publishedAt ?? p.createdAt ?? null }))
    .filter((p) => p.feedDate && !isLegacyShadowedBlogSlug(p.slug))
    .sort((a, b) => new Date(b.feedDate!).getTime() - new Date(a.feedDate!).getTime())
    .slice(0, MAX_ITEMS)
    .map((p) => {
      const title = (locale === "en" ? p.titleEn : p.titleEs) || p.titleEs || p.slug;
      const excerpt = (locale === "en" ? p.excerptEn : p.excerptEs) || p.excerptEs || "";
      const link = `${BASE}${prefix}/blog/${p.slug}`;
      const pubDate = new Date(p.feedDate as unknown as string | Date).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${locale === "en" ? "en-US" : "es-CO"}</language>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
