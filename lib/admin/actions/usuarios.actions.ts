"use server";

import { db } from "@/lib/db";
import { adminUsers, adminActivityLog } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import { hashPassword } from "@/lib/admin/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUsuarios() {
  if (!db) return [];
  return db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      lastLogin: adminUsers.lastLogin,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt));
}

export async function createUsuario(input: {
  email: string;
  name: string;
  role: "admin" | "editor";
  password: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const passwordHash = await hashPassword(input.password);

  const [user] = await db
    .insert(adminUsers)
    .values({
      email: input.email,
      name: input.name,
      role: input.role,
      passwordHash,
      isActive: true,
      mustChangePassword: true,
    })
    .returning({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
    });

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "create",
    entityType: "admin_user",
    entityId: user.id,
    details: { email: input.email },
  });

  revalidatePath("/admin/configuracion/usuarios");
  return user;
}

export async function updateUsuario(
  id: string,
  input: {
    name?: string;
    role?: "admin" | "editor";
    isActive?: boolean;
  },
) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db
    .update(adminUsers)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "admin_user",
    entityId: id,
  });

  revalidatePath("/admin/configuracion/usuarios");
}

export async function deactivateUsuario(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  await db
    .update(adminUsers)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(adminUsers.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "deactivate",
    entityType: "admin_user",
    entityId: id,
  });

  revalidatePath("/admin/configuracion/usuarios");
}

export async function resetPassword(id: string, newPassword: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(adminUsers)
    .set({
      passwordHash,
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, id));

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "reset_password",
    entityType: "admin_user",
    entityId: id,
  });
}
