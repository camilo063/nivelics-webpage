/**
 * Saneo de copy en DB (Fase 1.5 — dirección de arte).
 *
 * 1. FIX automático: subtítulos de servicios que terminan en artefacto de
 *    footnote ("…resultados reales.2" → "…resultados reales.").
 * 2. REPORTE (no modifica): casos de éxito cuyas métricas {value,label}
 *    producen frases duplicadas al concatenarse ("Alto tráfico" + "Portal de
 *    alto tráfico modernizado") y títulos con prefijo "Cliente: …".
 *    El renderer ya los muestra saneados (lib/utils/case-copy.ts); este
 *    reporte es para curarlos definitivamente en el admin CMS.
 *
 * Run: node --env-file=.env.local --import tsx scripts/fix-casos-copy.ts
 */
import { db } from "@/lib/db";
import { servicios, casosExito } from "@/lib/db/schema/admin";
import { eq } from "drizzle-orm";

const FOOTNOTE_RE = /\.(\d)\s*$/;

async function main() {
  if (!db) {
    console.error("Sin conexión a DB (DATABASE_URL). Aborta.");
    process.exit(1);
  }

  // ── 1. Fix footnote artifacts en subtítulos de servicios ──
  const servs = await db
    .select({ id: servicios.id, slugEs: servicios.slugEs, subtitleEs: servicios.subtitleEs })
    .from(servicios);

  let fixed = 0;
  for (const s of servs) {
    if (s.subtitleEs && FOOTNOTE_RE.test(s.subtitleEs)) {
      const cleaned = s.subtitleEs.replace(FOOTNOTE_RE, ".");
      await db.update(servicios).set({ subtitleEs: cleaned }).where(eq(servicios.id, s.id));
      console.log(`✓ fix [${s.slugEs}]: "…${s.subtitleEs.slice(-25)}" → "…${cleaned.slice(-25)}"`);
      fixed++;
    }
  }
  console.log(fixed ? `\n${fixed} subtítulo(s) corregidos.` : "Sin artefactos de footnote.");

  // ── 2. Reporte de métricas/títulos a curar en el admin ──
  const casos = await db
    .select({
      slug: casosExito.slug,
      clientName: casosExito.clientName,
      titleEs: casosExito.titleEs,
      m1v: casosExito.metric1Value,
      m1l: casosExito.metric1LabelEs,
      m2v: casosExito.metric2Value,
      m2l: casosExito.metric2LabelEs,
      m3v: casosExito.metric3Value,
      m3l: casosExito.metric3LabelEs,
    })
    .from(casosExito);

  console.log("\n── Reporte para curaduría en admin (/admin/casos) ──");
  for (const c of casos) {
    const issues: string[] = [];
    if (c.clientName && c.titleEs?.toLowerCase().startsWith(c.clientName.toLowerCase())) {
      issues.push(`título repite cliente: "${c.titleEs}"`);
    }
    const metrics: Array<[string | null, string | null]> = [
      [c.m1v, c.m1l],
      [c.m2v, c.m2l],
      [c.m3v, c.m3l],
    ];
    for (const [value, label] of metrics) {
      const v = value?.trim() ?? "";
      const l = label?.trim() ?? "";
      if (v && l && l.toLowerCase().includes(v.toLowerCase())) {
        issues.push(`métrica duplicada: value="${v}" ya está en label="${l}"`);
      } else if (v && !/\d/.test(v)) {
        issues.push(`métrica sin cifra: value="${v}" (¿debería ser un número?)`);
      }
    }
    if (issues.length) {
      console.log(`\n[${c.slug}]`);
      for (const i of issues) console.log(`  · ${i}`);
    }
  }
  console.log("\nListo. El renderer ya sanea la visualización; esto es curaduría de fondo.");
  process.exit(0);
}

main();
