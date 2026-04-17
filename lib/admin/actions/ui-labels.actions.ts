"use server";

import { db } from "@/lib/db";
import { adminActivityLog, uiLabels } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import {
  uiLabelSchema,
  uiLabelUpdateSchema,
  type UiLabelInput,
  type UiLabelUpdateInput,
} from "@/lib/admin/validations/ui-labels.schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function listUiLabels() {
  if (!db) return [];
  return db.select().from(uiLabels).orderBy(asc(uiLabels.key));
}

export async function getUiLabelById(id: string) {
  if (!db) return null;
  const rows = await db.select().from(uiLabels).where(eq(uiLabels.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createUiLabel(input: UiLabelInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = uiLabelSchema.parse(input);

  const existing = await db.select().from(uiLabels).where(eq(uiLabels.key, parsed.key)).limit(1);
  if (existing.length > 0) throw new Error(`La key "${parsed.key}" ya existe.`);

  const [row] = await db
    .insert(uiLabels)
    .values({
      key: parsed.key,
      labelEs: parsed.labelEs,
      labelEn: parsed.labelEn,
      category: parsed.category,
      description: parsed.description || null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "ui_label",
    entityId: row.id,
    details: { key: parsed.key, category: parsed.category },
  });

  revalidatePath("/admin/ui-labels");
  await revalidatePublicPages(["/"]);
  return row;
}

export async function updateUiLabel(id: string, input: UiLabelUpdateInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = uiLabelUpdateSchema.parse(input);

  const existing = await db.select().from(uiLabels).where(eq(uiLabels.id, id)).limit(1);
  if (existing.length === 0) throw new Error("Label no encontrado");

  const patch: Partial<typeof uiLabels.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.labelEs !== undefined) patch.labelEs = parsed.labelEs;
  if (parsed.labelEn !== undefined) patch.labelEn = parsed.labelEn;
  if (parsed.category !== undefined) patch.category = parsed.category;
  if (parsed.description !== undefined) patch.description = parsed.description || null;
  // `key` is immutable once created — ignored on update to keep call-sites stable.

  const [row] = await db.update(uiLabels).set(patch).where(eq(uiLabels.id, id)).returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "ui_label",
    entityId: id,
    details: { key: existing[0].key },
  });

  revalidatePath("/admin/ui-labels");
  await revalidatePublicPages(["/"]);
  return row;
}

export async function deleteUiLabel(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db.select().from(uiLabels).where(eq(uiLabels.id, id)).limit(1);
  if (existing.length === 0) throw new Error("Label no encontrado");

  await db.delete(uiLabels).where(eq(uiLabels.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "ui_label",
    entityId: id,
    details: { key: existing[0].key },
  });

  revalidatePath("/admin/ui-labels");
  await revalidatePublicPages(["/"]);
}

/**
 * Auto-translate a label's ES → EN (or EN → ES) via the admin translate endpoint.
 * Returns the new value without persisting — the form persists on submit.
 */
export async function translateUiLabel(
  sourceText: string,
  sourceLocale: "es" | "en",
): Promise<string> {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY no configurada");

  const target = sourceLocale === "es" ? "English" : "Spanish";
  const source = sourceLocale === "es" ? "Spanish (Colombia, B2B tech)" : "English (USA B2B tech)";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system:
        "You are a professional B2B tech translator for Nivelics (Bogotá + Miami). Keep it concise and natural — these are UI labels. Never translate: Staff Augmentation, FinOps, Cloud, Applied AI, Nivelics, PAYWL, Niveleads, Hirely, AWS, GCP, Azure. Output ONLY the translation, no quotes, no preface.",
      messages: [
        {
          role: "user",
          content: `Translate this UI label from ${source} to ${target}:\n\n${sourceText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`API ${response.status}: ${JSON.stringify(err)}`);
  }
  const data = (await response.json()) as {
    content?: Array<{ type: string; text: string }>;
  };
  const text = data.content?.[0]?.type === "text" ? data.content[0].text.trim() : "";
  if (!text) throw new Error("Respuesta vacía del traductor");
  return text;
}
