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
  const raw = await getCasoExito("televisa");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  return {
    title: caso?.seoTitle || "Caso de Éxito Televisa N+ | Nivelics",
    description:
      caso?.seoDescription ||
      "Cómo Nivelics ayudó a Televisa a construir N+, una plataforma de noticias digitales tipo streaming escalable a millones de usuarios.",
    alternates: {
      canonical: "https://www.nivelics.com/casos-de-exito/televisa",
      languages: {
        es: "https://www.nivelics.com/casos-de-exito/televisa",
        en: "https://www.nivelics.com/en/case-studies/televisa",
        "x-default": "https://www.nivelics.com/casos-de-exito/televisa",
      },
    },
  };
}

// LEGACY FALLBACK
const RESULTS = [
  { metric: "Millones", label: "Plataforma escalable a millones de usuarios" },
  { metric: "99.9%", label: "Uptime en eventos en vivo" },
  { metric: "40%", label: "Time-to-market más rápido" },
];

export default async function TelevisaPage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getCasoExito("televisa");
  const caso = raw ? mapCasoExito(raw as Record<string, unknown>, locale) : null;

  const results = caso?.metrics?.length
    ? caso.metrics.map((m) => ({ metric: m.value, label: m.label }))
    : RESULTS;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: caso?.clientName || "Televisa / N+", url: "/casos-de-exito/televisa" },
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
            <ServiceBadge variant="cloud">Cloud</ServiceBadge>
            <ServiceBadge variant="staffing">Staffing</ServiceBadge>
            <span className="text-sm text-text-40">
              {caso?.clientCountry || "México"} &middot;{" "}
              {caso?.clientSector || "Medios / Streaming"}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            {caso?.title || "Televisa / N+: Plataforma de Noticias Digitales"}
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
                  "Televisa necesitaba una plataforma digital de noticias tipo streaming para el mercado hispanohablante, capaz de manejar picos masivos de tráfico durante eventos noticiosos en vivo."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">La Solución</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                {caso?.solution ||
                  "Diseñamos una arquitectura cloud escalable en AWS con CDN global, equipo de ingeniería Nivelics integrado al equipo Televisa, y pipelines de CI/CD para deploys múltiples al día."}
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
              <ServiceBadge variant="cloud">Cloud</ServiceBadge>
              <ServiceBadge variant="staffing">Staffing</ServiceBadge>
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
