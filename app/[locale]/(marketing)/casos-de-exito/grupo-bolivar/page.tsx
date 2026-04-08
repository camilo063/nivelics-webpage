import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Caso de Éxito Grupo Bolívar | Nivelics",
  description:
    "Cómo Nivelics ayudó a Grupo Bolívar a modernizar múltiples líneas de negocio con productos digitales para seguros, salud y e-commerce.",
  alternates: {
    canonical: "https://www.nivelics.com/casos-de-exito/grupo-bolivar",
    languages: {
      es: "https://www.nivelics.com/casos-de-exito/grupo-bolivar",
      en: "https://www.nivelics.com/en/case-studies/grupo-bolivar",
      "x-default": "https://www.nivelics.com/casos-de-exito/grupo-bolivar",
    },
  },
};

const RESULTS = [
  { metric: "3", label: "Productos digitales lanzados" },
  { metric: "25%", label: "Reducción de costos operativos" },
  { metric: "85%", label: "Adopción digital" },
];

export default function GrupoBolivarPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
    { name: "Grupo Bolívar", url: "/casos-de-exito/grupo-bolivar" },
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
            <ServiceBadge variant="ia">IA</ServiceBadge>
            <span className="text-sm text-text-40">
              Colombia &middot; Seguros / Salud / E-commerce
            </span>
          </div>

          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            Grupo Bolívar: Transformación Digital Multi-línea
          </h1>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-text-100">El Reto</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                Grupo Bolívar necesitaba modernizar múltiples líneas de negocio simultáneamente,
                integrando canales digitales y optimizando procesos internos.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-100">La Solución</h2>
              <p className="mt-4 text-text-70 leading-relaxed">
                Rediseño y desarrollo de productos digitales para seguros, salud y e-commerce con
                equipo dedicado y metodología ágil.
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
