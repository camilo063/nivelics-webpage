"use server";

import { db } from "@/lib/db";
import { casosExito, adminActivityLog } from "@/lib/db/schema/admin";
import { casoExitoSchema, type CasoExitoInput } from "@/lib/admin/validations/caso.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq, desc, and, isNull, ilike, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getCasosExito(options?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  if (!db) return { casos: [], total: 0 };

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  const conditions = [isNull(casosExito.deletedAt)];

  if (options?.status && options.status !== "all") {
    conditions.push(eq(casosExito.status, options.status as "draft" | "published" | "scheduled"));
  }

  if (options?.search) {
    conditions.push(ilike(casosExito.titleEs, `%${options.search}%`));
  }

  const [casos, totalResult] = await Promise.all([
    db
      .select()
      .from(casosExito)
      .where(and(...conditions))
      .orderBy(desc(casosExito.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(casosExito)
      .where(and(...conditions)),
  ]);

  return { casos, total: totalResult[0].count };
}

export async function getCasoExito(id: string) {
  if (!db) return null;

  const result = await db
    .select()
    .from(casosExito)
    .where(and(eq(casosExito.id, id), isNull(casosExito.deletedAt)))
    .limit(1);

  return result[0] || null;
}

export async function createCasoExito(input: CasoExitoInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = casoExitoSchema.parse(input);

  const [caso] = await db
    .insert(casosExito)
    .values({
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "caso_exito",
    entityId: caso.id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/casos");
  await revalidatePublicPages([`/casos-de-exito/${parsed.slug}`, "/casos-de-exito", "/"]);
  return caso;
}

export async function updateCasoExito(id: string, input: Partial<CasoExitoInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = casoExitoSchema.partial().parse(input);

  const [caso] = await db
    .update(casosExito)
    .set({
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(casosExito.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "caso_exito",
    entityId: id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/casos");
  revalidatePath(`/admin/casos/${id}`);
  if (caso?.slug)
    await revalidatePublicPages([`/casos-de-exito/${caso.slug}`, "/casos-de-exito", "/"]);
  return caso;
}

export async function deleteCasoExito(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.update(casosExito).set({ deletedAt: new Date() }).where(eq(casosExito.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "caso_exito",
    entityId: id,
  });

  revalidatePath("/admin/casos");
}

export async function publishCasoExito(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db
    .update(casosExito)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(casosExito.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "publish",
    entityType: "caso_exito",
    entityId: id,
  });

  revalidatePath("/admin/casos");
}
