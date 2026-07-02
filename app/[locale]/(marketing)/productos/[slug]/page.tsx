import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { HeroEffect } from "@/components/ui/hero-effect";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { GeoIconBox, type IconColor } from "@/lib/icons/geometric";
import { JsonLd } from "@/components/shared/json-ld";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getAllProductos, getProductoBySlug, mapProducto, accentHex } from "@/lib/cms/productos";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateStaticParams() {
  const all = await getAllProductos();
  return all.map((p) => ({ slug: p.slugEs }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getProductoBySlug(slug, locale);
  if (!raw) return {};
  const p = mapProducto(raw, locale);

  const isEn = locale === "en";
  const baseUrl = "https://www.nivelics.com";
  const esPath = `/productos/${raw.slugEs}`;
  const enPath = `/en/products/${raw.slugEn}`;
  const canonical = isEn ? `${baseUrl}${enPath}` : `${baseUrl}${esPath}`;

  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: {
      canonical,
      languages: {
        es: `${baseUrl}${esPath}`,
        en: `${baseUrl}${enPath}`,
        "x-default": `${baseUrl}${esPath}`,
      },
    },
    openGraph: {
      title: p.seoTitle,
      description: p.seoDescription,
      url: canonical,
      images: p.ogImage ? [{ url: p.ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: p.seoTitle,
      description: p.seoDescription,
      images: p.ogImage ? [p.ogImage] : [],
    },
  };
}

const ACCENT_TO_ICON: Record<string, IconColor> = {
  cyan: "cyan",
  teal: "green",
  violet: "violet",
};

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const [raw, all] = await Promise.all([getProductoBySlug(slug, locale), getAllProductos()]);
  if (!raw) notFound();
  const p = mapProducto(raw, locale);

  // Cross-sell
  const others = all.filter((x) => x.id !== raw.id).map((x) => mapProducto(x, locale));

  const accent = accentHex(p.accentColor);
  const iconColor = ACCENT_TO_ICON[p.accentColor] ?? "cyan";
  const baseUrl = "https://www.nivelics.com";
  const canonical = isEn ? `${baseUrl}/en/products/${p.slug}` : `${baseUrl}/productos/${p.slug}`;
  const hubUrl = isEn ? `${baseUrl}/en/products` : `${baseUrl}/productos`;
  const homeUrl = isEn ? `${baseUrl}/en` : baseUrl;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: p.schemaCategory,
    operatingSystem: "Web",
    url: canonical,
    description: p.description,
    offers: {
      "@type": "Offer",
      price: p.pricingFrom?.toString() ?? "0",
      priceCurrency: p.pricingCurrency,
      availability: "https://schema.org/InStock",
    },
    author: { "@id": `${baseUrl}/#organization` },
    availableLanguage: ["es", "en"],
    sameAs: p.externalUrl,
  };

  // Product schema (complements the SoftwareApplication above — both are emitted).
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    url: canonical,
    ...(p.ogImage ? { image: p.ogImage } : {}),
    brand: { "@type": "Brand", name: "Nivelics" },
    manufacturer: { "@id": `${baseUrl}/#organization` },
    offers: {
      "@type": "Offer",
      ...(p.pricingFrom != null
        ? { price: p.pricingFrom.toString(), priceCurrency: p.pricingCurrency }
        : {}),
      availability: "https://schema.org/InStock",
      url: canonical,
    },
    sameAs: p.externalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEn ? "Home" : "Inicio", item: homeUrl },
      { "@type": "ListItem", position: 2, name: isEn ? "Products" : "Productos", item: hubUrl },
      { "@type": "ListItem", position: 3, name: p.name, item: canonical },
    ],
  };

  const faqSchema =
    p.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <JsonLd data={productSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0d1117" }}
        data-section="producto-hero"
      >
        <HeroEffect kind={(p.heroEffect as never) ?? "particles"} opacity={0.4} />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-16 md:px-20 md:py-24">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-sm text-text-70 hover:text-white mb-6"
          >
            <ArrowLeft size={14} /> {isEn ? "Back to Products" : "Volver a Productos"}
          </Link>

          <span
            className="mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}
          >
            {p.category}
          </span>

          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-[52px] leading-tight">
            {p.name}
            <span className="block text-text-70 font-medium text-2xl md:text-3xl mt-3">
              {p.tagline}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-text-70 leading-relaxed">{p.description}</p>

          <div className="mt-4 text-sm text-text-40">
            <span className="font-semibold text-text-70">ICP:</span> {p.icp}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: accent, color: "#000" }}
            >
              {p.externalCta}
              <ExternalLink size={14} />
            </a>
            {p.faqs.length > 0 ? (
              <Link
                href="#faqs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
              >
                {isEn ? "See FAQs" : "Ver preguntas frecuentes"}
              </Link>
            ) : (
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
              >
                {isEn ? "Contact us" : "Contactar"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* METRICS */}
      {p.metrics.length > 0 && (
        <section className="border-y border-white/[0.06] py-10" data-section="producto-metrics">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              {p.metrics.map((m, i) => (
                <div key={i}>
                  <div
                    className="text-3xl font-bold tabular-nums md:text-4xl"
                    style={{ color: accent }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1 text-xs text-text-55 md:text-sm">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {p.features.length > 0 && (
        <section className="py-16 md:py-24" data-section="producto-features">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-2xl font-bold text-text-100 md:text-3xl mb-10">
              {isEn ? "Capabilities" : "Capacidades"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {p.features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: `2px solid ${accent}`,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <GeoIconBox name={f.icon} size={18} color={iconColor} />
                    <h3 className="text-base font-semibold text-white leading-tight mt-1">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-text-55">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMPARISON TABLE */}
      {p.comparisonTable && p.comparisonTable.rows.length > 0 && (
        <section
          id="comparativa"
          className="bg-bg-surface py-16 md:py-24"
          data-section="producto-comparativa"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-2xl font-bold text-text-100 md:text-3xl mb-8">
              {isEn ? "How it compares" : "Cómo se compara"}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr>
                    {p.comparisonTable.headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          background: i === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                          color: "var(--text-55)",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.comparisonTable.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        background: row.isNivelicsProduct
                          ? `${accent}0A`
                          : ri % 2 === 0
                            ? "rgba(255,255,255,0.015)"
                            : "transparent",
                        borderLeft: row.isNivelicsProduct ? `2px solid ${accent}` : undefined,
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm"
                        style={{
                          color: row.isNivelicsProduct ? "#fff" : "rgba(255,255,255,0.7)",
                          fontWeight: row.isNivelicsProduct ? 600 : 500,
                          borderBottom: ".5px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {row.isNivelicsProduct && (
                          <span style={{ color: accent, marginRight: 6 }}>★</span>
                        )}
                        {row.feature}
                      </td>
                      {row.values.map((v, vi) => (
                        <td
                          key={vi}
                          className="px-4 py-3 text-sm"
                          style={{
                            color: row.isNivelicsProduct
                              ? "rgba(255,255,255,0.92)"
                              : "rgba(255,255,255,0.55)",
                            borderBottom: ".5px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {p.faqs.length > 0 && (
        <div id="faqs" data-section="producto-faqs">
          <FAQAccordion
            title={isEn ? "Frequently asked questions" : "Preguntas frecuentes"}
            faqs={p.faqs}
            schemaEnabled={false}
          />
        </div>
      )}

      {/* FINAL CTA */}
      <section
        className="relative overflow-hidden text-center"
        style={{ background: "#0d1117" }}
        data-section="producto-cta"
      >
        <HeroEffect kind="particles" opacity={0.3} />
        <div className="relative z-10 mx-auto max-w-[900px] px-6 py-20 md:py-24">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {isEn ? `Ready to start with ${p.name}?` : `¿Listo para empezar con ${p.name}?`}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: accent, color: "#000" }}
            >
              {p.externalCta}
              <ExternalLink size={14} />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
            >
              {isEn ? "Contact us" : "Contactar"}
            </Link>
          </div>
        </div>
      </section>

      {/* CROSS-SELL */}
      {others.length > 0 && (
        <section className="py-16 md:py-20" data-section="producto-cross">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-xl font-bold text-text-100 mb-6">
              {isEn ? "Other products you might like" : "Otros productos que quizás te interesen"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {others.map((o) => {
                const a = accentHex(o.accentColor);
                return (
                  <Link
                    key={o.id}
                    href={`/productos/${o.slug}`}
                    className="rounded-xl p-5 transition-transform hover:-translate-y-1 block"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderTop: `2px solid ${a}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs uppercase font-semibold tracking-wider"
                        style={{ color: a }}
                      >
                        {o.category}
                      </span>
                      <ArrowRight size={14} className="text-text-40" />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">{o.name}</h3>
                    <p className="mt-1 text-sm text-text-55">{o.tagline}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
