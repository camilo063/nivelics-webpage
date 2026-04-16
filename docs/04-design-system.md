# 04 — Design system

## Philosophy

- **Dark-first** — all marketing pages sit on a near-black background
  (`#0d1117` family) with thin borders and translucent surfaces
  (`rgba(255,255,255,0.03)`).
- **No stock icons in new work** — everything uses the **GeoIcon** system
  (custom SVG set) so that icons are agentic-friendly (inline SVG, not img),
  on-brand, and tree-shakable.
- **Accent colors are semantic**, not decorative — cyan = info/AI, amber =
  industries, green = staffing, violet = premium/experimental, red = alerts.

## GeoIcon system

[lib/icons/geometric.tsx](../lib/icons/geometric.tsx) is a self-contained
icon library. Exports:

- `GeoIcon` — inline SVG icon, sized by prop
- `GeoIconBox` — `GeoIcon` inside a colored rounded box (used for feature cards)
- `ICON_MAP` — registry of all icons
- `LUCIDE_TO_GEO` — translation map from lucide icon names to geo icon names
- `resolveIcon(name)` — looks up in the geo registry first, then `LUCIDE_TO_GEO`

### Icon families

5 geometric families, 34 icons total:

- `hex-*` — hexagon-based (primary, ~60% of icons)
- `dia-*` — diamond/rhombus
- `tri-*` — triangle
- `oct-*` — octagon
- `arc-*` — arcs and circular

### Icon colors

`IconColor = 'cyan' | 'violet' | 'green' | 'amber' | 'red'`

Each color has a fill tint and stroke in `geometric.tsx`. When mapping from
a hex color on legacy data, use `hexToIconColor()` (home page, line 27) or
`accentColor` → `ACCENT_TO_ICON` for product accents.

### GeoIconPicker (admin)

[components/admin/ui/GeoIconPicker.tsx](../components/admin/ui/GeoIconPicker.tsx)
renders a visual SVG grid grouped by family, with search. Used inside every
admin form that has an icon field (ProductoForm, IndustriaForm, features
editor, etc.).

## Typography

Loaded via `next/font` in [app/[locale]/layout.tsx](../app/[locale]/layout.tsx):

- **Inter** — body, weights 400–900, swap display
- **JetBrains Mono** — metric numbers and code, weights 400/500/700

CSS variables: `--font-inter`, `--font-jetbrains-mono`.

## Color tokens

Defined in [app/globals.css](../app/globals.css) as CSS variables:

- `--primary` / `--primary-dark` — brand cyan
- `--bg-base` / `--bg-surface` — backgrounds
- `--text-100` / `--text-70` / `--text-40` — text opacities
- `--border` — default border color
- `--grad-hero` — hero gradient (home page uses this)

Tailwind v4 picks them up automatically via CSS-first config.

## Shared components

[components/shared/](../components/shared/):

- `CTABanner` / `CtaFinal` — final CTA block. `maxWidth: 1280`, button height
  48px, auto-centers. Used at the bottom of every service + industry page.
- `BenefitCard` — "Option B" card with border-top accent + hover translateY.
  Accepts an icon name (string) or a Lucide component; maps via `LUCIDE_TO_GEO`.
- `ComparisonTable` — the Nivelics vs competencia comparison used on product
  pages. Nivelics column is highlighted with cyan bg + green checkmarks.
- `ServiceBadge` — small pill for "IA" / "Cloud" / "Staffing" tags.
- `MetricCard` — metric value + label.
- `TestimonialCard` — quote + author + role.
- `Breadcrumb` — breadcrumb renderer (visible; schema.org lives separately in `lib/schema/breadcrumb.ts`).
- `TranslationBanner` — shown at top of EN pages when `translation_status_en != 'complete'`.
- `WhatsAppFAB` — floating WhatsApp button on every marketing page.

## Layout components

[components/layout/](../components/layout/):

- `Nav` — desktop mega-menu (framer-motion) + mobile accordion. Reads nav
  config from `nav_config` table + `NAV_DEFAULTS` in [lib/constants/nav.ts](../lib/constants/nav.ts).
  Has dedicated panels for Servicios, Industrias, Productos, Nosotros.
- `Footer` — footer with Services / Productos / Company columns + social links.
  Logo uses raw `<img>` with `loading="lazy"` (below the fold).
- `PageWrapper` — top padding for nav, minimum viewport height, flex column.

## UI primitives

[components/ui/](../components/ui/):

- `button.tsx` — Button with variants `default | cta | outline | ghost`.
- `hero-effect.tsx` — SVG hero background (hex / diagonal / etc.).
- `hero-graph.tsx` — decorative canvas with connected nodes. Deferred via
  `requestIdleCallback`, halved nodes on mobile, paused off-screen.
- `portal-effect.tsx` — radial glow effect used on CTABanner.

## Design tokens to use, not invent

- `max-w-[1280px]` for content containers.
- `px-6 md:px-20` for horizontal padding.
- `py-10 md:py-14` for standard sections; `py-16 md:py-24` for heros.
- `glass` class = translucent glass card style (white 3% bg, white 8% border).
- `glow-hover` class = hover glow + subtle scale.

Look at [app/[locale]/(marketing)/page.tsx](<../app/[locale]/(marketing)/page.tsx>)
for canonical examples of every pattern.
