# 06 — Workflows

## Dev server

```
npm run dev
```

Runs Next on **port 3002** (hardcoded). First compile of a route may take a
few seconds under Turbopack; subsequent requests are fast (typically <200 ms
TTFB for simple pages, higher for the home's heavier tree).

Useful one-off checks:

```
curl -s -o /dev/null -w "HTTP %{http_code} | TTFB %{time_starttransfer}s\n" http://localhost:3002/
curl -s http://localhost:3002/sitemap/es.xml | grep "<loc>" | wc -l
```

## Type-check and build

```
npm run type-check       # tsc --noEmit — must be 0 errors before commit
npm run build            # full production build
npm run start            # serve the build on port 3000 by default
```

Pre-commit hook runs `eslint --fix` + `prettier --write` via `lint-staged`.
If it reverts your commit, read the eslint output carefully — the React 19
"no setState in effect body" rule has caught real bugs on this repo.

## DB scripts

Pattern for running any script in `scripts/`:

```
node --env-file=.env.local --import tsx scripts/<name>.ts
```

**Do not** use `npx tsx scripts/...` without `--env-file` — the script will
fail to connect to Neon because `DATABASE_URL` won't be loaded.

### Script catalog

| Script                                          | When to run                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inspect-db.ts`                                 | Quick `SELECT *` dump of key tables — debugging only                                                                                                                                                                                                                                |
| `db-report.ts`                                  | Structured report of row counts per table                                                                                                                                                                                                                                           |
| `audit-completo.ts`                             | Full content audit (counts, missing translations, noindex flags)                                                                                                                                                                                                                    |
| `seed-home-content.ts`                          | Seed or reseed home page content                                                                                                                                                                                                                                                    |
| `seed-home-process.ts`                          | Seed the 3-step process section on home                                                                                                                                                                                                                                             |
| `seed-benefits-steps.ts`                        | Seed benefit cards + methodology steps                                                                                                                                                                                                                                              |
| `seed-industrias-hub.ts`                        | Seed `/industrias` hub page copy                                                                                                                                                                                                                                                    |
| `seed-industrias-rich.ts`                       | Seed industry rich sections (pain points, solutions, use cases)                                                                                                                                                                                                                     |
| `seed-industrias-section.ts`                    | Seed industry vertical pages (6 industries)                                                                                                                                                                                                                                         |
| `seed-servicios-hub.ts`                         | Seed `/servicios` hub page                                                                                                                                                                                                                                                          |
| `seed-servicios-content.ts`                     | Seed the 4 service hubs + 18 sub-services                                                                                                                                                                                                                                           |
| `seed-productos.ts`                             | Seed the 3 SaaS products (PAYWL, Niveleads, Hirely)                                                                                                                                                                                                                                 |
| `seed-landings.ts`                              | Seed example landing pages                                                                                                                                                                                                                                                          |
| `seed-content-from-hardcoded.ts`                | Populate DB from hardcoded fallbacks — useful after a fresh `drizzle-kit push`                                                                                                                                                                                                      |
| `seed-llms-to-config.ts`                        | Seed the `site_config.llmsTxtContent` override (DO NOT — the dynamic builder is preferred; see below)                                                                                                                                                                               |
| `check-hub-state.ts`                            | Verify servicios/industrias hubs are fully populated                                                                                                                                                                                                                                |
| `check-industrias-icons.ts`                     | Lint icon strings stored in industrias DB rows                                                                                                                                                                                                                                      |
| `create-leads-table.ts`                         | One-off table bootstrap — obsolete after initial migration                                                                                                                                                                                                                          |
| `enrich-services-from-pages.ts`                 | Back-port hardcoded page content into DB                                                                                                                                                                                                                                            |
| `fix-ctas-definitivo.ts`                        | One-off CTA text cleanup                                                                                                                                                                                                                                                            |
| `fix-missing-seo-en.ts`                         | Fill missing English SEO fields via translation API                                                                                                                                                                                                                                 |
| `fix-subtitles-blog.ts`                         | One-off blog subtitle cleanup                                                                                                                                                                                                                                                       |
| `update-service-icons.ts`                       | Normalize icon references on services / benefits                                                                                                                                                                                                                                    |
| `verify-industrias-section.ts`                  | QA check for industry sections                                                                                                                                                                                                                                                      |
| `translate-all.ts` / `translate-all-content.ts` | Bulk auto-translate from ES → EN                                                                                                                                                                                                                                                    |
| `translate-industrias-es-to-en.ts`              | Translate industries only                                                                                                                                                                                                                                                           |
| `clear-llms-admin-content.ts`                   | **NULL out `site_config.llmsTxtContent` + `llmsFullTxtContent`** so the dynamic builder is used for ES endpoints                                                                                                                                                                    |
| `strip-nivelics-suffix-from-seo-titles.ts`      | Remove trailing `\| Nivelics` from `seoTitleEs`/`seoTitleEn` across blog/casos/servicios/industrias/productos/pages_general                                                                                                                                                         |
| `generate-blog-content.ts`                      | Bilingual blog-post pipeline — parses briefs in `docs/seo/briefs-*.md`, calls the Anthropic API, writes `content/generated/{es,en}/*.md` + `.meta.json`. CLI flags: `--only-pillars`, `--only-standard`, `--brief=<id>`, `--lang=es\|en\|both`, `--force`, `--dry-run`, `--max=<n>` |
| `seed-blog-posts.ts`                            | UPSERT all articles from `content/generated/` into `blog_posts` (idempotent). Auto-creates missing `blog_categories`. `--dry-run` for plan only; `--publish-all` to mark as published instead of draft                                                                              |
| `audit-blog-content.ts`                         | Classify each `blog_posts.content_{es,en}` row as HTML / markdown / plain / empty. Writes `/tmp/blog-content-audit.txt`                                                                                                                                                             |
| `normalize-blog-content.ts`                     | Convert markdown posts → HTML in `blog_posts` (skips rows already in HTML). Dry-run by default; pass `--apply` to commit. The Tiptap editor normalizes on save, so this is only needed for bulk migration                                                                           |

### When to write a new script vs. a migration

- If it **mutates data content** (e.g. fix typos, normalize strings, backfill a
  field), write a `scripts/*.ts` file.
- If it **mutates schema** (add/drop column, change type), run `drizzle-kit
generate` and commit the generated SQL migration in `drizzle/migrations/`.

## Deploy

- **Git flow**: feature branch → PR → merge to `main`.
- **Current working branch**: `fix/ui-improvements` (at time of writing).
- **Deploy target**: Vercel, auto-preview on push, production on merge to main.
- **Env vars**: set in Vercel dashboard. `DATABASE_URL` (Neon), `AWS_S3_BUCKET`
  - `AWS_REGION` for media uploads, OpenAI/Anthropic key for `/api/admin/translate`.

Before deploying:

1. `npm run type-check` = 0 errors
2. `npm run build` succeeds
3. Verify `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/en/llms.txt` in the
   preview URL

## Admin CMS usage

1. Log in at `/admin/login` (credentials stored in `admin_users` table —
   hashed via bcrypt; provisioned via seed or direct SQL).
2. Dashboard at `/admin` shows stats + recent activity.
3. Editing any content:
   - Form has **Bilingual fields** (ES tab + EN tab) via `BilingualField` component.
   - **Auto-translate** button hits `/api/admin/translate` to prefill EN from ES.
   - **Save** triggers a Server Action that mutates DB, logs activity, and
     calls `revalidatePath()` for every public path that consumes the content.
4. Translation queue at `/admin/traducciones` shows rows with pending/in-progress
   EN translations.

## Debugging

### Sitemap returns 500

Cause is almost always a DB query inside `getAllSiteUrls()` throwing. Check
`/tmp/nivelics-dev.log` or Vercel function logs for the stack. Fallbacks should
prevent this in prod, but if `productos` table schema drifts from the code, the
query will fail.

### `/llms.txt` returns admin content instead of dynamic

That's by design — admin override wins. To bypass:

```
node --env-file=.env.local --import tsx scripts/clear-llms-admin-content.ts
```

### Titles render `Title | Nivelics | Nivelics`

DB row has `| Nivelics` suffix in `seoTitleEs` or `seoTitleEn`. Run:

```
node --env-file=.env.local --import tsx scripts/strip-nivelics-suffix-from-seo-titles.ts
```

### Logo does not appear on marketing pages

`siteConfig.logoUrl` is null, or the URL is not covered by `remotePatterns` in
[next.config.ts](../next.config.ts). Covered hosts: the S3 bucket + local
`/uploads/` paths.

### Mega menu panels open but cards are blank

`nav_config` row is empty or stale. The nav falls back to `NAV_DEFAULTS` in
[lib/constants/nav.ts](../lib/constants/nav.ts) when DB is empty.

### Build fails on Vercel but works locally

Most common causes observed so far:

- `.ts` file in `scripts/` imports something linted out locally (e.g. unused
  `let` removed by auto-fix). Re-add the variable.
- `legacy-peer-deps` needed for `react-simple-maps` on install. Verify
  `.npmrc` or `NPM_CONFIG_LEGACY_PEER_DEPS=true` is set on Vercel.
