# Fase 0 — Fundaciones del sistema

> **Objetivo:** normalizar tokens, tipografía, elevación y color **antes** de
> rediseñar, para que la Fase 1 no herede la deuda actual.
> **Sin esta fase, el rediseño se vuelve inmanejable.**
> Archivo principal a tocar: [../../app/globals.css](../../app/globals.css).

## Por qué esta fase existe

La auditoría encontró tres sistemas conviviendo para lo mismo:

- **Tipografía**: `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[15px]`
  (62 usos arbitrarios en marketing) mezclados con `text-xs`/`text-sm`.
- **Opacidad de texto**: tokens `text-text-40/70/100` **y** `text-white/30/35/50/60/70`.
- **Superficies/bordes**: `.glass` (white 4%) **y** `bg-[rgba(255,255,255,0.03)]`
  inline **y** `border-white/[0.08]` repetido en 50+ sitios.

Resultado: nada tiene jerarquía. Esta fase colapsa esos tres sistemas en uno.

---

## 0.1 — Escala tipográfica única _(prioridad máxima)_

### Estado actual (verificado)

En `app/[locale]/(marketing)/page.tsx` conviven:

| Uso                 | Clase actual  | Ubicación                                                      |
| ------------------- | ------------- | -------------------------------------------------------------- |
| Eyebrow/badge       | `text-[10px]` | [page.tsx:281](<../../app/[locale]/(marketing)/page.tsx#L281>) |
| Descripción de card | `text-[13px]` | [page.tsx:293](<../../app/[locale]/(marketing)/page.tsx#L293>) |
| Meta país/sector    | `text-[11px]` | [page.tsx:340](<../../app/[locale]/(marketing)/page.tsx#L340>) |

Conteo en marketing: `text-[11px]`×26, `text-[13px]`×13, `text-[10px]`×8,
`text-[12px]`×7, más `text-[15px]`, `text-[22px]`, `text-[52px]`, `text-[80px]`.

### Acción

Definir una escala semántica en `app/globals.css` dentro de `@theme inline`
(Tailwind v4 CSS-first) y/o un helper `lib/design/typography.ts` con clases
compuestas reutilizables:

```ts
// lib/design/typography.ts
export const TYPO = {
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.12em]",
  caption: "text-xs text-text-40",
  bodySmall: "text-sm text-text-70",
  body: "text-base leading-relaxed text-text-70",
  cardTitle: "text-lg font-semibold text-text-100",
  sectionSubtitle: "text-lg text-text-70",
  sectionTitle: "text-3xl font-bold text-text-100 md:text-4xl",
  pageTitle: "text-4xl font-bold text-text-100 md:text-5xl lg:text-6xl",
} as const;
```

**Regla:** el único `text-[Npx]` permitido es el `eyebrow` (11px es intencional
por debajo de la escala Tailwind). Todo lo demás usa `text-xs → text-6xl`.

### Migración

- Reemplazar `text-[13px]` → `text-sm`, `text-[10px]` → `eyebrow`,
  `text-[11px]` → `text-xs` o `eyebrow` según contexto.
- Los tamaños grandes decorativos (`text-[80px]` del 404, `text-[52px]`) pueden
  quedarse pero documentados como excepción decorativa.

---

## 0.2 — Opacidad de texto: un solo sistema

### Estado actual

`text-white/30`, `/35`, `/50`, `/55`, `/60`, `/70` conviven con `text-text-40/70/100`.

### Acción

**Retirar la vía `text-white/NN` en marketing.** Usar exclusivamente los tokens:

| Rol                    | Token           | Valor             |
| ---------------------- | --------------- | ----------------- |
| Texto principal        | `text-text-100` | `#ffffff` (21:1)  |
| Texto secundario       | `text-text-70`  | `#b3b3cc` (17:1)  |
| Texto terciario / hint | `text-text-40`  | `#66667a` (9.9:1) |

Si se necesita un cuarto nivel intermedio (hoy improvisado con `white/50`),
**crear un token real** `--text-55: #8a8aa0;` en vez de opacidades sueltas.
Nunca bajar de `text-text-40` para texto legible (WCAG AA).

---

## 0.3 — Escala de elevación (bordes + sombras + superficies)

Hoy **todo** usa `border-white/[0.08]` y `.glass` (white 4%). Sin jerarquía de
profundidad, el layout se lee plano. Introducir 3 niveles.

### Bordes — nuevos tokens en `:root`

```css
--border-subtle: rgba(255, 255, 255, 0.05); /* divisores, fondos */
--border: #1e1e2e; /* (existente) card default */
--border-strong: rgba(255, 255, 255, 0.14); /* card destacada / hover */
--border-hover: rgba(0, 212, 255, 0.3); /* (existente) foco de acción */
```

### Sombras — nuevos tokens (hoy solo existe `shadow-primary/20` en botones)

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
--shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.45);
--shadow-glow: 0 8px 40px rgba(0, 212, 255, 0.15); /* acción/hover cyan */
```

### Superficies — diferenciar glass

Hoy `.glass` = white 4% en todo. Crear dos niveles:

```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
}
.glass-elevated {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}
```

**Regla de uso:** fondo de sección = plano; card normal = `.glass`;
card destacada/interactiva = `.glass-elevated` + hover a `--border-strong`.

---

## 0.4 — Color con profundidad tonal

### Estado actual

`--primary: #00d4ff` se usa para **todo**: acciones, bordes, glows, texto de
acento, iconos. Un solo tono → sin profundidad.

### Acción

Extender la rampa primaria y añadir un **acento secundario cálido** para
contraste (los acentos por servicio ya existen: `--ia`, `--cloud`, etc.).

```css
/* Rampa cyan — reservar el tono puro solo para acciones */
--primary-50: #e0fbff;
--primary-200: #7fe9ff;
--primary: #00d4ff; /* (existente) acciones, foco */
--primary-600: #00a8cc;
--primary-dark: #0099cc; /* (existente) */

/* Acento secundario cálido — para contraste puntual (badges, highlights) */
--accent-warm: #ff8a5c; /* usar con moderación: 1 acento por vista */
```

**Regla:** el cyan puro (`--primary`) se reserva para **acciones y foco**.
Bordes decorativos, texto de acento y glows usan tonos derivados
(`--primary-200`, `--primary-600`) para dar profundidad.

---

## 0.5 — Primitiva de layout `<MaxWidthWrapper>`

`max-w-[1280px] px-6 md:px-20` se repite 50+ veces. Crear:

```tsx
// components/layout/max-width-wrapper.tsx
export function MaxWidthWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-[1280px] px-6 md:px-20", className)}>{children}</div>;
}
```

Migrar de forma incremental (no es bloqueante para Fase 1).

---

## 0.6 — Ritmo vertical consistente

Hoy conviven `py-10 md:py-14`, `py-16 md:py-24`, `pt-20 pb-14…`. Definir 2 ritmos:

- **Sección estándar**: `py-16 md:py-24`
- **Sección compacta** (strips, logos): `py-10 md:py-14`
- **Hero**: `pt-24 pb-16` (excepción documentada)

Documentarlo en [../04-design-system.md](../04-design-system.md) sección "tokens".

---

## Checklist de aceptación — Fase 0

- [x] `lib/design/typography.ts` creado y home migrada; **0 usos de `text-[13px]/[12px]/[10px]`** en `app/[locale]` (grep limpio salvo excepciones decorativas documentadas).
- [x] Marketing usa solo `text-text-*` para texto (no `text-white/NN`; quedan 7 `text-white/20` en separadores decorativos `aria-hidden` — exentos por no ser texto legible).
- [x] Tokens `--border-subtle/-strong`, `--shadow-*`, `.glass-elevated`, rampa `--primary-*` y `--accent-warm` añadidos a `globals.css` (+ mapeo `@theme inline` para utilidades Tailwind).
- [x] `<MaxWidthWrapper>` creado (migración puede ser gradual).
- [x] Ritmo vertical documentado en `04-design-system.md` (+ secciones de escala tipográfica y elevación).
- [x] `npm run type-check` = 0 errores (verificado; eslint 0 errores).
- [ ] La home se ve **idéntica o mejor** — pendiente de verificación visual en dev (`npm run dev`, puerto 3002).

> Ejecutada el 2026-07-01. Bonus incluidos: rgba inline en `color:` migrados a
> `var(--text-*)`, fix del separador de idioma `text-text-40/50` (contraste
> WCAG, adelanto de Fase 2), y jerarquías hover preservadas
> (`/60→text-70`, `/80→text-100`).
> </content>
