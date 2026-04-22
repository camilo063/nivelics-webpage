import { db } from "@/lib/db";
import { productos, type Producto } from "@/lib/db/schema/admin";
import { eq, asc } from "drizzle-orm";
import { PRODUCTOS_FB } from "./fallbacks-data";

// Snapshot of the real productos table — mirrors data/fallbacks/productos.json.
// Used whenever `db === null` (local fallback mode) or when a DB error happens.
const FALLBACK: Producto[] = [...PRODUCTOS_FB]
  .filter((p) => p.status === "published")
  .sort((a, b) => a.sortOrder - b.sortOrder);

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

export type ProductoSitemapRow = {
  slugEs: string;
  slugEn: string;
  updatedAt: Date | null;
  status: Producto["status"];
};

export async function getAllProductosSitemap(): Promise<ProductoSitemapRow[]> {
  const fallback: ProductoSitemapRow[] = FALLBACK.map((p) => ({
    slugEs: p.slugEs,
    slugEn: p.slugEn,
    updatedAt: p.updatedAt,
    status: p.status,
  }));
  if (!db) return fallback;
  try {
    const data = await db
      .select({
        slugEs: productos.slugEs,
        slugEn: productos.slugEn,
        updatedAt: productos.updatedAt,
        status: productos.status,
      })
      .from(productos)
      .where(eq(productos.status, "published"))
      .orderBy(asc(productos.sortOrder));
    return data.length ? data : fallback;
  } catch (e) {
    console.error("[productos/sitemap] DB error, using fallback:", e);
    return fallback;
  }
}

export type ProductoHubRow = {
  id: string;
  slugEs: string;
  slugEn: string;
  name: string;
  taglineEs: string;
  taglineEn: string;
  categoryEs: string;
  categoryEn: string;
  pricingLabelEs: string | null;
  pricingLabelEn: string | null;
  pricingNoteEs: string | null;
  pricingNoteEn: string | null;
  accentColor: string;
  externalUrl: string;
  sortOrder: number;
  status: Producto["status"];
};

export async function getAllProductosHub(): Promise<ProductoHubRow[]> {
  const fallback: ProductoHubRow[] = FALLBACK.map((p) => ({
    id: p.id,
    slugEs: p.slugEs,
    slugEn: p.slugEn,
    name: p.name,
    taglineEs: p.taglineEs,
    taglineEn: p.taglineEn,
    categoryEs: p.categoryEs,
    categoryEn: p.categoryEn,
    pricingLabelEs: p.pricingLabelEs,
    pricingLabelEn: p.pricingLabelEn,
    pricingNoteEs: p.pricingNoteEs,
    pricingNoteEn: p.pricingNoteEn,
    accentColor: p.accentColor,
    externalUrl: p.externalUrl,
    sortOrder: p.sortOrder,
    status: p.status,
  }));
  if (!db) return fallback;
  try {
    const data = await db
      .select({
        id: productos.id,
        slugEs: productos.slugEs,
        slugEn: productos.slugEn,
        name: productos.name,
        taglineEs: productos.taglineEs,
        taglineEn: productos.taglineEn,
        categoryEs: productos.categoryEs,
        categoryEn: productos.categoryEn,
        pricingLabelEs: productos.pricingLabelEs,
        pricingLabelEn: productos.pricingLabelEn,
        pricingNoteEs: productos.pricingNoteEs,
        pricingNoteEn: productos.pricingNoteEn,
        accentColor: productos.accentColor,
        externalUrl: productos.externalUrl,
        sortOrder: productos.sortOrder,
        status: productos.status,
      })
      .from(productos)
      .where(eq(productos.status, "published"))
      .orderBy(asc(productos.sortOrder));
    return data.length ? data : fallback;
  } catch (e) {
    console.error("[productos/hub] DB error, using fallback:", e);
    return fallback;
  }
}

export type MappedProductoCard = Pick<
  MappedProducto,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "category"
  | "pricingLabel"
  | "pricingNote"
  | "accentColor"
  | "externalUrl"
>;

export function mapProductoCard(row: ProductoHubRow, locale: "es" | "en"): MappedProductoCard {
  const en = locale === "en";
  return {
    id: row.id,
    slug: en ? row.slugEn : row.slugEs,
    name: row.name,
    tagline: en ? row.taglineEn : row.taglineEs,
    category: en ? row.categoryEn : row.categoryEs,
    pricingLabel: en ? row.pricingLabelEn : row.pricingLabelEs,
    pricingNote: en ? row.pricingNoteEn : row.pricingNoteEs,
    accentColor: (row.accentColor ?? "cyan") as MappedProducto["accentColor"],
    externalUrl: row.externalUrl,
  };
}

export type ProductoLlmsRow = {
  name: string;
  slugEs: string;
  slugEn: string;
  taglineEs: string;
  taglineEn: string;
  pricingLabelEs: string | null;
  pricingLabelEn: string | null;
};

export async function getAllProductosLlms(): Promise<ProductoLlmsRow[]> {
  const fallback: ProductoLlmsRow[] = FALLBACK.map((p) => ({
    name: p.name,
    slugEs: p.slugEs,
    slugEn: p.slugEn,
    taglineEs: p.taglineEs,
    taglineEn: p.taglineEn,
    pricingLabelEs: p.pricingLabelEs,
    pricingLabelEn: p.pricingLabelEn,
  }));
  if (!db) return fallback;
  try {
    const data = await db
      .select({
        name: productos.name,
        slugEs: productos.slugEs,
        slugEn: productos.slugEn,
        taglineEs: productos.taglineEs,
        taglineEn: productos.taglineEn,
        pricingLabelEs: productos.pricingLabelEs,
        pricingLabelEn: productos.pricingLabelEn,
      })
      .from(productos)
      .where(eq(productos.status, "published"))
      .orderBy(asc(productos.sortOrder));
    return data.length ? data : fallback;
  } catch (e) {
    console.error("[productos/llms] DB error, using fallback:", e);
    return fallback;
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
