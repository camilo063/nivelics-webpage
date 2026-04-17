# Deprecated schema columns — removal plan

Columns that are scheduled for removal once the bilingual replacement has been
verified in production over at least one release cycle.

| Table         | Legacy column      | Bilingual replacement                         | Remove after |
| ------------- | ------------------ | --------------------------------------------- | ------------ |
| `casos_exito` | `client_country`   | `client_country_es` / `client_country_en`     | 2026-Q3      |
| `casos_exito` | `client_sector`    | `client_sector_es` / `client_sector_en`       | 2026-Q3      |
| `casos_exito` | `testimonial_role` | `testimonial_role_es` / `testimonial_role_en` | 2026-Q3      |

## Rules before removing a column

1. `scripts/migrate-monolingual-to-bilingual.ts` must have run successfully
   (it back-fills `_es` from the legacy column and translates to `_en`).
2. The resolver in [lib/cms/mappers.ts](../lib/cms/mappers.ts) picks the `_es`/`_en`
   values first and falls back to the legacy column only when `_es` is empty —
   once all rows have `_es` populated the fallback is unreachable.
3. Grep the codebase for direct reads of the legacy column, outside of
   `lib/cms/mappers.ts` and `lib/db/schema/admin.ts`. There should be **zero**
   matches before a column is dropped:
   ```bash
   grep -rn "\.clientCountry\b\|\.clientSector\b\|\.testimonialRole\b" \
     app/ components/ lib/ --include="*.ts" --include="*.tsx" \
     | grep -v "mappers.ts" | grep -v "schema/admin.ts"
   ```
4. The drop migration must include the corresponding admin-form clean-up:
   remove the legacy field from [lib/admin/validations/caso.schema.ts](../lib/admin/validations/caso.schema.ts)
   and [components/admin/forms/CasoForm.tsx](../components/admin/forms/CasoForm.tsx).

## How the transition works today

- Reads on the public site go through `mapCasoExito(row, locale)` which returns
  a localized string. Components render the mapped field directly; they never
  touch the legacy column.
- Writes from `/admin/casos/[id]` still target the legacy column so editors
  working in the admin UI do not lose values. The migration script can be
  re-run idempotently to sync `_es` with any new legacy edits during the
  transition.
- Once the admin form is updated to write `_es`/`_en` directly, the legacy
  column becomes write-dead and can be dropped on the scheduled date.

## Recently removed

_(none yet — populate this section when a column is actually dropped)_
