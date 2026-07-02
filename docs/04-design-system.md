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

### Icon usage rule (Fase 1 §1.6)

- **GeoIcon** para iconos de **contenido y marca**: features, badges, servicios,
  industrias, métricas, cards.
- **lucide** solo para **affordances de acción de UI**: `ArrowRight`,
  `ChevronDown/Right`, `Check`, `X`, `Menu`, `MessageCircle` en botones/links.
- Nunca introducir un icono lucide decorativo nuevo — buscar el equivalente en
  `ICON_MAP` o añadirlo a `LUCIDE_TO_GEO`.
- Deuda conocida: las columnas del mega-menú (`NAV_DEFAULTS`) todavía usan
  `LucideIcon` tipado — migrarlas a GeoIcon requiere tocar los VM types del nav
  (pendiente, no bloqueante).

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

- `--primary-50/-200` / `--primary` / `--primary-600/-dark` — brand cyan ramp.
  **Pure `--primary` is reserved for actions and focus**; decorative borders,
  accent text and glows use the derived tones.
- `--accent-warm` — warm secondary accent. Max **one use per view** (badges/highlights).
- `--bg-base` / `--bg-surface` — backgrounds
- `--text-100` / `--text-70` / `--text-55` / `--text-40` — text hierarchy.
  **The only way to dim text.** Never `text-white/NN` opacities and never
  opacity modifiers on the tokens (`text-text-40/50` is forbidden — fails WCAG).
- `--border-subtle` / `--border` / `--border-strong` — border elevation scale
  (dividers → default card → highlighted/hover).
- `--shadow-sm/-md/-lg/-glow` — shadow elevation scale (plain CSS vars, used by
  `.glass-elevated` or via `shadow-(--shadow-md)` arbitrary syntax).
- `--grad-hero` — hero gradient (home page uses this)

Tailwind v4 picks them up automatically via CSS-first config.

## Typography scale

[lib/design/typography.ts](../lib/design/typography.ts) exports `TYPO` — the
single type scale (eyebrow, caption, bodySmall, body, cardTitle,
sectionSubtitle, sectionTitle, pageTitle). Rules:

- **No arbitrary `text-[Npx]` sizes.** The only allowed arbitrary value is
  `text-[11px]` for eyebrows/pills (intentionally below Tailwind's scale).
- Decorative exceptions (`text-[52px]`, `text-[80px]` on the 404 page) are
  documented outliers — do not add new ones.
- Migration mapping used across the site: `13px → text-sm`, `12px → text-xs`,
  `15px → text-base`, `10px → text-[11px]` (eyebrow/pill) or `text-xs` (caption).

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

## Scroll / 3D effects

[components/effects/](../components/effects/) — client wrappers around
server-rendered children. All of them are performance/SEO-safe by design:
the SSR HTML stays fully visible (no `opacity: 0` in served markup — hidden
states are applied by JS after hydration), they animate `transform`/`opacity`
only (zero CLS), use passive listeners + `requestAnimationFrame`, and respect
`prefers-reduced-motion`.

- `reveal.tsx` — `<Reveal delay={ms}>` reveal-on-scroll (IntersectionObserver).
  Skips elements already in the viewport on load to protect LCP.
- `tilt-card.tsx` — `<TiltCard>` mouse-tracking 3D tilt + cursor-following
  glow. Only activates on `(hover: hover)` devices.
- `parallax-layer.tsx` — `<ParallaxLayer speed={n}>` subtle parallax for
  decorative hero layers (`aria-hidden`).
- `scroll-beam.tsx` — `<ScrollBeam>` fixed 3D scroll-progress line (desktop
  ≥lg only), mounted once in the marketing layout so every public page gets
  it (it hides itself on `/contacto`). Past 55% scroll it reveals a contact
  invite: localized link to `/contacto` plus a button that opens the Dapta
  agent chat (falls back to `/contacto`).

These are applied transversally through the shared components (`ServiceCard`,
`BenefitCard`, `CaseStudyCard`, `CTABanner`, `CmsServicioBenefits`,
`CmsSubServicesGrid`), so individual pages rarely need to import them.

- CSS lives in `app/globals.css` (`nv-reveal-*`, `tilt-card*`, `border-anim`,
  `scroll-beam*`). `border-anim` = animated conic-gradient border on hover.

## Design tokens to use, not invent

- `<MaxWidthWrapper>` ([components/layout/max-width-wrapper.tsx](../components/layout/max-width-wrapper.tsx))
  = `mx-auto max-w-[1280px] px-6 md:px-20`. Use it in new code instead of
  repeating the raw classes; existing pages migrate incrementally.
- **Vertical rhythm** (two rhythms only):
  - Standard section: `py-16 md:py-24`
  - Compact section (strips, logo bars): `py-10 md:py-14`
  - Hero: `pt-24 pb-16` (documented exception)
- `glass` class = informational card (white 3% bg, `--border-subtle`).
- `glass-elevated` class = highlighted/interactive card (white 6% bg,
  `--border`, `--shadow-md`; hover raises to `--border-strong`).
- `glow-hover` class = hover glow + subtle scale.

Look at [app/[locale]/(marketing)/page.tsx](<../app/[locale]/(marketing)/page.tsx>)
for canonical examples of every pattern.
