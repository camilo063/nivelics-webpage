# Fase 2 — Refuerzos: SEO · Accesibilidad · Core Web Vitals

> **Objetivo:** cerrar las brechas técnicas que no son visuales pero afectan
> visibilidad (SEO/LLMs), inclusión (a11y) y velocidad (CWV).
> **Independiente de Fase 1** — puede ejecutarse en paralelo.

---

## Parte A — SEO técnico

La base agent-first es excelente (robots.txt, llms.txt, sitemap, hreflang).
Las brechas están en **OpenGraph** y **JSON-LD** de páginas hub y transaccionales.

### A.1 — OpenGraph faltante (ALTO)

Páginas sin bloque `openGraph`/`twitter` en su `generateMetadata`:

| Página                  | Archivo                                            | Acción                            |
| ----------------------- | -------------------------------------------------- | --------------------------------- |
| `/contacto`             | `app/[locale]/(marketing)/contacto/page.tsx`       | **CRÍTICO** — añadir OG + Twitter |
| `/servicios` (hub)      | `app/[locale]/(marketing)/servicios/page.tsx`      | Añadir OG                         |
| `/productos` (hub)      | `app/[locale]/(marketing)/productos/page.tsx`      | Añadir OG                         |
| `/casos-de-exito` (hub) | `app/[locale]/(marketing)/casos-de-exito/page.tsx` | Añadir OG                         |
| `/blog` (hub y `?cat=`) | `app/[locale]/(marketing)/blog/page.tsx`           | `generateMetadata` dinámico + OG  |
| Casos individuales      | `casos-de-exito/[slug o carpeta]/page.tsx`         | Añadir OG                         |

Patrón (blog posts y productos individuales ya lo hacen bien — copiar de ahí):

```ts
openGraph: {
  title, description,
  url: "https://www.nivelics.com/<ruta>",
  type: "website",
  images: [{ url: ogImage ?? "https://www.nivelics.com/og/<seccion>.jpg",
             width: 1200, height: 630 }],
},
twitter: { card: "summary_large_image", title, description, images: [ogImage] },
```

### A.2 — JSON-LD faltante

| Página               | Schema faltante                                                                      | Severidad   |
| -------------------- | ------------------------------------------------------------------------------------ | ----------- |
| `/contacto`          | `LocalBusiness` + `ContactPoint`                                                     | **CRÍTICO** |
| `/productos/[slug]`  | migrar de `SoftwareApplication` a `Product` con `offers`/precio                      | **CRÍTICO** |
| Casos individuales   | `CreativeWork` (el generador existe en `lib/schema/creative-work.ts`, no se inyecta) | ALTO        |
| `/servicios` (hub)   | `Service` + `BreadcrumbList`                                                         | ALTO        |
| `/industrias/[slug]` | schema de `INDUSTRIAS_SCHEMA_DATA` no se inyecta                                     | ALTO        |
| `/blog` y `?cat=`    | `CollectionPage`                                                                     | MEDIO       |

**Helper recomendado** para no repetir el patrón `<script type="application/ld+json">`:

```tsx
// components/shared/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

### A.3 — Semántica HTML

- Falta `<main>` envolviendo el contenido → añadir en `PageWrapper` o layout
  con `id="main-content"` (necesario también para el skip-link de a11y, Parte B).
- Blog posts sin `<article>` → envolver con `<article itemScope itemType="...BlogPosting">`.

### A.4 — Menores

- `Organization.sameAs`: solo LinkedIn → añadir otras redes si existen.
- Añadir `<link rel="llms" href="/llms.txt">` además del `<meta name="llms">`.
- Sección "Quick Facts" al inicio de `llms.txt` (fundación, tamaño, hiring).

---

## Parte B — Accesibilidad (WCAG AA)

### B.1 — Prioridad alta

| Problema                                          | Ubicación                                    | Fix                                                                                        |
| ------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Sin skip-to-content** (nav de ~60 ítems)        | layout / `nav`                               | `<a href="#main-content" class="sr-only focus:not-sr-only">` como primer focusable         |
| **Mega-menú solo con mouse**                      | `components/layout/nav-client.tsx`           | handlers de teclado (ArrowDown/Enter/Escape) + focus al 1er ítem                           |
| **Paneles sin rol semántico**                     | mega-menú                                    | `role="region"` + `aria-label`; conectar trigger↔panel con `aria-controls`                 |
| **Focus poco visible**                            | `components/ui/button.tsx:6`                 | `ring-primary/50` sobre `#0a0a0f` es tenue → subir a `ring-2 ring-primary` o `ring-white`  |
| **Inputs sin ring de foco**                       | `contacto/contact-page-client.tsx`           | añadir `focus:ring-2 focus:ring-primary` además del `focus:border`                         |
| **Contraste marginal**                            | separador idioma `text-text-40/50` (~4.95:1) | usar `text-text-40` sólido (9.9:1)                                                         |
| **Accordion mobile sin `aria-controls`**          | `nav-client.tsx` (MobileAccordion)           | IDs únicos + `aria-controls` + cerrar con Escape                                           |
| **Apply-form sin validación client ni anti-spam** | `trabaja-con-nosotros/apply-form.tsx`        | replicar arquitectura del form de contacto (React Hook Form + Zod + honeypot + rate-limit) |

### B.2 — Menores

- `aria-current="page"` en el idioma activo del language switcher.
- `<h1>` del 404 que incluya "404" (hoy el número es `aria-hidden`).
- Skeleton screens en rutas DB-heavy (opcional).

**Nota:** la paleta base ya cumple AA con holgura (text-100/70/40). Los fallos de
contraste son **solo por opacidades sueltas** — la Fase 0 (§0.2) los elimina de raíz.

---

## Parte C — Core Web Vitals

El sitio ya está sano (home server + ISR, efectos deferidos y pasivos, AWS SDK
server-only). Ajustes tácticos:

| Acción                                                   | Ubicación                                | Ganancia                              |
| -------------------------------------------------------- | ---------------------------------------- | ------------------------------------- |
| Logo nav `<img>` → `next/image` + `priority`             | `components/layout/nav-client.tsx:476`   | LCP −50–80ms, CLS                     |
| Logo footer: añadir `width/height`                       | `components/layout/footer-client.tsx:94` | CLS                                   |
| `LpCaseStudy` logos: `alt` dinámico + dimensiones        | `components/lp/LpCaseStudy.tsx:56`       | CLS, a11y                             |
| Reducir pesos de Inter (6→3-4) **o** tipografía variable | `app/[locale]/layout.tsx`                | ≈ −50KB (se resuelve con Fase 1 §1.7) |
| `TiltCard`: evaluar event delegation global              | `components/effects/tilt-card.tsx`       | INP −10–15ms                          |

**Nota:** el logo del **layout de marketing** ya usa `next/image` con `priority`
correctamente ([layout.tsx:38](<../../app/[locale]/(marketing)/layout.tsx#L38>)). El
`<img>` raw pendiente está en el **nav-client** interno.

---

## Checklist de aceptación — Fase 2

- [x] OpenGraph + Twitter en `/contacto`, `/servicios`, `/productos`, `/casos-de-exito`, `/blog` y los 7 casos individuales (verificado en runtime: contacto ✓).
- [x] `LocalBusiness` en `/contacto` (nuevo `lib/schema/local-business.ts`), `Product` + `SoftwareApplication` en productos, `CreativeWork` en los 7 casos (verificado: televisa ✓), `Service` en hub servicios. Industrias ya lo inyectaba (verificado, sin cambios). `CollectionPage` en blog ya existía.
- [x] `<main id="main-content">` en el layout de marketing (PageWrapper pasó a `div` para evitar `<main>` anidado); `<article itemScope>` en blog posts.
- [x] Skip-link como primer focusable; mega-menú con ArrowDown/Escape + `aria-controls` + `role="region"`; accordion mobile con `aria-controls` + Escape; focus ring `ring-primary` sólido en botones + `focus:ring-2` en inputs de contacto y apply.
- [x] Contraste: opacidades sueltas eliminadas en Fase 0 (separador idioma incluido) — validar con axe/Lighthouse al desplegar.
- [x] Apply-form con RHF + Zod client/server, honeypot, timing check, rate-limit (Upstash + in-memory) y heurística de spam — arquitectura idéntica al form de contacto.
- [x] Logo nav: el slot `next/image` + `priority` del layout siempre se pasa (el `<img>` interno es fallback muerto); footer ya tenía width/height; logos de `LpCaseStudy` con `height` + `lazy` + `decoding=async`.
- [x] `aria-current` en language switcher; h1 del 404 incluye "404"; `sameAs` +Instagram; Quick Facts en llms.txt (verificado en `/en/llms.txt` ✓).
- [ ] Lighthouse en producción: SEO ≥ 95, Accessibility ≥ 95, LCP < 1.8s, CLS < 0.03, INP < 90ms — **medir tras deploy**.
- [x] `npm run type-check` = 0 errores.

> Ejecutada el 2026-07-01. No hecho (documentado): `<link rel="llms">` — App Router no
> permite link tags arbitrarios vía metadata de forma fiable (el `<meta name="llms">`
> de autodiscovery ya existe); `TiltCard` event delegation — el rAF por card ya está
> throttled, beneficio marginal vs riesgo. Nota del agente SEO: si `/llms.txt` (ES)
> tiene override de admin, correr `scripts/clear-llms-admin-content.ts` para ver los Quick Facts.
> </content>
