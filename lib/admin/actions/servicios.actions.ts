"use server";

import { db } from "@/lib/db";
import { servicios, adminActivityLog } from "@/lib/db/schema/admin";
import { servicioSchema, type ServicioInput } from "@/lib/admin/validations/servicio.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq, and, isNull, asc, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getServicios() {
  if (!db) return [];

  const allServicios = await db
    .select()
    .from(servicios)
    .where(isNull(servicios.deletedAt))
    .orderBy(asc(servicios.sortOrder));

  // Build parent/child structure
  const hubs = allServicios.filter((s) => s.serviceType === "hub");
  const subs = allServicios.filter((s) => s.serviceType === "sub");

  return hubs.map((hub) => ({
    ...hub,
    children: subs.filter((sub) => sub.parentId === hub.id),
  }));
}

export async function getServicio(slugEs: string) {
  if (!db) return null;

  const result = await db
    .select()
    .from(servicios)
    .where(and(eq(servicios.slugEs, slugEs), isNull(servicios.deletedAt)))
    .limit(1);

  return result[0] || null;
}

export async function updateServicio(slugEs: string, input: Partial<ServicioInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = servicioSchema.partial().parse(input);

  const [servicio] = await db
    .update(servicios)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(eq(servicios.slugEs, slugEs))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "servicio",
    entityId: servicio.id,
    details: { title: parsed.titleEs, slugEs },
  });

  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${slugEs}`);
  await revalidatePublicPages(["/servicios", `/servicios/${slugEs}`, "/"]);
  return servicio;
}

export async function createServicio(input: {
  slugEs: string;
  slugEn?: string;
  serviceType: "hub" | "sub";
  parentId?: string | null;
  accentColor: "ia" | "cloud" | "staffing" | "finops" | "dev";
  titleEs: string;
  titleEn?: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  // Get next sort order
  const maxOrder = await db.select({ max: max(servicios.sortOrder) }).from(servicios);
  const nextOrder = (maxOrder[0]?.max ?? 0) + 1;

  const [servicio] = await db
    .insert(servicios)
    .values({
      slugEs: input.slugEs,
      slugEn: input.slugEn || null,
      serviceType: input.serviceType,
      parentId: input.parentId || null,
      accentColor: input.accentColor,
      titleEs: input.titleEs,
      titleEn: input.titleEn || null,
      sortOrder: nextOrder,
      status: "draft",
      translationStatusEn: "pending",
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "servicio",
    entityId: servicio.id,
    details: { title: input.titleEs, slugEs: input.slugEs },
  });

  revalidatePath("/admin/servicios");
  return servicio;
}

export async function deleteServicio(slugEs: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db
    .select({ id: servicios.id })
    .from(servicios)
    .where(and(eq(servicios.slugEs, slugEs), isNull(servicios.deletedAt)))
    .limit(1);

  if (!existing[0]) throw new Error("Servicio no encontrado");

  await db.update(servicios).set({ deletedAt: new Date() }).where(eq(servicios.slugEs, slugEs));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "servicio",
    entityId: existing[0].id,
    details: { slugEs },
  });

  revalidatePath("/admin/servicios");
}
