/**
 * Seed new homeContent columns with ES content extracted from app/[locale]/(marketing)/page.tsx
 * hardcoded arrays. English fields are filled with canonical translations.
 */
import { db } from "../lib/db";
import { homeContent } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";

async function main() {
  const updates = {
    heroCtaPrimaryUrl: "/contacto",
    heroCtaSecondaryUrl:
      "https://wa.me/573103926621?text=Hola%2C%20quiero%20información%20sobre%20Nivelics",

    // Trust bar header
    trustBarTitleEs: "Empresas en LATAM y USA que ya transformaron con Nivelics",
    trustBarTitleEn: "Companies across LATAM and USA already transformed with Nivelics",

    // Pillars subtitle
    pillarsSubtitleEs:
      "La mayoría ataca estos retos por separado. Nosotros los conectamos en un solo aliado.",
    pillarsSubtitleEn:
      "Most tackle these challenges in silos. We connect them under a single partner.",

    // Cases section
    casesSectionSubtitleEs:
      "Empresas en medios, fintech, retail y servicios que eligieron Nivelics para transformar su tecnología.",
    casesSectionSubtitleEn:
      "Companies in media, fintech, retail and services that chose Nivelics to transform their technology.",
    casesSectionFooterEs: "7 empresas. Resultados reales.",
    casesSectionFooterEn: "7 companies. Real results.",
    casesSectionCtaEs: "Ver todos los casos",
    casesSectionCtaEn: "See all case studies",

    // Products strip
    productsStripTitleEs: "Software propio de Nivelics",
    productsStripTitleEn: "Nivelics proprietary software",
    productsStripCtaEs: "Ver todos los productos →",
    productsStripCtaEn: "See all products →",

    // Map section
    mapTitleEs: "13 años. 7 países. Un solo aliado.",
    mapTitleEn: "13 years. 7 countries. One partner.",
    mapSubtitleEs:
      "Proyectos activos en Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y Argentina.",
    mapSubtitleEn:
      "Active projects in Colombia, USA, Mexico, El Salvador, Panama, Ecuador, Peru and Argentina.",
    mapMetrics: [
      {
        value: "13+",
        labelEs: "Años",
        labelEn: "Years",
        sublabelEs: "Fundados en 2012",
        sublabelEn: "Founded in 2012",
      },
      {
        value: "7+",
        labelEs: "Países",
        labelEn: "Countries",
        sublabelEs: "LATAM y USA",
        sublabelEn: "LATAM and USA",
      },
    ],

    // Why us
    whyUsTitleEs: "¿Por qué Nivelics?",
    whyUsTitleEn: "Why Nivelics?",
    whyUsItems: [
      {
        icon: "layers",
        color: "#06B6D4",
        titleEs: "Los 3 pilares en un solo aliado",
        titleEn: "All 3 pillars under one partner",
        copyEs:
          "No somos una agencia de diseño, ni una consultora de infraestructura, ni una bolsa de empleo. Somos los tres — integrados.",
        copyEn:
          "We're not a design agency, an infrastructure consultancy, or a staffing board. We're all three — integrated.",
      },
      {
        icon: "bar-chart2",
        color: "#8B5CF6",
        titleEs: "Resultados, no presentaciones",
        titleEn: "Results, not slides",
        copyEs: "Cada proyecto tiene KPIs definidos antes de empezar. Si no se mide, no existe.",
        copyEn:
          "Every project has KPIs defined before kickoff. If it isn't measured, it doesn't exist.",
      },
      {
        icon: "zap",
        color: "#F59E0B",
        titleEs: "Candidatos en 5 días. Agentes en 8 semanas.",
        titleEn: "Candidates in 5 days. Agents in 8 weeks.",
        copyEs: "El tiempo de integración que prometemos está en el contrato — no en el pitch.",
        copyEn: "The ramp-up timeline we promise is in the contract — not in the pitch.",
      },
      {
        icon: "globe",
        color: "#10B981",
        titleEs: "LATAM que opera como global",
        titleEn: "LATAM that operates like a global team",
        copyEs:
          "Sede en Bogotá y Miami. Equipos bilingües. Proyectos en 7 países. Great Place to Work 2022.",
        copyEn:
          "HQ in Bogotá and Miami. Bilingual teams. Projects in 7 countries. Great Place to Work 2022.",
      },
    ],

    // FAQs wrapper title
    faqsTitleEs: "Preguntas frecuentes",
    faqsTitleEn: "Frequently Asked Questions",

    // Final CTA
    finalCtaBullets: [
      {
        textEs: "Respondemos en menos de 24 horas",
        textEn: "We reply in under 24 hours",
      },
      {
        textEs: "Sin compromiso — el diagnóstico es gratuito",
        textEn: "No commitment — the assessment is free",
      },
      { textEs: "Hablamos español e inglés", textEn: "We speak Spanish and English" },
    ],
    finalCtaPrimaryEs: "Agenda tu diagnóstico",
    finalCtaPrimaryEn: "Book your assessment",
    finalCtaPrimaryUrl: "/contacto",
    finalCtaSecondaryEs: "Hablar por WhatsApp",
    finalCtaSecondaryEn: "Chat on WhatsApp",
    finalCtaSecondaryUrl: "https://wa.me/573103926621",
    finalCtaFinePrintEs: "Respondemos en menos de 24 horas. Sin ventas agresivas.",
    finalCtaFinePrintEn: "We reply in under 24 hours. No aggressive sales.",
  };

  const existing = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);
  if (existing.length === 0) {
    console.error("No homeContent 'main' row found — cannot seed new fields");
    process.exit(1);
  }

  await db.update(homeContent).set(updates).where(eq(homeContent.id, "main"));
  console.log("Updated homeContent with", Object.keys(updates).length, "new fields.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
