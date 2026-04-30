import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { HeroEffect } from "@/components/ui/hero-effect";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getAllProductosHub, mapProductoCard, accentHex } from "@/lib/cms/productos";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  return {
    title: isEn
      ? "Nivelics SaaS Products | PAYWL, Niveleads, Hirely"
      : "Productos SaaS propios | Nivelics",
    description: isEn
      ? "PAYWL, Niveleads and Hirely: three SaaS products built by Nivelics to solve real LATAM problems."
      : "PAYWL, Niveleads e Hirely: tres productos SaaS construidos por Nivelics para resolver problemas reales en LATAM.",
    alternates: {
      canonical: "https://www.nivelics.com/productos",
      languages: {
        es: "https://www.nivelics.com/productos",
        en: "https://www.nivelics.com/en/products",
        "x-default": "https://www.nivelics.com/productos",
      },
    },
  };
}

export default async function ProductosHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const all = await getAllProductosHub();
  const products = all.map((p) => mapProductoCard(p, locale));

  const baseUrl = "https://www.nivelics.com";
  const hubUrl = isEn ? `${baseUrl}/en/products` : `${baseUrl}/productos`;

  const pricingMap: Record<string, { price: string; category: string }> = {
    PAYWL: { price: "450", category: "BusinessApplication" },
    Niveleads: { price: "99", category: "BusinessApplication" },
    Hirely: { price: "0", category: "WebApplication" },
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isEn ? "Nivelics SaaS Products" : "Productos SaaS propios de Nivelics",
    url: hubUrl,
    description: isEn
      ? "PAYWL, Niveleads and Hirely: three SaaS products built by Nivelics."
      : "PAYWL, Niveleads e Hirely: tres productos SaaS construidos por Nivelics.",
    author: { "@id": `${baseUrl}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => {
        const pm = pricingMap[p.name] ?? { price: "0", category: "WebApplication" };
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            url: `${hubUrl}/${p.slug}`,
            applicationCategory: pm.category,
            offers: {
              "@type": "Offer",
              price: pm.price,
              priceCurrency: "USD",
            },
          },
        };
      }),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Inicio",
        item: isEn ? `${baseUrl}/en` : baseUrl,
      },
      { "@type": "ListItem", position: 2, name: isEn ? "Products" : "Productos", item: hubUrl },
    ],
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0d1117" }}
        data-section="productos-hero"
      >
        <HeroEffect kind="diagonal" opacity={0.45} />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20 md:px-20 md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {isEn
              ? "Built by Nivelics · Proprietary software"
              : "Built by Nivelics · Software propio"}
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-[52px] leading-tight max-w-3xl">
            {isEn ? "Three products. One same principle." : "Tres productos. Un mismo principio."}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/60">
            {isEn
              ? "We built them because we needed them first. Battle-tested in production. Available for you."
              : "Construimos software porque lo necesitábamos primero. Probado en producción. Disponible para ti."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {products.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium"
                style={{
                  borderColor: `${accentHex(p.accentColor)}40`,
                  background: `${accentHex(p.accentColor)}10`,
                  color: accentHex(p.accentColor),
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: accentHex(p.accentColor) }}
                />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 md:py-24" data-section="productos-grid">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const accent = accentHex(p.accentColor);
              return (
                <article
                  key={p.id}
                  className="flex flex-col rounded-xl p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderTop: `2px solid ${accent}`,
                  }}
                >
                  <span
                    className="mb-4 self-start rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}
                  >
                    {p.category}
                  </span>

                  <h2 className="text-xl font-bold text-white">{p.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{p.tagline}</p>

                  {p.pricingLabel && (
                    <div className="mt-4 text-sm font-semibold" style={{ color: accent }}>
                      {p.pricingLabel}
                    </div>
                  )}
                  {p.pricingNote && (
                    <div className="mt-1 text-xs text-white/40">{p.pricingNote}</div>
                  )}

                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href={`/productos/${p.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                      style={{ background: accent, color: "#000" }}
                    >
                      {isEn ? `Explore ${p.name}` : `Ver ${p.name}`}
                      <ArrowRight size={14} />
                    </Link>
                    <a
                      href={p.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
                    >
                      {isEn ? "Official site" : "Sitio oficial"}
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section
        className="border-y border-white/[0.06] py-10"
        style={{ background: "rgba(255,255,255,0.015)" }}
        data-section="productos-proof"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-white/50 mt-1">
                {isEn ? "Products · 100% owned" : "Productos · 100% propios"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">LATAM first</div>
              <div className="text-xs text-white/50 mt-1">
                {isEn ? "AWS Infrastructure" : "Infraestructura AWS"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {isEn ? "In active use" : "En uso activo"}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {isEn ? "By our team" : "Por nuestro equipo"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
