/**
 * Saneo de copy para casos de éxito (Fase 1.5 — dirección de arte).
 *
 * El CMS guarda métricas como { value, label } y títulos con prefijo
 * "Cliente: …". Concatenarlos a ciegas produce frases rotas tipo
 * "Alto tráfico Portal de alto tráfico modernizado". Estos helpers
 * formatean de forma defensiva sin importar cómo venga el dato.
 */

/** Quita el prefijo "NombreCliente:" o "NombreCliente —" del título del caso. */
export function cleanCaseTitle(clientName: string | null | undefined, title: string): string {
  if (!clientName) return title;
  const re = new RegExp(`^\\s*${escapeRegExp(clientName)}\\s*[:—–-]\\s*`, "i");
  return title.replace(re, "").trim() || title;
}

/**
 * Une valor + label de una métrica sin duplicar palabras:
 * - label ya contiene el valor → solo label ("Millones" + "Plataforma escalable
 *   a millones de usuarios" → el label).
 * - valor sin dígitos (es una palabra, no una cifra) → solo label.
 * - valor numérico real → "40% ahorro promedio…" (valor + label).
 */
export function formatCaseMetric(
  value: string | null | undefined,
  label: string | null | undefined,
): string {
  const v = value?.trim() ?? "";
  const l = label?.trim() ?? "";
  if (!v) return l;
  if (!l) return v;
  if (l.toLowerCase().includes(v.toLowerCase())) return l;
  if (!/\d/.test(v)) return l;
  return `${v} ${l}`;
}

/** Código tipográfico de país (sin emoji flags — se renderizan distinto por OS). */
const COUNTRY_CODES: Record<string, string> = {
  colombia: "CO",
  usa: "USA",
  "estados unidos": "USA",
  "united states": "USA",
  méxico: "MX",
  mexico: "MX",
  "el salvador": "SV",
  panamá: "PA",
  panama: "PA",
  ecuador: "EC",
  perú: "PE",
  peru: "PE",
  argentina: "AR",
};

export function countryCode(country: string | null | undefined): string {
  if (!country) return "";
  return COUNTRY_CODES[country.trim().toLowerCase()] ?? country;
}

/** Limpia artefactos de footnote al final de un texto ("…resultados reales.2" → "…reales."). */
export function stripFootnote(text: string | null | undefined): string {
  return (text ?? "").replace(/\.(\d)\s*$/, ".");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
