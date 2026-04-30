import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
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
  const raw = await getCasoExito("two-maids");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  return {
    title: caso?.seoTitle || "Caso de Éxito Two Maids | Nivelics",
    description:
      caso?.seoDescription ||
      "Cómo Nivelics ayudó a Two Maids a escalar su equipo tech y construir una plataforma de gestión para +100 franquicias en USA.",
    alternates: {
      canonical: "https://www.nivelics.com/casos-de-exito/two-maids",
      languages: {
        es: "https://www.nivelics.com/casos-de-exito/two-maids",
        en: "https://www.nivelics.com/en/case-studies/two-maids",
        "x-default": "https://www.nivelics.com/casos-de-exito/two-maids",
      },
    },
  };
}

// LEGACY FALLBACK
const RESULTS = [
  { metric: "<10 días", label: "Equipo escalado en menos de 10 días" },
  { metric: "40%", label: "Ahorro vs contratación USA" },
  { metric: "+100", label: "Franquicias gestionadas" },
];

export default async function TwoMaidsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getCasoExito("two-maids");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;
  const uiLabels = await getAllUiLabels();

  const results = caso?.metrics?.length
    ? caso.metrics.map((m) => ({ metric: m.value, label: m.label }))
    : RESULTS;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: caso?.clientName || "Two Maids", url: "/casos-de-exito/two-maids" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

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
              {caso?.clientCountry || "USA"} &middot;{" "}
              {caso?.clientSector || "Servicios / Franquicias"}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            {caso?.title || "Two Maids: Escalamiento de Equipo Tech en USA"}
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
                  "Two Maids necesitaba escalar su equipo de desarrollo rápidamente para construir una plataforma de gestión de franquicias sin los costos de contratación directa en USA."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">
                {uiLabel(uiLabels, "caso.solution_label", locale)}
              </h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.solution ||
                  "Staff Augmentation con ingenieros senior colombianos integrados al equipo de Two Maids. Desarrollo de plataforma para +100 franquicias."}
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
