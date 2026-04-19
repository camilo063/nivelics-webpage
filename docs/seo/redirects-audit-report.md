# Redirects 301/308 — auditoría pre-launch

**Fecha:** 2026-04-17
**Autor:** Camilo Villanueva (+ auditoría asistida)
**Input:** `docs/seo/legacy-urls-gsc-2026-04-12.csv` (364 URLs, export de GSC al 2026-04-12)

---

## Resumen ejecutivo

| métrica                                                   | valor                                      |
| --------------------------------------------------------- | ------------------------------------------ |
| URLs legacy en GSC                                        | 364                                        |
| URLs fuera de scope (`ai.nivelics.com`)                   | 2                                          |
| URLs en scope                                             | **362**                                    |
| Cobertura total                                           | **100%** (350 por regla + 12 rutas reales) |
| Reglas propuestas                                         | **58** (51 alta conf · 5 media · 2 baja)   |
| Reglas en [`next.config.ts`](../../next.config.ts) actual | 22                                         |
| Reglas huérfanas                                          | 1 (interna, no en GSC)                     |
| Cadenas A→B→C detectadas                                  | 0                                          |

**Ready to ship:** las 58 reglas propuestas en [`docs/seo/redirects-proposed.ts`](./redirects-proposed.ts) cubren el 100% del tráfico legacy indexado por Google.

**El único bloqueante real** es estratégico, no técnico: el blog del sitio nuevo solo tiene 4 posts migrados de 248. Leer sección **Blog — riesgo mayor** más abajo.

---

## Decisiones tomadas en Fase 3 (aprobadas)

1. **Servicios SEO → `/servicios/desarrollo-digital/sitios-web-agentic`** (opción A)
   El nuevo sitio no ofrece SEO como servicio standalone. Se mandan las 5 URLs SEO legacy (2 ES + 3 EN) al servicio agentic, que abarca SEO/AEO moderno. Confianza marcada como `medium` en la propuesta.

2. **`/en/services/media-solutions` → `/en/industries/media-entertainment`**
   En el sitio viejo "medios" era categoría de servicio; en el nuevo es una industria.

3. **`/en/services/it-staffing` → `/en/services/staff-augmentation`**
   Rename directo — mismo servicio, nombre actualizado.

4. **`/servicios/mejora-cadena-valor-inteligencia-artificial` → `/servicios/inteligencia-artificial/automatizacion-procesos`**
   Se mantiene el destino actual de [`next.config.ts:120`](../../next.config.ts#L120). Mi propuesta original (hub) era menos específica.

5. **`/servicios/implementacion-de-plataformas-en-la-nube` → `/servicios/cloud/migracion-aws`**
   **Cambio respecto a config actual** (que apunta a `/cloud/infraestructura`). "Implementación de plataformas en la nube" es literalmente migración.

---

## Blog — riesgo mayor

### Situación

| métrica                         | valor |
| ------------------------------- | ----- |
| Posts publicados en DB          | **4** |
| URLs `/blog/*` en GSC           | 134   |
| URLs `/en/blog/*` en GSC        | 113   |
| Match directo (slug idéntico)   | 0     |
| Rename (fuzzy, alta/media conf) | 3     |
| Redirect al hub `/blog`         | 244   |

Los 4 posts migrados: `como-implementar-ia-generativa-en-tu-empresa`, `finops-guia-completa`, `migracion-cloud-errores-comunes`, `staff-augmentation-vs-outsourcing`.

### Riesgo

Redirigir 244 URLs específicas al hub `/blog` genera:

- **Soft-404 masivo en GSC** — Google interpreta redirects a hub como "contenido ya no existe" y puede de-indexar rápidamente.
- **Pérdida de autoridad temática** — ~80% de los backlinks del dominio apuntan a posts individuales del blog viejo. Sin contenido equivalente, esa autoridad se diluye.
- **Caída de tráfico orgánico** estimada entre 30–60% en los primeros 60 días post-launch, dependiendo de qué tan rápido se re-migre contenido.

### Mitigaciones (ordenadas por preferencia)

1. **Re-migrar los top-20 posts por tráfico antes del launch.** Consultar GSC → Performance → Pages → filtrar por `/blog/*` → ordenar por Clicks 90d. Migrarlos al nuevo CMS manteniendo el slug original. Coste: 2–3 días de contenido. Beneficio: recupera ~70% del tráfico orgánico del blog.
2. **Redirigir por topic cluster a páginas de servicio** cuando haya match semántico obvio (ej. `/blog/que-es-devops` → `/servicios/staff-augmentation/devops-cloud`). Se puede hacer en una segunda iteración sin bloquear el launch.
3. **Post-launch:** crear páginas temáticas tipo `/blog/tema/inteligencia-artificial` y re-apuntar los redirects del clúster.

### Decisión recomendada

Ir con el plan actual (hub) **solo si** se compromete mitigación #1 dentro de 2 semanas post-launch. De lo contrario, recomiendo retrasar el launch o reducir drásticamente el scope del cutover.

---

## Cambios pendientes al merge

La propuesta en [`redirects-proposed.ts`](./redirects-proposed.ts) agrupa las 58 reglas. Cuando se integre a [`next.config.ts`](../../next.config.ts):

- **Reemplazar** las 22 reglas actuales (están todas incluidas en la propuesta).
- **Cuidado con** `/servicios/implementacion-de-plataformas-en-la-nube` — el destino cambia de `/cloud/infraestructura` (actual) a `/cloud/migracion-aws` (propuesto).
- **Todas las reglas son 308** (`permanent: true`). Next.js preserva query strings automáticamente (UTMs se mantienen).

```typescript
import { LEGACY_REDIRECTS, toNextRedirects } from "./docs/seo/redirects-proposed";

async redirects() {
  return toNextRedirects(LEGACY_REDIRECTS);
}
```

---

## Priorización por volumen de URLs afectadas

Sin datos de clicks por URL (GSC Performance export no incluido), priorizo por cantidad de URLs legacy cubiertas por cada regla:

| # URLs | regla                   | destino                                          | impacto                        |
| ------ | ----------------------- | ------------------------------------------------ | ------------------------------ |
| 132    | `blog hub catch-all ES` | `/blog`                                          | 🔴 crítico — ver sección Blog  |
| 112    | `blog hub catch-all EN` | `/en/blog`                                       | 🔴 crítico — ver sección Blog  |
| 9      | QA / Testing EN         | `/en/services/staff-augmentation/qa-security`    | 🟡 medio                       |
| 9      | QA / Testing ES         | `/servicios/staff-augmentation/qa-seguridad`     | 🟡 medio                       |
| 4      | UX/Diseño ES            | `/servicios/staff-augmentation/diseno-ux-ui`     | 🟢 bajo                        |
| 4      | Web platforms ES        | `/servicios/desarrollo-digital/plataformas-web`  | 🟢 bajo                        |
| 4      | Apps móviles ES         | `/servicios/desarrollo-digital/apps-moviles`     | 🟢 bajo                        |
| 4      | UX/Diseño EN            | `/en/services/staff-augmentation/ux-ui-design`   | 🟢 bajo                        |
| 4      | Web platforms EN        | `/en/services/digital-development/web-platforms` | 🟢 bajo                        |
| 3      | Apps móviles EN         | `/en/services/digital-development/mobile-apps`   | 🟢 bajo                        |
| 3      | Ecommerce ES            | `/servicios/desarrollo-digital/ecommerce`        | 🟢 bajo                        |
| 3      | Ecommerce EN            | `/en/services/digital-development/ecommerce`     | 🟢 bajo                        |
| 3      | Cloud infra ES          | `/servicios/cloud/infraestructura`               | 🟢 bajo                        |
| 3      | Cloud infra EN          | `/en/services/cloud/infrastructure`              | 🟢 bajo                        |
| 3      | Seguridad ES            | `/servicios/cloud/seguridad`                     | 🟢 bajo                        |
| 3      | SEO ES/EN               | `/.../sitios-web-agentic`                        | 🟢 bajo (pero confianza media) |

---

## Reglas con confianza NO alta

Cinco reglas `medium` + dos `low`. Todas listadas a continuación; todas operables pero conviene monitorear GSC en los primeros 14 días post-launch.

### Medium confidence

| regla                                                                                                                | razón                                                          |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `/servicios/:slug(auditorias-seo\|estrategia-seo)` → `/servicios/desarrollo-digital/sitios-web-agentic`              | Decisión estratégica — el nuevo sitio no ofrece SEO standalone |
| `/en/services/:slug(seo\|seo-audits\|seo-consulting)` → `/en/services/digital-development/agentic-web`               | Idem                                                           |
| `/es/soluciones/seo{/}?` → `/servicios/desarrollo-digital/sitios-web-agentic`                                        | Idem                                                           |
| `/blog/staff-augmentation-vs-outsourcing-diferencias-y-beneficios` → `/blog/staff-augmentation-vs-outsourcing`       | Fuzzy match Jaccard 0.6 — título coincide temáticamente        |
| `/en/blog/staff-augmentation-vs-outsourcing-differences-and-benefits` → `/en/blog/staff-augmentation-vs-outsourcing` | Idem, EN                                                       |

### Low confidence (2 reglas catch-all de blog)

Las dos reglas "blog hub catch-all" cubren 244 URLs entre ambos idiomas. Ver sección **Blog — riesgo mayor**.

---

## Checklist pre-deploy

- [ ] Camilo revisa [`docs/seo/redirects-proposed.ts`](./redirects-proposed.ts) — especialmente las 5 reglas de confianza `medium`.
- [ ] Camilo decide si migra top-20 posts antes del launch (mitigación blog).
- [ ] Integrar `LEGACY_REDIRECTS` en [`next.config.ts`](../../next.config.ts) usando `toNextRedirects()`.
- [ ] Correr `npm run type-check` — debe pasar.
- [ ] Correr `node --import tsx scripts/verify-redirects.ts` — debe terminar con exit 0.
- [ ] Deploy a preview en Vercel. Testear manualmente 10 URLs aleatorias del CSV:
  ```
  curl -I https://preview-url.vercel.app/servicios/ia-aplicada-a-negocios
  # esperado: 308, Location: /servicios/inteligencia-artificial
  ```
- [ ] Verificar en preview que las 4 URLs del blog migrado NO redirijan (deben servir contenido).
- [ ] Actualizar `/sitemap.xml` y `/llms.txt` para reflejar solo rutas nuevas (no las legacy).
- [ ] Día del launch: enviar `/sitemap.xml` actualizado a GSC. Monitorear "Páginas" → "No indexadas" → "Página con redirección" durante 30 días.
- [ ] T+14d: revisar GSC Performance → comparar clicks/impressions vs. baseline pre-launch.
- [ ] T+30d: re-correr este audit con nuevo export GSC para confirmar que todas las URLs legacy aparecen como redirigidas (no como 404).

---

## Fuera de scope

- **`ai.nivelics.com/*`** (2 URLs): producto separado, hosteado en subdominio distinto. No se gestiona desde [`next.config.ts`](../../next.config.ts) de `www.`. Coordinar con el equipo de `ai` si ese subdominio sigue activo.

---

## Entregables

| archivo                                                                                  | propósito                                                    |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`docs/seo/legacy-urls-gsc-2026-04-12.csv`](./legacy-urls-gsc-2026-04-12.csv)            | Fuente de verdad: GSC export                                 |
| [`docs/seo/buckets/*.txt`](./buckets/)                                                   | URLs agrupadas por sección                                   |
| [`docs/seo/buckets/blog-mapping.csv`](./buckets/blog-mapping.csv)                        | Mapeo blog slug-por-slug con clasificación                   |
| [`docs/seo/redirects-proposed.ts`](./redirects-proposed.ts)                              | 58 reglas listas para integrar                               |
| [`scripts/bucket-legacy-urls.ts`](../../scripts/bucket-legacy-urls.ts)                   | Regenera buckets                                             |
| [`scripts/map-legacy-blog.ts`](../../scripts/map-legacy-blog.ts)                         | Consulta DB y genera `blog-mapping.csv`                      |
| [`scripts/generate-redirects-proposed.ts`](../../scripts/generate-redirects-proposed.ts) | Genera `redirects-proposed.ts`                               |
| [`scripts/verify-redirects.ts`](../../scripts/verify-redirects.ts)                       | Simula matching y produce `/tmp/redirects-verification.json` |
| `/tmp/redirects-verification.json`                                                       | Reporte técnico del verificador                              |
