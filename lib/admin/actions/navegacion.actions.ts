"use server";

import { db } from "@/lib/db";
import { navConfig, adminActivityLog } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export interface NavItem {
  labelEs: string;
  labelEn: string;
  url: string;
  description?: string;
  icon?: string;
}

export interface MegaMenuSection {
  titleEs: string;
  titleEn: string;
  items: NavItem[];
}

export interface FooterColumn {
  titleEs: string;
  titleEn: string;
  links: NavItem[];
}

export interface FooterData {
  columns: FooterColumn[];
  copyrightEs: string;
  copyrightEn: string;
  legalLinks: NavItem[];
}

export async function getNavConfig() {
  if (!db)
    return {
      megaMenu: [] as MegaMenuSection[],
      footer: { columns: [], copyrightEs: "", copyrightEn: "", legalLinks: [] } as FooterData,
    };

  const result = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);

  if (result.length === 0) {
    return {
      megaMenu: [] as MegaMenuSection[],
      footer: { columns: [], copyrightEs: "", copyrightEn: "", legalLinks: [] } as FooterData,
    };
  }

  return {
    megaMenu: (result[0].megaMenu as MegaMenuSection[]) || [],
    footer: (result[0].footer as FooterData) || {
      columns: [],
      copyrightEs: "",
      copyrightEn: "",
      legalLinks: [],
    },
  };
}

export async function updateMegaMenu(megaMenu: MegaMenuSection[]) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);

  if (existing.length === 0) {
    await db.insert(navConfig).values({ id: "main", megaMenu, updatedAt: new Date() });
  } else {
    await db
      .update(navConfig)
      .set({ megaMenu, updatedAt: new Date() })
      .where(eq(navConfig.id, "main"));
  }

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "mega_menu",
    entityId: "main",
  });

  revalidatePath("/admin/navegacion");
  // Nav appears on every page — revalidate everything
  await revalidatePublicPages(["/"]);
}

export async function updateFooter(footer: FooterData) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);

  if (existing.length === 0) {
    await db.insert(navConfig).values({ id: "main", footer, updatedAt: new Date() });
  } else {
    await db
      .update(navConfig)
      .set({ footer, updatedAt: new Date() })
      .where(eq(navConfig.id, "main"));
  }

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "footer",
    entityId: "main",
  });

  revalidatePath("/admin/navegacion");
  // Nav appears on every page — revalidate everything
  await revalidatePublicPages(["/"]);
}
