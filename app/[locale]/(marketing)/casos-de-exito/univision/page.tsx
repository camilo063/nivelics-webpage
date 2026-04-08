import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Caso de Éxito Univision | Nivelics",
  description:
    "Cómo Nivelics fortaleció las capacidades digitales de Univision con talento senior bilingüe integrado.",
  alternates: {
    canonical: "https://www.nivelics.com/casos-de-exito/univision",
    languages: {
      es: "https://www.nivelics.com/casos-de-exito/univision",
      en: "https://www.nivelics.com/en/case-studies/univision",
      "x-default": "https://www.nivelics.com/casos-de-exito/univision",
    },
  },
};

const RESULTS = [
  { metric: "Integrado", label: "Equipo integrado exitosamente" },
  { metric: "Mejoradas", label: "Plataformas digitales mejoradas" },
  { metric: "100%", label: "Cobertura bilingüe total" },
];

export default function UnivisionPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: "Univision", url: "/casos-de-exito/univision" },
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
            <ServiceBadge variant="staffing">Staffing</ServiceBadge>
            <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
            <span className="text-sm text-text-40">México &middot; Medios</span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            Univision: Desarrollo Digital para Medios Hispanos
          </h1>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-text-100">El Reto</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                Univision requería capacidad de desarrollo adicional para sus plataformas digitales
                dirigidas al mercado hispano en USA y México.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">La Solución</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                Equipo de desarrollo Nivelics integrado para fortalecer las capacidades digitales de
                Univision con talento senior bilingüe.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-100">Resultados</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {RESULTS.map((r) => (
                <div key={r.label} className="glass rounded-xl p-6 text-center">
                  <p className="text-3xl font-mono font-bold text-primary">{r.metric}</p>
                  <p className="mt-2 text-sm text-text-70">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-100">Servicios utilizados</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <ServiceBadge variant="staffing">Staffing</ServiceBadge>
              <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
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
