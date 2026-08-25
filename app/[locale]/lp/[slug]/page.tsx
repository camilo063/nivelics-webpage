import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema/admin";
import { eq, and, ne } from "drizzle-orm";
import { BlocksRenderer, type LandingBlock } from "@/components/lp/BlockRenderer";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";
import { DEFAULT_OG_IMAGE, mirroredUrls } from "@/lib/seo/page-meta";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

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
  const { slug, locale: __locale } = await params;
  setRequestLocale(__locale);
  const landing = await getLanding(slug);
  if (!landing) return {};

  const isEn = __locale === "en";
  const urls = mirroredUrls(`/lp/${landing.slug}`);
  const canonical = isEn ? urls.en : urls.es;
  const title = landing.metaTitle || landing.campaignName;
  const description = landing.metaDescription || undefined;
  const ogImage = landing.ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    robots: landing.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: isEn ? "en_US" : "es_CO",
      alternateLocale: isEn ? ["es_CO"] : ["en_US"],
      siteName: "Nivelics",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: landing.noindex
      ? undefined
      : { canonical, languages: { es: urls.es, en: urls.en, "x-default": urls.es } },
  };
}

export default async function LandingPageDynamic({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: __locale } = await params;
  setRequestLocale(__locale);
  const [landing, siteConfig] = await Promise.all([getLanding(slug), getSiteConfigPublic()]);

  if (!landing || landing.status === "draft" || landing.status === "archived") {
    notFound();
  }

  const lpLocale: "es" | "en" = __locale === "en" ? "en" : "es";
  const whatsappPhone = siteConfig?.phoneWhatsapp ?? null;

  const accentKey = (landing.accentColor as string) || "dev";
  const accentColor = ACCENT_COLORS[accentKey] || "#00D4FF";
  const defaultServicio = SERVICE_LABELS[(landing.serviceType as string) || accentKey];
  const blocks = (landing.blocks as LandingBlock[]) || [];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nivelics",
    url: "https://www.nivelics.com",
    foundingDate: "2012",
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: landing.metaTitle || landing.campaignName,
    description: landing.metaDescription,
    url: `https://www.nivelics.com/lp/${landing.slug}`,
    mainEntity: {
      "@type": "ContactPage",
      url: `https://www.nivelics.com/lp/${landing.slug}#formulario`,
    },
  };

  // Resolve WhatsApp message: admin column → B18 block → default.
  const footerBlock = blocks.find((b) => b.type === "B18");
  const waMessage =
    landing.whatsappMessage ||
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
        locale={lpLocale}
        whatsappPhone={whatsappPhone}
      />

      <LpWhatsApp message={waMessage} phone={whatsappPhone} />
    </>
  );
}
