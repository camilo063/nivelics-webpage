# Code conventions

## File-per-locale pattern is PROHIBITED

Never create files with locale suffixes such as `content.es.tsx`, `content.en.tsx`,
`page.es.tsx`, `*.en.ts`, etc. All bilingual content lives in the database via
`*_es` / `*_en` column pairs, or in the `ui_labels` table for reusable UI strings.

Helpers for resolving bilingual fields:

| Helper                       | Location                      | Safe for client? |
| ---------------------------- | ----------------------------- | ---------------- |
| `pickLocale(locale, es, en)` | `lib/cms/bilingual.ts`        | Yes              |
| `tItem(item, field, locale)` | `lib/cms/bilingual.ts`        | Yes              |
| `uiLabel(map, key, locale)`  | `lib/cms/ui-labels-helper.ts` | Yes              |
| `getAllUiLabels()`           | `lib/cms/ui-labels.ts`        | No (server only) |

If you find files matching this pattern in the repo, delete them and migrate the
content to the CMS. See the `servicios/cloud/finops/page.tsx` rewrite as a reference
for how to merge `content.es.tsx` + `content.en.tsx` into a single bilingual page.

## Guard (CI / pre-commit)

```bash
npm run check:locale-files
```

This script fails if any `*.es.tsx`, `*.en.tsx`, `*.es.ts`, or `*.en.ts` files exist
in `app/`, `components/`, or `lib/`. Run it locally before pushing.
