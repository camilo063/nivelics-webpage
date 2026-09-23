"use server";

import { db } from "@/lib/db";
import { siteConfig, adminActivityLog } from "@/lib/db/schema/admin";
import { getAdminSession } from "@/lib/admin/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { revalidatePublicPages } from "@/lib/admin/revalidate-public";

export async function getSiteConfig() {
  if (!db) return null;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);
  return result[0] || null;
}

export async function updateSiteConfig(input: {
  siteNameEs?: string;
  siteNameEn?: string;
  taglineEs?: string;
  taglineEn?: string;
  logoUrl?: string;
  logoWidth?: number | null;
  logoHeight?: number | null;
  logoAltEs?: string;
  logoAltEn?: string;
  logoTitleEs?: string;
  logoTitleEn?: string;
  faviconUrl?: string;
  defaultOgImage?: string;
  phoneWhatsapp?: string;
  emailContact?: string;
  addressBogota?: string;
  addressMiami?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  if (!db) throw new Error("Base de datos no configurada");

  const existing = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);

  const data = {
    ...input,
    updatedAt: new Date(),
  };

  if (existing.length === 0) {
    await db.insert(siteConfig).values({ id: "main", ...data });
  } else {
    await db.update(siteConfig).set(data).where(eq(siteConfig.id, "main"));
  }

  await db.insert(adminActivityLog).values({
    userId: session.sub,
    action: "update",
    entityType: "site_config",
    entityId: "main",
  });

  revalidatePath("/admin/configuracion");
  // Revalidate public files served from this config
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/robots.txt");
  // Las páginas que imprimen el correo / WhatsApp / redes en el cuerpo o en el
  // JSON-LD tienen `revalidate = 86400`: sin esto, cambiar un dato de contacto
  // en el admin tardaría hasta un día en verse. `revalidatePublicPages` traduce
  // cada ruta a sus dos idiomas (/contacto y /en/contact), refresca el layout
  // raíz —de donde salen el pie y el nav— y avisa a IndexNow.
  // (El import ya estaba en el archivo pero nunca se llamaba.)
  await revalidatePublicPages(["/", "/contacto", "/soporte", "/privacidad", "/nosotros"]);
}
