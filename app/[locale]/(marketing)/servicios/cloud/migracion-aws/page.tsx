import type { Metadata } from "next";
import { ClipboardCheck, ShieldCheck, Gauge } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Migración a AWS | Cloud Migration sin Interrupciones",
  description:
    "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud/migracion-aws",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud/migracion-aws",
      en: "https://www.nivelics.com/en/services/cloud/aws-migration",
      "x-default": "https://www.nivelics.com/servicios/cloud/migracion-aws",
    },
  },
};

const BENEFITS = [
  {
    icon: ClipboardCheck,
    title: "Assessment y estrategia de migración",
    description:
      "Evaluamos tu infraestructura actual, definimos la estrategia de migración (rehost, replatform, refactor) y el roadmap paso a paso.",
  },
  {
    icon: ShieldCheck,
    title: "Zero downtime con rollback",
    description:
      "Migración sin interrupciones con plan de rollback probado, validación continua y cutover controlado para cero impacto en tu operación.",
  },
  {
    icon: Gauge,
    title: "Optimización post-migración",
    description:
      "Rightsizing, reserved instances y monitoreo de costos desde el primer día en AWS para maximizar tu inversión en la nube.",
  },
];

export default function MigracionAWSPage() {
  const serviceSchema = getServiceSchema({
    name: "Migración a AWS",
    description:
      "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
    url: "/servicios/cloud/migracion-aws",
    serviceType: "Cloud Migration Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Migración a AWS", url: "/servicios/cloud/migracion-aws" },
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
            Migración a AWS
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y
            optimización de costos desde el día uno.
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
        title="¿Por qué migrar con Nivelics vs. hacerlo con equipo interno?"
        alternativeLabel="Migración interna"
        nivelicsLabel="Nivelics Migration"
        rows={[
          {
            criterion: "Tiempo estimado",
            alternative: "12–18 meses",
            nivelics: "3–6 meses (metodología probada)",
          },
          {
            criterion: "Riesgo de downtime",
            alternative: "Alto — sin playbook validado",
            nivelics: "Mínimo — estrategia de rollback siempre activa",
          },
          {
            criterion: "Certificaciones AWS",
            alternative: "No garantizadas",
            nivelics: "Equipo AWS Certified Partner",
          },
          {
            criterion: "Documentación final",
            alternative: "Incompleta o inexistente",
            nivelics: "IaC + runbooks + arquitectura documentada",
          },
          {
            criterion: "Optimización de costos",
            alternative: "Lift-and-shift sin gobierno",
            nivelics: "FinOps incluido desde el diseño",
          },
          {
            criterion: "Seguridad desde el inicio",
            alternative: "Reactiva — se corrige después",
            nivelics: "Hardening y compliance desde día 1",
          },
          {
            criterion: "Soporte post-migración",
            alternative: "Equipo interno saturado por el proyecto",
            nivelics: "Operación continua disponible",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
