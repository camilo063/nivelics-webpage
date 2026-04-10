import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getCasoExito, mapCasoExito } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const raw = await getCasoExito("cronica");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  return {
    title: caso?.seoTitle || "Caso de Éxito Crónica Argentina | Nivelics",
    description:
      caso?.seoDescription ||
      "Cómo Nivelics modernizó la plataforma digital de Crónica con arquitectura moderna y personalización con IA.",
    alternates: {
      canonical: "https://www.nivelics.com/casos-de-exito/cronica",
      languages: {
        es: "https://www.nivelics.com/casos-de-exito/cronica",
        en: "https://www.nivelics.com/en/case-studies/cronica",
        "x-default": "https://www.nivelics.com/casos-de-exito/cronica",
      },
    },
  };
}

// LEGACY FALLBACK
const RESULTS = [
  { metric: "Alto tráfico", label: "Portal de alto tráfico modernizado" },
  { metric: "IA", label: "Personalización con IA implementada" },
  { metric: "50%", label: "Procesos editoriales más eficientes" },
];

export default async function CronicaPage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getCasoExito("cronica");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const results = caso?.metrics?.length
    ? caso.metrics.map((m) => ({ metric: m.value, label: m.label }))
    : RESULTS;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: caso?.clientName || "Crónica", url: "/casos-de-exito/cronica" },
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
              <ArrowLeft size={14} /> Todos los casos
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
              <h2 className="text-2xl font-bold text-text-100">El Reto</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.challenge ||
                  "Crónica, uno de los medios más reconocidos de Argentina, necesitaba modernizar su plataforma digital para competir en la era del contenido personalizado."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">La Solución</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.solution ||
                  "Rediseño completo del portal de noticias con arquitectura moderna, personalización de contenido con IA y optimización de procesos editoriales."}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-100">Resultados</h2>
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
            <h2 className="text-2xl font-bold text-text-100">Servicios utilizados</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
              <ServiceBadge variant="ia">IA</ServiceBadge>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="¿Tu empresa podría ser el próximo caso?"
        description="Cuéntanos tu desafío y diseñemos juntos la solución."
      />
    </PageWrapper>
  );
}
