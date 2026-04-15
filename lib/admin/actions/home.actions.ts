"use server";

import { db } from "@/lib/db";
import { homeContent, adminActivityLog } from "@/lib/db/schema/admin";
import { homeContentSchema, type HomeContentInput } from "@/lib/admin/validations/home.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getHomeContent() {
  if (!db) return null;

  const result = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);

  return result[0] || null;
}

export async function updateHomeContent(input: HomeContentInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = homeContentSchema.parse(input);

  const existing = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);

  let record;

  if (existing.length > 0) {
    const [updated] = await db
      .update(homeContent)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(homeContent.id, "main"))
      .returning();
    record = updated;
  } else {
    const [created] = await db
      .insert(homeContent)
      .values({
        id: "main",
        ...parsed,
      })
      .returning();
    record = created;
  }

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "home_content",
    entityId: "main",
    details: { section: "home" },
  });

  revalidatePath("/admin/home");
  await revalidatePublicPages(["/", "/industrias"]);
  return record;
}
