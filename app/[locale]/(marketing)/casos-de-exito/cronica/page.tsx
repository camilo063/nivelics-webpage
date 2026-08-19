import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, JsonLd, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getCreativeWorkSchema } from "@/lib/schema/creative-work";
import { getReviewSchema } from "@/lib/schema/review";
import { getLocale, setRequestLocale } from "next-intl/server";
import { localizedUrls } from "@/lib/seo/page-meta";
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
  const raw = await getCasoExito("cronica");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const { es: esUrl, en: enUrl } = localizedUrls("/casos-de-exito/cronica");
  const canonical = locale === "en" ? enUrl : esUrl;
  const ogImage = "https://www.nivelics.com/og/nivelics-home.jpg";

  const title = caso?.seoTitle || "Caso de Éxito Crónica Argentina";
  const description =
    caso?.seoDescription ||
    "Cómo Nivelics modernizó la plataforma digital de Crónica con arquitectura moderna y personalización con IA.";

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
  { metric: "Alto tráfico", label: "Portal de alto tráfico modernizado" },
  { metric: "IA", label: "Personalización con IA implementada" },
  { metric: "50%", label: "Procesos editoriales más eficientes" },
];

export default async function CronicaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const [raw, uiLabels] = await Promise.all([getCasoExito("cronica"), getAllUiLabels()]);
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const results = caso?.metrics?.length
    ? caso.metrics.map((m) => ({ metric: m.value, label: m.label }))
    : RESULTS;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: caso?.clientName || "Crónica", url: "/casos-de-exito/cronica" },
  ]);

  const creativeWork = getCreativeWorkSchema([
    {
      name: caso?.clientName || "Crónica",
      description:
        caso?.seoDescription ||
        "Cómo Nivelics modernizó la plataforma digital de Crónica con arquitectura moderna y personalización con IA.",
      url: "/casos-de-exito/cronica",
    },
  ])[0];

  const review =
    caso?.testimonialQuote && caso.testimonialAuthor
      ? getReviewSchema({
          quote: caso.testimonialQuote,
          author: caso.testimonialAuthor,
          role: caso.testimonialRole,
          aboutName: caso.clientName || "Crónica",
          aboutUrl: "/casos-de-exito/cronica",
          locale,
        })
      : null;

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <JsonLd data={creativeWork} />
      {review && <JsonLd data={review} />}

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/casos-de-exito">
              <ArrowLeft size={14} /> {uiLabel(uiLabels, "caso.back_to_list", locale)}
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
            <ServiceBadge variant="ia">IA</ServiceBadge>
            <span className="text-sm text-text-40">
              {caso?.clientCountry || "Argentina"} &middot; {caso?.clientSector || "Medios"}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            {caso?.title || "Crónica: Modernización de Plataforma de Noticias"}
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
                  "Crónica, uno de los medios más reconocidos de Argentina, necesitaba modernizar su plataforma digital para competir en la era del contenido personalizado."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">
                {uiLabel(uiLabels, "caso.solution_label", locale)}
              </h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.solution ||
                  "Rediseño completo del portal de noticias con arquitectura moderna, personalización de contenido con IA y optimización de procesos editoriales."}
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
              <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
              <ServiceBadge variant="ia">IA</ServiceBadge>
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
