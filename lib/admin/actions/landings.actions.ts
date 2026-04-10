"use server";

import { db } from "@/lib/db";
import { landingPages, adminActivityLog } from "@/lib/db/schema/admin";
import { landingPageSchema, type LandingPageInput } from "@/lib/admin/validations/landing.schema";
import { BLOCK_TYPES, TEMPLATES, type BlockTypeKey } from "@/lib/admin/landing-blocks";
import { getAdminSession } from "@/lib/admin/session";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLandingPages(options?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  if (!db) return { landings: [], total: 0 };

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof eq>[] = [];

  if (options?.status && options.status !== "all") {
    conditions.push(eq(landingPages.status, options.status as "draft" | "published" | "archived"));
  }

  const whereClause = conditions.length > 0 ? conditions[0] : undefined;

  const [landings, totalResult] = await Promise.all([
    db
      .select()
      .from(landingPages)
      .where(whereClause)
      .orderBy(desc(landingPages.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(landingPages).where(whereClause),
  ]);

  return { landings, total: totalResult[0].count };
}

export async function getLandingPage(id: string) {
  if (!db) return null;

  const result = await db.select().from(landingPages).where(eq(landingPages.id, id)).limit(1);

  return result[0] || null;
}

export async function createLandingPage(input: LandingPageInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = landingPageSchema.parse(input);

  const [landing] = await db
    .insert(landingPages)
    .values({
      slug: parsed.slug,
      campaignName: parsed.campaignName,
      serviceType: parsed.serviceType ?? null,
      accentColor: parsed.accentColor ?? "dev",
      noindex: parsed.noindex ?? true,
      metaTitle: parsed.metaTitle || null,
      metaDescription: parsed.metaDescription || null,
      ogImage: parsed.ogImage || null,
      blocks: parsed.blocks || [],
      formDestination: parsed.formDestination || null,
      formWebhookUrl: parsed.formWebhookUrl || null,
      whatsappMessage: parsed.whatsappMessage || null,
      utmCampaign: parsed.utmCampaign || null,
      utmSource: parsed.utmSource || null,
      utmMedium: parsed.utmMedium || null,
      pixelFacebook: parsed.pixelFacebook ?? false,
      googleAdsTag: parsed.googleAdsTag || null,
      status: parsed.status ?? "draft",
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "landing_page",
    entityId: landing.id,
    details: { campaignName: parsed.campaignName },
  });

  revalidatePath("/admin/landing-pages");
  return landing;
}

export async function updateLandingPage(id: string, input: Partial<LandingPageInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = landingPageSchema.partial().parse(input);

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (parsed.slug !== undefined) updateData.slug = parsed.slug;
  if (parsed.campaignName !== undefined) updateData.campaignName = parsed.campaignName;
  if (parsed.serviceType !== undefined) updateData.serviceType = parsed.serviceType ?? null;
  if (parsed.accentColor !== undefined) updateData.accentColor = parsed.accentColor;
  if (parsed.noindex !== undefined) updateData.noindex = parsed.noindex;
  if (parsed.metaTitle !== undefined) updateData.metaTitle = parsed.metaTitle || null;
  if (parsed.metaDescription !== undefined)
    updateData.metaDescription = parsed.metaDescription || null;
  if (parsed.ogImage !== undefined) updateData.ogImage = parsed.ogImage || null;
  if (parsed.blocks !== undefined) updateData.blocks = parsed.blocks;
  if (parsed.formDestination !== undefined)
    updateData.formDestination = parsed.formDestination || null;
  if (parsed.formWebhookUrl !== undefined)
    updateData.formWebhookUrl = parsed.formWebhookUrl || null;
  if (parsed.whatsappMessage !== undefined)
    updateData.whatsappMessage = parsed.whatsappMessage || null;
  if (parsed.utmCampaign !== undefined) updateData.utmCampaign = parsed.utmCampaign || null;
  if (parsed.utmSource !== undefined) updateData.utmSource = parsed.utmSource || null;
  if (parsed.utmMedium !== undefined) updateData.utmMedium = parsed.utmMedium || null;
  if (parsed.pixelFacebook !== undefined) updateData.pixelFacebook = parsed.pixelFacebook;
  if (parsed.googleAdsTag !== undefined) updateData.googleAdsTag = parsed.googleAdsTag || null;
  if (parsed.status !== undefined) updateData.status = parsed.status;

  const [landing] = await db
    .update(landingPages)
    .set(updateData)
    .where(eq(landingPages.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "landing_page",
    entityId: id,
    details: { campaignName: parsed.campaignName },
  });

  revalidatePath("/admin/landing-pages");
  revalidatePath(`/admin/landing-pages/${id}`);
  return landing;
}

export async function deleteLandingPage(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.delete(landingPages).where(eq(landingPages.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "landing_page",
    entityId: id,
  });

  revalidatePath("/admin/landing-pages");
}

export async function duplicateLandingPage(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const original = await getLandingPage(id);
  if (!original) throw new Error("Landing page no encontrada");

  const [landing] = await db
    .insert(landingPages)
    .values({
      slug: `${original.slug}-copy`,
      campaignName: `${original.campaignName} (copia)`,
      serviceType: original.serviceType,
      accentColor: original.accentColor,
      noindex: original.noindex,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      ogImage: original.ogImage,
      blocks: original.blocks || [],
      formDestination: original.formDestination,
      formWebhookUrl: original.formWebhookUrl,
      whatsappMessage: original.whatsappMessage,
      utmCampaign: original.utmCampaign,
      utmSource: original.utmSource,
      utmMedium: original.utmMedium,
      pixelFacebook: original.pixelFacebook,
      googleAdsTag: original.googleAdsTag,
      status: "draft",
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "duplicate",
    entityType: "landing_page",
    entityId: landing.id,
    details: { originalId: id, campaignName: landing.campaignName },
  });

  revalidatePath("/admin/landing-pages");
  return landing;
}

export async function createFromTemplate(template: "A" | "B" | "C" | "D" | "E") {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const blockTypes = TEMPLATES[template];
  if (!blockTypes) throw new Error("Template invalido");

  const blocks = blockTypes.map((type, index) => ({
    type,
    order: index,
    data: { ...BLOCK_TYPES[type as BlockTypeKey].defaultData } as Record<string, unknown>,
  }));

  const timestamp = Date.now();
  const [landing] = await db
    .insert(landingPages)
    .values({
      slug: `landing-${template.toLowerCase()}-${timestamp}`,
      campaignName: `Landing Template ${template}`,
      blocks,
      status: "draft",
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "landing_page",
    entityId: landing.id,
    details: { template, campaignName: landing.campaignName },
  });

  revalidatePath("/admin/landing-pages");
  return landing;
}
