import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import type { Locale } from "@/lib/cms";
import { ContactPageClient } from "./contact-page-client";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return {
    title: page?.seoTitle || "Contacto | Nivelics",
    description:
      page?.seoDescription ||
      "Cuéntanos sobre tu proyecto o desafío tecnológico y te contactamos en menos de 24 horas.",
    alternates: {
      canonical: "https://www.nivelics.com/contacto",
      languages: {
        es: "https://www.nivelics.com/contacto",
        en: "https://www.nivelics.com/en/contact",
        "x-default": "https://www.nivelics.com/contacto",
      },
    },
  };
}

export default async function ContactoPage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return (
    <ContactPageClient
      seoTitle={page?.seoTitle || undefined}
      seoDescription={page?.seoDescription || undefined}
      pageTitle={page?.title || undefined}
      pageSubtitle={undefined}
    />
  );
}
