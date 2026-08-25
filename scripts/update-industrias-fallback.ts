/**
 * Agrega las 2 industrias nuevas a los snapshots de fallback del repo:
 *   - data/fallbacks/industrias.json   (filas con el shape de la tabla `industrias`)
 *   - data/fallbacks/nav_config.json   (links en la sección industrias del mega-menú)
 *
 * Idempotente (salta lo que ya existe). No toca la base de datos.
 * Tras sembrar producción se puede regenerar todo con scripts/export-fallbacks.ts.
 *
 * Uso: node --import tsx scripts/update-industrias-fallback.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INDUSTRIAS_NUEVAS, NAV_ITEMS_NUEVAS } from "./data/industrias-nuevas.data";

const ROOT = process.cwd();
const STAMP = "2026-08-25T00:00:00.000Z";

// UUIDs fijos para el snapshot (la DB genera los suyos al sembrar; el
// export-fallbacks posterior los sincroniza).
const FALLBACK_IDS: Record<string, string> = {
  "medicion-de-audiencias": "7a1f5c3e-9b2d-4e8f-a6c1-d0e4b7f29a53",
  "investigacion-de-mercados": "3c8e2b71-5d4a-4f9c-b8e2-a1f6d9c04e87",
};

// ─── industrias.json ────────────────────────────────────────────────────
const industriasPath = join(ROOT, "data/fallbacks/industrias.json");
const industrias = JSON.parse(readFileSync(industriasPath, "utf8")) as Array<
  Record<string, unknown>
>;

for (const ind of INDUSTRIAS_NUEVAS) {
  if (industrias.some((r) => r.slugEs === ind.slugEs)) {
    console.log(`[SKIP] fallback industrias: ${ind.slugEs} ya existe`);
    continue;
  }
  industrias.push({
    id: FALLBACK_IDS[ind.slugEs],
    slugEs: ind.slugEs,
    slugEn: ind.slugEn,
    icon: ind.icon,
    accentColor: ind.accentColor,
    nameEs: ind.nameEs,
    nameEn: ind.nameEn,
    heroTitleEs: ind.heroTitleEs,
    heroTitleEn: ind.heroTitleEn,
    heroSubtitleEs: ind.heroSubtitleEs,
    heroSubtitleEn: ind.heroSubtitleEn,
    painPoints: ind.painPoints,
    solutions: ind.solutions,
    casoDestacadoId: null,
    differentiators: null,
    metrics: ind.metrics,
    statHighlights: ind.statHighlights,
    regulations: ind.regulations,
    useCases: ind.useCases,
    playbook: ind.playbook,
    industryFaqs: ind.industryFaqs,
    techStack: ind.techStack,
    servicesHighlight: ind.servicesHighlight,
    relatedCaseSlugs: null,
    ctaTitleEs: ind.ctaTitleEs,
    ctaTitleEn: ind.ctaTitleEn,
    ctaPrimaryTextEs: ind.ctaPrimaryTextEs,
    ctaPrimaryTextEn: ind.ctaPrimaryTextEn,
    ctaPrimaryUrl: ind.ctaPrimaryUrl,
    hubIntroTitleEs: ind.hubIntroTitleEs,
    hubIntroTitleEn: ind.hubIntroTitleEn,
    hubIntroSubtitleEs: ind.hubIntroSubtitleEs,
    hubIntroSubtitleEn: ind.hubIntroSubtitleEn,
    ctaTextEs: ind.ctaTextEs,
    ctaTextEn: ind.ctaTextEn,
    seoTitleEs: ind.seoTitleEs,
    seoTitleEn: ind.seoTitleEn,
    seoDescriptionEs: ind.seoDescriptionEs,
    seoDescriptionEn: ind.seoDescriptionEn,
    status: "published",
    translationStatusEn: "complete",
    createdAt: STAMP,
    updatedAt: STAMP,
    deletedAt: null,
  });
  console.log(`[OK] fallback industrias: ${ind.slugEs} agregada`);
}
writeFileSync(industriasPath, JSON.stringify(industrias, null, 2) + "\n");

// ─── nav_config.json ────────────────────────────────────────────────────
const navPath = join(ROOT, "data/fallbacks/nav_config.json");
const navRows = JSON.parse(readFileSync(navPath, "utf8")) as Array<{
  megaMenu?: Array<{ items?: Array<{ url?: string }> }>;
}>;
const nav = navRows[0];
const section = nav?.megaMenu?.find(
  (s) => Array.isArray(s.items) && s.items.some((i) => i.url?.startsWith("/industrias/")),
);
if (!section?.items) {
  console.warn("[WARN] sección industrias no encontrada en nav_config.json");
} else {
  for (const item of NAV_ITEMS_NUEVAS) {
    if (section.items.some((i) => i.url === item.url)) {
      console.log(`[SKIP] fallback nav: ${item.url} ya existe`);
      continue;
    }
    section.items.push({ ...item });
    console.log(`[OK] fallback nav: ${item.url} agregado`);
  }
  writeFileSync(navPath, JSON.stringify(navRows, null, 2) + "\n");
}

console.log("\n✅ Fallbacks actualizados.");
