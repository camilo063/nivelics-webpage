/**
 * Quita de los artículos del blog los marcadores de borrador «[VERIFICAR: …]» y
 * «[VERIFY: …]», que se estaban publicando tal cual en el sitio.
 *
 * Eran 309 marcadores repartidos en 41 de los 52 posts publicados, visibles para el
 * lector: «…cerca de USD 2.76 millones [VERIFICAR: costo promedio breach LATAM 2025, IBM
 * Cost of a Data Breach Report]». Son notas que quien redactó dejó para buscar una fuente
 * antes de publicar, y nadie las quitó.
 *
 * Dos tratamientos:
 *
 *  1. La mayoría son anotaciones al final de una frase que ya está completa y matizada
 *     («la ventana entre el parche y el ataque suele medirse en días, no en semanas»).
 *     Ahí basta con borrar el corchete: la prosa queda bien y sin afirmar una cifra que
 *     nadie verificó.
 *
 *  2. En 31 sitios la frase se apoyaba en el marcador («paga su construcción en …», «takes
 *     an average of …»). Esos van uno por uno en REESCRITURAS: se reformula la frase sin
 *     inventar el número. Donde el dato sí es verificable y público se deja escrito
 *     (WCAG 2.2 es de octubre de 2023 y añade nueve criterios; PCI DSS pide doce meses de
 *     logs con tres en línea).
 *
 * Idempotente: si ya no hay marcadores, no escribe.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-marcadores-blog.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-marcadores-blog.ts
 *   node --import tsx scripts/seed-limpiar-marcadores-blog.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

/** Campos de texto de un post donde pueden vivir los marcadores. */
const CAMPOS = [
  "titleEs",
  "titleEn",
  "excerptEs",
  "excerptEn",
  "contentEs",
  "contentEn",
  "seoDescriptionEs",
  "seoDescriptionEn",
] as const;

const MARCADOR = /\s*\[(?:VERIFICAR|VERIFY)[^\]]*\]/g;

/**
 * `<code>[VERIFY: …]</code>` NO es una nota de borrador: es el propio artículo de
 * generación de contenido citando la convención como ejemplo. Se protege con un
 * centinela mientras corre el barrido y se restituye después. Sin esto quedaba
 * `<code></code>`, y una de las dos apariciones se colaba además en el FAQPage.
 */
const CODIGO_LITERAL = /<code>\[(?:VERIFICAR|VERIFY)[^<]*<\/code>/g;

/** `<p>[VERIFICAR: …]. Lo que sí…` → el punto era del marcador, no de la frase. */
const PARRAFO_ABRE_MARCADOR = /<p>\s*\[(?:VERIFICAR|VERIFY)[^\]]*\]\s*\.\s*/g;
const CENTINELA = "\u0000MARCA\u0000";

/** `(…[VERIFICAR: …]…)` entero: el paréntesis solo existía para envolver el marcador. */
const PARENTESIS_MARCADOR = /\s*\(\s*\[(?:VERIFICAR|VERIFY)[^\]]*\]\s*\)/g;

/** `.[VERIFICAR: …].` → un solo signo, sin tocar la puntuación del resto del campo. */
const PUNTUACION_MARCADOR = /([.;:])\s*\[(?:VERIFICAR|VERIFY)[^\]]*\]\s*\1/g;

/**
 * Frases que se apoyaban en el marcador: se reescriben enteras. El patrón incluye el
 * texto de alrededor porque borrar solo el corchete dejaba la oración coja.
 */
const REESCRITURAS: Array<[RegExp, string]> = [
  [
    /Perplexity citaba a Nivelics en \[VERIFICAR[^\]]*\]/g,
    "Perplexity citaba a Nivelics en una fracción mínima",
  ],
  [/de 300\+ a \[VERIFICAR[^\]]*\]/g, "de 300+ a un catálogo acotado"],
  [
    /According to the \[VERIFY: Verizon[^\]]*\]/g,
    "According to the Verizon Data Breach Investigations Report",
  ],
  [
    /the cost of a single web-originated incident reached \[VERIFY[^\]]*\]/g,
    "the cost of a single web-originated incident runs into the millions",
  ],
  [/paga su construcción en \[VERIFICAR[^\]]*\]/g, "paga su construcción en pocos meses"],
  [/Leader \(\[VERIFY: 34\+[^\]]*\]\)/g, "Leader (widest region footprint)"],
  [/Strong \(\[VERIFY: 40\+[^\]]*\]\)/g, "Strong (broad global coverage)"],
  [/Cinco años y \[VERIFICAR[^\]]*\] después/g, "Cinco años de migraciones cloud después"],
  [
    /translates into a \[VERIFY: average client savings[^\]]*\] reduction/g,
    "translates into a measurable reduction",
  ],
  [
    /overspend by an average of \[VERIFY: average overspend[^\]]*\] in year one/g,
    "overspend in year one",
  ],
  [
    /sampling del \[VERIFICAR[^\]]*\] suele ser suficiente/g,
    "un sampling parcial suele ser suficiente",
  ],
  [
    /command salaries in the \[VERIFY: USD 6,000[^\]]*\] and turnover is high/g,
    "command premium salaries, and turnover is high",
  ],
  [
    /payback window for a well-scoped automation initiative is \[VERIFY[^\]]*\]/g,
    "payback window for a well-scoped automation initiative is measured in months, not years",
  ],
  [
    /These ranges are \[VERIFY: 2026 LATAM nearshore rate[^\]]*\]/g,
    "These ranges are indicative and move with role, seniority and market",
  ],
  [/takes an average of \[VERIFY: 5–7 months[^\]]*\] and costs/g, "takes several months and costs"],
  [
    /The result: salary inflation of \[VERIFY: 18–25%[^\]]*\] and time-to-hire cycles/g,
    "The result: salary inflation and time-to-hire cycles",
  ],
  [
    /Ranges are \[VERIFY: 2026 LATAM nearshore AI[^\]]*\]\. For context, equivalent US-based senior ML engineer fully loaded cost lands at \[VERIFY[^\]]*\], roughly 1\.8–2\.2x the LATAM rate\./g,
    "Ranges are indicative and move with role, seniority and market. The equivalent US-based senior ML engineer, fully loaded, costs roughly twice the LATAM rate.",
  ],
  [/se redujo a \[VERIFICAR: 2,5 años[^\]]*\]/g, "se acortó a pocos años"],
  [
    /oportunidad medible: cerca del \[VERIFICAR: 15-16%[^\]]*\] y un porcentaje mucho mayor/g,
    "oportunidad medible: una parte significativa de la población mundial vive con alguna discapacidad, y un porcentaje mucho mayor",
  ],
  // WCAG 2.2 es recomendación del W3C desde octubre de 2023 y añade nueve criterios: dato
  // público y verificable, así que se deja escrito en vez de vaciarlo.
  [
    /recomendación oficial del W3C en \[VERIFICAR: octubre de 2023\]/g,
    "recomendación oficial del W3C en octubre de 2023",
  ],
  [/Añade \[VERIFICAR: 9 nuevos criterios de éxito\]/g, "Añade nueve criterios de éxito nuevos"],
  [
    /de facto\. En \[VERIFICAR: 2023-2024 hubo más de 4\.000 demandas[^\]]*\]\./g,
    "de facto, y el volumen de demandas por accesibilidad web en cortes federales sigue creciendo año a año.",
  ],
  [
    /con plazos \[VERIFICAR: hasta abril de 2026[^\]]*\]/g,
    "con plazos escalonados según el tamaño de la entidad",
  ],
  [
    /muestran aumentos de \[VERIFICAR: entre 10% y 30%[^\]]*\]\./g,
    "muestran aumentos de tráfico orgánico tras remediaciones de accesibilidad.",
  ],
  [
    /pagar su costo de creación en \[VERIFICAR: rango típico de 5 a 15 ejecuciones[^\]]*\]\./g,
    "pagar su costo de creación tras un puñado de ejecuciones.",
  ],
  [
    /consumen entre un \[VERIFICAR: 20-30%[^\]]*\] del tiempo del equipo/g,
    "consumen una parte considerable del tiempo del equipo",
  ],
  [
    /error rate bajó a \[VERIFICAR[^\]]*\], y se liberaron/g,
    "el error rate se redujo de forma sostenida, y se liberaron",
  ],
  [
    /3DS2 envía más de \[VERIFICAR: número exacto de data points[^\]]*\] al emisor/g,
    "3DS2 envía muchos más datos de contexto al emisor",
  ],
  // PCI DSS exige conservar doce meses de logs, con tres inmediatamente disponibles.
  [
    /retención mínima de \[VERIFICAR: retención PCI DSS[^\]]*\] y alertas/g,
    "retención mínima de doce meses, con los últimos tres disponibles en línea si aplica PCI DSS, y alertas",
  ],
  [
    /procesan más de \[VERIFICAR: umbral de facturación anual[^\]]*\] al año/g,
    "procesan volúmenes altos de transacciones al año",
  ],
  [
    /Retail spread of \[VERIFY: 2–4% typical retail FX spread[^\]]*\]/g,
    "Retail spread on top of mid-market",
  ],
  [
    /Un dato relevante: \[VERIFICAR: % de proyectos de IA en LATAM[^\]]*\]\. La distancia/g,
    "Un dato relevante: buena parte de los proyectos de IA en LATAM se queda en piloto y nunca llega a producción. La distancia",
  ],
  [
    /reach production within 12 months: \[VERIFY: LATAM AI pilot-to-production rate[^\]]*\]\./g,
    "reach production within 12 months: still a minority.",
  ],
  [
    /pérdidas reportadas por \[VERIFICAR: monto exacto del fraude Arup[^\]]*\]/g,
    "pérdidas millonarias",
  ],
  // — Segunda tanda: frases que el barrido dejó truncadas y que el QA encontró tras la
  //   primera reparación. Mismo criterio: reformular sin inventar la cifra.
  [
    /El egress hacia internet cuesta \[VERIFICAR[^\]]*\];/g,
    "El egress hacia internet se cobra por GB;",
  ],
  [
    /typically range \[VERIFY[^\]]*\]\./g,
    "typically command rates well above the commodity offshore tier and well below US onshore.",
  ],
  [
    /with more than \[VERIFY[^\]]*\] operating across payments/g,
    "with a large and growing number of fintechs operating across payments",
  ],
  [
    /concentrate roughly \[VERIFY[^\]]*\]\s*, followed by/g,
    "concentrate most of the volume, followed by",
  ],
  [/usually takes \[VERIFY[^\]]*\]\./g, "usually takes considerably longer."],
  [
    /en la región alcanzó \[VERIFICAR[^\]]*\], con una tasa/g,
    "en la región siguió creciendo, con una tasa",
  ],
  [
    /When invocation frequency is under \[VERIFY[^\]]*\], Lambda wins on cost\./g,
    "When invocation frequency is low, Lambda wins on cost.",
  ],
  [
    /The crossover typically sits between \[VERIFY[^\]]*\], depending on memory/g,
    "The crossover point depends on memory",
  ],
  [/Según \[VERIFICAR[^\]]*\], una porción mayoritaria/g, "Una porción mayoritaria"],
  [
    /place post-release defect cost at roughly \[VERIFY[^\]]*\]\./g,
    "place post-release defect cost far above the cost of catching the same defect in development.",
  ],
  [
    /Industry benchmark for tech is around \[VERIFY[^\]]*\]; anything above 30%/g,
    "Industry benchmarks sit well below that; anything above 30%",
  ],
  [/In \[VERIFY[^\]]*\], React remained/g, "React remained"],
  [/in 2026 sit at \[VERIFY[^\]]*\], significantly below/g, "in 2026 sit significantly below"],
  [/sobrepagan entre \[VERIFICAR[^\]]*\]\./g, "sobrepagan de forma sistemática."],
  [/Según \[VERIFICAR[^\]]*\], el rol de AI\/ML Specialist es/g, "El rol de AI/ML Specialist es"],
  [/is small, estimated at \[VERIFY[^\]]*\]\./g, "is small."],
  [
    /lifts form completion rates by \[VERIFY[^\]]*\], because the fixes/g,
    "lifts form completion rates, because the fixes",
  ],
  // — Tercera tanda: los marcadores que iban EN MEDIO de la oración y que las dos tandas
  //   anteriores no cubrieron. Donde el dato es público y verificable se deja escrito
  //   (la EAA rige desde el 28 de junio de 2025; las leyes LATAM tienen nombre y número).
  [
    /\[VERIFICAR: porcentaje de empresas LATAM[^\]]*\] de las grandes empresas reporta/g,
    "Una mayoría de las grandes empresas reporta",
  ],
  [
    /Roughly \[VERIFY[^\]]*\] of medium and large enterprises report/g,
    "A growing share of medium and large enterprises report",
  ],
  [
    /The headline gap is roughly \[VERIFY[^\]]*\] percentage points in enterprise AI adoption\./g,
    "The headline gap in enterprise AI adoption is wide.",
  ],
  [
    /entró en vigor el \[VERIFICAR: 28 de junio de 2025\] y aplica/g,
    "entró en vigor el 28 de junio de 2025 y aplica",
  ],
  [
    /\[VERIFICAR: Brasil \(Lei Brasileira de Inclusão[^\]]*\] establecen obligaciones/g,
    "Brasil (Lei Brasileira de Inclusão, 2015), Colombia (Ley 1618 de 2013 y NTC 5854), México (Ley General para la Inclusión de Personas con Discapacidad) y Argentina (Ley 26.653) establecen obligaciones",
  ],
  [
    /In 2026, roughly \[VERIFY[^\]]*\] — a market segment/g,
    "In 2026, people living with some form of disability remain a market segment",
  ],
  [
    /puede costar \[VERIFICAR: un 5-10% adicional[^\]]*\], mientras que remediarlo/g,
    "añade un esfuerzo marginal, mientras que remediarlo",
  ],
  [
    /Ask for \[VERIFY[^\]]*\] as a benchmark when negotiating\./g,
    "Ask for their current average time-to-productive as a benchmark when negotiating.",
  ],
  [
    /financial-services data breach was \[VERIFY[^\]]*\] and the incidents span/g,
    "financial-services data breach runs into the millions, and the incidents span",
  ],
  [
    /AEs report \[VERIFY[^\]]*\] when this is deployed correctly\./g,
    "AEs report meaningful time savings on prospect research when this is deployed correctly.",
  ],
  [
    /Cloud adoption in LATAM enterprises reached \[VERIFY[^\]]*\] in 2025, with banking/g,
    "Cloud adoption in LATAM enterprises kept climbing through 2025, with banking",
  ],
  [
    /un SRE senior en LATAM cuesta \[VERIFICAR[^\]]*\] mensual fully-loaded\./g,
    "un SRE senior en LATAM tiene un costo mensual fully-loaded que pesa en la comparación.",
  ],
  [
    /A reasonable target is observability spend between \[VERIFY[^\]]*\] of total AWS spend\./g,
    "A reasonable target keeps observability spend to a small share of total AWS spend.",
  ],
  [
    /se alcanza entre \[VERIFICAR[^\]]*\] tras iniciar la automatización\./g,
    "se alcanza a los pocos meses de iniciar la automatización.",
  ],
  [
    /senior engineers typically run \[VERIFY[^\]]*\] versus \[VERIFY[^\]]*\]\./g,
    "senior engineers typically run well below their US onshore equivalents.",
  ],
  [
    /Argentina, and Brazil, with \[VERIFY[^\]]*\] senior engineers available\./g,
    "Argentina, and Brazil.",
  ],
  // — Cuarta tanda: marcadores que van seguidos de un signo de puntuación, así que el
  //   detector los daba por «anotación al final» aunque la oración dependiera de ellos.
  [
    /ARM-based instances that deliver \[VERIFY[^\]]*\]\./g,
    "ARM-based instances that deliver better price-performance than comparable x86.",
  ],
  [/by a wide margin — \[VERIFY[^\]]*\]\./g, "by a wide margin."],
  [/Review utilization quarterly — \[VERIFY[^\]]*\]\./g, "Review utilization quarterly."],
  [
    /Ese punto suele estar \[VERIFICAR[^\]]*\]\./g,
    "Ese punto depende del volumen de invocaciones y del perfil de ejecución.",
  ],
  [
    /<strong>Lambda:<\/strong> ~\[VERIFICAR[^\]]*\], sin costos fijos\./g,
    "<strong>Lambda:</strong> se paga por invocación, sin costos fijos.",
  ],
  [/now the dominant trend per \[VERIFY[^\]]*\], builds/g, "now the dominant trend, builds"],
  [
    /apuntan a que cubren \[VERIFICAR[^\]]*\]\./g,
    "apuntan a que cubren solo una parte de los criterios.",
  ],
  [
    /ADA Title III website lawsuits exceeded \[VERIFY[^\]]*\]\./g,
    "ADA Title III website lawsuits keep climbing year over year.",
  ],
  [
    /las herramientas automáticas detectan \[VERIFICAR[^\]]*\];/g,
    "las herramientas automáticas detectan solo una parte de los problemas;",
  ],
  [/double-digit CAGR through 2028, per \[VERIFY[^\]]*\]\./g, "double-digit CAGR through 2028."],
  [
    /<strong>Nubank\.<\/strong> Surpassed \[VERIFY[^\]]*\]\./g,
    "<strong>Nubank.</strong> Operates at scale across Brazil, Mexico and Colombia.",
  ],
];

/**
 * Bloques cuyo contenido ES el marcador: `<p>[VERIFICAR: …].</p>`. Se borran enteros,
 * porque quitar solo el corchete deja un párrafo con un punto suelto.
 */
const BLOQUE_SOLO_MARCADOR = /<(p|li)>\s*\[(?:VERIFICAR|VERIFY)[^\]]*\]\s*[.;:,]?\s*<\/\1>\s*/g;

/**
 * Reparaciones sobre el texto YA limpio. El barrido genérico quitaba el corchete pero no
 * la frase que se apoyaba en él, y dejó 21 puntos rotos en 11 posts: oraciones truncadas
 * («organizations waste roughly.»), dos encabezados fusionados con el párrafo siguiente y
 * la tabla de tarifas de staff-augmentation-para-proyectos-ia con las tres columnas en
 * blanco. Van aquí y no en REESCRITURAS porque la BD ya tiene el texto sin marcador: así
 * el script arregla lo mismo tanto si corre sobre el contenido original como sobre el ya
 * barrido, y sigue siendo idempotente.
 */
const REPARACIONES: Array<[RegExp, string]> = [
  [
    /Gartner estima que del gasto cloud es desperdicio evitable\./g,
    "Los informes anuales de Gartner y Flexera coinciden en que una parte relevante del gasto cloud es desperdicio evitable.",
  ],
  [
    /organizations waste roughly\./g,
    "organizations waste a significant share of their cloud spend.",
  ],
  [/tickets\. Per, the economics/g, "tickets. The economics"],
  [
    /poorly governed RPA programs see\./g,
    "poorly governed RPA programs end up reworking a large share of their bots within the first year.",
  ],
  [/2 FTE al año \(aprox\. USD por FTE\)/g, "2 FTE al año"],
  [
    /procesaba aproximadamente conciliaciones bancarias al mes/g,
    "procesaba un volumen alto de conciliaciones bancarias al mes",
  ],
  [
    /don&#39;t actively manage cost overspend by\./g,
    "don&#39;t actively manage cost overspend significantly.",
  ],
  [
    /cuota de mercado cloud global con aproximadamente, seguido por/g,
    "cuota de mercado cloud global, por delante de",
  ],
  [/and cuts cycle time by\./g, "and cuts cycle time materially."],
  [/una brecha sigue siendo alto ——,/g, "una brecha sigue siendo alto,"],
  [/Según el el sector retail sigue siendo/g, "El sector retail sigue siendo"],
  [/Según, una fracción significativa/g, "Una fracción significativa"],
  [/Con PCI DSS v4\.0 \(en vigor desde\) hay requisitos/g, "Con PCI DSS v4.0 hay requisitos"],
  [/Nada de claves en\.env commiteados/g, "Nada de claves en .env commiteados"],
  [/~70 hours\/month, or roughly\./g, "~70 hours/month."],
  [
    /produce lo que antes requería\.<\/p>/g,
    "produce lo que antes requería un equipo bastante mayor.</p>",
  ],
  [
    /accessibility statement cover roughly\./g,
    "accessibility statement cover the bulk of the legal exposure across the US, the EU and the main LATAM markets.",
  ],
  [
    /eight weeks of launch we observed, a measurable rise/g,
    "eight weeks of launch we observed a measurable rise",
  ],
  // Los dos encabezados que se tragaron el párrafo siguiente: el marcador era la línea
  // que los separaba.
  [
    /### Qué porcentaje de búsquedas B2B pasa por un LLM hoy\. Lo que sí es medible/g,
    "### Qué porcentaje de búsquedas B2B pasa por un LLM hoy\n\nLo que sí es medible",
  ],
  [
    /### Resultados tempranos \(indexación, tiempo en Claude\/Perplexity\)\. Lo que sí podemos declarar/g,
    "### Resultados tempranos (indexación, tiempo en Claude/Perplexity)\n\nLo que sí podemos declarar",
  ],
  [
    /Un proceso típico para cubrir un ML Engineer senior en LATAM toma entre desde la apertura del rol/g,
    "Un proceso típico para cubrir un ML Engineer senior en LATAM toma meses desde la apertura del rol",
  ],
];

/**
 * La tabla de tarifas del post de staff augmentation para IA: sus quince celdas estaban
 * dentro de marcadores, así que el barrido dejó la tabla vacía. Los rangos son tarifas
 * comerciales propias, no una estadística de tercero, y la versión en inglés del mismo
 * artículo ya las publica, así que se restauran — con los valores de la tabla inglesa, que
 * es la que el autor dejó sin marcar. La española traía rangos distintos en 4 de 5 filas
 * (el lead de AI Researcher difería un 25%): el sitio no puede publicar dos listas de
 * precios para los mismos roles.
 */
const TARIFAS_IA: Array<[string, string, string, string]> = [
  ["ML Engineer", "55–75", "75–95", "95–120"],
  ["Data Engineer (AI)", "50–70", "70–90", "90–110"],
  ["MLOps Engineer", "60–80", "80–100", "100–125"],
  ["LLM / Prompt Engineer", "55–75", "75–100", "100–130"],
  ["AI Researcher", "70–95", "95–130", "130–180"],
];

function repararTablaTarifas(texto: string): string {
  let out = texto;
  for (const [rol, mid, senior, lead] of TARIFAS_IA) {
    // Casa tanto la fila vacía que dejó el barrido como una ya escrita con otros valores.
    const fila = new RegExp(
      `<td>${rol.replace(/[.*+?^$()|[\]\\]/g, "\\$&")}</td>\\s*<td>[^<]*</td>\\s*<td>[^<]*</td>\\s*<td>[^<]*</td>`,
    );
    const nueva = `<td>${rol}</td>\n<td>${mid}</td>\n<td>${senior}</td>\n<td>${lead}</td>`;
    const m = fila.exec(out);
    if (m && m[0] !== nueva) out = out.replace(fila, nueva);
  }
  return out;
}

/**
 * Limpia un campo. El barrido de marcadores solo corre si el campo trae alguno: aplicarlo
 * a todo el corpus dañaba texto ajeno (el colapso de espacios convirtió «claves en .env»
 * en «claves en.env»). Las reparaciones sí corren siempre, porque arreglan el texto que
 * una corrida anterior ya dejó roto.
 */
/**
 * El único post cuya tabla de tarifas hay que reparar. Sin este filtro, la reparación
 * pisaba la tabla de `staff-augmentation-latam-ventajas-nearshore`, que también tiene una
 * fila «ML Engineer» pero con otros rangos.
 */
const POST_TARIFAS = "staff-augmentation-para-proyectos-ia";

function limpiar(texto: string, slug: string): string {
  let out = texto;
  if (out.includes("[VERIF")) {
    const literales: string[] = [];
    out = out.replace(CODIGO_LITERAL, (m) => {
      literales.push(m);
      return CENTINELA;
    });
    out = out.replace(BLOQUE_SOLO_MARCADOR, "");
    for (const [re, to] of REESCRITURAS) out = out.replace(re, to);
    // MARCADOR ya se come el espacio previo, así que la puntuación queda pegada sola.
    // Los paréntesis vacíos y la puntuación duplicada se resuelven ANCLADOS al marcador.
    // Como reglas globales borraban texto legítimo: «sleep()» perdía sus paréntesis y un
    // «&quot;;» real perdía el punto y coma, porque `&quot;` ya termina en «;».
    out = out
      .replace(PARRAFO_ABRE_MARCADOR, "<p>")
      .replace(PARENTESIS_MARCADOR, "")
      .replace(PUNTUACION_MARCADOR, "$1")
      .replace(MARCADOR, "")
      .replace(/<(p|li)>\s*[.;:,]?\s*<\/\1>\s*/g, "")
      .replace(/<ul>\s*<\/ul>\s*/g, "");
    out = out.replace(new RegExp(CENTINELA, "g"), () => literales.shift() ?? "");
  }
  out = REPARACIONES.reduce((t, [re, to]) => t.replace(re, to), out);
  return slug === POST_TARIFAS ? repararTablaTarifas(out) : out;
}

/** Devuelve solo los campos que cambian. */
function patchDe(row: Record<string, unknown>): Record<string, string> {
  const patch: Record<string, string> = {};
  for (const campo of CAMPOS) {
    const v = row[campo];
    if (typeof v !== "string") continue;
    const limpio = limpiar(v, row.slug as string);
    if (limpio !== v) patch[campo] = limpio;
  }
  return patch;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/blog_posts.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let tocados = 0;
  for (const row of rows) {
    const patch = patchDe(row);
    if (!Object.keys(patch).length) continue;
    Object.assign(row, patch);
    tocados++;
  }
  if (!tocados) {
    console.log("• blog_posts.json: ya no hay marcadores");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/blog_posts.json: ${tocados} post(s)`);
}

async function main(): Promise<void> {
  if (FALLBACKS) {
    applyToFallbacks();
    process.exit(0);
  }
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }

  let tocados = 0;
  for (const row of await db.select().from(blogPosts)) {
    const patch = patchDe(row as unknown as Record<string, unknown>);
    if (!Object.keys(patch).length) continue;
    tocados++;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slug}: ${Object.keys(patch).join(", ")}`);
      continue;
    }
    await db
      .update(blogPosts)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(blogPosts.id, row.id));
    console.log(`✓ ${row.slug}: ${Object.keys(patch).join(", ")}`);
  }

  if (!tocados) console.log("• ningún post trae marcadores");
  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
