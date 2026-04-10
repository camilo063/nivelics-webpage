"use server";

import { db } from "@/lib/db";
import { industrias, adminActivityLog } from "@/lib/db/schema/admin";
import { industriaSchema, type IndustriaInput } from "@/lib/admin/validations/industria.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getIndustrias() {
  if (!db) return [];

  const result = await db
    .select()
    .from(industrias)
    .where(isNull(industrias.deletedAt))
    .orderBy(industrias.nameEs);

  return result;
}

export async function getIndustria(slugEs: string) {
  if (!db) return null;

  const result = await db
    .select()
    .from(industrias)
    .where(and(eq(industrias.slugEs, slugEs), isNull(industrias.deletedAt)))
    .limit(1);

  return result[0] || null;
}

export async function updateIndustria(slugEs: string, input: Partial<IndustriaInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = industriaSchema.partial().parse(input);

  const [industria] = await db
    .update(industrias)
    .set({
      ...parsed,
      casoDestacadoId: parsed.casoDestacadoId ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(industrias.slugEs, slugEs))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "industria",
    entityId: industria.id,
    details: { name: parsed.nameEs },
  });

  revalidatePath("/admin/industrias");
  revalidatePath(`/admin/industrias/${slugEs}`);
  await revalidatePublicPages([`/industrias/${slugEs}`, "/"]);
  return industria;
}

export async function createIndustria(input: {
  slugEs: string;
  slugEn?: string;
  nameEs: string;
  nameEn?: string;
  icon?: string;
  accentColor?: "ia" | "cloud" | "staffing" | "finops" | "dev";
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const [industria] = await db
    .insert(industrias)
    .values({
      slugEs: input.slugEs,
      slugEn: input.slugEn || null,
      nameEs: input.nameEs,
      nameEn: input.nameEn || null,
      icon: input.icon || null,
      accentColor: input.accentColor || "dev",
      status: "draft",
      translationStatusEn: "pending",
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "industria",
    entityId: industria.id,
    details: { name: input.nameEs, slugEs: input.slugEs },
  });

  revalidatePath("/admin/industrias");
  return industria;
}

export async function deleteIndustria(slugEs: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db
    .select({ id: industrias.id })
    .from(industrias)
    .where(and(eq(industrias.slugEs, slugEs), isNull(industrias.deletedAt)))
    .limit(1);

  if (!existing[0]) throw new Error("Industria no encontrada");

  await db.update(industrias).set({ deletedAt: new Date() }).where(eq(industrias.slugEs, slugEs));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "industria",
    entityId: existing[0].id,
    details: { slugEs },
  });

  revalidatePath("/admin/industrias");
}
