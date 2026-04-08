import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Nav, Footer } from "@/components/layout";
import { WhatsAppFAB } from "@/components/shared";
import { TranslationBanner } from "@/components/shared/translation-banner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nivelics.com"),
  title: {
    default: "Nivelics | IA · Cloud · Staffing Premium LATAM y USA",
    template: "%s | Nivelics",
  },
  description:
    "Transformación digital para empresas en LATAM y USA. IA aplicada, Cloud (AWS/GCP), FinOps y Staff Augmentation premium. Bogotá + Miami. 13 años de proyectos entregados.",
  authors: [{ name: "Nivelics SAS", url: "https://www.nivelics.com" }],
  creator: "Nivelics SAS",
  openGraph: {
    type: "website",
    url: "https://www.nivelics.com",
    siteName: "Nivelics",
    title: "Nivelics | IA · Cloud · Staffing Premium",
    description:
      "La única empresa en LATAM que integra IA aplicada, Cloud con gobierno real y Staffing premium en un solo aliado.",
    images: [
      {
        url: "/og/nivelics-home.jpg",
        width: 1200,
        height: 630,
        alt: "Nivelics — Transformación digital B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nivelics",
    title: "Nivelics | IA · Cloud · Staffing Premium",
    images: ["/og/nivelics-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav />
      <TranslationBanner />
      {children}
      <Footer />
      <WhatsAppFAB />
    </NextIntlClientProvider>
  );
}
