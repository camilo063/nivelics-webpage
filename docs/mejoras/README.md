# Plan de mejoras — Nivelics web

> Documentos generados a partir de la auditoría integral de julio 2026
> (agent-first · SEO · UX · UI · Performance · Conversión).
> Objetivo: llevar el sitio de un acabado **2021–2022** a **2025+** sin rehacer
> la arquitectura, y convertir el tráfico que navega en **leads B2B**.

Estos documentos son **prescriptivos y ejecutables**: cada fase lista archivos
reales, valores actuales, valores propuestos y criterios de aceptación, para
poder ejecutarse con Fable 5 fase por fase.

## Índice

| Documento                                                              | Qué contiene                                                        | Estado                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| [fase-0-fundaciones-sistema.md](./fase-0-fundaciones-sistema.md)       | Tokens, escala tipográfica, elevación, color. **Base obligatoria.** | ✅ Ejecutada 2026-07-01                                         |
| [fase-1-rediseno-visual.md](./fase-1-rediseno-visual.md)               | Hero, cards, glass, iconografía, microinteracciones                 | ✅ Ejecutada 2026-07-01 (pendiente aprobación visual)           |
| [fase-2-refuerzos-seo-a11y-cwv.md](./fase-2-refuerzos-seo-a11y-cwv.md) | OpenGraph, JSON-LD, accesibilidad, Core Web Vitals                  | ✅ Ejecutada 2026-07-01 (Lighthouse tras deploy)                |
| [conversion-cro-engagement.md](./conversion-cro-engagement.md)         | Convertir navegantes en leads, aumentar dwell time y clics útiles   | ✅ Núcleo ejecutado 2026-07-01 (ver pendientes en su checklist) |

**Verificación global (2026-07-01):** `npm run type-check` 0 errores · eslint 0 errores ·
`npm run build` exitoso · schemas/OG verificados contra build de producción.

## Puntuación de partida (auditoría)

| Dimensión                     | Nota | Techo tras el plan |
| ----------------------------- | ---- | ------------------ |
| Agent-first (robots/llms.txt) | 9.0  | 9.5                |
| SEO técnico                   | 7.0  | 9.0                |
| UX / Accesibilidad            | 7.2  | 8.8                |
| UI / Design system            | 7.2  | 9.0                |
| Performance / CWV             | 8.0  | 9.0                |
| Conversión (CRO)              | —    | objetivo del plan  |

## Principio rector del rediseño

El sitio **no está roto**: está plano. Todo pesa lo mismo (bordes `white/[0.08]`
en todo, cyan `#00d4ff` en todo, glass 4% en todo). El rediseño consiste en
**introducir jerarquía y variación**: profundidad tonal de color, escala de
elevación, escala tipográfica real y microinteracciones. Eso es lo que separa
lo 2021 de lo 2025.

## Reglas de ejecución (para Fable 5)

1. **Fase 0 antes que nada.** Los tokens nuevos son la base de todo lo demás.
2. **No romper el design system existente** ([../04-design-system.md](../04-design-system.md)):
   se **extiende**, no se reemplaza. GeoIcon, `glass`, `glow-hover`, `max-w-[1280px]`
   siguen siendo la referencia.
3. **`npm run type-check` en 0 errores** antes de cada commit (regla del repo).
4. **No tocar los fallbacks** de `lib/cms/*.ts` ni las superficies agentic
   (robots.ts, llms, sitemap) salvo lo que indica la Fase 2.
5. **Verificar contra la home** ([../../app/[locale]/(marketing)/page.tsx](<../../app/[locale]/(marketing)/page.tsx>)):
   es la página canónica; si un patrón nuevo se ve bien ahí, se propaga.
6. Cada fase tiene su **checklist de aceptación** al final; no se cierra sin cumplirla.

## Métrica de éxito global

- **UI**: cero `text-[Npx]` arbitrarios en marketing; una sola escala tipográfica.
- **CRO**: aumentar leads y dwell time; ver KPIs en
  [conversion-cro-engagement.md](./conversion-cro-engagement.md#kpis-y-medición).
- **SEO**: OpenGraph + JSON-LD en el 100% de páginas indexables.
- **CWV**: LCP < 1.8s, CLS < 0.03, INP < 90ms.
  </content>
  </invoke>
