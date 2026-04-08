import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Caso de Éxito AB InBev-Bavaria | Nivelics",
  description:
    "Cómo Nivelics ayudó a AB InBev-Bavaria a digitalizar procesos de distribución y ventas en Centroamérica.",
  alternates: {
    canonical: "https://www.nivelics.com/casos-de-exito/ab-inbev",
    languages: {
      es: "https://www.nivelics.com/casos-de-exito/ab-inbev",
      en: "https://www.nivelics.com/en/case-studies/ab-inbev",
      "x-default": "https://www.nivelics.com/casos-de-exito/ab-inbev",
    },
  },
};

const RESULTS = [
  { metric: "Digital", label: "Procesos de distribución digitalizados" },
  { metric: "Real-time", label: "Trazabilidad en tiempo real" },
  { metric: "Mejorada", label: "Eficiencia operativa mejorada" },
];

export default function ABInBevPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: "AB InBev-Bavaria", url: "/casos-de-exito/ab-inbev" },
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
            <span className="text-sm text-text-40">El Salvador &middot; Consumo Masivo</span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            AB InBev-Bavaria: Transformación Digital en Consumo Masivo
          </h1>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-text-100">El Reto</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                AB InBev-Bavaria necesitaba digitalizar procesos de distribución y ventas en la
                región centroamericana para mejorar eficiencia y trazabilidad.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">La Solución</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                Desarrollo de soluciones digitales para optimizar la cadena de distribución y las
                operaciones de venta en campo.
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
              <ServiceBadge variant="dev">Desarrollo</ServiceBadge>
              <ServiceBadge variant="cloud">Cloud</ServiceBadge>
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
