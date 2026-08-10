import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import type { Locale } from "@/lib/cms";
import { JsonLd } from "@/components/shared/json-ld";
import { getLocalBusinessSchema } from "@/lib/schema/local-business";
import { ContactPageClient } from "./contact-page-client";

export const revalidate = 86400;

const CONTACTO_ES = "https://www.nivelics.com/contacto";
const CONTACTO_EN = "https://www.nivelics.com/en/contact";
const DEFAULT_OG_IMAGE = "https://www.nivelics.com/og/nivelics-home.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  // Canonical points to the current locale's URL (not always ES) so Google
  // treats `/contacto?from=cloud/finops` and `/contacto` as the same page
  // without collapsing EN and ES into a single entry.
  const canonical = locale === "en" ? CONTACTO_EN : CONTACTO_ES;

  const title = page?.seoTitle || "Contacto | Nivelics";
  const description =
    page?.seoDescription ||
    "Cuéntanos sobre tu proyecto o desafío tecnológico y te contactamos en menos de 24 horas.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: CONTACTO_ES,
        en: CONTACTO_EN,
        "x-default": CONTACTO_ES,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CO",
      alternateLocale: locale === "en" ? ["es_CO"] : ["en_US"],
      siteName: "Nivelics",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;
  const config = await getSiteConfigPublic().catch(() => null);

  return (
    <>
      <JsonLd data={getLocalBusinessSchema(locale)} />
      <Suspense fallback={null}>
        <ContactPageClient
          seoTitle={page?.seoTitle || undefined}
          seoDescription={page?.seoDescription || undefined}
          pageTitle={page?.title || undefined}
          pageSubtitle={undefined}
          phoneWhatsapp={config?.phoneWhatsapp}
        />
      </Suspense>
    </>
  );
}
