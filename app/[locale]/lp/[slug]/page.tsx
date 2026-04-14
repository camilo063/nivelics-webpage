import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema/admin";
import { eq, and, ne } from "drizzle-orm";
import { BlocksRenderer, type LandingBlock } from "@/components/lp/BlockRenderer";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

export const revalidate = 300;

const ACCENT_COLORS: Record<string, string> = {
  ia: "#8B5CF6",
  cloud: "#1E40AF",
  staffing: "#00E5A0",
  finops: "#F59E0B",
  dev: "#00D4FF",
};

const SERVICE_LABELS: Record<string, string> = {
  ia: "IA Aplicada",
  cloud: "Cloud / FinOps",
  staffing: "Staff Augmentation",
  finops: "Cloud / FinOps",
  dev: "Desarrollo Digital",
};

async function getLanding(slug: string) {
  if (!db) return null;
  const result = await db
    .select()
    .from(landingPages)
    .where(and(eq(landingPages.slug, slug), ne(landingPages.status, "archived")))
    .limit(1);
  return result[0] || null;
}

export async function generateStaticParams() {
  if (!db) return [];
  try {
    const landings = await db
      .select({ slug: landingPages.slug })
      .from(landingPages)
      .where(eq(landingPages.status, "published"));
    return landings.map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = await getLanding(slug);
  if (!landing) return {};

  return {
    title: landing.metaTitle || `${landing.campaignName} | Nivelics`,
    description: landing.metaDescription || undefined,
    robots: landing.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: landing.metaTitle || landing.campaignName,
      description: landing.metaDescription || undefined,
      images: landing.ogImage ? [{ url: landing.ogImage }] : undefined,
    },
    alternates: landing.noindex
      ? undefined
      : { canonical: `https://nivelics.com/lp/${landing.slug}` },
  };
}

export default async function LandingPageDynamic({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const landing = await getLanding(slug);

  if (!landing || landing.status === "draft" || landing.status === "archived") {
    notFound();
  }

  const accentKey = (landing.accentColor as string) || "dev";
  const accentColor = ACCENT_COLORS[accentKey] || "#00D4FF";
  const defaultServicio = SERVICE_LABELS[(landing.serviceType as string) || accentKey];
  const blocks = (landing.blocks as LandingBlock[]) || [];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nivelics",
    url: "https://nivelics.com",
    foundingDate: "2012",
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: landing.metaTitle || landing.campaignName,
    description: landing.metaDescription,
    url: `https://nivelics.com/lp/${landing.slug}`,
    mainEntity: {
      "@type": "ContactPage",
      url: `https://nivelics.com/lp/${landing.slug}#formulario`,
    },
  };

  // Resolve WhatsApp message from B18 block (if any)
  const footerBlock = blocks.find((b) => b.type === "B18");
  const waMessage =
    (footerBlock?.data?.whatsapp_mensaje as string) ||
    `Hola, quiero información sobre ${landing.campaignName}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <BlocksRenderer
        blocks={blocks}
        accentColor={accentColor}
        fuente={landing.slug}
        defaultServicio={defaultServicio}
      />

      <LpWhatsApp message={waMessage} />
    </>
  );
}
