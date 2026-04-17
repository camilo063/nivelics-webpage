/**
 * Field-by-field EN gap auditor.
 * Outputs scripts/translation-audit-report.json and a terminal summary.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../lib/db/schema/admin";
import { isNull } from "drizzle-orm";
import * as fs from "fs/promises";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

type AnyRow = Record<string, unknown>;

const isEmpty = (v: unknown): boolean =>
  v === null ||
  v === undefined ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

function auditScalarEn(row: AnyRow): string[] {
  const missing: string[] = [];
  for (const key of Object.keys(row)) {
    if (!key.endsWith("En")) continue;
    if (key === "translationStatusEn") continue;
    const esKey = key.slice(0, -2) + "Es";
    const esVal = row[esKey];
    const enVal = row[key];
    if (!isEmpty(esVal) && isEmpty(enVal)) missing.push(key);
  }
  return missing;
}

function auditArrayEn(items: unknown, arrayName: string): string[] {
  if (!Array.isArray(items)) return [];
  const missing: string[] = [];
  items.forEach((item, idx) => {
    if (typeof item !== "object" || item === null) return;
    const obj = item as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      const endsEn = k.endsWith("_en") || (k.endsWith("En") && !k.endsWith("PngEn"));
      if (!endsEn) continue;
      const esKey = k.endsWith("_en") ? k.replace(/_en$/, "_es") : k.slice(0, -2) + "Es";
      if (!isEmpty(obj[esKey]) && isEmpty(obj[k])) {
        missing.push(`${arrayName}[${idx}].${k}`);
      }
    }
  });
  return missing;
}

type TableReport = {
  id: string;
  slug?: string;
  translationStatus?: string;
  missingScalar: string[];
  missingInArrays: string[];
  totalMissing: number;
};

async function main() {
  const report: Record<string, TableReport[] | TableReport> = {};

  // ── homeContent ─────────────────────────────────────────
  const home = await db.query.homeContent.findFirst();
  if (home) {
    const h = home as unknown as AnyRow;
    const scalar = auditScalarEn(h);
    const arrays = ["metrics", "trustBarLogos", "faqs", "industriasSectionMetrics", "processSteps"];
    const arrayMissing = arrays.flatMap((af) => auditArrayEn(h[af], af));
    report["homeContent"] = {
      id: String(h.id),
      translationStatus: h.translationStatusEn as string,
      missingScalar: scalar,
      missingInArrays: arrayMissing,
      totalMissing: scalar.length + arrayMissing.length,
    };
  }

  // ── servicios ───────────────────────────────────────────
  const servs = await db.query.servicios.findMany();
  const sRep: TableReport[] = [];
  for (const s of servs) {
    const r = s as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    const arrays = [
      "benefits",
      "processSteps",
      "metrics",
      "faqs",
      "hubMetrics",
      "frameworkPillars",
      "sectors",
    ];
    const arrayMissing = arrays.flatMap((af) => auditArrayEn(r[af], af));
    const total = scalar.length + arrayMissing.length;
    if (total > 0 || (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")) {
      sRep.push({
        id: String(r.id),
        slug: String(r.slugEs),
        translationStatus: r.translationStatusEn as string,
        missingScalar: scalar,
        missingInArrays: arrayMissing,
        totalMissing: total,
      });
    }
  }
  report["servicios"] = sRep;

  // ── industrias ──────────────────────────────────────────
  const inds = await db.query.industrias.findMany();
  const iRep: TableReport[] = [];
  for (const i of inds) {
    const r = i as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    const arrays = [
      "painPoints",
      "solutions",
      "differentiators",
      "metrics",
      "statHighlights",
      "regulations",
      "useCases",
      "playbook",
      "industryFaqs",
    ];
    const arrayMissing = arrays.flatMap((af) => auditArrayEn(r[af], af));
    const total = scalar.length + arrayMissing.length;
    if (total > 0 || (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")) {
      iRep.push({
        id: String(r.id),
        slug: String(r.slugEs),
        translationStatus: r.translationStatusEn as string,
        missingScalar: scalar,
        missingInArrays: arrayMissing,
        totalMissing: total,
      });
    }
  }
  report["industrias"] = iRep;

  // ── casosExito ──────────────────────────────────────────
  const casos = await db.query.casosExito.findMany();
  const cRep: TableReport[] = [];
  for (const c of casos) {
    const r = c as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (
      scalar.length > 0 ||
      (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")
    ) {
      cRep.push({
        id: String(r.id),
        slug: String(r.slug),
        translationStatus: r.translationStatusEn as string,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["casosExito"] = cRep;

  // ── blogPosts ───────────────────────────────────────────
  const posts = await db.query.blogPosts.findMany();
  const bRep: TableReport[] = [];
  for (const p of posts) {
    const r = p as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (
      scalar.length > 0 ||
      (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")
    ) {
      bRep.push({
        id: String(r.id),
        slug: String(r.slug),
        translationStatus: r.translationStatusEn as string,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["blogPosts"] = bRep;

  // ── teamMembers ─────────────────────────────────────────
  const team = await db.query.teamMembers.findMany();
  const tRep: TableReport[] = [];
  for (const m of team) {
    const r = m as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (scalar.length > 0) {
      tRep.push({
        id: String(r.id),
        slug: String(r.slug ?? r.name),
        translationStatus: undefined,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["teamMembers"] = tRep;

  // ── historiaItems ───────────────────────────────────────
  const hist = await db.query.historiaItems.findMany();
  const hRep: TableReport[] = [];
  for (const it of hist) {
    const r = it as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (scalar.length > 0) {
      hRep.push({
        id: String(r.id),
        slug: String(r.year) + "-" + String(r.titleEs).slice(0, 30),
        translationStatus: undefined,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["historiaItems"] = hRep;

  // ── certificaciones ─────────────────────────────────────
  const certs = await db.query.certificaciones.findMany();
  const ceRep: TableReport[] = [];
  for (const c of certs) {
    const r = c as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (scalar.length > 0) {
      ceRep.push({
        id: String(r.id),
        slug: String(r.nameEs ?? ""),
        translationStatus: undefined,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["certificaciones"] = ceRep;

  // ── pagesGeneral ────────────────────────────────────────
  const pages = await db.query.pagesGeneral.findMany();
  const pRep: TableReport[] = [];
  for (const p of pages) {
    const r = p as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (
      scalar.length > 0 ||
      (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")
    ) {
      pRep.push({
        id: String(r.id),
        slug: String(r.slugEs),
        translationStatus: r.translationStatusEn as string,
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      });
    }
  }
  report["pagesGeneral"] = pRep;

  // ── siteConfig ──────────────────────────────────────────
  const sc = await db.query.siteConfig.findFirst();
  if (sc) {
    const r = sc as unknown as AnyRow;
    const scalar = auditScalarEn(r);
    if (scalar.length > 0) {
      report["siteConfig"] = {
        id: String(r.id),
        missingScalar: scalar,
        missingInArrays: [],
        totalMissing: scalar.length,
      };
    }
  }

  // ── navConfig (jsonb) ───────────────────────────────────
  const nav = await db.query.navConfig.findFirst();
  if (nav) {
    const r = nav as unknown as AnyRow;
    const issues: string[] = [];
    // megaMenu and footer are jsonb — do recursive check for *_es that have empty *_en counterparts
    function walk(obj: unknown, path: string) {
      if (Array.isArray(obj)) {
        obj.forEach((it, idx) => walk(it, `${path}[${idx}]`));
        return;
      }
      if (obj && typeof obj === "object") {
        const o = obj as Record<string, unknown>;
        for (const k of Object.keys(o)) {
          if (k.endsWith("_en") || (k.endsWith("En") && k.length > 2)) {
            const esK = k.endsWith("_en") ? k.replace(/_en$/, "_es") : k.slice(0, -2) + "Es";
            if (!isEmpty(o[esK]) && isEmpty(o[k])) issues.push(`${path}.${k}`);
          }
          walk(o[k], `${path}.${k}`);
        }
      }
    }
    walk(r.megaMenu, "megaMenu");
    walk(r.footer, "footer");
    if (issues.length > 0) {
      report["navConfig"] = {
        id: String(r.id),
        missingScalar: [],
        missingInArrays: issues,
        totalMissing: issues.length,
      };
    }
  }

  // ── productos ───────────────────────────────────────────
  try {
    const prods = await db.query.productos.findMany();
    const prRep: TableReport[] = [];
    for (const p of prods) {
      const r = p as unknown as AnyRow;
      const scalar = auditScalarEn(r);
      const arrays = ["metrics", "features", "faqs", "comparisonTable"];
      const arrayMissing = arrays.flatMap((af) => auditArrayEn(r[af], af));
      // comparisonTable is object, not array
      if (r.comparisonTable && typeof r.comparisonTable === "object") {
        const ct = r.comparisonTable as Record<string, unknown>;
        if (Array.isArray(ct.headersEs) && Array.isArray(ct.headersEn)) {
          if ((ct.headersEs as unknown[]).length > 0 && (ct.headersEn as unknown[]).length === 0) {
            arrayMissing.push("comparisonTable.headersEn");
          }
        }
      }
      const total = scalar.length + arrayMissing.length;
      if (total > 0 || (r.translationStatusEn !== "complete" && r.translationStatusEn !== "auto")) {
        prRep.push({
          id: String(r.id),
          slug: String(r.slugEs),
          translationStatus: r.translationStatusEn as string,
          missingScalar: scalar,
          missingInArrays: arrayMissing,
          totalMissing: total,
        });
      }
    }
    report["productos"] = prRep;
  } catch (e) {
    // table may not exist yet
  }

  // ── Output ──────────────────────────────────────────────
  const json = JSON.stringify(report, null, 2);
  await fs.writeFile("./scripts/translation-audit-report.json", json);

  // Summary
  console.log("\n=== FIELD-LEVEL EN GAP AUDIT ===\n");
  const summary: Array<[string, number, number, number]> = [];
  let grandTotal = 0;
  for (const [table, data] of Object.entries(report)) {
    if (Array.isArray(data)) {
      const totalFields = data.reduce((acc, r) => acc + r.totalMissing, 0);
      summary.push([table, data.length, totalFields, 0]);
      grandTotal += totalFields;
    } else {
      summary.push([table, 1, data.totalMissing, 0]);
      grandTotal += data.totalMissing;
    }
  }
  console.log("Table              | Rows w/ gaps | Missing fields");
  console.log("-".repeat(55));
  for (const [t, rows, fields] of summary) {
    console.log(`${t.padEnd(18)} | ${String(rows).padStart(12)} | ${String(fields).padStart(14)}`);
  }
  console.log("-".repeat(55));
  console.log(`TOTAL MISSING EN FIELDS: ${grandTotal}`);
  console.log("\nReport written to scripts/translation-audit-report.json");

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
