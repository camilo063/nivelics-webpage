# Nivelics web — docs index

These files are the canonical context for this project. An agent picking up
a task should skim the file most relevant to the change, not all of them.
If anything here conflicts with current code, **the code wins** — update
the doc.

| File                                                       | Read when you need to know…                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| [00-overview.md](./00-overview.md)                         | What Nivelics is, who the site targets, what lives on it     |
| [01-stack.md](./01-stack.md)                               | Runtime versions, libraries, conventions, what NOT to do     |
| [02-routes.md](./02-routes.md)                             | Every public URL (ES + EN), route handlers, i18n routing     |
| [03-cms-data-model.md](./03-cms-data-model.md)             | DB tables, admin CMS, fallback pattern, Server Actions       |
| [04-design-system.md](./04-design-system.md)               | GeoIcon system, colors, shared components, Tailwind tokens   |
| [05-seo-agentic.md](./05-seo-agentic.md)                   | Sitemap, llms.txt, schema.org, robots.txt, hreflang          |
| [06-workflows.md](./06-workflows.md)                       | Dev server, DB scripts, deploy, translation, debugging       |
| [i18n-guide.md](./i18n-guide.md)                           | How translation keys vs DB bilingual fields split is applied |
| [infrastructure/s3-setup.md](./infrastructure/s3-setup.md) | Dual-mode uploads (local `/uploads/` vs S3)                  |

## Update discipline

- When you add/rename a DB table, update [03-cms-data-model.md](./03-cms-data-model.md).
- When you add a route, update [02-routes.md](./02-routes.md) AND [lib/i18n/routing.ts](../lib/i18n/routing.ts) AND [lib/seo/sitemap-urls.ts](../lib/seo/sitemap-urls.ts).
- When you add a new shared component or icon family, update [04-design-system.md](./04-design-system.md).
- When you add a one-off maintenance script to `scripts/`, update [06-workflows.md](./06-workflows.md) with a one-liner of when to run it.
- Keep each file under ~300 lines. If a doc bloats, split it rather than trimming accurate info.
