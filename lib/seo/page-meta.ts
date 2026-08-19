import type { Metadata } from "next";
import { getPathname } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

const BASE = "https://www.nivelics.com";

export const DEFAULT_OG_IMAGE = `${BASE}/og/nivelics-home.jpg`;

type Href = Parameters<typeof getPathname>[0]["href"];

function absolute(path: string): string {
  const url = `${BASE}${path}`;
  // The homepage keeps its trailing slash so the canonical matches the
  // sitemap <loc> (https://www.nivelics.com/) exactly.
  if (url === `${BASE}/`) return url;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** Absolute ES + EN URLs for a route from the i18n pathnames map. */
export function localizedUrls(href: Href): { es: string; en: string } {
  return {
    es: absolute(getPathname({ locale: "es", href })),
    en: absolute(getPathname({ locale: "en", href })),
  };
}

/**
 * ES + EN URLs for routes that share the same path in both locales and are
 * not in the i18n pathnames map (blog posts, categorías, landings).
 */
export function mirroredUrls(path: string): { es: string; en: string } {
  return { es: absolute(path), en: absolute(`/en${path}`) };
}

export function pageAlternates(
  locale: Locale,
  urls: { es: string; en: string },
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: locale === "en" ? urls.en : urls.es,
    languages: { es: urls.es, en: urls.en, "x-default": urls.es },
    types: {
      "application/rss+xml": [
        {
          url: locale === "en" ? "/en/feed.xml" : "/feed.xml",
          title: locale === "en" ? "Nivelics Blog — RSS" : "Blog de Nivelics — RSS",
        },
      ],
    },
  };
}

type PageMetadataInput = {
  locale: Locale;
  /** Route key from lib/i18n/routing.ts pathnames. Use `path` instead for routes outside the map. */
  href?: Href;
  /** Raw path shared by both locales (EN mirror lives under /en). */
  path?: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article";
};

/**
 * Canonical, hreflang, OpenGraph and Twitter metadata for a marketing page.
 * The canonical always matches the locale being served — never hardcode it.
 * Spread the result and override fields when a page needs something extra.
 */
export function buildPageMetadata({
  locale,
  href,
  path,
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const urls = href !== undefined ? localizedUrls(href) : mirroredUrls(path ?? "/");
  const canonical = locale === "en" ? urls.en : urls.es;
  return {
    title,
    description,
    alternates: pageAlternates(locale, urls),
    openGraph: {
      title,
      description,
      url: canonical,
      type: ogType,
      locale: locale === "en" ? "en_US" : "es_CO",
      alternateLocale: locale === "en" ? ["es_CO"] : ["en_US"],
      siteName: "Nivelics",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
