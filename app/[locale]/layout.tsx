import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { AnalyticsScripts, AnalyticsNoscript } from "@/components/layout/analytics-scripts";

// Variable font: un solo woff2 cubre todo el eje 100–900 (Fase 1 §1.7 / Fase 2 C)
// — antes se cargaban 6 pesos estáticos (~50KB extra).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const revalidate = 86400;

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
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Blog de Nivelics — RSS" }],
    },
  },
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
  verification: {
    google: "eZ9CgeaQbtb0Mqow3UdFQV8OcaRC_zcD238HdQ7nRiE",
  },
  other: {
    llms: "/llms.txt",
    "llms-full": "/llms-full.txt",
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
  const config = await getSiteConfigPublic().catch(() => null);
  const gaId = config?.googleAnalyticsId ?? null;
  const gtmId = config?.googleTagManagerId ?? null;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Pre-warm the jsdelivr connection before the América map fetches its GeoJSON. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <AnalyticsScripts gaId={gaId} gtmId={gtmId} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AnalyticsNoscript gtmId={gtmId} />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
