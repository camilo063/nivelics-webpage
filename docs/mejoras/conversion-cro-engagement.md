# Conversión (CRO) y engagement

> **Objetivo de negocio:** que el visitante **navegue mucho, se quede tiempo y se
> convierta en lead B2B**. Este documento convierte "tráfico que mira" en
> "tráfico que contacta".
> Transversal a las fases; algunas piezas dependen del rediseño (Fase 1).

## Filosofía

Dos palancas trabajan juntas:

1. **Engagement (dwell time + profundidad):** dar razones para seguir navegando
   — contenido relacionado, siguiente paso claro, elementos interactivos, prueba
   social. Más tiempo y más páginas = más intención = más probabilidad de lead.
2. **Conversión (fricción mínima):** cuando aparece la intención, que contactar
   sea **inmediato y omnipresente**, no algo que haya que buscar.

La regla: **cada página debe responder "¿y ahora qué?" con un siguiente paso
visible**, y **el contacto nunca debe estar a más de un clic**.

---

## Estado actual de los touchpoints de conversión (verificado)

En el layout de marketing ([../../app/[locale]/(marketing)/layout.tsx](<../../app/[locale]/(marketing)/layout.tsx>)):

| Touchpoint                                  | Cobertura actual                                 | Diagnóstico                                                           |
| ------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| **Nav CTA**                                 | Global (desktop + mobile)                        | ✅ Bien                                                               |
| **Hero CTAs** (primario + secundario)       | Home                                             | ✅ Bien                                                               |
| **ScrollBeam** invite ("¿Hablamos?" + chat) | **Solo desktop ≥lg, aparece pasado ~55% scroll** | ⚠️ Invisible en mobile y en la primera mitad del scroll               |
| **DaptaWidget** (chat con agente IA)        | Global                                           | ✅ Potente, pero pasivo (espera clic)                                 |
| **StickyMobileCta**                         | **Existe pero se aplica por-página, no global**  | ⚠️ Muchas páginas mobile sin CTA persistente                          |
| **WhatsApp FAB** (`LpWhatsApp`)             | **Solo en `components/lp/` (landing pages)**     | 🔴 **No está en páginas de marketing** — canal directo desaprovechado |
| **CTABanner / CtaFinal**                    | Fondo de cada página de servicio/industria       | ✅ Bien                                                               |
| **CTAContextual**                           | Disponible                                       | Verificar que se use en todas las páginas largas                      |

### Brechas de conversión detectadas

1. 🔴 **Mobile carece de affordance de contacto persistente** en la mayoría de
   páginas: el ScrollBeam es desktop-only y el StickyMobileCta no es global.
2. 🔴 **WhatsApp** (canal de altísima conversión en LatAm B2B) **no aparece** en
   las páginas de marketing, solo en landings.
3. ⚠️ **El chat Dapta es pasivo**: no invita proactivamente en momentos de alta intención.
4. ⚠️ **La invitación del ScrollBeam llega tarde** (55% del scroll) y solo en desktop.

---

## Parte 1 — Conversión (reducir fricción)

### 1.1 — CTA persistente global en mobile _(prioridad máxima)_

Mover `StickyMobileCta` al **layout de marketing** (no por-página), con destino
inteligente por contexto (o `/contacto` por defecto). Aparece tras 300px de scroll
(ya implementado). Coordinar z-index con el WhatsApp FAB para que no se solapen.

### 1.2 — WhatsApp FAB global en marketing

Llevar el FAB de WhatsApp (`components/lp/LpWhatsApp`) al layout de marketing con
mensaje pre-rellenado por contexto de página. En LatAm B2B el WhatsApp convierte
más que un formulario. Consideraciones:

- Coordinar posición con `StickyMobileCta` (FAB arriba-derecha, sticky abajo).
- Opción de cerrar (con `localStorage`) para no ser intrusivo.

### 1.3 — Chat proactivo por intención

Hacer que Dapta (o un tooltip que lo abra) **invite proactivamente** en señales
de alta intención, sin ser molesto:

- Al llegar al final de una página de servicio/producto.
- Tras X segundos en `/contacto` sin enviar el form.
- En scroll depth > 70% de una página larga.
  Máximo **una invitación por sesión**; respetar cierre del usuario.

### 1.4 — Reducir clics hasta el lead

- Pre-rellenar el `?from=<servicio>` del form de contacto desde cada CTA (ya
  existe atribución — extenderla a todos los CTAs) para que el usuario no reescriba contexto.
- CTA secundario "agendar llamada" (Calendly/embed) como **micro-conversión** de
  menor fricción que el formulario largo.

### 1.5 — Jerarquía de CTA clara

- **Un** CTA primario por vista (visualmente dominante, variant `cta`).
- CTAs secundarios en `outline`/`ghost` — no competir con el primario.
- Verbo de acción + valor, no genérico: "Solicitar diagnóstico gratis" > "Contacto".

---

## Parte 2 — Engagement (aumentar dwell time y profundidad)

### 2.1 — "Siguiente paso" al final de cada página

Ninguna página debe terminar en un callejón. Al final de servicios/industrias/casos:

- Bloque de **contenido relacionado** (otros servicios, casos de la misma industria,
  productos relevantes) → mantiene la navegación viva.
- Además del `CTABanner`, links a **profundizar** (metodología, caso de éxito relacionado).

### 2.2 — Prueba social más arriba y más presente

- Subir el **logo bar de clientes** y las **métricas** (ya existen: `ClientLogosMarquee`,
  `MetricsBar`) — la prueba social temprana aumenta la confianza y el tiempo en página.
- Testimonios (`TestimonialCard`) distribuidos en páginas largas, no solo al final.
- En casos de éxito: métricas medibles arriba (resultado primero, historia después).

### 2.3 — Elementos interactivos que retienen

Los que aumentan dwell time por naturaleza:

- **Calculadora de ROI / ahorro** (ej. para FinOps o Staffing): input → resultado.
  Es un imán de tiempo y una micro-conversión (capta email para "enviar resultado").
- **Comparador** (`ComparisonTable` ya existe): Nivelics vs alternativa — expandible.
- **Tabs / acordeones** de servicios que revelan detalle sin cambiar de página.
- El **grafo del hero** y efectos ya invitan a explorar — mantenerlos.

### 2.4 — Contenido que genera sesiones largas

- **Blog** bien enlazado internamente (posts relacionados al final, CTA contextual
  dentro del artículo → servicio relevante).
- **Casos de éxito** como formato narrativo (reto → solución → resultado) con datos.
- Enlazado interno fuerte: cada servicio enlaza a casos, industrias y productos
  relacionados. Aumenta páginas/sesión y SEO simultáneamente.

### 2.5 — Lead magnets (captura sin compromiso)

- Descargable (guía, checklist, benchmark de industria) a cambio de email →
  convierte al que "solo mira" en contacto.
- Newsletter/insights B2B con un valor claro.

---

## Parte 3 — Momentos de conversión por tipo de página

| Página            | Intención del visitante      | CTA prioritario                            | Engagement                                             |
| ----------------- | ---------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **Home**          | Explorar, entender qué hacen | "Solicitar diagnóstico" + chat             | Prueba social temprana, links a servicios/casos        |
| **Servicio**      | Evaluar fit                  | "Hablar de mi proyecto" (`?from=servicio`) | Casos de esa industria, comparador, siguiente servicio |
| **Producto SaaS** | Evaluar/probar               | "Solicitar demo" / "Ver precios"           | ComparisonTable, casos, calculadora ROI                |
| **Caso de éxito** | Validar credibilidad         | "Quiero resultados así" → contacto         | Casos relacionados, métricas arriba                    |
| **Blog**          | Aprender                     | CTA contextual al servicio del tema        | Posts relacionados, newsletter                         |
| **Contacto**      | Convertir                    | Form + WhatsApp + agendar llamada          | Reforzar confianza (logos, garantía)                   |

---

## KPIs y medición

Sin medición no hay CRO. Instrumentar (GA4 / analytics del proyecto) y seguir:

### Conversión

- **Tasa de lead** (envíos de form + clics WhatsApp + aperturas de chat) / visitantes.
- **Clics por CTA** (usar los `data-field` / `data-section` que ya existen para atribución).
- **Micro-conversiones**: descargas de lead magnet, agendas de llamada, aperturas de chat.
- **Funnel**: home → servicio → contacto → envío. Dónde se cae.

### Engagement

- **Tiempo medio en página** y **duración de sesión** (objetivo: subir vs baseline).
- **Profundidad de scroll** (25/50/75/100%) por página — usar los `data-section`.
- **Páginas por sesión** (objetivo: > 2.5).
- **Tasa de rebote** de páginas clave (objetivo: bajar).

### Instrumentación sugerida

- Eventos en cada CTA (nav, hero, sticky, WhatsApp, chat, banner final).
- Scroll-depth automático apoyado en los `data-section="..."` ya presentes en la home.
- Heatmap / grabaciones (Clarity/Hotjar) en home, un servicio y `/contacto` para
  detectar fricción real.

---

## Priorización CRO (impacto vs esfuerzo)

| #   | Acción                                                       | Impacto  | Esfuerzo | Depende de      |
| --- | ------------------------------------------------------------ | -------- | -------- | --------------- |
| 1   | CTA sticky global en mobile                                  | 🔴 Alto  | Bajo     | —               |
| 2   | WhatsApp FAB global en marketing                             | 🔴 Alto  | Bajo     | —               |
| 3   | Instrumentar KPIs (eventos + scroll-depth)                   | 🔴 Alto  | Medio    | —               |
| 4   | "Siguiente paso" + contenido relacionado al final de páginas | 🟠 Alto  | Medio    | Fase 1 (visual) |
| 5   | Chat proactivo por intención                                 | 🟠 Medio | Medio    | —               |
| 6   | Prueba social más arriba                                     | 🟠 Medio | Bajo     | —               |
| 7   | Calculadora ROI (imán de tiempo + micro-conversión)          | 🟠 Medio | Alto     | Fase 1          |
| 8   | Lead magnet + captura                                        | 🟡 Medio | Medio    | —               |
| 9   | CTA "agendar llamada" (menor fricción)                       | 🟡 Medio | Medio    | —               |

## Checklist de aceptación — CRO

- [x] CTA de contacto persistente en mobile en todas las páginas de marketing: `GlobalMobileCta` en el layout (skip en `/contacto` y en sub-servicios, que conservan su sticky contextual propio).
- [x] WhatsApp global: `components/shared/whatsapp-fab.tsx` en el layout de marketing — bottom-left (Dapta ocupa bottom-right), elevado en mobile sobre el sticky, cerrable con localStorage, bilingüe.
- [x] Instrumentación: `lib/analytics/track.ts` (gtag → dataLayer fallback) + `ScrollDepthTracker` (25/50/75/100 por página) + eventos en StickyMobileCta (`cta_click`), WhatsApp (`whatsapp_click`), ScrollBeam (`cta_click`/`chat_invite`) e invite proactivo (`chat_invite` shown/open/dismiss). Los CTAs server-side ya llevan `data-field`/`data-section` para triggers GTM.
- [x] Chat proactivo por intención: `ProactiveChatInvite` — mobile/tablet (<lg, en desktop invita el ScrollBeam), scroll >70%, 1 vez por sesión, cerrable, abre Dapta con fallback a /contacto.
- [x] Prueba social en primera mitad: verificado — `ClientLogosMarquee` va justo después del hero y `MetricsBar` es la sección 3 (ya cumplía).
- [ ] "Siguiente paso" en todas las páginas — **parcial**: blog ✓ (`RelatedPosts`), servicios ✓ (`sibling-services-nav` + `CTABanner`); falta bloque de casos relacionados en las 7 páginas de caso (pendiente).
- [ ] Baseline de KPIs — **acción del equipo**: registrar métricas GA4 actuales antes de desplegar esta rama para medir el delta.
- [ ] Pendientes que requieren insumo de negocio: CTA "agendar llamada" (URL de Calendly), lead magnet (asset descargable). La calculadora ROI ya existe (`savings-calculator`, `hero-calculator`).
- [x] `npm run type-check` = 0 errores.

> Ejecutada el 2026-07-01 (ítems #1, #2, #3, #5, #6 de la priorización).
> </content>
