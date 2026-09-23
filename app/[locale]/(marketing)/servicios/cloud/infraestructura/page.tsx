// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// todo el copy duro de esta página salía en español en /en/services/cloud/infrastructure.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";
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

const ACCENT = "#3B82F6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("infraestructura", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/infraestructura",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Cloud Architecture and Infrastructure | AWS · GCP · Azure"
        : "Arquitectura e Infraestructura Cloud | AWS · GCP · Azure"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Design and implementation of cloud infrastructure that is scalable, secure and tuned to how your operation runs."
        : "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación."),
  });
}

/* ── Principios de diseño (reemplazan a MetricsBar) ──────────────────────── */

const PRINCIPLES_ES = [
  "Arquitecturas multi-AZ y multi-región con RPO/RTO definidos",
  "Infraestructura como código versionada y reproducible",
  "Observabilidad configurada desde el primer despliegue",
  "Runbooks y escalamiento definidos antes del incidente",
];

const PRINCIPLES_EN = [
  "Multi-AZ and multi-region architectures with defined RPO/RTO",
  "Infrastructure as code, versioned and reproducible",
  "Observability configured from the first deployment",
  "Runbooks and escalation defined before the incident",
];

const BENEFITS_ES = [
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

const BENEFITS_EN = [
  {
    icon: "cloud",
    title: "Multi-cloud architecture",
    description:
      "We design architectures that take the best of AWS, GCP and Azure, avoiding vendor lock-in and keeping costs in check.",
  },
  {
    icon: "file-code",
    title: "IaC with Terraform/Pulumi",
    description:
      "Infrastructure as code that is versioned, reproducible and auditable with Terraform, Pulumi or CloudFormation.",
  },
  {
    icon: "shield-check",
    title: "High availability and disaster recovery",
    description:
      "Multi-AZ and multi-region architectures with defined RPO/RTO, automatic failover and tested recovery plans.",
  },
];

const SERVICES_ES = [
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
];

const SERVICES_EN = [
  {
    icon: "🏗️",
    label: "Architecture Design",
    url: "/servicios/cloud/infraestructura",
    description: "Cloud architecture from scratch, or a redesign of the one you have.",
  },
  {
    icon: "📜",
    label: "IaC (Terraform / Pulumi)",
    url: "/servicios/cloud/infraestructura",
    description: "Infrastructure as code, versioned and reproducible.",
  },
  {
    icon: "🔄",
    label: "Disaster Recovery",
    url: "/servicios/cloud/infraestructura",
    description: "DR plans with defined and tested RPO/RTO.",
  },
  {
    icon: "📊",
    label: "Observability",
    url: "/servicios/cloud/infraestructura",
    description: "Monitoring with Datadog, Grafana or CloudWatch.",
  },
  {
    icon: "⚙️",
    label: "Ongoing Operation",
    url: "/servicios/cloud/infraestructura",
    description: "24/7 managed services with a guaranteed SLA.",
  },
];

const COMPARISON_ES = [
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
    alternative: "Costo alto y recurrente por cada perfil senior",
    nivelics: "Fracción del costo — equipo completo",
  },
];

const COMPARISON_EN = [
  {
    criterion: "24/7 availability",
    alternative: "Hard to sustain with a small team",
    nivelics: "Guaranteed SLA with a defined escalation path",
  },
  {
    criterion: "IaC (Terraform / CDK)",
    alternative: "Not always implemented",
    nivelics: "Standard on every project",
  },
  {
    criterion: "Observability",
    alternative: "Basic or manual",
    nivelics: "Datadog / Grafana set up from the start",
  },
  {
    criterion: "Incident response",
    alternative: "Variable — depends on who happens to be around",
    nivelics: "Defined runbooks + clear escalation",
  },
  {
    criterion: "Security updates",
    alternative: "Reactive — patched once there is an incident",
    nivelics: "Proactive, with scheduled windows",
  },
  {
    criterion: "Cost of senior specialists",
    alternative: "High, recurring cost for each senior profile",
    nivelics: "A fraction of the cost — full team",
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
  const isEn = locale === "en";
  const cms = await getServicioData("infraestructura", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: isEn ? "Request a design" : "Solicitar diseño", url: "/contacto" },
    fallbackSecondary: { text: isEn ? "See the benefits" : "Ver beneficios", url: "#beneficios" },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Cloud Architecture and Infrastructure" : "Arquitectura e Infraestructura Cloud",
    description: isEn
      ? "Design and implementation of cloud infrastructure that is scalable, secure and tuned to how your operation runs."
      : "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
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
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: ACCENT }}
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
        badge={isEn ? "Cloud · Infrastructure" : "Cloud · Infraestructura"}
        h1={cms?.title || (isEn ? "Your cloud infrastructure" : "Tu infra cloud")}
        h1Accent={isEn ? "always running" : "siempre operando"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Design and implementation of cloud infrastructure that is scalable, secure and tuned to how your operation runs."
            : "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.")
        }
        bullets={
          isEn
            ? [
                "Multi-AZ and multi-region architectures",
                "IaC with Terraform, Pulumi or CDK",
                "Guaranteed availability SLA",
              ]
            : [
                "Arquitecturas multi-AZ y multi-región",
                "IaC con Terraform, Pulumi o CDK",
                "SLA de disponibilidad garantizado",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={
          <HeroSelector
            title={isEn ? "Infrastructure services" : "Servicios de infraestructura"}
            accentColor={ACCENT}
            options={isEn ? SERVICES_EN : SERVICES_ES}
          />
        }
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      <section id="beneficios" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Key benefits" : "Beneficios clave"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {(isEn ? BENEFITS_EN : BENEFITS_ES).map((b) => (
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
        accentColor={ACCENT}
        titleEs="Por qué elegir Infraestructura Cloud con Nivelics"
        titleEn="Why choose Cloud Infrastructure with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Cómo lo implementamos"
        titleEn="How we deliver"
        locale={locale}
      />

      <ComparisonTable
        title={
          isEn
            ? "Why managed infrastructure instead of an in-house team?"
            : "¿Por qué infraestructura gestionada vs. equipo interno?"
        }
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        alternativeLabel={isEn ? "In-house infra team" : "Equipo interno de infra"}
        nivelicsLabel="Nivelics Cloud Ops"
        rows={isEn ? COMPARISON_EN : COMPARISON_ES}
      />

      <CTABanner locale={locale} />

      <StickyMobileCta
        text={isEn ? "Request an audit →" : "Solicitar auditoría →"}
        url="/contacto"
        accentColor={ACCENT}
      />
    </PageWrapper>
  );
}
