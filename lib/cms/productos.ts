import { db } from "@/lib/db";
import { productos, type Producto } from "@/lib/db/schema/admin";
import { eq, asc } from "drizzle-orm";

const FALLBACK: Producto[] = [
  {
    id: "fb-paywl",
    slugEs: "paywl",
    slugEn: "paywl",
    name: "PAYWL",
    taglineEs: "Motor de paywall para medios LATAM",
    taglineEn: "Paywall engine for LATAM media",
    descriptionEs: "Motor SaaS de paywall para medios.",
    descriptionEn: "SaaS paywall engine for media.",
    externalUrl: "https://paywl.io",
    externalCtaEs: "Ir a paywl.io",
    externalCtaEn: "Go to paywl.io",
    icpEs: "Medios digitales LATAM",
    icpEn: "LATAM digital media",
    categoryEs: "Medios · LATAM",
    categoryEn: "Media · LATAM",
    pricingFrom: 450,
    pricingCurrency: "USD",
    pricingLabelEs: "Desde $450/mes",
    pricingLabelEn: "From $450/month",
    pricingNoteEs: null,
    pricingNoteEn: null,
    metrics: null,
    features: null,
    comparisonTable: null,
    faqs: null,
    accentColor: "cyan",
    heroEffect: "particles",
    ogImage: null,
    seoTitleEs: "PAYWL | Nivelics",
    seoTitleEn: "PAYWL | Nivelics",
    seoDescriptionEs: "Paywall SaaS LATAM.",
    seoDescriptionEn: "SaaS paywall LATAM.",
    schemaCategory: "BusinessApplication",
    status: "published",
    translationStatusEn: "complete",
    sortOrder: 1,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fb-niveleads",
    slugEs: "niveleads",
    slugEn: "niveleads",
    name: "Niveleads",
    taglineEs: "Lead scoring B2B con IA",
    taglineEn: "B2B lead scoring with AI",
    descriptionEs: "Lead scoring B2B con IA.",
    descriptionEn: "B2B lead scoring with AI.",
    externalUrl: "https://leads.nivelics.com",
    externalCtaEs: "Ver demo gratis",
    externalCtaEn: "See free demo",
    icpEs: "Equipos B2B",
    icpEn: "B2B teams",
    categoryEs: "Ventas B2B · IA",
    categoryEn: "B2B Sales · AI",
    pricingFrom: 99,
    pricingCurrency: "USD",
    pricingLabelEs: "Desde $99/mes",
    pricingLabelEn: "From $99/month",
    pricingNoteEs: null,
    pricingNoteEn: null,
    metrics: null,
    features: null,
    comparisonTable: null,
    faqs: null,
    accentColor: "teal",
    heroEffect: "grid",
    ogImage: null,
    seoTitleEs: "Niveleads | Nivelics",
    seoTitleEn: "Niveleads | Nivelics",
    seoDescriptionEs: "Lead scoring B2B con IA.",
    seoDescriptionEn: "B2B lead scoring with AI.",
    schemaCategory: "BusinessApplication",
    status: "published",
    translationStatusEn: "complete",
    sortOrder: 2,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fb-hirely",
    slugEs: "hirely",
    slugEn: "hirely",
    name: "Hirely",
    taglineEs: "Reclutamiento inteligente con IA",
    taglineEn: "Intelligent recruitment with AI",
    descriptionEs: "ATS con IA.",
    descriptionEn: "ATS with AI.",
    externalUrl: "https://hirely-sepia.vercel.app",
    externalCtaEs: "Ver demo",
    externalCtaEn: "See demo",
    icpEs: "RR.HH.",
    icpEn: "HR teams",
    categoryEs: "Recursos Humanos · IA",
    categoryEn: "Human Resources · AI",
    pricingFrom: null,
    pricingCurrency: "USD",
    pricingLabelEs: "Demo gratis",
    pricingLabelEn: "Free demo",
    pricingNoteEs: null,
    pricingNoteEn: null,
    metrics: null,
    features: null,
    comparisonTable: null,
    faqs: null,
    accentColor: "violet",
    heroEffect: "hex",
    ogImage: null,
    seoTitleEs: "Hirely | Nivelics",
    seoTitleEn: "Hirely | Nivelics",
    seoDescriptionEs: "ATS con IA.",
    seoDescriptionEn: "ATS with AI.",
    schemaCategory: "WebApplication",
    status: "published",
    translationStatusEn: "complete",
    sortOrder: 3,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getAllProductos(): Promise<Producto[]> {
  if (!db) return FALLBACK;
  try {
    const data = await db
      .select()
      .from(productos)
      .where(eq(productos.status, "published"))
      .orderBy(asc(productos.sortOrder));
    if (!data.length) return FALLBACK;
    return data;
  } catch (e) {
    console.error("[productos] DB error, using fallback:", e);
    return FALLBACK;
  }
}

export async function getProductoBySlug(
  slug: string,
  locale: "es" | "en",
): Promise<Producto | null> {
  if (!db) return FALLBACK.find((p) => (locale === "en" ? p.slugEn : p.slugEs) === slug) ?? null;
  try {
    const field = locale === "en" ? productos.slugEn : productos.slugEs;
    const res = await db.select().from(productos).where(eq(field, slug)).limit(1);
    return res[0] ?? null;
  } catch (e) {
    console.error("[productos] DB error:", e);
    return FALLBACK.find((p) => (locale === "en" ? p.slugEn : p.slugEs) === slug) ?? null;
  }
}

export type MappedProducto = {
  id: string;
  slug: string;
  slugAlt: string;
  name: string;
  tagline: string;
  description: string;
  externalUrl: string;
  externalCta: string;
  icp: string;
  category: string;
  pricingFrom: number | null;
  pricingCurrency: string;
  pricingLabel: string | null;
  pricingNote: string | null;
  metrics: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
  comparisonTable: {
    headers: string[];
    rows: Array<{ feature: string; isNivelicsProduct: boolean; values: string[] }>;
  } | null;
  faqs: Array<{ question: string; answer: string }>;
  accentColor: "cyan" | "teal" | "violet";
  heroEffect: string;
  ogImage: string | null;
  seoTitle: string;
  seoDescription: string;
  schemaCategory: string;
  updatedAt: Date | null;
};

export function mapProducto(data: Producto, locale: "es" | "en"): MappedProducto {
  const en = locale === "en";
  const comparison = data.comparisonTable;
  return {
    id: data.id,
    slug: en ? data.slugEn : data.slugEs,
    slugAlt: en ? data.slugEs : data.slugEn,
    name: data.name,
    tagline: en ? data.taglineEn : data.taglineEs,
    description: en ? data.descriptionEn : data.descriptionEs,
    externalUrl: data.externalUrl,
    externalCta: en ? data.externalCtaEn : data.externalCtaEs,
    icp: en ? data.icpEn : data.icpEs,
    category: en ? data.categoryEn : data.categoryEs,
    pricingFrom: data.pricingFrom,
    pricingCurrency: data.pricingCurrency ?? "USD",
    pricingLabel: en ? data.pricingLabelEn : data.pricingLabelEs,
    pricingNote: en ? data.pricingNoteEn : data.pricingNoteEs,
    metrics: (data.metrics ?? []).map((m) => ({
      value: m.value,
      label: en ? m.labelEn : m.labelEs,
    })),
    features: (data.features ?? []).map((f) => ({
      icon: f.icon,
      title: en ? f.titleEn : f.titleEs,
      description: en ? f.descriptionEn : f.descriptionEs,
    })),
    comparisonTable: comparison
      ? {
          headers: en ? comparison.headersEn : comparison.headersEs,
          rows: comparison.rows.map((r) => ({
            feature: en ? r.featureEn : r.featureEs,
            isNivelicsProduct: r.isNivelicsProduct,
            values: r.values,
          })),
        }
      : null,
    faqs: (data.faqs ?? []).map((f) => ({
      question: en ? f.questionEn : f.questionEs,
      answer: en ? f.answerEn : f.answerEs,
    })),
    accentColor: (data.accentColor ?? "cyan") as "cyan" | "teal" | "violet",
    heroEffect: data.heroEffect ?? "particles",
    ogImage: data.ogImage,
    seoTitle: en ? data.seoTitleEn : data.seoTitleEs,
    seoDescription: en ? data.seoDescriptionEn : data.seoDescriptionEs,
    schemaCategory: data.schemaCategory ?? "BusinessApplication",
    updatedAt: data.updatedAt,
  };
}

const ACCENT_HEX: Record<string, string> = {
  cyan: "#00D4FF",
  teal: "#00e5a0",
  violet: "#a78bfa",
};

export function accentHex(color: string): string {
  return ACCENT_HEX[color] ?? ACCENT_HEX.cyan;
}
