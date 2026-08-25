/**
 * Seed de las 2 industrias nuevas (contenido completo ES + EN):
 *
 *   - medicion-de-audiencias / audience-measurement
 *   - investigacion-de-mercados / market-research
 *
 * Inserta las filas en `industrias` (status: published, translation complete)
 * y agrega los 2 links a la sección "industrias" del mega-menú (`nav_config`).
 *
 * ⚠️  CORRER SOLO CUANDO EL CÓDIGO DE LAS RUTAS ESTÉ DESPLEGADO.
 *     El hub /industrias y el home listan las industrias desde la DB sin filtro,
 *     así que sembrar antes del deploy produce links rotos en producción.
 *
 * Idempotente: salta industrias cuyo slug ya existe y links de nav ya presentes.
 *
 * Uso: node --env-file=.env.local --import tsx scripts/seed-industrias-nuevas.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";
import { INDUSTRIAS_NUEVAS, NAV_ITEMS_NUEVAS } from "./data/industrias-nuevas.data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  const db = drizzle(neon(url), { schema });

  // ─── 1. Industrias ────────────────────────────────────────────────────
  for (const ind of INDUSTRIAS_NUEVAS) {
    const existing = await db
      .select({ id: schema.industrias.id })
      .from(schema.industrias)
      .where(eq(schema.industrias.slugEs, ind.slugEs))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[SKIP] ${ind.slugEs} — ya existe`);
      continue;
    }

    await db.insert(schema.industrias).values({
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
      metrics: ind.metrics,
      statHighlights: ind.statHighlights,
      regulations: ind.regulations,
      useCases: ind.useCases,
      playbook: ind.playbook,
      industryFaqs: ind.industryFaqs,
      techStack: ind.techStack,
      servicesHighlight: ind.servicesHighlight,
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
    });
    console.log(`[OK] ${ind.slugEs} — insertada (published, EN complete)`);
  }

  // ─── 2. Mega-menú (nav_config.mega_menu → sección industrias) ─────────
  const [nav] = await db
    .select()
    .from(schema.navConfig)
    .where(eq(schema.navConfig.id, "main"))
    .limit(1);

  if (!nav?.megaMenu) {
    console.warn(
      "[WARN] nav_config 'main' sin megaMenu — agrega los links desde Admin → Navegación",
    );
  } else {
    const menu = nav.megaMenu as Array<{ kind?: string; items?: Array<{ url?: string }> }>;
    const section = menu.find(
      (s) => Array.isArray(s.items) && s.items.some((i) => i.url?.startsWith("/industrias/")),
    );
    if (!section?.items) {
      console.warn("[WARN] sección de industrias no encontrada en megaMenu — agrégala desde Admin");
    } else {
      let added = 0;
      for (const item of NAV_ITEMS_NUEVAS) {
        if (section.items.some((i) => i.url === item.url)) {
          console.log(`[SKIP] nav ${item.url} — ya existe`);
          continue;
        }
        section.items.push({ ...item });
        added++;
      }
      if (added > 0) {
        await db
          .update(schema.navConfig)
          .set({ megaMenu: menu, updatedAt: new Date() })
          .where(eq(schema.navConfig.id, "main"));
        console.log(`[OK] nav_config — ${added} link(s) agregados a la sección industrias`);
      }
    }
  }

  console.log("\n✅ Seed completo. Recuerda revalidar: /industrias, / y las 2 páginas nuevas.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
