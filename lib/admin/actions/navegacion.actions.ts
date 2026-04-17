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
  urlEn?: string;
  description?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  ariaLabelEs?: string;
  ariaLabelEn?: string;
  icon?: string;
  badgeEs?: string;
  badgeEn?: string;
}

export interface MegaMenuSection {
  // Top-level trigger (what appears in the header): e.g. "Servicios/Services"
  titleEs: string;
  titleEn: string;
  // Optional trigger URL (hub landing for the trigger)
  triggerUrl?: string;
  // Panel kind: 'columns' (4 services pattern), 'grid' (industries 3x2), 'products' (3 cards)
  kind?: "columns" | "grid" | "products" | "nosotros" | "simple";
  // Columns inside a mega-panel (used when kind='columns'). If empty, `items` is rendered directly.
  columns?: MegaMenuColumn[];
  // Flat items list (used for kind='grid' | 'nosotros' | 'simple').
  items: NavItem[];
  // Right-side credentials block (for kind='nosotros')
  credentials?: {
    metricValue1?: string;
    metricLabelEs1?: string;
    metricLabelEn1?: string;
    metricValue2?: string;
    metricLabelEs2?: string;
    metricLabelEn2?: string;
    awardName?: string;
    awardCaptionEs?: string;
    awardCaptionEn?: string;
    footerCaptionEs?: string;
    footerCaptionEn?: string;
    ctaTextEs?: string;
    ctaTextEn?: string;
    ctaUrl?: string;
  };
  // Footer link inside the panel ("Ver todas las industrias →")
  footerLinkEs?: string;
  footerLinkEn?: string;
  footerLinkUrl?: string;
  footerLinkColor?: string;
  // Accent color for kind='grid' panels
  accentColor?: string;
  // Header caption (kind='nosotros'): "La empresa detrás de los proyectos"
  headerCaptionEs?: string;
  headerCaptionEn?: string;
}

export interface MegaMenuColumn {
  titleEs: string;
  titleEn: string;
  url: string;
  urlEn?: string;
  icon?: string;
  color?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  metricValue?: string;
  metricLabelEs?: string;
  metricLabelEn?: string;
  items: NavItem[];
  footerLinkEs?: string;
  footerLinkEn?: string;
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
  // Brand column (left)
  brandTaglineEs?: string;
  brandTaglineEn?: string;
  // Contact column (right)
  contactColumnTitleEs?: string;
  contactColumnTitleEn?: string;
  contactEmail?: string;
  contactWhatsappLabelEs?: string;
  contactWhatsappLabelEn?: string;
  contactWhatsappUrl?: string;
  contactSupportLabelEs?: string;
  contactSupportLabelEn?: string;
  contactSupportUrl?: string;
  // Social links
  socialLinkedin?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialTwitter?: string;
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
