import type { Metadata } from "next";
import Link from "next/link";
import { SitemapMap } from "@/components/sections/sitemap-map";
import { getSitemapSectionsStatic } from "@/lib/seo/sitemap-sections";
import "./globals.css";

// Root not-found — único 404 que Next.js renderiza para URLs que no
// matchean ningún segmento. Desde acá no hay contexto de next-intl
// (getLocale no funciona) ni layout con <html><body>, así que ambos
// se proveen aquí. Default ES con toggle visible a EN.
//
// Mantiene SSG: usa getSitemapSectionsStatic() (sync, fallback array)
// y no llama a headers()/cookies() para no degradar a dynamic.

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

export default function RootNotFound() {
  const sections = getSitemapSectionsStatic();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Página no encontrada",
    description: "La URL solicitada no existe en nivelics.com",
    url: "https://www.nivelics.com",
    isPartOf: { "@id": "https://www.nivelics.com/#website" },
  };

  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0d1117]">
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
                className="rounded-full border px-2.5 py-1 text-[10px] font-medium"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  color: "#f87171",
                  borderColor: "rgba(239,68,68,0.20)",
                }}
              >
                Página no encontrada · Page not found
              </span>
            </span>

            <h1 className="mb-3 text-[22px] font-medium leading-snug text-text-100">
              Esta URL no existe en el sitio
            </h1>
            <p className="mb-1 text-[12px] leading-snug text-text-40">
              This URL doesn&apos;t exist on the site
            </p>

            <p className="mb-6 mt-4 max-w-[340px] text-[13px] leading-relaxed text-text-70">
              El contenido que buscas puede haber cambiado de dirección. Explora el mapa completo →
            </p>

            <div className="flex max-w-[340px] flex-col gap-2.5">
              <Link
                href="/"
                className="rounded-md bg-primary px-4 py-2.5 text-center text-[12px] font-medium text-[#0d1117] transition-colors duration-150 hover:bg-[#22d3ee]"
              >
                ← Ir al inicio
              </Link>

              <Link
                href="/contacto"
                className="rounded-md border border-white/[0.10] px-4 py-2.5 text-center text-[12px] text-text-70 transition-colors duration-150 hover:bg-white/[0.04] hover:text-text-100"
              >
                Contactar
              </Link>

              <Link
                href="/en"
                className="mt-1 text-center text-[11px] text-text-40 transition-colors hover:text-text-70"
              >
                Versión EN / English version
              </Link>
            </div>
          </aside>

          <section className="px-6 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">
            <header className="mb-6">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-40">
                Mapa completo del sitio
              </p>
            </header>

            <SitemapMap sections={sections} locale="es" />
          </section>
        </div>
      </body>
    </html>
  );
}
