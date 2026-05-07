/**
 * Audit script — scans every page.tsx under app/[locale]/(marketing)/ and
 * classifies it as 🟢 CONNECTED / 🟡 PARTIAL / 🔴 HARDCODED based on whether
 * it consumes the CMS fields it has available.
 *
 * Output: scripts/output/hardcoded-audit-report.md
 *
 * Run:  npx tsx scripts/audit-hardcoded-content.ts
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MARKETING_DIR = path.join(ROOT, "app", "[locale]", "(marketing)");
const OUT_FILE = path.join(ROOT, "scripts", "output", "hardcoded-audit-report.md");

const CMS_QUERIES = [
  "getServicio",
  "getServicioData",
  "getAllServicios",
  "getSubserviciosData",
  "getServiciosByParent",
  "getHubServicios",
  "getHubServiciosData",
  "getIndustria",
  "getAllIndustrias",
  "getCasoExito",
  "getAllCasosExito",
  "getBlogPost",
  "getAllBlogPosts",
  "getAllBlogPostsLight",
  "getFeaturedBlogPost",
  "getActiveBlogCategories",
  "getBlogPostsByCategory",
  "getBlogCategoryBySlug",
  "getPopularBlogPosts",
  "getBlogCategoriesPublic",
  "getHomeContent",
  "getTeamMembers",
  "getHistoriaItems",
  "getCertificacionesPublic",
  "getNavConfigPublic",
  "getSiteConfigPublic",
  "getPageGeneral",
  "getAllProductos",
  "getAllProductosHub",
  "getProductoBySlug",
  "getAllUiLabels",
];

type Status = "🟢" | "🟡" | "🔴";

interface FileReport {
  file: string;
  status: Status;
  cmsImports: string[];
  cmsFieldsUsed: string[];
  cmsFieldsMissing: string[];
  hardcodedArrays: string[];
  notes: string[];
}

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (e.isFile() && e.name === "page.tsx") out.push(full);
  }
  return out;
}

function detectCmsImports(content: string): string[] {
  const found = new Set<string>();
  for (const q of CMS_QUERIES) {
    const re = new RegExp(`\\b${q}\\b`);
    if (re.test(content)) found.add(q);
  }
  return [...found];
}

function detectHardcodedArrays(content: string): string[] {
  // Match `const NAME = [` followed by an object with title:/description:/icon:
  const out: string[] = [];
  const re =
    /const\s+([A-Z][A-Z0-9_]+|[a-z][a-zA-Z0-9_]*)\s*=\s*\[\s*\{\s*[^}]*?\b(title|titleEs|description|descripcion|question|step|criterion|icon|label|badge|name)\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

const SERVICIO_FIELDS_RENDERED = [
  "title",
  "subtitle",
  "description",
  "benefits",
  "processSteps",
  "metrics",
  "faqs",
  "ctaPrimaryText",
  "ctaPrimaryUrl",
  "ctaSecondaryText",
  "ctaSecondaryUrl",
];
const INDUSTRIA_FIELDS_RENDERED = [
  "name",
  "heroTitle",
  "heroSubtitle",
  "painPoints",
  "solutions",
  "differentiators",
  "metrics",
  "useCases",
  "playbook",
  "industryFaqs",
  "ctaTitle",
  "ctaText",
];
const HOME_FIELDS_RENDERED = [
  "heroTitle",
  "heroSubtitle",
  "heroBadge",
  "metrics",
  "trustBarTitle",
  "servicesSectionTitle",
  "casesSectionTitle",
  "mapTitle",
  "whyUsTitle",
  "whyUsItems",
  "faqs",
  "finalCtaTitle",
  "industriasSectionTitle",
  "processSteps",
];

function detectFieldUsage(
  content: string,
  fields: string[],
  binders: string[],
): { used: string[]; missing: string[] } {
  const used: string[] = [];
  const missing: string[] = [];
  for (const f of fields) {
    let found = false;
    for (const b of binders) {
      // matches `binder.field` or `binder?.field` (deep too: `binder?.field?.length`)
      const re = new RegExp(`\\b${b}\\??\\.${f}\\b`);
      if (re.test(content)) {
        found = true;
        break;
      }
    }
    (found ? used : missing).push(f);
  }
  return { used, missing };
}

function findBinders(content: string): string[] {
  const binders = new Set<string>();
  // Match patterns like: const cms = await getServicioData(...)
  const re =
    /const\s+(\w+)\s*=\s*(?:await\s+)?(?:[\w.]*?)(get(?:Servicio|Industria|HomeContent|CasoExito|BlogPost|Producto|TeamMembers|Page|HistoriaItems|Certificaciones|Subservicios|HubServicios)\w*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    binders.add(m[1]);
  }
  // Also look for: const ind = raw ? mapIndustria(...) : null
  const mapRe =
    /const\s+(\w+)\s*=\s*\w+\s*\?\s*map(?:Servicio|Industria|HomeContent|CasoExito|BlogPost|Producto|TeamMember|HistoriaItem|PageGeneral)\s*\(/g;
  while ((m = mapRe.exec(content)) !== null) {
    binders.add(m[1]);
  }
  // Also: home, ind, cms, data, raw, etc — common names
  for (const name of ["home", "cms", "ind", "raw", "data", "post", "caso", "producto", "page"]) {
    if (new RegExp(`\\b${name}\\??\\.[a-zA-Z]`).test(content)) {
      binders.add(name);
    }
  }
  return [...binders];
}

function categoryOf(rel: string): string {
  if (rel.includes("/servicios/") && rel.split("/").length >= 5) return "subservicios";
  if (rel.endsWith("/servicios/page.tsx")) return "hubs";
  if (
    rel.endsWith("/inteligencia-artificial/page.tsx") ||
    rel.endsWith("/cloud/page.tsx") ||
    rel.endsWith("/staff-augmentation/page.tsx") ||
    rel.endsWith("/desarrollo-digital/page.tsx")
  )
    return "hubs";
  if (rel.includes("/industrias/")) return "industrias";
  if (rel.includes("/casos-de-exito/")) return "casos";
  if (rel.includes("/nosotros/")) return "nosotros";
  if (rel.includes("/blog/")) return "blog";
  if (rel.includes("/productos")) return "productos";
  if (rel === "app/[locale]/(marketing)/page.tsx") return "home";
  return "general";
}

async function analyze(file: string): Promise<FileReport> {
  const content = await fs.readFile(file, "utf-8");
  const rel = path.relative(ROOT, file);
  const cms = detectCmsImports(content);
  const arrays = detectHardcodedArrays(content);
  const binders = findBinders(content);

  let fieldsCheck: { used: string[]; missing: string[] } = { used: [], missing: [] };
  let expectedFields: string[] = [];

  if (categoryOf(rel) === "subservicios" || categoryOf(rel) === "hubs") {
    expectedFields = SERVICIO_FIELDS_RENDERED;
    fieldsCheck = detectFieldUsage(content, expectedFields, binders);
  } else if (categoryOf(rel) === "industrias") {
    expectedFields = INDUSTRIA_FIELDS_RENDERED;
    fieldsCheck = detectFieldUsage(content, expectedFields, binders);
  } else if (categoryOf(rel) === "home") {
    expectedFields = HOME_FIELDS_RENDERED;
    fieldsCheck = detectFieldUsage(content, expectedFields, binders);
  }

  const notes: string[] = [];
  let status: Status;

  if (cms.length === 0) {
    status = "🔴";
    notes.push("No CMS query imports detected");
  } else if (fieldsCheck.missing.length > expectedFields.length / 2 && expectedFields.length > 0) {
    status = "🟡";
    notes.push(`Missing ${fieldsCheck.missing.length}/${expectedFields.length} expected fields`);
  } else if (arrays.length > 2 && expectedFields.length > 0) {
    status = "🟡";
    notes.push(`${arrays.length} hardcoded array(s) detected`);
  } else {
    status = "🟢";
  }

  return {
    file: rel,
    status,
    cmsImports: cms,
    cmsFieldsUsed: fieldsCheck.used,
    cmsFieldsMissing: fieldsCheck.missing,
    hardcodedArrays: arrays,
    notes,
  };
}

async function main() {
  const files = (await walk(MARKETING_DIR)).sort();
  const reports = await Promise.all(files.map(analyze));

  const byStatus = { "🟢": 0, "🟡": 0, "🔴": 0 } as Record<Status, number>;
  reports.forEach((r) => {
    byStatus[r.status]++;
  });

  const byCategory: Record<string, FileReport[]> = {};
  for (const r of reports) {
    const cat = categoryOf(r.file);
    (byCategory[cat] ||= []).push(r);
  }

  let md = `# Auditoría de contenido hardcodeado vs CMS\n\n`;
  md += `**Fecha:** ${new Date().toISOString().slice(0, 10)}\n`;
  md += `**Total páginas:** ${reports.length}\n`;
  md += `- 🟢 Conectadas: ${byStatus["🟢"]}\n`;
  md += `- 🟡 Parciales: ${byStatus["🟡"]}\n`;
  md += `- 🔴 Hardcodeadas: ${byStatus["🔴"]}\n\n`;
  md += `---\n\n`;

  for (const cat of [
    "home",
    "hubs",
    "subservicios",
    "industrias",
    "casos",
    "nosotros",
    "general",
    "productos",
    "blog",
  ]) {
    const list = byCategory[cat];
    if (!list?.length) continue;
    md += `## ${cat.toUpperCase()} (${list.length})\n\n`;
    md += `| Estado | Archivo | Imports CMS | Campos faltantes | Arrays hardcoded |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const r of list) {
      const file = r.file.replace("app/[locale]/(marketing)/", ".../");
      const cms = r.cmsImports.length ? r.cmsImports.join(", ") : "_none_";
      const missing = r.cmsFieldsMissing.length ? r.cmsFieldsMissing.join(", ") : "—";
      const arrs = r.hardcodedArrays.length ? r.hardcodedArrays.slice(0, 6).join(", ") : "—";
      md += `| ${r.status} | \`${file}\` | ${cms} | ${missing} | ${arrs} |\n`;
    }
    md += `\n`;
  }

  md += `---\n\n## Detalle por archivo\n\n`;
  for (const r of reports) {
    md += `### ${r.status} \`${r.file}\`\n\n`;
    md += `- **CMS imports**: ${r.cmsImports.join(", ") || "_none_"}\n`;
    if (r.cmsFieldsUsed.length) md += `- **Campos usados**: ${r.cmsFieldsUsed.join(", ")}\n`;
    if (r.cmsFieldsMissing.length)
      md += `- **Campos faltantes**: ${r.cmsFieldsMissing.join(", ")}\n`;
    if (r.hardcodedArrays.length) md += `- **Arrays hardcoded**: ${r.hardcodedArrays.join(", ")}\n`;
    if (r.notes.length) md += `- **Notas**: ${r.notes.join("; ")}\n`;
    md += `\n`;
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, md, "utf-8");

  console.log(`\n=== AUDIT SUMMARY ===`);
  console.log(`Total: ${reports.length}`);
  console.log(`🟢 Connected: ${byStatus["🟢"]}`);
  console.log(`🟡 Partial:   ${byStatus["🟡"]}`);
  console.log(`🔴 Hardcoded: ${byStatus["🔴"]}`);
  console.log(`\nReport written to ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
