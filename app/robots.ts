import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema/admin";
import { eq } from "drizzle-orm";

export const revalidate = 86400;

const SITE_URL = "https://www.nivelics.com";

interface LandingRow {
  slug: string;
  noindex: boolean;
}

async function getLandings(): Promise<LandingRow[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select({ slug: landingPages.slug, noindex: landingPages.noindex })
      .from(landingPages)
      .where(eq(landingPages.status, "published"));
    return rows;
  } catch {
    return [];
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const landings = await getLandings();
  const noindexed = landings.filter((l) => l.noindex);

  const lpDisallow = noindexed.flatMap((l) => [`/lp/${l.slug}`, `/en/lp/${l.slug}`]);

  return {
    rules: [
      // Search bots — full access
      { userAgent: "Googlebot", allow: "/", crawlDelay: 0 },
      { userAgent: "Bingbot", allow: "/", crawlDelay: 1 },

      // AI bots — full access
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/", crawlDelay: 2 },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Gemini", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "YouBot", allow: "/", crawlDelay: 2 },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "AI2Bot", allow: "/", crawlDelay: 2 },
      { userAgent: "Amazonbot", allow: "/", crawlDelay: 2 },
      { userAgent: "meta-externalagent", allow: "/", crawlDelay: 2 },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "MistralAI-User", allow: "/" },

      // AI bots — blocked (no commercial value)
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },

      // SEO analysis
      { userAgent: "AhrefsBot", allow: "/", crawlDelay: 3 },
      { userAgent: "SemrushBot", allow: "/", crawlDelay: 3 },

      // Global rule
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/cms/",
          "/api/",
          "/staging/",
          "/_next/",
          "/*?preview=*",
          "/*?draft=*",
          ...lpDisallow,
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
