# 01 — Stack and conventions

## Runtime

- **Next.js 16.2.2** with App Router + Turbopack (dev and build)
- **React 19.2.4**
- **TypeScript strict mode** — `tsconfig.json` enforces `strict: true`
- **Node** — whatever Vercel runs for Next 16 (currently 20+)

> ⚠ [AGENTS.md](../AGENTS.md): "This is NOT the Next.js you know." This version has
> breaking changes vs. older Next.js. Check `node_modules/next/dist/docs/` before
> assuming an API exists. Treat deprecation notices as blocking.

## Core libraries

| Package                    | Version  | Used for                                                                               |
| -------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `next-intl`                | ^4.9.0   | i18n (ES + EN) with `as-needed` locale prefix, `pathnames` mapping                     |
| `drizzle-orm`              | ^0.45.2  | DB ORM (PostgreSQL)                                                                    |
| `@neondatabase/serverless` | —        | Neon Postgres driver                                                                   |
| `tailwindcss`              | ^4       | Styling (Tailwind v4 with CSS-first config)                                            |
| `framer-motion`            | ^12.38.0 | Mega-menu + panel animations in nav                                                    |
| `lucide-react`             | —        | Some icons still used, but **new work uses GeoIcon** (see [04](./04-design-system.md)) |
| `react-hook-form` + `zod`  | —        | Forms on `/contacto` and admin CMS                                                     |
| `react-simple-maps`        | —        | América map on home (lazy-loaded, ~150 KB)                                             |

## File structure

```
nivelics-web/
├── app/
│   ├── [locale]/              # i18n wrapper (es + en)
│   │   ├── (marketing)/       # Public marketing routes (route group)
│   │   └── layout.tsx         # <html lang> + preconnect + <NextIntlClientProvider>
│   ├── admin/(authenticated)/ # CMS routes, protected by middleware
│   ├── api/                   # Route handlers (admin + public)
│   ├── en/                    # EN-only mirror for llms.txt (bypasses middleware)
│   ├── llms.txt/, llms-full.txt/, sitemap.xml/, sitemap/{es,en}.xml/, robots.ts
│   └── layout.tsx             # Root layout (minimal — just imports globals.css)
├── components/
│   ├── admin/                 # Admin-only UI (forms, ProductoForm, GeoIconPicker, etc.)
│   ├── layout/                # Nav, Footer, PageWrapper
│   ├── lp/                    # Landing-page block components
│   ├── navigation/            # Nav sub-components (mobile accordion, panels)
│   ├── sections/              # Page-level sections (hero, metrics-bar, FAQ, etc.)
│   ├── shared/                # CTABanner, BenefitCard, ComparisonTable, etc.
│   └── ui/                    # Primitives (button, hero-effect, hero-graph, portal-effect)
├── lib/
│   ├── admin/actions/         # Server Actions for CMS mutations
│   ├── cms/                   # Read-only CMS queries + mappers (public)
│   │   ├── queries.ts         # getIndustria, getServicio, getHomeContent, getSiteConfigPublic, etc.
│   │   ├── productos.ts       # getAllProductos + FALLBACK + mapProducto
│   │   └── mappers.ts         # Locale resolvers for bilingual DB fields
│   ├── db/schema/admin.ts     # Drizzle schema — single source of truth for DB
│   ├── i18n/routing.ts        # next-intl routing config (locales + pathnames)
│   ├── icons/geometric.tsx    # GeoIcon / GeoIconBox / LUCIDE_TO_GEO / resolveIcon
│   ├── schema/                # Schema.org JSON-LD generators
│   └── seo/                   # sitemap-urls.ts + llms-content.ts (SEO shared builders)
├── scripts/                   # One-off DB maintenance / seeders (run with tsx)
├── docs/                      # This folder
├── drizzle/migrations/        # Drizzle-generated migrations
├── public/                    # Static assets + uploaded media (/uploads/*)
├── next.config.ts             # headers, redirects, remotePatterns
└── middleware.ts              # next-intl + admin auth gating
```

## Conventions that matter

- **File paths in markdown references** use `[name](path/to/file)` and
  `[name.ts:42](path/to/file.ts#L42)` style so VS Code renders them clickable.
- **DB columns are `snake_case`**, TS fields are `camelCase`. Drizzle maps between
  them via the column declarations (`varchar("slug_es", ...)` → `slugEs`).
- **Bilingual fields** live in the DB as `*Es` + `*En` pairs. Map via
  `pick(locale, data.fieldEs, data.fieldEn)` — see [lib/cms/mappers.ts](../lib/cms/mappers.ts).
- **Server Components by default**. Client components must start with `"use client"`.
  Do not mix client-only imports (e.g. `react-hook-form`) into server components.
- **Server Actions** live under `lib/admin/actions/*.actions.ts` with `"use server"`.
  Prefer Server Actions for admin mutations; prefer plain async functions wrapped
  in React `cache()` for read-only public queries.
- **No inline `<img>` for new images** — use `next/image`. Existing raw `<img>`
  tags in nav/footer came from before the S3 migration and are being migrated.
- **Icons**: new components use `GeoIcon` / `GeoIconBox` from
  [lib/icons/geometric.tsx](../lib/icons/geometric.tsx). Old `lucide-react` icons
  are still present in legacy pages; `LUCIDE_TO_GEO` provides auto-translation.
- **Colors / design tokens** live in [globals.css](../app/globals.css) as CSS
  variables (`--grad-hero`, `--primary`, etc.). See [04-design-system.md](./04-design-system.md).

## Anti-patterns to avoid

- **Do not mock the database in tests** — integration tests hit a real DB.
- **Do not invent "|" Nivelics suffix** in page titles. The Next.js metadata
  template `%s | Nivelics` adds it automatically; duplicating in `seoTitleEs`
  causes `Title | Nivelics | Nivelics`. See the cleanup script at
  [scripts/strip-nivelics-suffix-from-seo-titles.ts](../scripts/strip-nivelics-suffix-from-seo-titles.ts).
- **Do not bypass the LUCIDE_TO_GEO mapping** — if you need an icon that is not
  in the geometric set, add it to the set, do not fall back to lucide.
- **Do not remove the fallback arrays in `lib/cms/*.ts`** — they keep the site
  alive if the DB is down. See [03-cms-data-model.md](./03-cms-data-model.md).
- **Do not use `unstable_cache` or `"use cache"` directives** without first
  checking whether the project has Cache Components enabled (it does not as of
  this writing). Use React `cache()` for request memoization instead.

## Dev commands

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Next dev on **port 3002** (hardcoded in `package.json`) |
| `npm run build`      | Production build                                        |
| `npm run start`      | Serve production build                                  |
| `npm run type-check` | `tsc --noEmit`                                          |
| `npm run lint`       | `next lint`                                             |
| `npm run test`       | Vitest                                                  |

**DB scripts** use tsx with env loading:

```
node --env-file=.env.local --import tsx scripts/<name>.ts
```

See [06-workflows.md](./06-workflows.md) for the full script catalog.
