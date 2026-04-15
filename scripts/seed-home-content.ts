/**
 * Populates home_content with baseline ES/EN copy (hero, sections, CTAs, FAQs).
 * Only writes fields that are currently empty — never overwrites admin edits.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const FAQS = [
  {
    questionEs: "¿Qué es Nivelics y qué servicios ofrece?",
    questionEn: "What is Nivelics and what services does it offer?",
    answerEs:
      "Nivelics es una empresa colombiana de transformación digital fundada en 2012 con sede en Bogotá y Miami. Ofrecemos tres líneas de servicio integradas: IA aplicada (agentes, automatización, RAG), Cloud con gobierno real (AWS, GCP, Azure, FinOps) y Staff Augmentation premium (talento tech bilingüe integrado en 5 días hábiles). Operamos en 7+ países de LATAM y USA.",
    answerEn:
      "Nivelics is a Colombian digital transformation firm founded in 2012, with offices in Bogotá and Miami. We deliver three integrated service lines: applied AI (agents, automation, RAG), Cloud with real governance (AWS, GCP, Azure, FinOps) and premium Staff Augmentation (bilingual tech talent integrated in 5 business days). We operate in 7+ countries across LATAM and the US.",
  },
  {
    questionEs: "¿En cuánto tiempo puede Nivelics integrar un perfil tech?",
    questionEn: "How quickly can Nivelics integrate a tech profile?",
    answerEs:
      "Presentamos los primeros candidatos en máximo 5 días hábiles. La integración completa al equipo del cliente tarda entre 6 y 10 días hábiles. Ofrecemos garantía de reemplazo sin costo en menos de 10 días si el perfil no cumple las expectativas.",
    answerEn:
      "We present the first candidates within 5 business days. Full integration into the client's team takes 6–10 business days. We offer a no-cost replacement guarantee in under 10 days if the profile doesn't meet expectations.",
  },
  {
    questionEs: "¿Cuánto cuesta trabajar con Nivelics?",
    questionEn: "How much does it cost to work with Nivelics?",
    answerEs:
      "Los precios varían según el servicio. Staff Augmentation tiene un modelo mensual por recurso, con un ahorro promedio del 40% vs. contratar en USA o Europa. Cloud y FinOps tienen modelos de fee fijo más success fee sobre el ahorro logrado. IA aplicada varía según la complejidad del agente. El diagnóstico inicial siempre es gratuito y sin compromiso.",
    answerEn:
      "Pricing depends on the service. Staff Augmentation is monthly per resource, averaging 40% savings vs. hiring in the US or Europe. Cloud and FinOps use fixed fees plus success fees on the savings achieved. Applied AI varies with agent complexity. The initial diagnostic is always free and with no commitment.",
  },
  {
    questionEs: "¿En qué países opera Nivelics?",
    questionEn: "Which countries does Nivelics operate in?",
    answerEs:
      "Nivelics tiene sede principal en Bogotá, Colombia y oficina en Miami, Florida (Nivelics LLC). Hemos entregado proyectos en Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y Argentina.",
    answerEn:
      "Nivelics is headquartered in Bogotá, Colombia, with an office in Miami, Florida (Nivelics LLC). We have delivered projects in Colombia, the US, Mexico, El Salvador, Panama, Ecuador, Peru and Argentina.",
  },
  {
    questionEs: "¿Qué diferencia a Nivelics de otras consultoras tech?",
    questionEn: "What sets Nivelics apart from other tech consultancies?",
    answerEs:
      "Tres cosas: primero, integramos los tres pilares (IA, Cloud y Staffing) en un solo aliado. Segundo, velocidad real: 5 días para candidatos, 8 semanas para un agente IA en producción. Tercero, resultados en contrato: nuestros SLAs y métricas de entrega están escritos, no prometidos en presentaciones.",
    answerEn:
      "Three things: first, we integrate the three pillars (AI, Cloud and Staffing) into a single partner. Second, real speed: 5 days for candidates, 8 weeks for an AI agent in production. Third, outcomes in the contract: our SLAs and delivery metrics are written, not promised in slides.",
  },
];

const DATA = {
  heroBadgeEs: "IA · Cloud · Staffing Premium",
  heroBadgeEn: "AI · Cloud · Premium Staffing",
  heroTitleEs: "Transforma más rápido.",
  heroTitleEn: "Transform faster.",
  heroSubtitleEs:
    "Empresa colombiana de transformación digital B2B. IA aplicada, Cloud (AWS, GCP, Azure) y Staff Augmentation premium para empresas en LATAM y USA. Desde 2012.",
  heroSubtitleEn:
    "Colombian B2B digital transformation firm. Applied AI, Cloud (AWS, GCP, Azure) and premium Staff Augmentation for companies in LATAM and the US. Since 2012.",
  heroCtaPrimaryEs: "Agenda tu diagnóstico",
  heroCtaPrimaryEn: "Book your diagnostic",
  heroCtaSecondaryEs: "Hablar por WhatsApp",
  heroCtaSecondaryEn: "Chat on WhatsApp",
  servicesSectionTitleEs: "IA + Cloud + Staffing — los tres pilares integrados",
  servicesSectionTitleEn: "AI + Cloud + Staffing — the three pillars integrated",
  casesSectionTitleEs: "Resultados reales en 7 países",
  casesSectionTitleEn: "Real outcomes in 7 countries",
  finalCtaTitleEs: "¿Listo para transformar más rápido?",
  finalCtaTitleEn: "Ready to transform faster?",
  finalCtaCopyEs:
    "Diagnóstico gratuito en 30 minutos. Sin RFP, sin presentaciones largas. Solo cuéntanos tu reto.",
  finalCtaCopyEn: "Free 30-minute diagnostic. No RFP, no long decks. Just tell us your challenge.",
  industriasHubTitleEs: "Tecnología que entiende tu industria",
  industriasHubTitleEn: "Technology that understands your industry",
  industriasHubSubtitleEs:
    "Cada sector tiene sus propias reglas, regulación y comportamientos de usuario. Traemos el expertise de dominio para que no gastes los primeros 3 meses explicándonos tu negocio.",
  industriasHubSubtitleEn:
    "Every sector has its own rules, regulations and user behaviors. We bring the domain expertise so you don't waste the first 3 months explaining your business.",
  industriasHubStatEs: "13 años entregando tecnología en los sectores más exigentes de LATAM y USA",
  industriasHubStatEn:
    "13 years delivering technology in the most demanding sectors in LATAM and the US",
};

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  const existing = await db.query.homeContent.findFirst();

  if (!existing) {
    await db.insert(schema.homeContent).values({
      id: "main",
      ...DATA,
      faqs: FAQS,
      translationStatusEn: "complete",
    });
    console.log("[OK] home_content created");
    return;
  }

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(DATA)) {
    const current = (existing as Record<string, unknown>)[key];
    if (!current || (typeof current === "string" && current.trim() === "")) {
      updates[key] = value;
    }
  }

  const currentFaqs = (existing.faqs as typeof FAQS | null) ?? [];
  if (!currentFaqs.length) {
    updates.faqs = FAQS;
  }

  if (Object.keys(updates).length > 0) {
    await db
      .update(schema.homeContent)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.homeContent.id, existing.id));
    console.log(`[OK] home_content — ${Object.keys(updates).length} fields populated`);
  } else {
    console.log("[SKIP] home_content already populated");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
