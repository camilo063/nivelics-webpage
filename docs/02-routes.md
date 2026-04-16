# 02 — Routes and i18n

## i18n model

- **Locales**: `es` (default), `en`
- **localePrefix**: `as-needed` — Spanish URLs have no prefix (`/servicios`),
  English URLs have `/en/` prefix (`/en/services`)
- **Source of truth**: [lib/i18n/routing.ts](../lib/i18n/routing.ts) —
  `defineRouting` with a `pathnames` map from canonical path → `{ es, en }`
- **Middleware**: [middleware.ts](../middleware.ts) uses next-intl middleware
  and applies admin auth gating. Paths with dots (`.`) are excluded from i18n
  rewriting so static files (`/sitemap.xml`, `/llms.txt`, `/robots.txt`) pass
  through untouched.

When you add a new public route, **three** files change:

1. The actual page file under `app/[locale]/(marketing)/.../page.tsx`
2. [lib/i18n/routing.ts](../lib/i18n/routing.ts) — add to `pathnames`
3. [lib/seo/sitemap-urls.ts](../lib/seo/sitemap-urls.ts) — add to `STATIC_URLS`
   (or ensure it shows up via dynamic `getAllSiteUrls()`)

## URL map

### Marketing (public)

| Canonical (ES)                                               | EN mirror                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| `/`                                                          | `/en`                                                     |
| `/servicios`                                                 | `/en/services`                                            |
| `/servicios/inteligencia-artificial`                         | `/en/services/artificial-intelligence`                    |
| `/servicios/inteligencia-artificial/agentes-ia`              | `/en/services/artificial-intelligence/ai-agents`          |
| `/servicios/inteligencia-artificial/agentes-comerciales`     | `/en/services/artificial-intelligence/sales-agents`       |
| `/servicios/inteligencia-artificial/automatizacion-procesos` | `/en/services/artificial-intelligence/process-automation` |
| `/servicios/inteligencia-artificial/gestion-contenido`       | `/en/services/artificial-intelligence/content-management` |
| `/servicios/inteligencia-artificial/marketing-crm`           | `/en/services/artificial-intelligence/marketing-crm`      |
| `/servicios/cloud`                                           | `/en/services/cloud`                                      |
| `/servicios/cloud/finops`                                    | `/en/services/cloud/finops`                               |
| `/servicios/cloud/migracion-aws`                             | `/en/services/cloud/aws-migration`                        |
| `/servicios/cloud/infraestructura`                           | `/en/services/cloud/infrastructure`                       |
| `/servicios/cloud/seguridad`                                 | `/en/services/cloud/security`                             |
| `/servicios/cloud/serverless`                                | `/en/services/cloud/serverless`                           |
| `/servicios/staff-augmentation`                              | `/en/services/staff-augmentation`                         |
| `/servicios/staff-augmentation/desarrollo-software`          | `/en/services/staff-augmentation/software-development`    |
| `/servicios/staff-augmentation/datos-ia`                     | `/en/services/staff-augmentation/data-ai`                 |
| `/servicios/staff-augmentation/devops-cloud`                 | `/en/services/staff-augmentation/devops-cloud`            |
| `/servicios/staff-augmentation/diseno-ux-ui`                 | `/en/services/staff-augmentation/ux-ui-design`            |
| `/servicios/staff-augmentation/qa-seguridad`                 | `/en/services/staff-augmentation/qa-security`             |
| `/servicios/desarrollo-digital`                              | `/en/services/digital-development`                        |
| `/servicios/desarrollo-digital/sitios-web-agentic`           | `/en/services/digital-development/agentic-web`            |
| `/servicios/desarrollo-digital/apps-moviles`                 | `/en/services/digital-development/mobile-apps`            |
| `/servicios/desarrollo-digital/ecommerce`                    | `/en/services/digital-development/ecommerce`              |
| `/servicios/desarrollo-digital/plataformas-web`              | `/en/services/digital-development/web-platforms`          |
| `/industrias/fintech`                                        | `/en/industries/fintech`                                  |
| `/industrias/medios-entretenimiento`                         | `/en/industries/media-entertainment`                      |
| `/industrias/salud`                                          | `/en/industries/healthcare`                               |
| `/industrias/retail-ecommerce`                               | `/en/industries/retail-ecommerce`                         |
| `/industrias/logistica`                                      | `/en/industries/logistics`                                |
| `/industrias/manufactura`                                    | `/en/industries/manufacturing`                            |
| `/productos`                                                 | `/en/products`                                            |
| `/productos/[slug]`                                          | `/en/products/[slug]`                                     |
| `/nosotros`                                                  | `/en/about`                                               |
| `/nosotros/historia`                                         | `/en/about/history`                                       |
| `/nosotros/equipo`                                           | `/en/about/team`                                          |
| `/nosotros/metodologia`                                      | `/en/about/methodology`                                   |
| `/nosotros/certificaciones`                                  | `/en/about/certifications`                                |
| `/casos-de-exito`                                            | `/en/success-stories`                                     |
| `/casos-de-exito/televisa`                                   | `/en/success-stories/televisa`                            |
| `/casos-de-exito/grupo-bolivar`                              | `/en/success-stories/grupo-bolivar`                       |
| `/casos-de-exito/two-maids`                                  | `/en/success-stories/two-maids`                           |
| `/casos-de-exito/ab-inbev`                                   | `/en/success-stories/ab-inbev`                            |
| `/casos-de-exito/cronica`                                    | `/en/success-stories/cronica`                             |
| `/casos-de-exito/pulzo`                                      | `/en/success-stories/pulzo`                               |
| `/casos-de-exito/univision`                                  | `/en/success-stories/univision`                           |
| `/blog`                                                      | `/en/blog`                                                |
| `/contacto`                                                  | `/en/contact`                                             |
| `/trabaja-con-nosotros`                                      | `/en/careers`                                             |
| `/soporte`                                                   | `/en/support`                                             |
| `/privacidad`                                                | `/en/privacy`                                             |

Dynamic routes:

- `/lp/[slug]` — CMS-driven landing pages (from `landingPages` table)
- `/blog/[slug]` — blog posts (from `blogPosts` table)
- `/blog/categoria/[category]` — category archive
- `/productos/[slug]` — product detail (static from `productos` + fallback)

### Admin (session-gated)

- `/admin/login` — login page (no session required)
- `/admin/(authenticated)/*` — everything under this group is gated by
  middleware auth. Includes pages for every CMS entity (see [03](./03-cms-data-model.md)).

### Route handlers (non-page)

Outside the `[locale]` tree, so the i18n middleware does not rewrite them:

| Path                | File                                                              | Purpose                                                                              |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `/robots.txt`       | [app/robots.ts](../app/robots.ts)                                 | Dynamic robots — includes AI bot rules + noindex-flagged landings                    |
| `/sitemap.xml`      | [app/sitemap.xml/route.ts](../app/sitemap.xml/route.ts)           | Sitemap **index** (references es.xml + en.xml)                                       |
| `/sitemap/es.xml`   | [app/sitemap/es.xml/route.ts](../app/sitemap/es.xml/route.ts)     | ES URLs with hreflang alternates                                                     |
| `/sitemap/en.xml`   | [app/sitemap/en.xml/route.ts](../app/sitemap/en.xml/route.ts)     | EN URLs with hreflang alternates                                                     |
| `/llms.txt`         | [app/llms.txt/route.ts](../app/llms.txt/route.ts)                 | ES llms.txt. Checks `siteConfig.llmsTxtContent` first, falls back to dynamic builder |
| `/llms-full.txt`    | [app/llms-full.txt/route.ts](../app/llms-full.txt/route.ts)       | ES full version — same override pattern                                              |
| `/en/llms.txt`      | [app/en/llms.txt/route.ts](../app/en/llms.txt/route.ts)           | EN llms.txt. Always uses the dynamic builder (no admin override)                     |
| `/en/llms-full.txt` | [app/en/llms-full.txt/route.ts](../app/en/llms-full.txt/route.ts) | EN full — dynamic only                                                               |

### API routes

- `/api/contact` — lead capture form (public, writes to `leads` table)
- `/api/leads` — LP lead capture (public)
- `/api/services`, `/api/team`, `/api/blog` — read endpoints
- `/api/health` — health check
- `/api/admin/*` — admin mutations (session-gated)
- `/api/admin/translate` — auto-translation endpoint used by admin UI

### Redirects

See [next.config.ts](../next.config.ts) for the full `redirects()` list —
~25 permanent redirects from legacy URLs (pre-2025 site) to the new IA.
