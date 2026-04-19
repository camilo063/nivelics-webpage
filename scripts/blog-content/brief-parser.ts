import fs from "node:fs";
import type { Brief, BriefType, CTA } from "./types";

const DEFAULT_STANDARD_WORDS = { min: 1200, max: 1500 };
const DEFAULT_PILLAR_WORDS = { min: 2500, max: 4000 };
const DEFAULT_SCHEMA = ["Article", "FAQPage", "BreadcrumbList"];

export function parseBriefFile(filepath: string): Brief[] {
  const content = fs.readFileSync(filepath, "utf-8");
  const blocks = splitBlocks(content);
  const briefs: Brief[] = [];
  for (const block of blocks) {
    try {
      briefs.push(parseBlock(block));
    } catch (err) {
      const e = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse brief ${block.id}: ${e}`);
    }
  }
  return briefs;
}

export function parseAllBriefs(files: string[]): Brief[] {
  const all: Brief[] = [];
  for (const f of files) all.push(...parseBriefFile(f));
  // Build slug lookup so standard briefs' "P1 pillar" / slug-only refs resolve
  // to full /blog/{slugEs} paths before the prompt sees them.
  const byId = new Map(all.map((b) => [b.id, b.slugEs]));
  const allSlugs = new Set(all.map((b) => b.slugEs));
  for (const b of all) {
    b.internalLinks = b.internalLinks
      .map((raw) => resolveInternalLink(raw, byId, allSlugs))
      .filter((v): v is string => Boolean(v));
    b.internalLinks = Array.from(new Set(b.internalLinks));
  }
  return all;
}

function resolveInternalLink(
  raw: string,
  byId: Map<string, string>,
  slugSet: Set<string>,
): string | null {
  const trimmed = raw.trim().replace(/^`|`$/g, "");
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  // "P1 pillar" or "B7" or "P1"
  const idMatch = trimmed.match(/^([PB]\d+)\b/);
  if (idMatch) {
    const slug = byId.get(idMatch[1]);
    return slug ? `/blog/${slug}` : null;
  }
  // slug-only (e.g., "chatbots-vs-agentes-ia-atencion-cliente")
  if (slugSet.has(trimmed) || /^[a-z0-9][a-z0-9-]+$/.test(trimmed)) {
    return `/blog/${trimmed}`;
  }
  return null;
}

type RawBlock = { id: string; title: string; body: string };

function splitBlocks(content: string): RawBlock[] {
  const regex = /^## ((?:P|B)\d+)\s*—\s*(.+?)\s*$/gm;
  const marks: Array<{ id: string; title: string; headerEnd: number; matchStart: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    marks.push({
      id: m[1],
      title: m[2].trim(),
      matchStart: m.index,
      headerEnd: regex.lastIndex,
    });
  }
  return marks.map((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].matchStart : content.length;
    return { id: mk.id, title: mk.title, body: content.slice(mk.headerEnd, end) };
  });
}

function parseBlock(block: RawBlock): Brief {
  const isPillar = block.id.startsWith("P");
  const isStandard = !isPillar && /^- \*\*Tipo:\*\*/m.test(block.body);
  if (isPillar) return parsePillar(block);
  if (isStandard) return parseStandard(block);
  // Standard without explicit Tipo field — treat as NEW
  return parseStandard(block);
}

function parsePillar(block: RawBlock): Brief {
  const b = block.body;

  const slugEs = requireBacktickField(b, "Slug ES");
  const slugEn = requireBacktickField(b, "Slug EN");
  const category = stripParenthetical(
    readBacktickField(b, "Categoría") ?? readField(b, "Categoría") ?? "",
  );
  const cluster = readField(b, "Cluster");

  const queryObjective = readSection(b, "Query objetivo principal") ?? "";
  const queryVariants = readListSection(b, "Variantes / long-tail");
  const intent = firstLine(readSection(b, "Intención de búsqueda") ?? "");
  const extensionText = readSection(b, "Extensión objetivo") ?? "";
  const { min, max } = parseWords(extensionText, DEFAULT_PILLAR_WORDS);

  const structureRaw = readSection(b, "Estructura \\(H2/H3\\)") ?? "";
  const h2List = extractH2s(structureRaw);

  const mustCover = readListSection(b, "Puntos obligatorios a cubrir");
  const verifyItems = readListSection(b, "Datos/cifras a VERIFICAR antes de publicar", {
    stripChecklist: true,
  });

  const { primary: ctaPrimary, secondary: ctaSecondary } = parsePillarCTAs(
    readSection(b, "CTAs") ?? "",
  );

  const metaBlock = readSection(b, "Meta description(?: \\(≤?\\d+ caracteres\\))?") ?? "";
  const metaDescriptionEs = matchLine(metaBlock, /^ES:\s*(.+)$/m);
  const metaDescriptionEn = matchLine(metaBlock, /^EN:\s*(.+)$/m);

  const schemaOrg = readListSection(b, "Schema\\.org").map(normalizeSchemaType);
  const internalLinks = parseBackticksList(
    readSection(b, "Links internos(?: obligatorios.*)?") ?? "",
  ).filter((l) => l.startsWith("/"));
  const redirectFrom = parseRedirects(readSection(b, "Redirect desde slug legacy") ?? "");

  return {
    id: block.id,
    isPillar: true,
    type: "NEW" as BriefType,
    title: block.title,
    slugEs,
    slugEn,
    category,
    cluster,
    queryObjective,
    queryVariants,
    intent,
    wordsMin: min,
    wordsMax: max,
    structureRaw,
    h2List,
    mustCover,
    verifyItems,
    ctaPrimary,
    ctaSecondary,
    metaDescriptionEs,
    metaDescriptionEn,
    schemaOrg: schemaOrg.length ? schemaOrg : DEFAULT_SCHEMA,
    internalLinks,
    redirectFrom,
  };
}

function parseStandard(block: RawBlock): Brief {
  const b = block.body;

  const typeStr = readField(b, "Tipo") ?? "NEW";
  const type = (typeStr.trim() as BriefType) || "NEW";

  const slugEs = readBacktickField(b, "Slug ES") ?? "";
  const slugEn = readBacktickField(b, "Slug EN") ?? "";
  if (!slugEs) throw new Error("missing Slug ES");
  if (!slugEn) throw new Error("missing Slug EN");

  const category = stripParenthetical(readField(b, "Categoría") ?? "");
  const queryObjective = readField(b, "Query objetivo") ?? "";
  const intent = readField(b, "Intención") ?? "Informacional";

  const structureRaw = extractStandardStructure(b);
  const h2List = extractH2s(structureRaw);

  const mustCoverRaw = readField(b, "Puntos obligatorios") ?? "";
  const mustCover = mustCoverRaw
    ? mustCoverRaw
        .split(/[;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const verifyRaw = readField(b, "Datos a VERIFICAR") ?? "";
  const verifyItems = verifyRaw
    ? verifyRaw
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const ctaRaw = readField(b, "CTA") ?? "";
  const ctaUrls = parseBackticksList(ctaRaw);
  const ctaPrimary: CTA | undefined = ctaUrls[0]
    ? { text: "Contáctanos", url: ctaUrls[0] }
    : undefined;
  const ctaSecondary: CTA | undefined = ctaUrls[1]
    ? { text: "Ver servicio", url: ctaUrls[1] }
    : undefined;

  const internalLinksRaw = readField(b, "Links internos") ?? "";
  const internalLinks = parseInternalLinksStandard(internalLinksRaw);

  const redirectFromRaw = readField(b, "Redirect desde") ?? "";
  const redirectFrom = parseRedirects(redirectFromRaw);

  return {
    id: block.id,
    isPillar: false,
    type,
    title: block.title,
    slugEs,
    slugEn,
    category,
    cluster: undefined,
    queryObjective,
    queryVariants: [],
    intent,
    wordsMin: DEFAULT_STANDARD_WORDS.min,
    wordsMax: DEFAULT_STANDARD_WORDS.max,
    structureRaw,
    h2List,
    mustCover,
    verifyItems,
    ctaPrimary,
    ctaSecondary,
    metaDescriptionEs: undefined,
    metaDescriptionEn: undefined,
    schemaOrg: DEFAULT_SCHEMA,
    internalLinks,
    redirectFrom,
  };
}

// ─── helpers ─────────────────────────────────────────────

/** Reads `**Field:** value` inline bold-labeled field (standard format) */
function readField(body: string, label: string): string | undefined {
  const re = new RegExp(`^-?\\s*\\*\\*${escapeRe(label)}:\\*\\*\\s*(.+?)$`, "m");
  const m = body.match(re);
  return m ? m[1].trim() : undefined;
}

/** Reads `**Field:** \`value\`` with backticks */
function readBacktickField(body: string, label: string): string | undefined {
  const v = readField(body, label);
  if (!v) return undefined;
  const bt = v.match(/`([^`]+)`/);
  return bt ? bt[1] : v.replace(/`/g, "").trim();
}

function requireBacktickField(body: string, label: string): string {
  const v = readBacktickField(body, label);
  if (!v) throw new Error(`missing field "${label}"`);
  return v;
}

/** Reads content under `### Header` up to next `### ` / `## ` / end-of-body. */
function readSection(body: string, headerRegex: string): string | undefined {
  const sentinel = "\n## __END_OF_BRIEF__\n";
  const augmented = body + sentinel;
  const re = new RegExp(`^###\\s+${headerRegex}\\s*$([\\s\\S]*?)(?=^###\\s|^##\\s)`, "m");
  const m = augmented.match(re);
  return m ? m[1].trim() : undefined;
}

/** Parse bullet list under a ### header */
function readListSection(
  body: string,
  headerRegex: string,
  opts: { stripChecklist?: boolean } = {},
): string[] {
  const section = readSection(body, headerRegex);
  if (!section) return [];
  return section
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- ") || l.startsWith("* "))
    .map((l) => {
      let s = l.replace(/^[-*]\s+/, "");
      if (opts.stripChecklist) s = s.replace(/^\[\s?[xX]?\s?\]\s*/, "");
      return s.trim();
    })
    .filter(Boolean);
}

function extractH2s(structure: string): string[] {
  const lines = structure.split("\n");
  const out: string[] = [];
  for (const l of lines) {
    // matches "**H2. Title**" or "- H2. Title" or "H2. Title"
    const m = l.match(/^(?:\s*[-*]\s+)?(?:\*\*)?H2[.:]\s*(.+?)(?:\*\*)?\s*$/);
    if (m) out.push(m[1].replace(/\*\*/g, "").trim());
  }
  return out;
}

function extractStandardStructure(body: string): string {
  const sentinel = "\n- **__END__:** x\n";
  const augmented = body + sentinel;
  const re = /^-?\s*\*\*Estructura:\*\*\s*$([\s\S]*?)(?=^-\s+\*\*|^\#\#)/m;
  const m = augmented.match(re);
  if (!m) return "";
  return m[1]
    .split("\n")
    .map((l) => l.replace(/^\s{2,}/, ""))
    .join("\n")
    .trim();
}

function parseWords(
  text: string,
  fallback: { min: number; max: number },
): {
  min: number;
  max: number;
} {
  const m = text.match(/(\d[\d.,]*)\s*[–-]\s*(\d[\d.,]*)\s*palabras/i);
  if (!m) return fallback;
  const min = Number(m[1].replace(/[.,]/g, ""));
  const max = Number(m[2].replace(/[.,]/g, ""));
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  return { min, max };
}

function parsePillarCTAs(section: string): { primary?: CTA; secondary?: CTA } {
  const out: { primary?: CTA; secondary?: CTA } = {};
  const lines = section.split("\n").map((l) => l.trim());
  for (const l of lines) {
    const isPrim = /primari[oa]/i.test(l);
    const isSec = /secundari[oa]/i.test(l);
    if (!isPrim && !isSec) continue;
    const quoted = l.match(/"([^"]+)"/);
    const url = l.match(/`([^`]+)`/);
    if (!url) continue;
    const cta: CTA = { text: quoted ? quoted[1] : "Contáctanos", url: url[1] };
    if (isPrim) out.primary = cta;
    else if (isSec) out.secondary = cta;
  }
  return out;
}

function parseBackticksList(text: string): string[] {
  const out: string[] = [];
  const re = /`([^`]+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

function parseInternalLinksStandard(raw: string): string[] {
  if (!raw) return [];
  // Standard format: "P1 pillar, agentes-ia-casos-uso-empresa-b2b, chatbots-vs-agentes-ia-atencion-cliente"
  return raw
    .split(/,/)
    .map((s) => s.trim())
    .map((s) => s.replace(/^`/, "").replace(/`$/, ""))
    .filter(Boolean);
}

function parseRedirects(raw: string): string[] {
  if (!raw || /^ninguno/i.test(raw.trim())) return [];
  const out = parseBackticksList(raw);
  if (out.length) return out.filter((s) => s.startsWith("/"));
  // no backticks — try comma/space separated
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("/"));
}

function firstLine(s: string): string {
  return (
    s
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? ""
  );
}

function matchLine(body: string, re: RegExp): string | undefined {
  const m = body.match(re);
  return m ? m[1].trim() : undefined;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSchemaType(raw: string): string {
  // "FAQPage (para el H2 final)" → "FAQPage"
  // "HowTo (para \"Cómo empe…)" → "HowTo"
  const first = raw.trim().split(/[\s(]/, 1)[0];
  return first.replace(/[^A-Za-z]/g, "").trim();
}

function stripParenthetical(s: string): string {
  return s.replace(/\s*\(.*?\)\s*/g, "").trim();
}
