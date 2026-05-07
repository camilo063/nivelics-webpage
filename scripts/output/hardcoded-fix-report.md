# Reporte de corrección: contenido hardcodeado → CMS

**Fecha:** 2026-05-07
**Branch:** fix/vercel-performance

## Resumen

| Métrica         | Antes | Después |
| --------------- | ----- | ------- |
| 🟢 Conectadas   | 27    | **50**  |
| 🟡 Parciales    | 25    | 3       |
| 🔴 Hardcodeadas | 2     | 1       |

**Type-check:** ✓ 0 errores
**Build:** ✓ 286/286 páginas generadas
**Tests:** N/A (no hay test suite definido para este alcance)

---

## El bug que se corrigió

Las páginas de servicio llamaban `getServicioData(slug, locale)` para datos del CMS pero **ignoraban la mayoría de los campos**. Solo consumían `title`, `subtitle`, `metrics`, `faqs`, `seoTitle`, `seoDescription`. Los siguientes campos editables desde `/admin/servicios/[slug]` jamás se renderizaban en el front:

- `benefits` (3-6 items por servicio en BD)
- `processSteps` (poblados en hubs + finops + sitios-web-agentic)
- `ctaPrimaryText`/`ctaPrimaryUrl` (poblados en todos)
- `ctaSecondaryText`/`ctaSecondaryUrl` (poblados en todos)
- `description` (siempre poblado)

Esto explica el reporte original: _"se actualizó un servicio desde el admin y nunca se actualizó en el front"_.

---

## Cambios realizados

### Archivo nuevo

- **`components/sections/cms-servicio-sections.tsx`** — componente puente que renderiza desde `MappedServicio` los campos antes ignorados (`benefits`, `processSteps`, sub-services grid, CTAs). Cada sección retorna `null` si la BD no tiene datos, así que es aditiva — no rompe el layout existente.
  - `<CmsServicioBenefits>` — grid de beneficios desde `cms.benefits`
  - `<CmsServicioProcess>` — timeline de proceso desde `cms.processSteps`
  - `<CmsSubServicesGrid>` — grid de sub-servicios desde `getSubserviciosData()` con fallback al array hardcodeado
  - `resolveServicioCtas()` — helper que prefiere CMS y cae a fallback
  - `<CmsServicioCtaStrip>` — CTAs únicos como sección

### Subservicios (18 archivos editados)

Patrón aplicado en cada uno:

1. Marker `// CMS-connected: 2026-05-07 — ...` al inicio
2. Imports de `cms-servicio-sections`
3. Llamada `resolveServicioCtas({...})` después de `getServicioData(...)` con fallback a los CTAs hardcodeados existentes
4. `<HeroSplit>` ahora recibe `ctaPrimary={ctaPrimary}` y `ctaSecondary={ctaSecondary}`
5. `<CmsServicioBenefits>` y `<CmsServicioProcess>` insertados antes del `<ComparisonTable>` o `<FAQAccordion>`

Archivos:

- IA: `agentes-ia`, `agentes-comerciales`, `automatizacion-procesos`, `gestion-contenido`, `marketing-crm`
- Cloud: `finops` (benefits después de pillars), `migracion-aws`, `infraestructura`, `seguridad`, `serverless`
- Staff Augmentation: `desarrollo-software`, `datos-ia`, `devops-cloud`, `diseno-ux-ui`, `qa-seguridad`
- Desarrollo Digital: `sitios-web-agentic` (variante con hero custom), `apps-moviles`, `ecommerce`, `plataformas-web`

### Hubs de servicios (4 archivos editados)

Cambios adicionales sobre el patrón de subservicios:

- Llamada a `getSubserviciosData(cms.id, locale)` para listar hijos desde CMS
- `<section id="sub-services">` hardcodeado **reemplazado** por `<CmsSubServicesGrid>`. La constante `SUB_SERVICES` permanece como fallback inyectado al componente.

Archivos:

- `servicios/inteligencia-artificial/page.tsx` — accent `#8B5CF6`
- `servicios/cloud/page.tsx` — accent `#3B82F6`
- `servicios/staff-augmentation/page.tsx` — accent `#10B981`
- `servicios/desarrollo-digital/page.tsx` — accent `#06B6D4`

### Páginas hardcoded recuperadas

- **`nosotros/metodologia/page.tsx`** — no existe tabla CMS para metodología. Las constantes `ROLES`/`EVENTS` se renombraron a `FALLBACK_ROLES`/`FALLBACK_EVENTS` y se documentó en marker la migración pendiente. **Pendiente:** crear `pages_general` row con `pageType='methodology'` (requiere extender el `pageTypeEnum` en `lib/db/schema/admin.ts`).
- **`blog/categoria/[category]/page.tsx`** — ahora consume `getBlogCategoryBySlug` + `getBlogPostsByCategory` con `mapBlogPost`. Los arrays hardcoded permanecen como fallback cuando el slug no se encuentra en BD.

### Script de auditoría

- **`scripts/audit-hardcoded-content.ts`** — escanea cada `page.tsx` bajo `app/[locale]/(marketing)/`, detecta imports CMS, mide qué campos del modelo se usan y emite el reporte en `scripts/output/hardcoded-audit-report.md`.

---

## Páginas que quedaron 🟡 / 🔴

| Estado | Archivo                                                    | Motivo                                                                                                                                                                   |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🟡     | `servicios/page.tsx`                                       | Master hub. Usa `hubMetrics`, `frameworkPillars`, `sectors` (no los campos estándar). Es un falso positivo del script.                                                   |
| 🟡     | `servicios/desarrollo-digital/sitios-web-agentic/page.tsx` | Tiene UI custom con `PAIN_CARDS`, `PROCESS_PHASES`, `FAQ_ITEMS` específicos. Las secciones CMS se añadieron, pero las custom siguen alimentándose de constantes locales. |
| 🟡     | `industrias/page.tsx`                                      | Hub de industrias. Usa `getAllIndustrias()`+`getHomeContent()` correctamente — no requiere `painPoints`/`solutions` (eso vive en cada industria). Falso positivo.        |
| 🔴     | `nosotros/metodologia/page.tsx`                            | No hay tabla en BD. Marcado como FALLBACK\_\*; pendiente extender `pageTypeEnum` para habilitar admin-edit.                                                              |

---

## Pendientes (próximas iteraciones)

1. **Schema migration**: añadir `methodology` al `pageTypeEnum` en `lib/db/schema/admin.ts` y poblar la metodología desde admin.
2. **Comparison tables**: las tablas comparativas en cada subservicio aún están hardcoded. Se recomienda añadir un campo `comparisonRows` (jsonb) al schema `servicios` similar al patrón de `productos.comparisonTable`.
3. **HeroSplit bullets**: los `bullets` en el hero de cada subservicio siguen hardcoded. Considerar añadir `heroBullets` (jsonb) al schema `servicios`.
4. **HeroSelector options**: los `<HeroSelector options>` de IA hub y subs siguen hardcoded. Considerar añadir `heroSelectorOptions` (jsonb).
5. **Verificación visual**: correr `/dev:db` en port 3002 y confirmar que páginas con CMS poblado renderizan los nuevos bloques `<CmsServicioBenefits>` correctamente.

---

## Cómo verificar manualmente

1. Editar un beneficio de `agentes-ia` desde `/admin/servicios/agentes-ia`
2. Guardar (debería invalidar la cache via revalidate)
3. Visitar `/servicios/inteligencia-artificial/agentes-ia` — ahora aparece la sección "Por qué elegir Agentes IA con Nivelics" con los benefits actualizados.
4. Lo mismo para `processSteps`, `ctaPrimaryText`, `ctaPrimaryUrl`.
