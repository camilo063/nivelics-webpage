import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { SitemapMap } from "@/components/sections/sitemap-map";
import { getSitemapSectionsStatic } from "@/lib/seo/sitemap-sections";
import type { Locale } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | Nivelics" },
  description:
    "La URL que buscas no existe en nivelics.com. Explora el mapa del sitio para encontrar lo que necesitas.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Página no encontrada | Nivelics",
    description: "Esta URL no existe en nivelics.com",
    siteName: "Nivelics",
  },
};

export default async function MarketingNotFound() {
  const locale = ((await getLocale()) as Locale) ?? "es";
  const en = locale === "en";
  const sections = getSitemapSectionsStatic();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: en ? "Page not found" : "Página no encontrada",
    description: en
      ? "The requested URL does not exist on nivelics.com"
      : "La URL solicitada no existe en nivelics.com",
    url: "https://www.nivelics.com",
    isPartOf: { "@id": "https://www.nivelics.com/#website" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="notfound-grid">
        <aside className="flex flex-col justify-center border-b border-white/[0.05] px-6 py-10 md:border-b-0 md:border-r md:px-10 md:py-14 lg:px-12 lg:py-16">
          <div
            className="mb-4 select-none text-[80px] font-semibold leading-none"
            style={{ color: "rgba(255,255,255,0.04)" }}
            aria-hidden="true"
          >
            404
          </div>

          <span className="mb-4 inline-flex w-fit items-center gap-1.5">
            <span
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
              style={{
                background: "rgba(239,68,68,0.10)",
                color: "#f87171",
                borderColor: "rgba(239,68,68,0.20)",
              }}
            >
              {en ? "Page not found" : "Página no encontrada"}
            </span>
          </span>

          <h1 className="mb-3 text-2xl font-medium leading-snug text-text-100">
            {en ? "404: This URL doesn't exist on the site" : "404: Esta URL no existe en el sitio"}
          </h1>

          <p className="mb-6 max-w-[340px] text-sm leading-relaxed text-text-70">
            {en
              ? "The content you're looking for may have moved. Explore the full site map →"
              : "El contenido que buscas puede haber cambiado de dirección. Explora el mapa completo →"}
          </p>

          <div className="flex max-w-[340px] flex-col gap-2.5">
            <Link
              href={en ? "/en" : "/"}
              className="rounded-md bg-primary px-4 py-2.5 text-center text-xs font-medium text-[#0d1117] transition-colors duration-150 hover:bg-[#22d3ee]"
            >
              ← {en ? "Go to home" : "Ir al inicio"}
            </Link>

            <Link
              href={en ? "/en/contact" : "/contacto"}
              className="rounded-md border border-white/[0.10] px-4 py-2.5 text-center text-xs text-text-70 transition-colors duration-150 hover:bg-white/[0.04] hover:text-text-100"
            >
              {en ? "Contact" : "Contactar"}
            </Link>

            <Link
              href={en ? "/" : "/en"}
              className="mt-1 text-center text-[11px] text-text-40 transition-colors hover:text-text-70"
            >
              {en ? "Versión ES / Spanish version" : "Versión EN / English version"}
            </Link>
          </div>
        </aside>

        <section className="px-6 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">
          <header className="mb-6">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-40">
              {en ? "Full site map" : "Mapa completo del sitio"}
            </p>
          </header>

          <SitemapMap sections={sections} locale={locale === "en" ? "en" : "es"} />
        </section>
      </div>
    </>
  );
}
