# Fase 1 — Rediseño visual moderno

> **Objetivo:** el salto estético 2021 → 2025+. Depende de la Fase 0 (tokens).
> **Principio:** introducir jerarquía y variación; nada de rehacer arquitectura.
> Referencia canónica: [../../app/[locale]/(marketing)/page.tsx](<../../app/[locale]/(marketing)/page.tsx>).

## Qué "delata la edad" hoy (resumen de auditoría)

| Síntoma                            | Causa                     | Fix en esta fase                          |
| ---------------------------------- | ------------------------- | ----------------------------------------- |
| Cyan `#00d4ff` en todo             | un solo tono              | §1.4 profundidad tonal (usa rampa Fase 0) |
| Bordes `white/[0.08]` en 50+ cards | sin elevación             | §1.2 cards con escala de elevación        |
| Glass 4% uniforme                  | superficie plana          | §1.3 glass en 2 niveles                   |
| Hero con 4 patrones apilados       | ruido visual "web3"       | §1.1 hero moderno                         |
| Sombras casi nulas                 | sin depth                 | §1.2 (tokens Fase 0)                      |
| Hover = solo translateY            | microinteracción pobre    | §1.5 microinteracciones                   |
| lucide suelto en 35 archivos       | iconografía inconsistente | §1.6 consolidar GeoIcon                   |

---

## 1.1 — Rediseñar el hero

### Estado actual

[page.tsx:205-242](<../../app/[locale]/(marketing)/page.tsx#L205>): el hero apila
**cuatro capas** simultáneas — `grid-pattern` + `dot-grid` + `<HeroGraph>` +
`<ParallaxLayer>` blur blob. La retícula en perspectiva (`grid-pattern`,
`grid-pattern` diagonal) es un cliché visual de 2021.

### Acción

- **Quitar el apilamiento.** Elegir UN protagonista: dejar `<HeroGraph>`
  (el grafo de nodos, que es distintivo y on-brand) y **reemplazar `grid-pattern`
  por un mesh/aurora gradient** suave detrás.
- Mesh gradient sugerido (CSS puro, sin librería, cero coste JS):

```css
.hero-aurora {
  background:
    radial-gradient(60% 50% at 20% 10%, rgba(0, 212, 255, 0.1), transparent 70%),
    radial-gradient(50% 45% at 85% 20%, rgba(139, 92, 246, 0.1), transparent 70%), var(--grad-hero);
}
```

- Mantener `dot-grid` **solo** si aporta (con la máscara radial ya se difumina bien);
  si compite con el aurora, quitarlo.
- Conservar `<ParallaxLayer>` (ya es performante y `aria-hidden`).

**Criterio:** el hero debe tener **una jerarquía clara** — fondo aurora → grafo
sutil → contenido nítido. No tres retículas peleando por atención.

---

## 1.2 — Cards con escala de elevación

### Estado actual

- Cards de servicios: `.glass border-anim` + `borderLeft 3px` ([page.tsx:275](<../../app/[locale]/(marketing)/page.tsx#L275>)).
- Cards de casos: `bg-[rgba(255,255,255,0.03)] border border-white/[0.08]` **inline**
  ([page.tsx:337](<../../app/[locale]/(marketing)/page.tsx#L337>)) — no usa `.glass`.

### Acción

- **Todas las cards** usan las clases del sistema, no valores inline:
  card normal `.glass`, card destacada/interactiva `.glass-elevated` (Fase 0).
- **Hover coherente**: borde a `--border-strong`, `box-shadow: var(--shadow-md)`,
  y en cards de acción `--shadow-glow`.
- **Jerarquía**: los 4 pilares de servicio y los casos destacados deben tener
  más peso visual (elevated + glow) que las cards secundarias.
- Mantener `<TiltCard>` y `border-anim` (ya performantes) pero **no en todas** —
  reservarlos para cards protagonistas; su uso indiscriminado diluye el efecto.

---

## 1.3 — Glass en dos niveles

Aplicar la diferenciación de Fase 0 (`.glass` vs `.glass-elevated`):

- **Fondo de sección** (`bg-bg-surface`): plano, sin glass.
- **Card informativa**: `.glass`.
- **Card interactiva / destacada** (servicios, productos, CTA): `.glass-elevated`.

Esto crea la sensación de capas (foreground/background) que hoy falta.

---

## 1.4 — Profundidad tonal de color

Usando la rampa de Fase 0:

- **Acciones y foco** → `--primary` puro (botones `cta`, links activos, foco).
- **Bordes decorativos y glows** → `--primary-200` / `--primary-600` (tonos, no puro).
- **Texto de acento** → `--primary-200` sobre fondo oscuro (mejor legibilidad que el puro).
- **Un acento cálido puntual** (`--accent-warm`) por vista para romper la monotonía
  cyan — p.ej. en un badge "Nuevo" o en una métrica destacada. **Máximo uno por pantalla.**

Los acentos por servicio (`--ia` violeta, `--staffing` verde, `--finops` ámbar)
ya existen y están bien usados — mantenerlos como código de color semántico.

---

## 1.5 — Microinteracciones más ricas

### Estado actual

Hover = `translateY(-3px)` + cambio de opacidad. Correcto pero básico. En
`BenefitCard` el hover se maneja con JS imperativo (`onMouseEnter` mutando
`el.style`) — moverlo a CSS.

### Acción

- **Mover hover de JS a CSS** en `BenefitCard` (clase `.benefit-card:hover`).
- **Enriquecer** el hover estándar de cards: `translateY(-3px)` + `scale(1.01)` +
  transición de color del icono (GeoIcon a `--primary`) + `--shadow-md`.
- **Easing con carácter**: usar `cubic-bezier(0.22, 1, 0.36, 1)` (ya se usa en
  `nv-reveal`) de forma consistente en todas las transiciones.
- **Botones**: el variant `cta` ya hace `scale-[1.02]` — extender coherencia al
  resto (outline/secondary con un feedback de elevación sutil).
- Todo respetando `prefers-reduced-motion` (el patrón del repo ya lo hace bien).

---

## 1.6 — Consolidar iconografía en GeoIcon

### Estado actual

El design system exige GeoIcon en trabajo nuevo, pero **35 archivos de marketing
importan `lucide-react`** directamente (verificado por grep).

### Acción

- Auditar los imports de lucide en `app/[locale]` y `components/shared|layout`.
- Los iconos **decorativos / de marca** (features, badges, servicios) → migrar a
  `GeoIcon` vía `resolveIcon()` / `LUCIDE_TO_GEO` ([../../lib/icons/geometric.tsx](../../lib/icons/geometric.tsx)).
- Los iconos **funcionales de UI de acción** (`ArrowRight`, `ChevronDown`,
  `MessageCircle`) pueden quedarse como lucide si son consistentes — **pero
  documentar la regla** en `04-design-system.md`: "GeoIcon para contenido/marca,
  lucide solo para affordances de acción".
- Completar `LUCIDE_TO_GEO` para los mapeos que falten.

---

## 1.7 — Modernizar detalles finos

- **Gradientes**: hoy solo lineales. Introducir radiales en glows y un mesh en hero.
- **Scrollbar y selección**: ya están estilizados (bien). Mantener.
- **Tipografía variable**: activar pesos fluidos de Inter (resuelve además el
  hallazgo de performance de "6 pesos" — ver Fase 2).
- **Bordes redondeados**: unificar radios (`rounded-xl` = 12px como base de cards,
  `rounded-lg` = 8px botones/pills) — hoy hay mezcla de `rounded-xl/lg/2xl`.

---

## Checklist de aceptación — Fase 1

- [x] Hero rediseñado: `.hero-aurora` (mesh CSS) + HeroGraph; `grid-pattern` y `dot-grid` retirados del hero de la home.
- [x] Cards de marketing migradas a `.glass` / `.glass-elevated` + `.card-lift` (home, cases-carousel, case-study-card, metrics-bar, impact-section, client-logos-section — 0 `bg-[rgba(...)]` inline en cards).
- [x] Jerarquía de elevación: pilares y casos = `glass-elevated card-lift`; industrias/why-us/métricas = `glass` informativa.
- [x] Pills de acento migradas a `text-primary-200` (rampa); cyan puro queda en acciones/foco/métricas.
- [x] `BenefitCard` sin hover en JS — clase `.benefit-card` en globals.css con `--nv-accent` por CSS var.
- [x] Easing token `--ease-out` + lift sutil en botones outline/secondary (`motion-reduce` respetado); `card-lift` y `benefit-card` respetan reduced-motion.
- [x] Regla de iconografía documentada en `04-design-system.md` (GeoIcon = contenido/marca; lucide = affordances). Deuda anotada: iconos LucideIcon del mega-menú (VM types).
- [x] Radios: `rounded-2xl → rounded-xl` fuera de LP; LP conserva su familia 2xl (consistente internamente, documentado).
- [x] Inter migrada a variable font (§1.7) — un woff2 en vez de 6 pesos estáticos.
- [x] `npm run type-check` = 0 errores; eslint 0 errores.
- [ ] Comparativa antes/después de la home aprobada — **pendiente de revisión visual del equipo**.

> Ejecutada el 2026-07-01.
> </content>
