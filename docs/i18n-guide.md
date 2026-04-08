# i18n Translation Guide — Nivelics Web

## Architecture

- **Framework**: next-intl with Next.js 16 App Router
- **ES**: default locale, no URL prefix (`/servicios/cloud`)
- **EN**: `/en/` prefix with translated URLs (`/en/services/cloud`)
- **Middleware**: handles locale detection and URL rewriting

## Translation Strategies

### Strategy A — JSON keys (simple pages)

For pages with short text (heroes, CTAs, titles).

1. Add keys to `messages/es.json` and `messages/en.json`
2. Use `useTranslations('namespace')` in the component
3. Update `translation-status.ts` to `'complete'`

### Strategy B — Content files (complex pages)

For pages with tables, long descriptions, comparison data.

1. Create `content.en.tsx` next to the page's `page.tsx`
2. Export a component with all English content
3. In `page.tsx`, import and render based on locale:

```tsx
import { ContentEn } from "./content.en";

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale === "en") return <ContentEn />;
  // ...ES content...
}
```

4. Update `translation-status.ts` to `'complete'`

## Translation Status

See `lib/i18n/translation-status.ts` for the current status of each page.

- `'complete'`: fully translated, no banner
- `'partial'`: partially translated, amber banner shown
- `'pending'`: not started, amber banner shown

## File Locations

| File                             | Purpose                     |
| -------------------------------- | --------------------------- |
| `messages/es.json`               | Spanish translations        |
| `messages/en.json`               | English translations        |
| `lib/i18n/routing.ts`            | URL map ES↔EN               |
| `lib/i18n/translation-status.ts` | Per-page translation status |
| `middleware.ts`                  | Locale detection            |
| `app/[locale]/layout.tsx`        | Locale provider + banner    |

## Adding a New Translated Page

1. Create `content.en.tsx` next to the page
2. Translate all text, keeping same component structure
3. Update `page.tsx` to conditionally render EN content
4. Add `generateMetadata` with locale-aware titles
5. Set status to `'complete'` in `translation-status.ts`
6. Run `npm run build` to verify

## Priority Order

1. Staff Augmentation (5 sub-pages)
2. Cloud (4 remaining sub-pages)
3. IA (5 sub-pages)
4. Success Stories (hub + 7 cases)
5. Industries (6 pages)
6. About sub-pages (4 pages)
7. Digital Development (3 sub-pages)
8. Legal/support pages
