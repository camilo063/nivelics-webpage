/**
 * Builds lib/seo/legacy-redirects.ts from docs/seo/redirects-proposed.ts,
 * stripping audit metadata and deduplicating against sources already present
 * in next.config.ts. The proposed rules use Next.js path-to-regexp syntax
 * (e.g. "/blog/:slug(a|b|c)") and were validated by scripts/verify-redirects.ts
 * (100% coverage of the GSC legacy URL list, 0 chains).
 *
 * Run: node --import tsx scripts/build-legacy-redirects.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LEGACY_REDIRECTS } from "../docs/seo/redirects-proposed";

const ROOT = process.cwd();

// Plain sources already handled in next.config.ts (kept there, not duplicated)
const nextConfig = readFileSync(join(ROOT, "next.config.ts"), "utf-8");
const existing = new Set([...nextConfig.matchAll(/source: "([^"]+)"/g)].map((m) => m[1]));

// Next.js matches redirect sources against the percent-encoded request path,
// so spaces and non-ASCII literals (e.g. "ñ", or the legacy slug with a
// leading space " what-is-rpa-and-Its-benefits") must be percent-encoded or
// the rule never fires. Do NOT trim alternation entries — leading/trailing
// whitespace is part of the legacy URL.
function encodeSourceLiterals(source: string): string {
  return source.replace(/[^\x21-\x7e]/g, (ch) => encodeURIComponent(ch));
}

// Next.js rejects redirect sources longer than 4096 chars — split giant
// ":slug(a|b|c|…)" alternations into chunks that stay well under the limit.
const MAX_SOURCE = 3800;

function splitAlternation(source: string): string[] {
  if (source.length <= MAX_SOURCE) return [source];
  const m = source.match(/^(.*:slug)\((.+)\)$/);
  if (!m) throw new Error(`Source too long and not splittable: ${source.slice(0, 80)}…`);
  const [, prefix, alternation] = m;
  const alts = alternation.split("|");
  const chunks: string[] = [];
  let current: string[] = [];
  for (const alt of alts) {
    const candidate = `${prefix}(${[...current, alt].join("|")})`;
    if (current.length > 0 && candidate.length > MAX_SOURCE) {
      chunks.push(`${prefix}(${current.join("|")})`);
      current = [alt];
    } else {
      current.push(alt);
    }
  }
  if (current.length) chunks.push(`${prefix}(${current.join("|")})`);
  return chunks;
}

// Blog slugs from the GSC audit that have since been RE-MIGRATED as published
// rows in blog_posts (they appear in the DB-driven sitemap). A live post must
// win over its legacy hub redirect, so they are pruned from the ":slug(a|b|…)"
// alternations. Verified against sitemap/es.xml + sitemap/en.xml on 2026-08-19
// (SEO metadata audit): these 22 sitemap URLs returned 308 → blog hub.
const REMIGRATED_BLOG_SLUGS: Record<"es" | "en", Set<string>> = {
  es: new Set([
    "actualizar-wordpress-core-plugins-seguridad",
    "automatizacion-de-infraestructura-optimizando-tu-entorno-tecnologico",
    "automatizacion-devops-herramientas",
    "automatizacion-eficiencia-operativa",
    "chatbots-vs-agentes-ia-atencion-cliente",
    "ciberseguridad-para-ecommerce",
    "como-las-fintech-esta-cambiando-la-industria-financiera",
    "cuales-son-los-ciberataques-mas-frecuentes-en-los-sitios-web",
    "fintech-vs-bancos-tradicionales-cual-es-la-mejor-opcion",
    "gcp-vs-aws",
    "guia-completa-migrar-nube",
    "ia-automatizacion-procesos-de-negocio",
    "pruebas-de-seguridad-en-los-sitios-web-descubre-los-beneficios",
    "pruebas-unitarias-con-inteligencia-artificial",
    "que-es-devops",
    "que-es-la-automatizacion-de-pruebas-de-software",
    "que-es-rpa-y-sus-beneficios",
    "que-es-staff-augmentation-y-como-puede-ayudarte-en-tu-compania",
    "reentrenamiento-it-nuevas-tecnologias",
    "testing-automatizado-vs-manual",
    "wcag-que-es-y-como-sumar-mas-usuarios-en-tu-web",
  ]),
  en: new Set(["gcp-vs-aws"]),
};

function pruneRemigratedSlugs(source: string): string | null {
  const m = source.match(/^(\/en)?\/blog\/:slug\((.+)\)$/);
  if (!m) return source;
  const migrated = REMIGRATED_BLOG_SLUGS[m[1] ? "en" : "es"];
  const alts = m[2].split("|").filter((a) => !migrated.has(a.trim()));
  if (alts.length === 0) return null;
  return `${m[1] ?? ""}/blog/:slug(${alts.join("|")})`;
}

const out = new Map<string, string>();
for (const r of LEGACY_REDIRECTS) {
  if (r.source === r.destination) continue;
  const prunedSource = pruneRemigratedSlugs(r.source);
  if (prunedSource === null) continue;
  for (const chunk of splitAlternation(prunedSource)) {
    const source = encodeSourceLiterals(chunk);
    if (existing.has(source) || out.has(source)) continue;
    out.set(source, r.destination);
  }
}

const rules = [...out.entries()].map(([source, destination]) => ({ source, destination }));

const header = `/**
 * Legacy → new-site redirects (301/308). GENERATED FILE — edit
 * scripts/build-legacy-redirects.ts and re-run it instead of editing by hand.
 *
 * Source of truth: docs/seo/redirects-proposed.ts, verified 2026-08-19 with
 * scripts/verify-redirects.ts (100% coverage of GSC legacy URLs, 0 chains).
 * ${rules.length} rules. Consumed by next.config.ts redirects().
 */

export const LEGACY_REDIRECTS: { source: string; destination: string; permanent: true }[] = [
`;

const body = rules
  .map(
    (r) =>
      `  { source: ${JSON.stringify(r.source)}, destination: ${JSON.stringify(r.destination)}, permanent: true },`,
  )
  .join("\n");

writeFileSync(join(ROOT, "lib/seo/legacy-redirects.ts"), `${header}${body}\n];\n`);

console.log(`Wrote ${rules.length} rules to lib/seo/legacy-redirects.ts`);
console.log(`Deduped against ${existing.size} existing next.config sources`);
