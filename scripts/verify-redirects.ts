/**
 * Verifier for the proposed legacy redirects.
 *
 * Inputs:
 *  - docs/seo/legacy-urls-gsc-2026-04-12.csv (all URLs Google knows)
 *  - docs/seo/redirects-proposed.ts (what we'll ship)
 *
 * Emits /tmp/redirects-verification.json with:
 *  - coverage %
 *  - list of uncovered legacy paths
 *  - list of orphan rules (match nothing)
 *  - detected redirect chains (A→B where B is also legacy and redirects elsewhere)
 *  - paths where the rule redirects to itself (bug)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathToRegexp, compile } = require("../node_modules/next/dist/compiled/path-to-regexp");
import { LEGACY_REDIRECTS } from "../docs/seo/redirects-proposed";

const ROOT = process.cwd();
const OUT = "/tmp/redirects-verification.json";

// ─── Load legacy paths ───────────────────────────────────────────────────────
const csv = readFileSync(join(ROOT, "docs/seo/legacy-urls-gsc-2026-04-12.csv"), "utf-8")
  .trim()
  .split("\n")
  .slice(1);

const legacyPaths: string[] = csv.map((line) => {
  const url = line.split(",")[0];
  let p = url.replace(/^https?:\/\/[^/]+/, "");
  if (p === "") p = "/";
  return p;
});

// Exclude external subdomain URLs (ai.nivelics.com) — they are outside www's scope
const externalSubdomain = csv
  .filter((line) => line.split(",")[0].startsWith("https://ai.nivelics.com"))
  .map((line) => line.split(",")[0]);

const legacyPathsInScope = legacyPaths.filter((_, idx) => {
  const url = csv[idx].split(",")[0];
  return !url.startsWith("https://ai.nivelics.com");
});

// ─── Real routes in the new site (do NOT need a redirect) ────────────────────
const REAL_ROUTES = new Set([
  "/",
  "/en",
  "/servicios",
  "/en/services",
  "/servicios/staff-augmentation",
  "/en/services/staff-augmentation",
  "/contacto",
  "/en/contact",
  "/casos-de-exito",
  "/casos-de-exito/televisa",
  "/casos-de-exito/grupo-bolivar",
  "/casos-de-exito/two-maids",
  "/casos-de-exito/cronica",
  "/en/success-stories",
  "/en/success-stories/televisa",
  "/en/success-stories/grupo-bolivar",
]);

// ─── Compile rules ───────────────────────────────────────────────────────────
type CompiledRule = {
  rule: (typeof LEGACY_REDIRECTS)[number];
  regex: RegExp;
  destTemplate: (data: Record<string, string>) => string;
  matchCount: number;
};

const compiled: CompiledRule[] = LEGACY_REDIRECTS.map((rule) => {
  const keys: Array<{ name: string }> = [];
  const regex = pathToRegexp(rule.source, keys);
  let destFn: (data: Record<string, string>) => string;
  try {
    destFn = compile(rule.destination, { encode: encodeURIComponent });
  } catch {
    destFn = () => rule.destination;
  }
  return { rule, regex, destTemplate: destFn, matchCount: 0 };
});

// ─── For each legacy path, find which rule matches (first-wins) ──────────────
type PathResult = {
  path: string;
  covered: boolean;
  destination?: string;
  ruleIndex?: number;
  ruleSource?: string;
  confidence?: string;
  isRealRoute?: boolean;
};

const results: PathResult[] = [];

for (const path of legacyPathsInScope) {
  // Skip obvious real routes (served directly)
  if (REAL_ROUTES.has(path)) {
    results.push({ path, covered: true, destination: path, isRealRoute: true });
    continue;
  }

  let matched: CompiledRule | undefined;
  let matchArr: RegExpExecArray | null = null;
  for (const c of compiled) {
    const m = c.regex.exec(path);
    if (m) {
      matched = c;
      matchArr = m;
      break;
    }
  }

  if (matched && matchArr) {
    matched.matchCount++;
    // Build params from capture groups
    const params: Record<string, string> = {};
    const keyNames: string[] = [];
    const keysOut: Array<{ name: string }> = [];
    pathToRegexp(matched.rule.source, keysOut);
    for (let i = 0; i < keysOut.length; i++) {
      keyNames.push(keysOut[i].name);
    }
    for (let i = 0; i < keyNames.length; i++) {
      params[keyNames[i]] = matchArr[i + 1] ?? "";
    }
    let dest: string;
    try {
      dest = matched.destTemplate(params);
    } catch {
      dest = matched.rule.destination;
    }
    results.push({
      path,
      covered: true,
      destination: dest,
      ruleIndex: compiled.indexOf(matched),
      ruleSource: matched.rule.source,
      confidence: matched.rule.confidence,
    });
  } else {
    results.push({ path, covered: false });
  }
}

const uncovered = results.filter((r) => !r.covered);
const coveredByRule = results.filter((r) => r.covered && !r.isRealRoute);
const servedAsReal = results.filter((r) => r.isRealRoute);

// ─── Orphan rules (matched zero legacy URLs) ─────────────────────────────────
const orphans = compiled
  .filter((c) => c.matchCount === 0)
  .map((c) => ({ source: c.rule.source, destination: c.rule.destination, note: c.rule.note }));

// ─── Chain detection: destination of rule A is itself covered by ANOTHER rule
// (not merely indexed in GSC — destination must actually redirect again, not be a
// real route that serves directly).
const ruleMatchedPaths = new Map<string, string>();
for (const r of coveredByRule) {
  if (r.destination) ruleMatchedPaths.set(r.path, r.destination);
}
const chains: Array<{ from: string; to: string; thenTo: string }> = [];
for (const r of coveredByRule) {
  if (!r.destination) continue;
  const dest = r.destination.replace(/\/$/, "") || "/";
  if (r.destination === r.path) {
    chains.push({ from: r.path, to: r.destination, thenTo: "SELF-LOOP" });
    continue;
  }
  const nextHop = ruleMatchedPaths.get(r.destination) ?? ruleMatchedPaths.get(dest);
  if (nextHop) {
    chains.push({ from: r.path, to: r.destination, thenTo: nextHop });
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalLegacyInScope: legacyPathsInScope.length,
    externalSubdomainOutOfScope: externalSubdomain.length,
    covered: coveredByRule.length + servedAsReal.length,
    coveredByRule: coveredByRule.length,
    servedAsRealRoute: servedAsReal.length,
    uncovered: uncovered.length,
    coveragePct: Number(
      (((coveredByRule.length + servedAsReal.length) / legacyPathsInScope.length) * 100).toFixed(2),
    ),
    totalRules: LEGACY_REDIRECTS.length,
    orphanRules: orphans.length,
    chains: chains.length,
  },
  confidenceBreakdown: {
    high: coveredByRule.filter((r) => r.confidence === "high").length,
    medium: coveredByRule.filter((r) => r.confidence === "medium").length,
    low: coveredByRule.filter((r) => r.confidence === "low").length,
  },
  uncoveredPaths: uncovered.map((r) => r.path),
  orphanRules: orphans,
  chains,
  externalSubdomainUrls: externalSubdomain,
  servedAsRealRoute: servedAsReal.map((r) => r.path),
};

writeFileSync(OUT, JSON.stringify(report, null, 2));

console.log(`\n📊 Verification report written to ${OUT}\n`);
console.log(`Legacy URLs in scope:        ${report.summary.totalLegacyInScope}`);
console.log(`External subdomain (out):    ${report.summary.externalSubdomainOutOfScope}`);
console.log(`Covered (rule):              ${report.summary.coveredByRule}`);
console.log(`Covered (real route):        ${report.summary.servedAsRealRoute}`);
console.log(`Uncovered:                   ${report.summary.uncovered}`);
console.log(`Coverage:                    ${report.summary.coveragePct}%`);
console.log(`Total rules:                 ${report.summary.totalRules}`);
console.log(`Orphan rules:                ${report.summary.orphanRules}`);
console.log(`Chains detected:             ${report.summary.chains}`);

if (uncovered.length > 0) {
  console.log(`\n⚠️  Uncovered legacy paths (${uncovered.length}):`);
  for (const r of uncovered.slice(0, 50)) console.log(`  ${r.path}`);
  if (uncovered.length > 50) console.log(`  ... +${uncovered.length - 50} more`);
}

if (orphans.length > 0) {
  console.log(`\n⚠️  Orphan rules (${orphans.length}):`);
  for (const o of orphans) console.log(`  ${o.source} → ${o.destination}`);
}

if (chains.length > 0) {
  console.log(`\n⚠️  Chains (${chains.length}):`);
  for (const c of chains) console.log(`  ${c.from} → ${c.to} → ${c.thenTo ?? "OK"}`);
}

process.exit(uncovered.length > 0 ? 1 : 0);
