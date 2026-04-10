"use server";

import { db } from "@/lib/db";
import { media, adminActivityLog } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMediaItems(options?: { page?: number; limit?: number }) {
  if (!db) return { items: [], total: 0 };

  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db.select().from(media).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(media),
  ]);

  return { items, total: totalResult[0].count };
}

export async function createMediaItem(input: {
  filename: string;
  originalName: string;
  url: string;
  altEs?: string;
  altEn?: string;
  sizeBytes?: number;
  mimeType?: string;
  width?: number;
  height?: number;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const [item] = await db
    .insert(media)
    .values({
      ...input,
      uploadedBy: session.sub,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "upload",
    entityType: "media",
    entityId: item.id,
    details: { filename: input.originalName },
  });

  revalidatePath("/admin/media");
  return item;
}

export async function updateMediaItem(id: string, input: { altEs?: string; altEn?: string }) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.update(media).set(input).where(eq(media.id, id));
  revalidatePath("/admin/media");
}

export async function deleteMediaItem(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.delete(media).where(eq(media.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "media",
    entityId: id,
  });

  revalidatePath("/admin/media");
}
