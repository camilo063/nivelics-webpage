// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
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
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
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
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/infraestructura",
    title: cms?.seoTitle || "Arquitectura e Infraestructura Cloud | AWS · GCP · Azure",
    description:
      cms?.seoDescription ||
      "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
  });
}

const BENEFITS = [
  {
    icon: "cloud",
    title: "Arquitectura multi-cloud",
    description:
      "Diseñamos arquitecturas que aprovechan lo mejor de AWS, GCP y Azure, evitando vendor lock-in y optimizando costos.",
  },
  {
    icon: "file-code",
    title: "IaC con Terraform/Pulumi",
    description:
      "Infraestructura como código versionada, reproducible y auditada con Terraform, Pulumi o CloudFormation.",
  },
  {
    icon: "shield-check",
    title: "Alta disponibilidad y disaster recovery",
    description:
      "Arquitecturas multi-AZ y multi-región con RPO/RTO definidos, failover automático y planes de recuperación probados.",
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
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Solicitar diseño", url: "/contacto" },
    fallbackSecondary: { text: "Ver beneficios", url: "#beneficios" },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: "Arquitectura e Infraestructura Cloud",
    description:
      "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
    url: "/servicios/cloud/infraestructura",
    serviceType: "Cloud Infrastructure Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(locale, [
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
          {
            name: "Ciberseguridad y Ethical Hacking",
            nameEn: "Cybersecurity & Ethical Hacking",
            url: "/servicios/cloud/ciberseguridad-ethical-hacking",
            urlEn: "/en/services/cloud/ethical-hacking",
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
        badge="Cloud · Infraestructura"
        h1={cms?.title || "Tu infra cloud"}
        h1Accent="siempre operando"
        subtitle={
          cms?.subtitle ||
          "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación."
        }
        bullets={[
          "Arquitecturas multi-AZ y multi-región",
          "IaC con Terraform, Pulumi o CDK",
          "SLA de disponibilidad garantizado",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#3B82F6"
        rightPanel={
          <HeroSelector
            title="Servicios de infraestructura"
            accentColor="#3B82F6"
            options={[
              {
                icon: "🏗️",
                label: "Diseño de Arquitectura",
                url: "/servicios/cloud/infraestructura",
                description: "Arquitectura cloud desde cero o rediseño de la existente.",
              },
              {
                icon: "📜",
                label: "IaC (Terraform / Pulumi)",
                url: "/servicios/cloud/infraestructura",
                description: "Infraestructura como código versionada y reproducible.",
              },
              {
                icon: "🔄",
                label: "Disaster Recovery",
                url: "/servicios/cloud/infraestructura",
                description: "Planes de DR con RPO/RTO definidos y probados.",
              },
              {
                icon: "📊",
                label: "Observabilidad",
                url: "/servicios/cloud/infraestructura",
                description: "Monitoreo con Datadog, Grafana o CloudWatch.",
              },
              {
                icon: "⚙️",
                label: "Operación Continua",
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
            ? cms.metrics.map((m) => ({
                value: m.value,
                label: m.label,
                sublabel: "",
                unit: m.unit,
              }))
            : /* LEGACY FALLBACK */ [
                { value: "99.9%", label: "Disponibilidad", sublabel: "SLA garantizado" },
                { value: "100%", label: "IaC", sublabel: "Infraestructura como código" },
                { value: "24/7", label: "Monitoreo", sublabel: "Observabilidad completa" },
                { value: "50%", label: "Menos incidentes", sublabel: "vs. gestión manual" },
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

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#3B82F6"
        titleEs="Por qué elegir Infraestructura Cloud con Nivelics"
        titleEn="Why choose Cloud Infrastructure with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#3B82F6"
        titleEs="Cómo lo implementamos"
        titleEn="How we deliver"
        locale={locale}
      />

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

      <StickyMobileCta text="Solicitar auditoría →" url="/contacto" accentColor="#3B82F6" />
    </PageWrapper>
  );
}
