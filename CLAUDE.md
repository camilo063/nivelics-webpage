@AGENTS.md

# Nivelics web — agent entry point

This is the marketing + lead-capture site for Nivelics (https://www.nivelics.com),
a Colombian B2B digital-transformation company. The site is bilingual (es default,
en mirror), DB-driven with hardcoded fallbacks, and built to be parsed by AI
agents as a first-class concern.

## Read these before touching the code

Canonical project context lives in [`docs/`](./docs/README.md). Skim the file
most relevant to your task — these are accurate and maintained by the team.

- [docs/00-overview.md](./docs/README.md) — what Nivelics is, what lives on the site
- [docs/01-stack.md](./docs/01-stack.md) — Next.js 16 + React 19 + Drizzle/Neon + Tailwind v4, conventions, anti-patterns
- [docs/02-routes.md](./docs/02-routes.md) — every URL (ES + EN), route handlers, i18n routing
- [docs/03-cms-data-model.md](./docs/03-cms-data-model.md) — 18 DB tables, admin CMS, Server Actions, fallback pattern
- [docs/04-design-system.md](./docs/04-design-system.md) — GeoIcon system, colors, shared components, tokens
- [docs/05-seo-agentic.md](./docs/05-seo-agentic.md) — sitemap, llms.txt, schema.org, robots.txt, hreflang
- [docs/06-workflows.md](./docs/06-workflows.md) — dev, DB scripts, deploy, debugging

The root [`docs/README.md`](./docs/README.md) has the full index plus
update discipline — when a doc goes stale, fix it in the same PR as the code.

## Quick facts

- Dev port: **3002** (hardcoded in `package.json`)
- DB scripts: `node --env-file=.env.local --import tsx scripts/<name>.ts`
- Type-check: `npm run type-check` (must be 0 errors before commit)
- Pre-commit hook runs eslint + prettier — do not skip with `--no-verify`
- Icons: use `GeoIcon` / `GeoIconBox` from [lib/icons/geometric.tsx](./lib/icons/geometric.tsx), not lucide
- Image hosts whitelisted for `next/image`: S3 bucket (from env) + local `/uploads/`

## High-risk gotchas

- **Next.js 16 has breaking changes vs. your training data** — see [AGENTS.md](./AGENTS.md)
- **Every bilingual DB column has `*_es` + `*_en`**. Use [lib/cms/mappers.ts](./lib/cms/mappers.ts) to resolve.
- **Metadata template is `%s | Nivelics`** — never put `| Nivelics` in `seoTitleEs/En`.
- **llms.txt is ALWAYS dynamic** (since 2026-08): all four endpoints use the builder in [lib/seo/llms-content.ts](./lib/seo/llms-content.ts) — the old `siteConfig.llmsTxtContent` admin override was removed (it silently froze content). The DB columns still exist but nothing reads them.
- **Fallback arrays in `lib/cms/*.ts` keep the site alive if DB is down** — do not remove them during refactors.
- **When you add a public route**, three files change: page file, [lib/i18n/routing.ts](./lib/i18n/routing.ts), and [lib/seo/sitemap-urls.ts](./lib/seo/sitemap-urls.ts).
- **Los leads de `/api/leads` también van a Niveleads** ([lib/integrations/niveleads.ts](./lib/integrations/niveleads.ts)), que es donde el equipo comercial los trabaja y donde se mide de qué campaña salieron. Tres cosas que no se pueden romper al tocar esa ruta: (1) el reenvío va dentro de `after()`, **después** de responder — si Niveleads está caído o tarda, el visitante no se entera y su lead ya está guardado aquí; (2) **el spam no se reenvía**, este sitio ya lo clasificó; (3) sin `NIVELEADS_CAPTURE_URL` + `NIVELEADS_CAPTURE_KEY` el puente no existe y el sitio funciona igual. La clave es la misma cadena que `INBOUND_CAPTURE_SECRET` en Niveleads: puesta solo en un lado, cada reenvío recibe 401 y solo lo dice el log (`[api/leads] Puente a Niveleads falló`).
- **La confirmación al lead la manda ESTE sitio, no Niveleads.** Su ruta de captura calla el correo cuando el lead entra por el puente. Si algún día este sitio deja de confirmar, hay que decidirlo allí también: si no, el visitante se queda sin ningún acuse.
