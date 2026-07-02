import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, JsonLd, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getCreativeWorkSchema } from "@/lib/schema/creative-work";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { getCasoExito, mapCasoExito, uiLabel } from "@/lib/cms";
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
  const raw = await getCasoExito("univision");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const esUrl = "https://www.nivelics.com/casos-de-exito/univision";
  const enUrl = "https://www.nivelics.com/en/case-studies/univision";
  const canonical = locale === "en" ? enUrl : esUrl;
  const ogImage = "https://www.nivelics.com/og/nivelics-home.jpg";

  const title = caso?.seoTitle || "Caso de Éxito Univision | Nivelics";
  const description =
    caso?.seoDescription ||
    "Cómo Nivelics fortaleció las capacidades digitales de Univision con talento senior bilingüe integrado.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: esUrl,
        en: enUrl,
        "x-default": esUrl,
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
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// LEGACY FALLBACK
const RESULTS = [
  { metric: "Integrado", label: "Equipo integrado exitosamente" },
  { metric: "Mejoradas", label: "Plataformas digitales mejoradas" },
  { metric: "100%", label: "Cobertura bilingüe total" },
];

export default async function UnivisionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const [raw, uiLabels] = await Promise.all([getCasoExito("univision"), getAllUiLabels()]);
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const results = caso?.metrics?.length
    ? caso.metrics.map((m) => ({ metric: m.value, label: m.label }))
    : RESULTS;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: caso?.clientName || "Univision", url: "/casos-de-exito/univision" },
  ]);

  const creativeWork = getCreativeWorkSchema([
    {
      name: caso?.clientName || "Univision",
      description:
        caso?.seoDescription ||
        "Cómo Nivelics fortaleció las capacidades digitales de Univision con talento senior bilingüe integrado.",
      url: "/casos-de-exito/univision",
    },
  ])[0];

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <JsonLd data={creativeWork} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/casos-de-exito">
              <ArrowLeft size={14} /> {uiLabel(uiLabels, "caso.back_to_list", locale)}
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <ServiceBadge variant="staffing">Staffing</ServiceBadge>
            <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
            <span className="text-sm text-text-40">
              {caso?.clientCountry || "México"} &middot; {caso?.clientSector || "Medios"}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            {caso?.title || "Univision: Desarrollo Digital para Medios Hispanos"}
          </h1>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-text-100">
                {uiLabel(uiLabels, "caso.challenge_label", locale)}
              </h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.challenge ||
                  "Univision requería capacidad de desarrollo adicional para sus plataformas digitales dirigidas al mercado hispano en USA y México."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">
                {uiLabel(uiLabels, "caso.solution_label", locale)}
              </h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.solution ||
                  "Equipo de desarrollo Nivelics integrado para fortalecer las capacidades digitales de Univision con talento senior bilingüe."}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-100">
              {uiLabel(uiLabels, "caso.results_label", locale)}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {results.map((r) => (
                <div key={r.label} className="glass rounded-xl p-6 text-center">
                  <p className="text-3xl font-mono font-bold text-primary">{r.metric}</p>
                  <p className="mt-2 text-sm text-text-70">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          {caso?.testimonialQuote && (
            <blockquote className="mt-12 glass rounded-xl p-8 border-l-4 border-primary">
              <p className="text-text-70 italic leading-relaxed">
                &ldquo;{caso.testimonialQuote}&rdquo;
              </p>
              {caso.testimonialAuthor && (
                <footer className="mt-4 text-sm text-text-40">
                  &mdash; {caso.testimonialAuthor}
                  {caso.testimonialRole && `, ${caso.testimonialRole}`}
                </footer>
              )}
            </blockquote>
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-100">
              {uiLabel(uiLabels, "caso.services_used_label", locale)}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <ServiceBadge variant="staffing">Staffing</ServiceBadge>
              <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title={uiLabel(uiLabels, "caso.cta_banner_title", locale)}
        description={uiLabel(uiLabels, "caso.cta_banner_description", locale)}
      />
    </PageWrapper>
  );
}
