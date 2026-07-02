/**
 * Escala tipográfica única del sitio (Fase 0 §0.1 — docs/mejoras).
 *
 * Regla: el único tamaño arbitrario permitido es el eyebrow (11px,
 * intencionalmente por debajo de la escala Tailwind). Todo lo demás
 * usa la escala estándar text-xs → text-6xl.
 *
 * Uso:
 *   import { TYPO } from "@/lib/design/typography";
 *   <p className={TYPO.body}>…</p>
 *   <p className={cn(TYPO.caption, "mt-2")}>…</p>
 */
export const TYPO = {
  /** Etiqueta pequeña en mayúsculas sobre un título (badges de sección, tags) */
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.12em]",
  /** Meta-información terciaria: país/sector, fechas, hints */
  caption: "text-xs text-text-40",
  /** Descripciones dentro de cards, texto secundario compacto */
  bodySmall: "text-sm text-text-70",
  /** Cuerpo de texto estándar */
  body: "text-base leading-relaxed text-text-70",
  /** Título de card */
  cardTitle: "text-lg font-semibold text-text-100",
  /** Subtítulo bajo un título de sección */
  sectionSubtitle: "text-lg text-text-70",
  /** Título de sección (H2) */
  sectionTitle: "text-3xl font-bold text-text-100 md:text-4xl",
  /** Título de página (H1) */
  pageTitle: "text-4xl font-bold text-text-100 md:text-5xl lg:text-6xl",
} as const;

export type TypoVariant = keyof typeof TYPO;
