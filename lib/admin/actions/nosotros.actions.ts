"use server";

import { db } from "@/lib/db";
import {
  teamMembers,
  historiaItems,
  certificaciones,
  adminActivityLog,
} from "@/lib/db/schema/admin";
import {
  teamMemberSchema,
  type TeamMemberInput,
  historiaItemSchema,
  type HistoriaItemInput,
  certificacionSchema,
  type CertificacionInput,
} from "@/lib/admin/validations/nosotros.schema";
import { getAdminSession } from "@/lib/admin/session";
import { eq, ne, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

const EQUIPO_PATHS = ["/nosotros", "/nosotros/equipo"];
const HISTORIA_PATHS = ["/nosotros", "/nosotros/historia"];
const CERTIFICACIONES_PATHS = ["/nosotros", "/nosotros/certificaciones"];

// ─── TEAM MEMBERS ───────────────────────────────────────

// `deleteTeamMember` archiva en vez de borrar, para no perder el histórico.
// El listado del admin tiene que excluir esos archivados o el miembro
// "eliminado" reaparece al recargar.
export async function getTeamMembers() {
  if (!db) return [];
  return db
    .select()
    .from(teamMembers)
    .where(ne(teamMembers.status, "archived"))
    .orderBy(asc(teamMembers.sortOrder));
}

export async function getTeamMember(id: string) {
  if (!db) return null;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0] || null;
}

export async function createTeamMember(input: TeamMemberInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = teamMemberSchema.parse(input);

  const slug = parsed.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const [member] = await db
    .insert(teamMembers)
    .values({
      ...parsed,
      slug,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "team_member",
    entityId: member.id,
    details: { name: parsed.name },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(EQUIPO_PATHS);
  return member;
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = teamMemberSchema.partial().parse(input);

  const updateData: Record<string, unknown> = {
    ...parsed,
    updatedAt: new Date(),
  };

  if (parsed.name) {
    updateData.slug = parsed.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const [member] = await db
    .update(teamMembers)
    .set(updateData)
    .where(eq(teamMembers.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "team_member",
    entityId: id,
    details: { name: parsed.name },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(EQUIPO_PATHS);
  return member;
}

export async function deleteTeamMember(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db
    .update(teamMembers)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(teamMembers.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "team_member",
    entityId: id,
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(EQUIPO_PATHS);
}

// ─── HISTORIA ITEMS ─────────────────────────────────────

export async function getHistoriaItems() {
  if (!db) return [];
  return db.select().from(historiaItems).orderBy(asc(historiaItems.sortOrder));
}

export async function createHistoriaItem(input: HistoriaItemInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = historiaItemSchema.parse(input);

  const [item] = await db
    .insert(historiaItems)
    .values({
      ...parsed,
      month: parsed.month ?? null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "historia_item",
    entityId: item.id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(HISTORIA_PATHS);
  return item;
}

export async function updateHistoriaItem(id: string, input: Partial<HistoriaItemInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = historiaItemSchema.partial().parse(input);

  const [item] = await db
    .update(historiaItems)
    .set({
      ...parsed,
      month: parsed.month ?? undefined,
    })
    .where(eq(historiaItems.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "historia_item",
    entityId: id,
    details: { title: parsed.titleEs },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(HISTORIA_PATHS);
  return item;
}

export async function deleteHistoriaItem(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.delete(historiaItems).where(eq(historiaItems.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "historia_item",
    entityId: id,
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(HISTORIA_PATHS);
}

// ─── CERTIFICACIONES ────────────────────────────────────

export async function getCertificaciones() {
  if (!db) return [];
  return db.select().from(certificaciones).orderBy(asc(certificaciones.sortOrder));
}

export async function createCertificacion(input: CertificacionInput) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = certificacionSchema.parse(input);

  const [cert] = await db
    .insert(certificaciones)
    .values({
      ...parsed,
      year: parsed.year ?? null,
    })
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "certificacion",
    entityId: cert.id,
    details: { name: parsed.nameEs },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(CERTIFICACIONES_PATHS);
  return cert;
}

export async function updateCertificacion(id: string, input: Partial<CertificacionInput>) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const parsed = certificacionSchema.partial().parse(input);

  const [cert] = await db
    .update(certificaciones)
    .set({
      ...parsed,
      year: parsed.year ?? undefined,
    })
    .where(eq(certificaciones.id, id))
    .returning();

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "certificacion",
    entityId: id,
    details: { name: parsed.nameEs },
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(CERTIFICACIONES_PATHS);
  return cert;
}

export async function deleteCertificacion(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db.delete(certificaciones).where(eq(certificaciones.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "delete",
    entityType: "certificacion",
    entityId: id,
  });

  revalidatePath("/admin/nosotros");
  await revalidatePublicPages(CERTIFICACIONES_PATHS);
}
