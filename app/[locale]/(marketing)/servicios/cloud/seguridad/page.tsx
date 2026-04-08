import type { Metadata } from "next";
import { Shield, KeyRound, Activity } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Seguridad Cloud | Gobierno e Identidad en AWS y GCP",
  description:
    "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud/seguridad",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud/seguridad",
      en: "https://www.nivelics.com/en/services/cloud/security",
      "x-default": "https://www.nivelics.com/servicios/cloud/seguridad",
    },
  },
};

const BENEFITS = [
  {
    icon: Shield,
    title: "Compliance SOC2 e ISO27001",
    description:
      "Implementación de controles y procesos para cumplir con SOC2, ISO27001 y otras normativas regulatorias del sector.",
  },
  {
    icon: KeyRound,
    title: "IAM y Zero Trust",
    description:
      "Gestión de identidades con principio de mínimo privilegio, MFA, SSO y arquitectura Zero Trust en toda tu infraestructura.",
  },
  {
    icon: Activity,
    title: "Monitoreo y respuesta a incidentes",
    description:
      "Detección de amenazas en tiempo real, alertas automatizadas y playbooks de respuesta a incidentes de seguridad.",
  },
];

export default function SeguridadCloudPage() {
  const serviceSchema = getServiceSchema({
    name: "Seguridad Cloud",
    description:
      "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud.",
    url: "/servicios/cloud/seguridad",
    serviceType: "Cloud Security Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Seguridad Cloud", url: "/servicios/cloud/seguridad" },
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
            Seguridad Cloud
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para
            tu infraestructura cloud.
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
        title="¿Por qué seguridad cloud con Nivelics vs. sin programa formal?"
        alternativeLabel="Sin programa de seguridad"
        nivelicsLabel="Nivelics Cloud Security"
        rows={[
          {
            criterion: "Visibilidad de vulnerabilidades",
            alternative: "Reactiva — se descubre post-incidente",
            nivelics: "Escaneo continuo automatizado",
          },
          {
            criterion: "Compliance (SOC2, ISO27001)",
            alternative: "Sin mapa claro ni hitos",
            nivelics: "Roadmap con hitos medibles desde semana 1",
          },
          {
            criterion: "Gestión de identidades (IAM)",
            alternative: "Permisiva por defecto — acceso amplio",
            nivelics: "Principio de mínimo privilegio aplicado",
          },
          {
            criterion: "Cifrado en tránsito y reposo",
            alternative: "Parcial o sin configurar",
            nivelics: "End-to-end configurado y auditado",
          },
          {
            criterion: "Detección de amenazas",
            alternative: "No existe",
            nivelics: "GuardDuty / Security Hub activo",
          },
          {
            criterion: "Respuesta a incidentes",
            alternative: "Sin plan — improvisación",
            nivelics: "Playbook probado con tiempos de respuesta",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
