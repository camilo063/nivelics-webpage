import { renderToHtml } from "@/components/shared/ProseContent";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// El HTML trae entidades (marked escribe `can&#39;t`) y React las volvería a escapar en
// el índice: se muestra «can&#39;t». Solo se decodifica el texto visible; el id sigue
// saliendo del texto crudo para no romper anclas que ya circulan.
function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Walks h2/h3 in the rendered HTML and injects stable `id` attributes so the
// TOC scroll-spy has anchors to observe. Headings that already carry an `id`
// are preserved; collisions get `-2`, `-3`, etc. suffixes.
export function addHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<(h2|h3)((?:\s+[^>]*)?)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const existingId = /\sid=["']([^"']+)["']/i.exec(attrs || "")?.[1];
      let id = existingId ?? slugify(text) ?? "";
      if (!id) id = `section-${headings.length + 1}`;
      let candidate = id;
      let n = 1;
      while (used.has(candidate)) {
        n++;
        candidate = `${id}-${n}`;
      }
      used.add(candidate);
      const level: 2 | 3 = tag.toLowerCase() === "h2" ? 2 : 3;
      headings.push({ id: candidate, text: decodeEntities(text), level });

      if (existingId) {
        const patched = attrs.replace(/\sid=["'][^"']+["']/i, ` id="${candidate}"`);
        return `<${tag}${patched}>${inner}</${tag}>`;
      }
      return `<${tag}${attrs || ""} id="${candidate}">${inner}</${tag}>`;
    },
  );

  return { html: withIds, headings };
}

export function processBlogContent(raw: string): { html: string; headings: Heading[] } {
  const rendered = renderToHtml(raw || "");
  return addHeadingIds(rendered);
}

// ─── FAQ dentro del cuerpo del artículo ──────────────────────────────────────
//
// 48 de los artículos publicados cierran con una sección de preguntas
// frecuentes escrita a mano dentro del contenido. El HTML tiene dos formas:
//
//   <h2>Preguntas frecuentes</h2><h3>pregunta</h3><p>respuesta</p>...
//   <h2>Preguntas frecuentes</h2><p><strong>pregunta</strong></p><p>respuesta</p>...
//
// De ahí sale el FAQPage. Solo se emite cuando hay ≥2 pares reales: la sección
// existe vacía en varios artículos (el h2 quedó sin cuerpo) y Google penaliza
// el structured data que no corresponde a nada visible.

export interface FaqPair {
  question: string;
  answer: string;
}

const FAQ_HEADING_TEXT: Record<"es" | "en", RegExp> = {
  es: /^preguntas\s+frecuentes$/i,
  en: /^frequently\s+asked\s+questions$/i,
};

/** Texto visible de un fragmento de HTML: sin etiquetas, sin entidades, sin dobles espacios. */
export function htmlToPlainText(html: string): string {
  const stripped = (html || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|li|div|h[1-6]|tr|td|th|blockquote)\s*>/gi, " ")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

/** Pares pregunta/respuesta marcados con encabezados más profundos que el de la sección. */
function pairsFromHeadings(segment: string, level: number): FaqPair[] {
  if (level >= 6) return [];
  const re = new RegExp(`<h([${level + 1}-6])\\b[^>]*>([\\s\\S]*?)<\\/h\\1>`, "gi");
  const marks: { question: string; answerStart: number; matchStart: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(segment)) !== null) {
    marks.push({
      question: htmlToPlainText(m[2]),
      answerStart: m.index + m[0].length,
      matchStart: m.index,
    });
  }
  return marks
    .map((mark, i) => ({
      question: mark.question,
      answer: htmlToPlainText(segment.slice(mark.answerStart, marks[i + 1]?.matchStart)),
    }))
    .filter((p) => p.question && p.answer);
}

/**
 * Pares marcados con un <strong>/<b> al inicio del párrafo. Cubre las dos
 * variantes que hay en la BD: la pregunta sola en su párrafo (la respuesta va
 * en los siguientes) y la pregunta seguida de la respuesta en el mismo párrafo.
 *
 * Se exige el signo de interrogación para abrir par: dentro de una respuesta es
 * común un párrafo que arranca en negrita («**Informar**: …») y sin ese filtro
 * se partiría en una pregunta falsa.
 */
function pairsFromBoldParagraphs(segment: string): FaqPair[] {
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const pairs: FaqPair[] = [];
  let current: { question: string; answer: string[] } | null = null;
  const flush = () => {
    if (current) pairs.push({ question: current.question, answer: current.answer.join(" ") });
  };
  let m: RegExpExecArray | null;
  while ((m = re.exec(segment)) !== null) {
    const inner = m[1].trim();
    const lead = /^<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/i.exec(inner);
    const question = lead ? htmlToPlainText(lead[2]) : "";
    if (lead && /[?¿]/.test(question)) {
      flush();
      current = { question, answer: [] };
      const sameParagraphAnswer = htmlToPlainText(inner.slice(lead[0].length));
      if (sameParagraphAnswer) current.answer.push(sameParagraphAnswer);
    } else if (current) {
      const text = htmlToPlainText(inner);
      if (text) current.answer.push(text);
    }
  }
  flush();
  return pairs.filter((p) => p.question && p.answer);
}

/**
 * Extrae los pares pregunta/respuesta de la sección de preguntas frecuentes del
 * artículo ya renderizado. Devuelve `[]` cuando no hay sección, cuando está
 * vacía o cuando hay menos de 2 pares: el FAQPage no debe emitirse entonces.
 *
 * @param html  HTML renderizado del cuerpo (el que se pinta en la página).
 * @param locale Idioma servido; se prueba su encabezado primero y el otro después,
 *               porque los cuerpos EN sin traducir caen al contenido ES.
 */
export function extractFaqPairs(html: string, locale: "es" | "en"): FaqPair[] {
  if (!html) return [];

  const labels =
    locale === "en"
      ? [FAQ_HEADING_TEXT.en, FAQ_HEADING_TEXT.es]
      : [FAQ_HEADING_TEXT.es, FAQ_HEADING_TEXT.en];

  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let sectionLevel = 0;
  let sectionStart = -1;
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(html)) !== null) {
    const text = htmlToPlainText(m[2]);
    if (!labels.some((re) => re.test(text))) continue;
    sectionLevel = Number(m[1]);
    sectionStart = m.index + m[0].length;
    break;
  }
  if (sectionStart < 0) return [];

  // La sección termina en el siguiente encabezado del mismo nivel o más alto.
  const rest = html.slice(sectionStart);
  const closeRe = new RegExp(`<h([1-${sectionLevel}])\\b[^>]*>`, "i");
  const close = closeRe.exec(rest);
  const segment = close ? rest.slice(0, close.index) : rest;

  const pairs = pairsFromHeadings(segment, sectionLevel);
  const result = pairs.length >= 2 ? pairs : pairsFromBoldParagraphs(segment);
  return result.length >= 2 ? result : [];
}
