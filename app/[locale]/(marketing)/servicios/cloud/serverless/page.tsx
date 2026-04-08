import type { Metadata } from "next";
import { Zap, Scaling, DollarSign } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Soluciones Serverless | Escala sin Administrar Servidores",
  description:
    "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud/serverless",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud/serverless",
      en: "https://www.nivelics.com/en/services/cloud/serverless",
      "x-default": "https://www.nivelics.com/servicios/cloud/serverless",
    },
  },
};

const BENEFITS = [
  {
    icon: Zap,
    title: "Event-driven architecture",
    description:
      "Arquitecturas reactivas que procesan eventos en tiempo real con Lambda, Cloud Functions y Azure Functions.",
  },
  {
    icon: Scaling,
    title: "Auto-scaling nativo",
    description:
      "Escalamiento automático de cero a millones de requests sin configuración manual ni gestión de servidores.",
  },
  {
    icon: DollarSign,
    title: "Costos basados en uso real",
    description:
      "Paga solo por el tiempo de ejecución que consumes. Sin servidores idle, sin costos fijos innecesarios.",
  },
];

export default function ServerlessPage() {
  const serviceSchema = getServiceSchema({
    name: "Soluciones Serverless",
    description:
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    url: "/servicios/cloud/serverless",
    serviceType: "Serverless Architecture Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Serverless", url: "/servicios/cloud/serverless" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-cloud/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="cloud">Cloud</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Soluciones Serverless
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por
            lo que usas.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cloud/10">
                    <Icon size={24} className="text-cloud" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="¿Serverless con Nivelics vs. arquitectura tradicional?"
        alternativeLabel="Arquitectura tradicional"
        nivelicsLabel="Nivelics Serverless"
        rows={[
          {
            criterion: "Costo de cómputo",
            alternative: "Fijo — pagas aunque no uses los recursos",
            nivelics: "Pay-per-use — solo lo que consumes",
          },
          {
            criterion: "Escalabilidad",
            alternative: "Manual o semi-automática",
            nivelics: "Automática e instantánea sin intervención",
          },
          {
            criterion: "Gestión de servidores",
            alternative: "Tu equipo la absorbe completamente",
            nivelics: "Cero gestión de infraestructura",
          },
          {
            criterion: "Time-to-market",
            alternative: "Más lento — infra previa necesaria",
            nivelics: "Más rápido — foco en lógica de negocio",
          },
          {
            criterion: "Cold starts",
            alternative: "No aplica",
            nivelics: "Gestionados con warm-up strategies",
          },
          {
            criterion: "Costo a largo plazo",
            alternative: "Predecible pero inflexible",
            nivelics: "Escala con el negocio — baja en periodos bajos",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
