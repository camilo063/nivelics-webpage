import type { Metadata } from "next";
import { Cloud, FileCode, ShieldCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Arquitectura e Infraestructura Cloud | AWS · GCP · Azure",
  description:
    "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud/infraestructura",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud/infraestructura",
      en: "https://www.nivelics.com/en/services/cloud/infrastructure",
      "x-default": "https://www.nivelics.com/servicios/cloud/infraestructura",
    },
  },
};

const BENEFITS = [
  {
    icon: Cloud,
    title: "Arquitectura multi-cloud",
    description:
      "Diseñamos arquitecturas que aprovechan lo mejor de AWS, GCP y Azure, evitando vendor lock-in y optimizando costos.",
  },
  {
    icon: FileCode,
    title: "IaC con Terraform/Pulumi",
    description:
      "Infraestructura como código versionada, reproducible y auditada con Terraform, Pulumi o CloudFormation.",
  },
  {
    icon: ShieldCheck,
    title: "Alta disponibilidad y disaster recovery",
    description:
      "Arquitecturas multi-AZ y multi-región con RPO/RTO definidos, failover automático y planes de recuperación probados.",
  },
];

export default function InfraestructuraPage() {
  const serviceSchema = getServiceSchema({
    name: "Arquitectura e Infraestructura Cloud",
    description:
      "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
    url: "/servicios/cloud/infraestructura",
    serviceType: "Cloud Infrastructure Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Infraestructura", url: "/servicios/cloud/infraestructura" },
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
            Arquitectura e Infraestructura Cloud
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu
            operación.
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
        title="¿Por qué infraestructura gestionada vs. equipo interno?"
        alternativeLabel="Equipo interno de infra"
        nivelicsLabel="Nivelics Cloud Ops"
        rows={[
          {
            criterion: "Disponibilidad 24/7",
            alternative: "Difícil de sostener con equipo pequeño",
            nivelics: "SLA garantizado con escalamiento definido",
          },
          {
            criterion: "IaC (Terraform / CDK)",
            alternative: "No siempre implementado",
            nivelics: "Estándar en todos los proyectos",
          },
          {
            criterion: "Observabilidad",
            alternative: "Básica o manual",
            nivelics: "Datadog / Grafana configurado desde el inicio",
          },
          {
            criterion: "Respuesta a incidentes",
            alternative: "Variable — depende de quién esté disponible",
            nivelics: "Runbooks definidos + escalamiento claro",
          },
          {
            criterion: "Actualizaciones de seguridad",
            alternative: "Reactivas — se parchea cuando hay incidente",
            nivelics: "Proactivas con ventanas programadas",
          },
          {
            criterion: "Costo de especialistas senior",
            alternative: "$8,000–15,000 USD/mes por perfil",
            nivelics: "Fracción del costo — equipo completo",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
