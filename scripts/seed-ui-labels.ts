/**
 * Seed the `ui_labels` table with the set of reusable labels that currently
 * live as hardcoded `locale === "en" ? "…" : "…"` ternaries in the public
 * pages (see FASE 0 audit of the nivelics closure prompt).
 *
 * Idempotent: upserts by `key`, so it is safe to re-run after schema changes.
 */
import { db } from "../lib/db";
import { uiLabels } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";

interface SeedLabel {
  key: string;
  labelEs: string;
  labelEn: string;
  category: string;
  description?: string;
}

const SEED: SeedLabel[] = [
  // ─── Caso de éxito detail pages ─────────────────────
  {
    key: "caso.back_to_list",
    labelEs: "Todos los casos",
    labelEn: "All case studies",
    category: "caso",
    description: "Back link at the top of every case-study detail page.",
  },
  {
    key: "caso.challenge_label",
    labelEs: "El Reto",
    labelEn: "The Challenge",
    category: "caso",
    description: "Heading above the 'challenge' paragraph on case detail pages.",
  },
  {
    key: "caso.solution_label",
    labelEs: "La Solución",
    labelEn: "The Solution",
    category: "caso",
    description: "Heading above the 'solution' paragraph on case detail pages.",
  },
  {
    key: "caso.results_label",
    labelEs: "Resultados",
    labelEn: "Results",
    category: "caso",
    description: "Heading above the results grid on case detail pages.",
  },
  {
    key: "caso.services_used_label",
    labelEs: "Servicios utilizados",
    labelEn: "Services used",
    category: "caso",
    description: "Heading above the services badges at the bottom of case detail pages.",
  },
  {
    key: "caso.cta_banner_title",
    labelEs: "¿Tu empresa podría ser el próximo caso?",
    labelEn: "Could your company be the next case?",
    category: "caso",
    description: "Shared CTA banner title on every case detail page.",
  },
  {
    key: "caso.cta_banner_description",
    labelEs: "Cuéntanos tu desafío y diseñemos juntos la solución.",
    labelEn: "Tell us your challenge and we'll design the solution together.",
    category: "caso",
    description: "Shared CTA banner description on every case detail page.",
  },

  // ─── Caso de éxito list page ────────────────────────
  {
    key: "caso.list_title",
    labelEs: "Casos de Éxito",
    labelEn: "Case Studies",
    category: "caso",
    description: "H1 on the case studies list page.",
  },
  {
    key: "caso.list_subtitle",
    labelEs:
      "Resultados concretos que demuestran el impacto de nuestras soluciones en empresas reales.",
    labelEn: "Concrete results showing the impact of our solutions on real companies.",
    category: "caso",
    description: "Intro paragraph on the case studies list page.",
  },
  {
    key: "caso.list_challenge_label",
    labelEs: "Desafío",
    labelEn: "Challenge",
    category: "caso",
    description: "Column heading inside each card on the case studies list.",
  },
  {
    key: "caso.list_solution_label",
    labelEs: "Solución",
    labelEn: "Solution",
    category: "caso",
    description: "Column heading inside each card on the case studies list.",
  },
  {
    key: "caso.list_results_label",
    labelEs: "Resultados",
    labelEn: "Results",
    category: "caso",
    description: "Column heading inside each card on the case studies list.",
  },
  {
    key: "caso.list_cta_banner_title",
    labelEs: "¿Quieres ser el próximo caso de éxito?",
    labelEn: "Want to be the next success story?",
    category: "caso",
    description: "CTA banner title on the case studies list page.",
  },

  // ─── Nav (mega menu) ────────────────────────────────
  {
    key: "nav.all_services",
    labelEs: "Ver todos los servicios",
    labelEn: "All services",
    category: "nav",
    description: "Link at the top of the Services mega-menu mobile accordion.",
  },
  {
    key: "nav.all_products",
    labelEs: "Todos los productos",
    labelEn: "All products",
    category: "nav",
    description: "Link at the top of the Products mega-menu mobile accordion.",
  },
  {
    key: "nav.about_nivelics",
    labelEs: "Sobre Nivelics",
    labelEn: "About Nivelics",
    category: "nav",
    description: "Link at the top of the About mega-menu mobile accordion.",
  },
  {
    key: "nav.aria_main",
    labelEs: "Navegación principal",
    labelEn: "Main navigation",
    category: "nav",
    description: "aria-label on the top-level <nav>.",
  },
  {
    key: "nav.aria_industries",
    labelEs: "Navegación por industrias",
    labelEn: "Industries navigation",
    category: "nav",
    description: "aria-label on the Industries mega-menu panel.",
  },
  {
    key: "nav.aria_products",
    labelEs: "Navegación por productos",
    labelEn: "Products navigation",
    category: "nav",
    description: "aria-label on the Products mega-menu panel.",
  },
  {
    key: "nav.aria_about",
    labelEs: "Navegación sección Nosotros",
    labelEn: "About navigation",
    category: "nav",
    description: "aria-label on the About mega-menu panel.",
  },
  {
    key: "nav.aria_close_menu",
    labelEs: "Cerrar menú",
    labelEn: "Close menu",
    category: "nav",
    description: "aria-label on the mobile menu close button.",
  },
  {
    key: "nav.aria_open_menu",
    labelEs: "Abrir menú",
    labelEn: "Open menu",
    category: "nav",
    description: "aria-label on the mobile menu open button.",
  },

  // ─── Home / shared ──────────────────────────────────
  {
    key: "ui.view",
    labelEs: "Ver",
    labelEn: "View",
    category: "ui_generic",
    description: "Short 'view' link on cards (home cases grid etc.).",
  },
  {
    key: "ui.see_all_cases",
    labelEs: "Ver todos los casos",
    labelEn: "See all case studies",
    category: "ui_generic",
    description: "Default CTA label when home 'See all cases' button has no DB override.",
  },
  {
    key: "ui.faqs_title",
    labelEs: "Preguntas frecuentes",
    labelEn: "Frequently Asked Questions",
    category: "ui_generic",
    description: "Default FAQ section title when no DB override is provided.",
  },

  // ─── Home pillars badges (short abbreviations) ───────
  {
    key: "home.badge_ia",
    labelEs: "I — IA",
    labelEn: "I — AI",
    category: "ui_generic",
    description: "Badge label on the IA pillar card on the home pillars section.",
  },
  {
    key: "home.badge_cloud",
    labelEs: "C — Cloud",
    labelEn: "C — Cloud",
    category: "ui_generic",
    description: "Badge label on the Cloud pillar card (same in both languages).",
  },
  {
    key: "home.badge_staffing",
    labelEs: "S — Staffing",
    labelEn: "S — Staffing",
    category: "ui_generic",
    description: "Badge label on the Staffing pillar card.",
  },
  {
    key: "home.badge_dev",
    labelEs: "Dev",
    labelEn: "Dev",
    category: "ui_generic",
    description: "Badge label on the Digital Development pillar card.",
  },

  // ─── SEO defaults for home (only used if DB home content is empty) ───
  {
    key: "seo.home_default_title",
    labelEs: "Transformación Digital IA · Cloud · Staffing | Nivelics Colombia",
    labelEn: "Digital Transformation AI · Cloud · Staffing | Nivelics",
    category: "seo",
    description: "Fallback SEO title for the home page when no DB content exists.",
  },
  {
    key: "seo.home_brand_suffix",
    labelEs: " | Nivelics Colombia",
    labelEn: " | Nivelics",
    category: "seo",
    description: "Suffix appended after the hero title in the home page metadata.",
  },
  {
    key: "seo.home_default_description",
    labelEs:
      "Empresa colombiana de transformación digital B2B. IA aplicada, Cloud (AWS, GCP, Azure) y Staff Augmentation premium para LATAM y USA. Desde 2012.",
    labelEn:
      "Colombian B2B digital transformation company. Applied AI, Cloud (AWS, GCP, Azure) and premium Staff Augmentation for LATAM and USA. Since 2012.",
    category: "seo",
    description: "Fallback SEO description for the home page when no DB content exists.",
  },

  // ─── Service hub pages (default section titles) ──────
  {
    key: "servicio.cloud_faqs_title",
    labelEs: "Preguntas frecuentes sobre Cloud",
    labelEn: "Frequently Asked Questions about Cloud",
    category: "servicio",
    description: "FAQ section title on the /servicios/cloud hub page.",
  },
  {
    key: "servicio.ia_faqs_title",
    labelEs: "Preguntas frecuentes sobre IA",
    labelEn: "Frequently Asked Questions about AI",
    category: "servicio",
    description: "FAQ section title on the /servicios/inteligencia-artificial hub page.",
  },
  {
    key: "servicio.staffaug_faqs_title",
    labelEs: "Preguntas frecuentes sobre Staff Augmentation",
    labelEn: "Frequently Asked Questions about Staff Augmentation",
    category: "servicio",
    description: "FAQ section title on the /servicios/staff-augmentation hub page.",
  },
  {
    key: "servicio.dev_faqs_title",
    labelEs: "Preguntas frecuentes",
    labelEn: "Frequently Asked Questions",
    category: "servicio",
    description: "FAQ section title on the /servicios/desarrollo-digital hub page.",
  },
  {
    key: "servicio.dev_process_title",
    labelEs: "Cómo trabajamos en cada proyecto",
    labelEn: "How we work on every project",
    category: "servicio",
    description: "Process section title on the /servicios/desarrollo-digital hub page.",
  },
  {
    key: "servicio.staffaug_why_title",
    labelEs: "¿Por qué Nivelics vs. contratar directamente?",
    labelEn: "Why Nivelics vs. hiring directly?",
    category: "servicio",
    description: "'Why us' heading on the /servicios/staff-augmentation hub page.",
  },
  {
    key: "servicio.staffaug_cta_view_profiles",
    labelEs: "Ver perfiles disponibles",
    labelEn: "View available profiles",
    category: "servicio",
    description: "Primary hero CTA on /servicios/staff-augmentation.",
  },
  {
    key: "servicio.staffaug_cta_whatsapp",
    labelEs: "Hablar por WhatsApp",
    labelEn: "Chat on WhatsApp",
    category: "servicio",
    description: "Secondary hero CTA on /servicios/staff-augmentation.",
  },

  // ─── Footer (defensive fallbacks when DB footer is unseeded) ──
  {
    key: "footer.default_brand_tagline",
    labelEs: "Transformación digital B2B. IA, Cloud & Staffing Premium.",
    labelEn: "B2B digital transformation. AI, Cloud & Premium Staffing.",
    category: "footer",
    description: "Fallback brand tagline only used if navConfig.footer is missing.",
  },
  {
    key: "footer.default_copyright",
    labelEs: "Todos los derechos reservados.",
    labelEn: "All rights reserved.",
    category: "footer",
    description: "Fallback copyright only used if navConfig.footer is missing.",
  },
  {
    key: "footer.default_contact_title",
    labelEs: "Contacto",
    labelEn: "Contact",
    category: "footer",
    description: "Fallback 'Contact' column title when no DB override exists.",
  },
  {
    key: "footer.default_support",
    labelEs: "Soporte",
    labelEn: "Support",
    category: "footer",
    description: "Fallback 'Support' link label when no DB override exists.",
  },

  // ─── CTA Banner (default fallbacks) ──────────────────
  {
    key: "cta_banner.default_eyebrow",
    labelEs: "DIAGNÓSTICO GRATUITO",
    labelEn: "FREE DIAGNOSTIC",
    category: "ui_generic",
    description: "Default eyebrow label on the shared CTABanner component.",
  },
  {
    key: "cta_banner.default_button",
    labelEs: "Agenda tu diagnóstico",
    labelEn: "Book your assessment",
    category: "ui_generic",
    description: "Default button label on the shared CTABanner component.",
  },
];

async function main() {
  if (!db) {
    console.error("DB not configured");
    process.exit(1);
  }
  let inserted = 0;
  let updated = 0;
  for (const l of SEED) {
    const existing = await db.select().from(uiLabels).where(eq(uiLabels.key, l.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(uiLabels).values({
        key: l.key,
        labelEs: l.labelEs,
        labelEn: l.labelEn,
        category: l.category,
        description: l.description ?? null,
      });
      inserted++;
    } else {
      // Refresh labels so schema updates propagate, but never overwrite
      // values if the row was edited in the admin and differs already —
      // detect that by comparing the seed's labelEs with the DB value.
      const current = existing[0];
      const adminEdited =
        current.labelEs !== l.labelEs ||
        current.labelEn !== l.labelEn ||
        current.description !== (l.description ?? null);
      if (!adminEdited) {
        await db
          .update(uiLabels)
          .set({
            labelEs: l.labelEs,
            labelEn: l.labelEn,
            category: l.category,
            description: l.description ?? null,
            updatedAt: new Date(),
          })
          .where(eq(uiLabels.key, l.key));
        updated++;
      }
    }
  }
  console.log(
    `Done. Inserted: ${inserted}, Updated: ${updated}, Total seed labels: ${SEED.length}`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
