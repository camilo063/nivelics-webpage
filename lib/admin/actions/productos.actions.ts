"use server";

import { db } from "@/lib/db";
import { productos, adminActivityLog } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProductoInput = Partial<{
  slugEs: string;
  slugEn: string;
  name: string;
  taglineEs: string;
  taglineEn: string;
  descriptionEs: string;
  descriptionEn: string;
  externalUrl: string;
  externalCtaEs: string;
  externalCtaEn: string;
  icpEs: string;
  icpEn: string;
  categoryEs: string;
  categoryEn: string;
  pricingFrom: number | null;
  pricingCurrency: string;
  pricingLabelEs: string;
  pricingLabelEn: string;
  pricingNoteEs: string;
  pricingNoteEn: string;
  metrics: Array<{ value: string; labelEs: string; labelEn: string }>;
  features: Array<{
    icon: string;
    titleEs: string;
    titleEn: string;
    descriptionEs: string;
    descriptionEn: string;
  }>;
  comparisonTable: {
    headersEs: string[];
    headersEn: string[];
    rows: Array<{
      featureEs: string;
      featureEn: string;
      isNivelicsProduct: boolean;
      values: string[];
    }>;
  } | null;
  faqs: Array<{
    questionEs: string;
    questionEn: string;
    answerEs: string;
    answerEn: string;
  }>;
  accentColor: string;
  heroEffect: string;
  ogImage: string | null;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  schemaCategory: string;
  status: "draft" | "published" | "scheduled" | "archived";
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  sortOrder: number;
}>;

export async function getProductosAdmin() {
  if (!db) return [];
  return await db.select().from(productos).orderBy(asc(productos.sortOrder));
}

export async function getProductoById(id: string) {
  if (!db) return null;
  const result = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  return result[0] ?? null;
}

export async function updateProducto(id: string, input: ProductoInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const [producto] = await db
    .update(productos)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .set({ ...(input as any), updatedAt: new Date() })
    .where(eq(productos.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "producto",
    entityId: producto.id,
    details: { name: producto.name, slugEs: producto.slugEs },
  });

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/productos");
  revalidatePath(`/productos/${producto.slugEs}`);
  revalidatePath("/en/products");
  revalidatePath(`/en/products/${producto.slugEn}`);
  revalidatePath("/");

  return producto;
}

export async function reorderProductos(items: Array<{ id: string; sortOrder: number }>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  for (const it of items) {
    await db
      .update(productos)
      .set({ sortOrder: it.sortOrder, updatedAt: new Date() })
      .where(eq(productos.id, it.id));
  }

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/en/products");
  revalidatePath("/");
}
