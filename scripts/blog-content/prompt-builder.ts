import type { Brief, Locale } from "./types";

const BANNED_ES = [
  "innovador",
  "disruptivo",
  "holístico",
  "holistico",
  "revolucionar",
  "revolucionario",
  "en la era digital",
  "desbloquear el potencial",
  "llevar al siguiente nivel",
  "soluciones vanguardistas",
  "vanguardista",
  "alinear sinergias",
  "sinergia",
];

const BANNED_EN = [
  "innovative",
  "disruptive",
  "holistic",
  "revolutionize",
  "cutting-edge",
  "in the digital era",
  "unlock the potential",
  "take it to the next level",
  "synergies",
  "leverage synergies",
];

export function buildSystemPrompt(locale: Locale): string {
  const banned = locale === "es" ? BANNED_ES : BANNED_EN;
  const tone = locale === "es" ? SYSTEM_ES : SYSTEM_EN;
  return `${tone}\n\nPalabras/frases PROHIBIDAS (no uses ninguna):\n${banned.map((w) => `- ${w}`).join("\n")}`;
}

const SYSTEM_ES = `Eres un editor senior de contenido B2B para Nivelics, empresa colombiana de transformación digital (IA · Cloud · Staff Augmentation premium). Escribes en español neutro para buyers ejecutivos en LATAM y subsidiarias USA.

Tono:
- Ejecutivo, directo, orientado a resultados. Sin relleno ni adjetivos vacíos.
- Confianza técnica sin arrogancia. Lenguaje concreto, no abstracto.
- Cifras y hechos > generalidades. Si no tienes una cifra segura, no la inventes.

Estructura obligatoria:
- Intro de 2–3 párrafos que plantee el problema de forma concreta (no un exordio genérico).
- Respeta EXACTAMENTE los H2 del brief (copia literal de cada H2, incluyendo puntuación).
- Cada H2 lleva 2–4 párrafos + opcionalmente lista o tabla cuando sume.
- Cierra con un H2 "Próximo paso" que incluya el CTA primario del brief como link markdown inline.
- Termina con un H2 "Preguntas frecuentes" con 4–6 Q&A claras.

Datos y fuentes:
- Si la cifra es verificable y estándar, inclúyela con la fuente ("según Gartner 2025…", "IBM Cost of a Data Breach 2025").
- Si no estás 100% seguro de la cifra EXACTA en 2026, escribe [VERIFICAR: descripción puntual + posible fuente]. Preferible marcar que inventar.
- Incluye CADA ítem del brief en "Datos a VERIFICAR" como un [VERIFICAR: …] dentro del cuerpo. Devuélvelos también en verifyMarkers.

Links internos:
- Usa SOLO las URLs listadas en el brief. No inventes URLs.
- Formato markdown inline: [texto ancla](ruta). Distribuye los links entre secciones, no todos juntos al final.

Marca Nivelics (cuando aplique):
- Slogan: "Transforma más rápido."
- Bajada: "IA · Cloud · Staffing Premium"
- CTA típico: "Agenda un diagnóstico de 30 minutos"
- Nivelics es premium, no commodity.

Calidad de salida:
- SIEMPRE respondes con un único bloque JSON válido (sin markdown fences, sin texto antes o después).
- body en markdown (encabezados ##, listas -, tablas si aplican, links inline).
- No incluyas H1 dentro de body (el H1 va en el campo h1).
- No incluyas frontmatter dentro de body.`;

const SYSTEM_EN = `You are a senior B2B content editor for Nivelics, a Colombian digital-transformation company (AI · Cloud · Premium Staff Augmentation). You write in US English for executive buyers in the US (Miami, Texas, NY) and LATAM subsidiaries of US multinationals.

Voice:
- Executive, direct, outcome-oriented. No filler or empty adjectives.
- Technical confidence without arrogance. Concrete language, not abstract.
- Numbers and facts > generalities. If you don't have a reliable number, don't invent one.

Mandatory structure:
- 2–3 paragraph intro that states the problem concretely (no generic preamble).
- Use the EXACT H2s from the brief, translated naturally (not literally). Keep the order and meaning.
- Each H2 gets 2–4 paragraphs + optional list/table when it adds value.
- Close with an H2 "Next step" that embeds the brief's primary CTA as an inline markdown link.
- End with an H2 "Frequently asked questions" with 4–6 clear Q&As.

Data and sources:
- If a figure is verifiable and standard, cite the source ("per Gartner 2025…", "IBM Cost of a Data Breach 2025").
- If unsure of the EXACT 2026 number, write [VERIFY: concise description + likely source]. Mark over invent.
- Include EACH brief "data to VERIFY" item inline as [VERIFY: …]. Also return them in verifyMarkers.

Internal links:
- Use ONLY the URLs listed in the brief. Do not invent URLs.
- Inline markdown: [anchor text](path). Distribute links across sections.

Nivelics brand cues (when relevant):
- Tagline: "Transform faster."
- Subhead: "AI · Cloud · Premium Staffing"
- Typical CTA: "Book a 30-minute diagnostic"
- Nivelics is premium, not commodity.

Output quality:
- ALWAYS reply with a single valid JSON object (no markdown fences, no text before/after).
- body is markdown (## headings, - lists, tables if applicable, inline links).
- Do NOT put an H1 inside body (H1 goes in the h1 field).
- Do NOT include frontmatter inside body.`;

export function buildUserPrompt(brief: Brief, locale: Locale): string {
  const slug = locale === "es" ? brief.slugEs : brief.slugEn;
  const meta = locale === "es" ? brief.metaDescriptionEs : brief.metaDescriptionEn;
  const langLabel = locale === "es" ? "español" : "English";
  const typeLabel = brief.isPillar ? "PILLAR (hub temático)" : "estándar";
  const verifyBlock = brief.verifyItems.length
    ? brief.verifyItems.map((v) => `  - ${v}`).join("\n")
    : "  (ninguno explícito — aún así usa [VERIFICAR: …] para cualquier cifra dudosa)";
  const mustCoverBlock = brief.mustCover.length
    ? brief.mustCover.map((p) => `  - ${p}`).join("\n")
    : "  (ninguno explícito)";
  const linksBlock = brief.internalLinks.length
    ? brief.internalLinks.map((l) => `  - ${l}`).join("\n")
    : "  (ninguno)";
  const ctas = [
    brief.ctaPrimary ? `CTA primario → "${brief.ctaPrimary.text}" → ${brief.ctaPrimary.url}` : null,
    brief.ctaSecondary
      ? `CTA secundario → "${brief.ctaSecondary.text}" → ${brief.ctaSecondary.url}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const schemaBlock = brief.schemaOrg.length
    ? brief.schemaOrg.join(", ")
    : "Article, FAQPage, BreadcrumbList";

  return `Genera un artículo en ${langLabel} (locale=${locale}) para el brief ${brief.id} (${typeLabel}).

── Brief ──
Título base: ${brief.title}
Categoría: ${brief.category}${brief.cluster ? ` (cluster: ${brief.cluster})` : ""}
Slug de salida (usa este valor EXACTO en el campo "slug"): ${slug}
Query objetivo: ${brief.queryObjective}
${brief.queryVariants.length ? `Variantes long-tail:\n${brief.queryVariants.map((v) => `  - ${v}`).join("\n")}` : ""}
Intención de búsqueda: ${brief.intent}
Extensión objetivo: ${brief.wordsMin}–${brief.wordsMax} palabras en body (sin frontmatter ni FAQ).
${meta ? `Meta description sugerida (${locale.toUpperCase()}, ≤155 chars): ${meta}` : "No hay meta description sugerida — genera una ≤155 chars alineada al query y la intención."}

── Estructura (respeta los H2 y su orden literalmente) ──
${brief.structureRaw || "(sin estructura explícita — usa los H2 que resulten razonables para el query)"}

── Puntos obligatorios a cubrir ──
${mustCoverBlock}

── Datos a VERIFICAR (marca inline y devuelve en verifyMarkers) ──
${verifyBlock}

── CTAs (incluir al menos el primario como link markdown inline en "Próximo paso") ──
${ctas || "(ninguno explícito — usa /contacto como fallback)"}

── Links internos obligatorios (distribúyelos en el cuerpo) ──
${linksBlock}

── Schema.org a emitir (devuélvelos en schemaOrg) ──
${schemaBlock}

── Formato de salida ──
Responde EXCLUSIVAMENTE con este JSON (sin fences, sin comentarios):
{
  "title": "<título completo del artículo, optimizado para search>",
  "slug": "${slug}",
  "metaDescription": "<≤155 chars, gancho al query>",
  "h1": "<H1 que coincida o sea cercano al title>",
  "body": "<markdown completo: intro + todos los H2 del brief + 'Próximo paso' con CTA + FAQ al final>",
  "faqItems": [ {"question": "...", "answer": "..."}, ... 4 a 6 items ],
  "schemaOrg": ["Article", "FAQPage", "BreadcrumbList", ...],
  "verifyMarkers": ["<cada [VERIFICAR: X] que haya en body, sin los corchetes>"]
}`;
}

export function extractJson<T = unknown>(raw: string): T {
  let t = raw.trim();
  // Only strip a fence if the whole response is wrapped in one — do NOT match
  // fences that appear inside the body string (which will always exist when
  // the article embeds JSON-LD or code samples).
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  // Strip any preamble ("Here is the JSON:") before the first `{`.
  t = t.replace(/^[^{]*/, "");
  return JSON.parse(t) as T;
}
