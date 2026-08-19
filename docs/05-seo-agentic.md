# 05 — SEO and agentic-first surfaces

This site is built to be **readable by AI agents as a first-class goal**, not
only by Google. Every machine-readable surface lives outside the `[locale]/`
tree so the i18n middleware does not rewrite it.

## Sitemap architecture

- **[/sitemap.xml](../app/sitemap.xml/route.ts)** — sitemapindex that references
  the per-locale sub-sitemaps. Google-recommended pattern for multi-locale.
- **[/sitemap/es.xml](../app/sitemap/es.xml/route.ts)** — Spanish URLs with
  `hreflang="es"`, `hreflang="en"`, `hreflang="x-default"` on every URL.
- **[/sitemap/en.xml](../app/sitemap/en.xml/route.ts)** — English URLs, same
  hreflang set.

All three are route handlers (not `app/sitemap.ts`) because Next.js's metadata
file approach did not emit a top-level index at `/sitemap.xml`.

### Shared builder

[lib/seo/sitemap-urls.ts](../lib/seo/sitemap-urls.ts) owns:

- `STATIC_URLS` — single source of truth for every static route, with
  `{ es, en, priority, changeFrequency, lastModified }`.
- `getAllSiteUrls()` — combines static URLs with DB-driven productos + indexable
  landing pages. Sets the `/productos` hub's `lastModified` to the most recent
  product `updated_at`.
- `buildLocaleSitemapXml(urls, locale)` — emits the XML for a given locale.

### `lastmod` rules

Google ignores `<lastmod>` if every URL shares the same timestamp, so:

- Static pages use **grouped static dates**: `SERVICIOS_MOD`, `INDUSTRIAS_MOD`,
  `NOSOTROS_MOD`, `CASOS_MOD`, `STATIC_LAST_MOD`. Bump these manually when
  content actually changes.
- Dynamic pages (productos, landings) use the real `updated_at` from the DB.

When editing a service page, bump `SERVICIOS_MOD` in
[lib/seo/sitemap-urls.ts](../lib/seo/sitemap-urls.ts).

## robots.txt

[app/robots.ts](../app/robots.ts) is dynamic. It declares:

- **AI bots allowed**: Googlebot, Bingbot, GPTBot, ChatGPT-User, OAI-SearchBot,
  ClaudeBot, Claude-SearchBot, Claude-User, Claude-Web, anthropic-ai,
  PerplexityBot, Perplexity-User, Google-Extended, Gemini, cohere-ai, YouBot,
  Applebot-Extended, AI2Bot, Amazonbot, meta-externalagent, DuckAssistBot,
  MistralAI-User.
- **AI bots blocked** (policy): Bytespider, CCBot. Block decision is based on
  their lack of reciprocal value or terms-of-use conflicts.
- **SEO bots**: AhrefsBot, SemrushBot (allowed, crawl-delay 3).
- **Global `Disallow`**: `/admin/`, `/cms/`, `/api/`, `/staging/`, `/_next/`,
  plus any `?preview=*` / `?draft=*` queries, plus any landing page marked
  `noindex: true`.
- **Sitemap**: exactly one declaration, pointing to the INDEX (`/sitemap.xml`).
  Do not add per-locale sitemap entries here — Google discovers them via
  the index.

## llms.txt and llms-full.txt

Bilingual, spec-compliant per [llmstxt.org](https://llmstxt.org).

### Endpoints

All four endpoints (`/llms.txt`, `/llms-full.txt`, `/en/llms.txt`,
`/en/llms-full.txt`) are **always dynamic** — built from the DB on each
revalidation. The former admin override (`siteConfig.llmsTxtContent` /
`llmsFullTxtContent`) was removed in 2026-08 because a frozen text silently
stopped reflecting products, posts and pricing; the DB columns remain but
nothing reads or writes them (`scripts/clear-llms-admin-content.ts` and
`scripts/seed-llms-to-config.ts` are obsolete).

Cost is negligible: `revalidate = 86400` + `s-maxage=86400,
stale-while-revalidate=604800` mean the builder runs at most ~once a day per
route; every other request is served from the CDN/route cache. Saving site
config in the admin also calls `revalidatePath("/llms.txt")` for an immediate
refresh.

### Shared builder

[lib/seo/llms-content.ts](../lib/seo/llms-content.ts) owns `buildLlmsTxt(locale)`
and `buildLlmsFullTxt(locale)`. Structure of the dynamic build:

```
# Nivelics
> Language: es | en
> Alternate: <mirror URL>
> Full version: <full URL>
> Last updated: <ISO date>

> <one-line company description>

<intro paragraph>

## Servicios / Services
## Productos SaaS / Proprietary SaaS products  (rendered from DB)
## Pricing                                     (hardcoded rates)
## Industrias / Industries
## Casos de Éxito / Success stories            (with metrics in -full variant)
## Empresa / Company
## Contacto / Contact
## Alternate language
## Further reading
```

`llms-full.txt` adds per-entity Spanish + English renderings for every product,
plus a `# Casos de Éxito` section with industry, country, challenge, solution,
measurable result for every case study.

### Autodiscovery

The root `<head>` emits:

```html
<meta name="llms" content="/llms.txt" /> <meta name="llms-full" content="/llms-full.txt" />
```

Via the `other` field of `metadata` in
[app/[locale]/layout.tsx](../app/[locale]/layout.tsx).

## Schema.org JSON-LD

Schema generators live in [lib/schema/](../lib/schema/):

| File               | Emits                                                                                               | Used on                                               |
| ------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `organization.ts`  | `["Organization", "ProfessionalService"]` with addresses, founders, serviceType, slogan, credential | Home                                                  |
| `website.ts`       | `WebSite` with SearchAction                                                                         | Home                                                  |
| `service.ts`       | `Service`                                                                                           | Every servicios + industrias page                     |
| `breadcrumb.ts`    | `BreadcrumbList`                                                                                    | Every non-home page                                   |
| `faq.ts`           | `FAQPage`                                                                                           | Home + services + industries + products               |
| `person.ts`        | `Person` + `TEAM_MEMBERS` fallback                                                                  | `/nosotros/equipo`                                    |
| `industria.ts`     | `WebPage` with industry keywords + `INDUSTRIAS_SCHEMA_DATA`                                         | 6 industry pages                                      |
| `creative-work.ts` | `CreativeWork`                                                                                      | Cases (available, not yet emitted on every case page) |

Product detail pages additionally emit `SoftwareApplication` with `Offer`
inline in the page component.

## Legacy redirects

[lib/seo/legacy-redirects.ts](../lib/seo/legacy-redirects.ts) is GENERATED by
[scripts/build-legacy-redirects.ts](../scripts/build-legacy-redirects.ts) from
`docs/seo/redirects-proposed.ts` and consumed by `next.config.ts redirects()`.
It covers the 362 GSC legacy URLs (100% coverage, verified 2026-08-19). Rules:

- Sources are percent-encoded (Next matches the encoded path) and giant
  `:slug(a|b|c)` alternations are split under the 4096-char source limit.
- **When a legacy blog post is re-migrated as a published post**, remove its
  slug from the catch-alls in `docs/seo/redirects-proposed.ts` and re-run the
  generator — otherwise the redirect shadows the live page. As a safety net,
  `isLegacyShadowedBlogSlug()` in [lib/seo/sitemap-urls.ts](../lib/seo/sitemap-urls.ts)
  keeps shadowed posts out of the sitemap and RSS feed.

## RSS feeds

`/feed.xml` (ES) and `/en/feed.xml` (EN) — route handlers built by
[lib/seo/feed.ts](../lib/seo/feed.ts) from published blog posts
(`publishedAt ?? createdAt` as pubDate, 50 items max). Autodiscovery `<link>`
is emitted by the locale layout and by every page using the shared metadata
helper.

## Shared metadata helper

[lib/seo/page-meta.ts](../lib/seo/page-meta.ts) — `buildPageMetadata()` is the
canonical way to emit page metadata: locale-aware canonical (NEVER hardcode
it), hreflang es/en/x-default, OpenGraph, Twitter and the RSS alternate. Pass
`href` (a `pathnames` key from routing.ts) for localized routes or `path` for
routes mirrored under `/en`.

## Brand assets

`public/logo.png` (schema.org logo), `public/og/nivelics-home.jpg` (1200×630),
`app/favicon.ico` + `app/icon.png` + `app/apple-icon.png` are generated from
the nav wordmark by [scripts/build-brand-assets.mjs](../scripts/build-brand-assets.mjs).

## Metadata + hreflang

`generateMetadata()` in every page declares:

```ts
alternates: {
  canonical: "https://www.nivelics.com/...",
  languages: {
    es: "https://www.nivelics.com/...",
    en: "https://www.nivelics.com/en/...",
    "x-default": "https://www.nivelics.com/...",
  },
}
```

Next.js renders these as `<link rel="alternate" hrefLang="...">` in the `<head>`.
Note: Next.js emits the HTML attribute as camelCase `hrefLang` — browsers accept
both cases, but grep for hreflang is case-insensitive when verifying.

### Title template

The locale layout sets `metadata.title.template = "%s | Nivelics"`. This means
**do not include `| Nivelics` in `seoTitleEs` or `seoTitleEn`** — it will render
as `... | Nivelics | Nivelics`. If legacy data is seen with the suffix, run
[scripts/strip-nivelics-suffix-from-seo-titles.ts](../scripts/strip-nivelics-suffix-from-seo-titles.ts).

## Verification

Quick smoke checks against the running site:

```
curl /robots.txt | grep "^Sitemap:"          # should be exactly 1 line
curl /sitemap.xml | grep "sitemapindex"       # should match
curl /sitemap/es.xml | grep -c "<loc>"        # ~57+ URLs
curl /sitemap/es.xml | grep -c 'hreflang="es"' # matches URL count (every URL has all 3 hreflang)
curl /llms.txt | head -6                       # should show > Language: es + headers
curl /en/llms.txt | grep "## Pricing"          # dynamic builder always has pricing
```
