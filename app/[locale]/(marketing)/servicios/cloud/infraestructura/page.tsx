import type { Metadata } from "next";
import { Cloud, FileCode, ShieldCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("infraestructura", locale);
  return {
    title: cms?.seoTitle || "Arquitectura e Infraestructura Cloud | AWS \u00b7 GCP \u00b7 Azure",
    description:
      cms?.seoDescription ||
      "Dise\u00f1o e implementaci\u00f3n de infraestructura cloud escalable, segura y optimizada para tu operaci\u00f3n.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/cloud/infraestructura",
      languages: {
        es: "https://www.nivelics.com/servicios/cloud/infraestructura",
        en: "https://www.nivelics.com/en/services/cloud/infrastructure",
        "x-default": "https://www.nivelics.com/servicios/cloud/infraestructura",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "cloud",
    title: "Arquitectura multi-cloud",
    description:
      "Dise\u00f1amos arquitecturas que aprovechan lo mejor de AWS, GCP y Azure, evitando vendor lock-in y optimizando costos.",
  },
  {
    icon: "file-code",
    title: "IaC con Terraform/Pulumi",
    description:
      "Infraestructura como c\u00f3digo versionada, reproducible y auditada con Terraform, Pulumi o CloudFormation.",
  },
  {
    icon: "shield-check",
    title: "Alta disponibilidad y disaster recovery",
    description:
      "Arquitecturas multi-AZ y multi-regi\u00f3n con RPO/RTO definidos, failover autom\u00e1tico y planes de recuperaci\u00f3n probados.",
  },
];

export default async function InfraestructuraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("infraestructura", locale);
  const serviceSchema = getServiceSchema({
    name: "Arquitectura e Infraestructura Cloud",
    description:
      "Dise\u00f1o e implementaci\u00f3n de infraestructura cloud escalable, segura y optimizada para tu operaci\u00f3n.",
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
      <SiblingServicesNav
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: "#3B82F6" }}
        siblings={[
          {
            name: "FinOps",
            nameEn: "FinOps",
            url: "/servicios/cloud/finops",
            urlEn: "/en/services/cloud/finops",
          },
          {
            name: "Migración a AWS",
            nameEn: "AWS Migration",
            url: "/servicios/cloud/migracion-aws",
            urlEn: "/en/services/cloud/aws-migration",
          },
          {
            name: "Infraestructura",
            nameEn: "Infrastructure",
            url: "/servicios/cloud/infraestructura",
            urlEn: "/en/services/cloud/infrastructure",
          },
          {
            name: "Seguridad Cloud",
            nameEn: "Cloud Security",
            url: "/servicios/cloud/seguridad",
            urlEn: "/en/services/cloud/security",
          },
          {
            name: "Serverless",
            nameEn: "Serverless",
            url: "/servicios/cloud/serverless",
            urlEn: "/en/services/cloud/serverless",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <HeroSplit
        heroEffect="particles"
        badge="Cloud \u00b7 Infraestructura"
        h1={cms?.title || "Tu infra cloud"}
        h1Accent="siempre operando"
        subtitle={
          cms?.subtitle ||
          "Dise\u00f1o e implementaci\u00f3n de infraestructura cloud escalable, segura y optimizada para tu operaci\u00f3n."
        }
        bullets={[
          "Arquitecturas multi-AZ y multi-regi\u00f3n",
          "IaC con Terraform, Pulumi o CDK",
          "SLA de disponibilidad garantizado",
        ]}
        ctaPrimary={{ text: "Solicitar dise\u00f1o", url: "/contacto" }}
        ctaSecondary={{ text: "Ver beneficios", url: "#beneficios" }}
        accentColor="#3B82F6"
        rightPanel={
          <HeroSelector
            title="Servicios de infraestructura"
            accentColor="#3B82F6"
            options={[
              {
                icon: "\ud83c\udfd7\ufe0f",
                label: "Dise\u00f1o de Arquitectura",
                url: "/servicios/cloud/infraestructura",
                description: "Arquitectura cloud desde cero o redise\u00f1o de la existente.",
              },
              {
                icon: "\ud83d\udcdc",
                label: "IaC (Terraform / Pulumi)",
                url: "/servicios/cloud/infraestructura",
                description: "Infraestructura como c\u00f3digo versionada y reproducible.",
              },
              {
                icon: "\ud83d\udd04",
                label: "Disaster Recovery",
                url: "/servicios/cloud/infraestructura",
                description: "Planes de DR con RPO/RTO definidos y probados.",
              },
              {
                icon: "\ud83d\udcca",
                label: "Observabilidad",
                url: "/servicios/cloud/infraestructura",
                description: "Monitoreo con Datadog, Grafana o CloudWatch.",
              },
              {
                icon: "\u2699\ufe0f",
                label: "Operaci\u00f3n Continua",
                url: "/servicios/cloud/infraestructura",
                description: "Managed services 24/7 con SLA garantizado.",
              },
            ]}
          />
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                { value: "99.9%", label: "Disponibilidad", sublabel: "SLA garantizado" },
                { value: "100%", label: "IaC", sublabel: "Infraestructura como c\u00f3digo" },
                { value: "24/7", label: "Monitoreo", sublabel: "Observabilidad completa" },
                { value: "50%", label: "Menos incidentes", sublabel: "vs. gesti\u00f3n manual" },
              ]
        }
      />

      <section id="beneficios" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <BenefitCard
                key={b.title}
                title={b.title}
                description={b.description}
                icon={b.icon}
                accentColor="#00D4FF"
              />
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="\u00bfPor qu\u00e9 infraestructura gestionada vs. equipo interno?"
        alternativeLabel="Equipo interno de infra"
        nivelicsLabel="Nivelics Cloud Ops"
        rows={[
          {
            criterion: "Disponibilidad 24/7",
            alternative: "Dif\u00edcil de sostener con equipo peque\u00f1o",
            nivelics: "SLA garantizado con escalamiento definido",
          },
          {
            criterion: "IaC (Terraform / CDK)",
            alternative: "No siempre implementado",
            nivelics: "Est\u00e1ndar en todos los proyectos",
          },
          {
            criterion: "Observabilidad",
            alternative: "B\u00e1sica o manual",
            nivelics: "Datadog / Grafana configurado desde el inicio",
          },
          {
            criterion: "Respuesta a incidentes",
            alternative: "Variable \u2014 depende de qui\u00e9n est\u00e9 disponible",
            nivelics: "Runbooks definidos + escalamiento claro",
          },
          {
            criterion: "Actualizaciones de seguridad",
            alternative: "Reactivas \u2014 se parchea cuando hay incidente",
            nivelics: "Proactivas con ventanas programadas",
          },
          {
            criterion: "Costo de especialistas senior",
            alternative: "$8,000\u201315,000 USD/mes por perfil",
            nivelics: "Fracci\u00f3n del costo \u2014 equipo completo",
          },
        ]}
      />

      <CTABanner />

      <StickyMobileCta
        text="Solicitar auditor\u00eda \u2192"
        url="/contacto"
        accentColor="#3B82F6"
      />
    </PageWrapper>
  );
}
