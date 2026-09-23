// CMS-connected: 2026-05-07 — sub-services, benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// todo el copy duro de esta página salía en español en /en/services/cloud.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  CmsSubServicesGrid,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData, getSubserviciosData } from "@/lib/cms/get-servicio-data";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { uiLabel } from "@/lib/cms/ui-labels-helper";
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
  const cms = await getServicioData("cloud", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud",
    title:
      cms?.seoTitle ||
      (isEn
        ? "AWS · GCP · Azure Cloud Services | Migration and FinOps"
        : "Servicios Cloud AWS · GCP · Azure | Migración y FinOps"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Multi-cloud architecture, migration, DevOps and cost optimisation with a FinOps approach."
        : "Arquitectura multi-cloud, migración, DevOps y optimización de costos con enfoque FinOps."),
  });
}

/* ── Sub-servicios (fallback del grid cuando el CMS está vacío) ───────────── */

const SUB_SERVICES_ES = [
  {
    icon: "dollar-sign",
    title: "FinOps",
    description:
      "Optimización y gobernanza financiera de la nube. Bajamos la factura sin perder rendimiento.",
    href: "/servicios/cloud/finops",
  },
  {
    icon: "cloud",
    title: "Migración a AWS",
    description:
      "Migración de workloads on-premise a la nube con zero downtime y estrategia de rollback.",
    href: "/servicios/cloud/migracion-aws",
  },
  {
    icon: "server",
    title: "Infraestructura Cloud",
    description:
      "Diseño e implementación de arquitecturas en AWS, Azure y GCP con alta disponibilidad.",
    href: "/servicios/cloud/infraestructura",
  },
  {
    icon: "shield",
    title: "Seguridad Cloud",
    description:
      "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end.",
    href: "/servicios/cloud/seguridad",
  },
  {
    icon: "zap",
    title: "Serverless",
    description:
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    href: "/servicios/cloud/serverless",
  },
  {
    icon: "oct-scan",
    title: "Ciberseguridad y Ethical Hacking",
    description:
      "Pentesting, red team y auditoría de seguridad de agentes de IA. Encontramos las vulnerabilidades antes que un atacante real.",
    href: "/servicios/cloud/ciberseguridad-ethical-hacking",
  },
];

const SUB_SERVICES_EN = [
  {
    icon: "dollar-sign",
    title: "FinOps",
    description:
      "Financial governance and optimisation of your cloud. We bring the bill down without giving up performance.",
    href: "/servicios/cloud/finops",
  },
  {
    icon: "cloud",
    title: "AWS Migration",
    description:
      "On-premise workloads moved to the cloud with zero downtime and a rollback strategy.",
    href: "/servicios/cloud/migracion-aws",
  },
  {
    icon: "server",
    title: "Cloud Infrastructure",
    description:
      "Design and implementation of high-availability architectures on AWS, Azure and GCP.",
    href: "/servicios/cloud/infraestructura",
  },
  {
    icon: "shield",
    title: "Cloud Security",
    description:
      "Hardening, compliance (SOC2, ISO27001), identity management and end-to-end encryption.",
    href: "/servicios/cloud/seguridad",
  },
  {
    icon: "zap",
    title: "Serverless",
    description:
      "Event-driven architectures with Lambda, Cloud Functions and Azure Functions. Pay only for what you use.",
    href: "/servicios/cloud/serverless",
  },
  {
    icon: "oct-scan",
    title: "Cybersecurity and Ethical Hacking",
    description:
      "Pentesting, red team and AI agent security audits. We find the vulnerabilities before a real attacker does.",
    href: "/servicios/cloud/ciberseguridad-ethical-hacking",
  },
];

/* ── Principios de diseño (reemplazan a MetricsBar) ──────────────────────── */

const PRINCIPLES_ES = [
  "Menos gasto cloud con gobierno FinOps desde el día uno",
  "Migraciones con plan de rollback probado antes de cada cutover",
  "Infraestructura como código: versionada, reproducible y auditable",
  "Operación continua con monitoreo y revisión de costos",
];

const PRINCIPLES_EN = [
  "Lower cloud spend under FinOps governance from day one",
  "Migrations with a rollback plan tested before every cutover",
  "Infrastructure as code: versioned, reproducible and auditable",
  "Ongoing operation with monitoring and cost review",
];

/* ── Clientes ────────────────────────────────────────────────────────────── */

const LOGOS_ES = [
  { name: "Televisa / N+", sector: "Medios" },
  { name: "Grupo Bolívar", sector: "Fintech" },
  { name: "Two Maids", sector: "Servicios" },
  { name: "Pulzo", sector: "Medios digitales" },
  { name: "AB InBev-Bavaria", sector: "CPG" },
];

const LOGOS_EN = [
  { name: "Televisa / N+", sector: "Media" },
  { name: "Grupo Bolívar", sector: "Fintech" },
  { name: "Two Maids", sector: "Services" },
  { name: "Pulzo", sector: "Digital media" },
  { name: "AB InBev-Bavaria", sector: "CPG" },
];

/* ── Proceso FinOps ──────────────────────────────────────────────────────── */

const PROCESS_ES = [
  {
    number: "01",
    title: "Discovery y auditoría",
    description:
      "Analizamos tu factura cloud, identificamos recursos huérfanos y oportunidades de optimización.",
    duration: "Semana 1-2",
    deliverable: "Reporte de auditoría + quick wins identificados",
  },
  {
    number: "02",
    title: "Quick wins",
    description:
      "Eliminamos recursos sin uso, optimizamos instancias y configuramos Reserved Instances.",
    duration: "Semana 3-4",
    deliverable: "Primeros ahorros visibles en factura",
  },
  {
    number: "03",
    title: "Gobierno y automatización",
    description: "Tagging, budgets, alertas automáticas y dashboard en tiempo real.",
    duration: "Semana 5-6",
    deliverable: "Sistema de gobierno operativo",
  },
  {
    number: "04",
    title: "Operación continua",
    description: "Revisión mensual, ajustes proactivos y reporte de ahorro acumulado.",
    duration: "MRR",
    deliverable: "Reporte mensual con ROI documentado",
  },
];

const PROCESS_EN = [
  {
    number: "01",
    title: "Discovery and audit",
    description:
      "We analyse your cloud bill, identify orphan resources and spot optimisation opportunities.",
    duration: "Week 1-2",
    deliverable: "Audit report + identified quick wins",
  },
  {
    number: "02",
    title: "Quick wins",
    description: "We remove unused resources, right-size instances and set up Reserved Instances.",
    duration: "Week 3-4",
    deliverable: "First savings visible on the bill",
  },
  {
    number: "03",
    title: "Governance and automation",
    description: "Tagging, budgets, automated alerts and a real-time dashboard.",
    duration: "Week 5-6",
    deliverable: "Governance system up and running",
  },
  {
    number: "04",
    title: "Ongoing operation",
    description: "Monthly review, proactive adjustments and a cumulative savings report.",
    duration: "MRR",
    deliverable: "Monthly report with documented ROI",
  },
];

/* ── Stack ───────────────────────────────────────────────────────────────── */

const STACK_ES = [
  { name: "IaC", items: ["Terraform", "AWS CDK", "Pulumi", "CloudFormation"] },
  { name: "Observabilidad", items: ["Datadog", "Grafana", "Prometheus", "CloudWatch"] },
  { name: "Seguridad", items: ["GuardDuty", "Security Hub", "Vault", "AWS WAF"] },
  { name: "FinOps", items: ["AWS Cost Explorer", "GCP Cost Management", "Spot.io"] },
  { name: "CI/CD", items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Jenkins"] },
  { name: "Containers", items: ["Kubernetes", "EKS", "GKE", "Docker", "Helm"] },
];

const STACK_EN = [
  { name: "IaC", items: ["Terraform", "AWS CDK", "Pulumi", "CloudFormation"] },
  { name: "Observability", items: ["Datadog", "Grafana", "Prometheus", "CloudWatch"] },
  { name: "Security", items: ["GuardDuty", "Security Hub", "Vault", "AWS WAF"] },
  { name: "FinOps", items: ["AWS Cost Explorer", "GCP Cost Management", "Spot.io"] },
  { name: "CI/CD", items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Jenkins"] },
  { name: "Containers", items: ["Kubernetes", "EKS", "GKE", "Docker", "Helm"] },
];

/* ── FAQ de respaldo ─────────────────────────────────────────────────────── */

const FAQ_ES = [
  {
    question: "¿Cuánto puedo ahorrar con FinOps?",
    answer:
      "Depende de qué tan optimizado esté hoy tu ambiente: cuanto menos gobierno haya, más margen hay para recortar. No damos una cifra genérica. En la auditoría inicial (gratuita) te entregamos una proyección concreta basada en tu factura actual.",
  },
  {
    question: "¿Cuánto tiempo toma una migración a AWS?",
    answer:
      "Entre 3 y 6 meses para la mayoría de los proyectos, dependiendo del tamaño del ambiente y las interdependencias. Trabajamos con estrategia de rollback en todas las migraciones para garantizar zero downtime.",
  },
  {
    question: "¿Necesito cambiar todo a la vez o puedo migrar gradualmente?",
    answer:
      "Migración gradual es nuestro enfoque recomendado. Empezamos por las cargas de trabajo menos críticas, validamos el proceso y escalamos. Nunca exponemos el negocio a un riesgo innecesario.",
  },
  {
    question: "¿Pueden gestionar nuestra infraestructura existente en AWS?",
    answer:
      "Sí. Hacemos una auditoría del ambiente actual, identificamos oportunidades de mejora y asumimos la operación. El proceso de onboarding típicamente toma 2-3 semanas.",
  },
  {
    question: "¿Trabajan solo con AWS o también con GCP y Azure?",
    answer:
      "Las tres. Aunque nuestra mayor experiencia y certificaciones son en AWS, tenemos proyectos activos en GCP (especialmente con Vertex AI y BigQuery) y Azure (con Azure OpenAI). Multi-cloud también.",
  },
];

const FAQ_EN = [
  {
    question: "How much can I save with FinOps?",
    answer:
      "It depends on how optimised your environment already is: the less governance there is today, the more room there is to cut. We do not quote a generic figure. In the initial audit (free) we give you a concrete projection based on your current bill.",
  },
  {
    question: "How long does an AWS migration take?",
    answer:
      "Between 3 and 6 months for most projects, depending on the size of the environment and its interdependencies. We work with a rollback strategy on every migration to guarantee zero downtime.",
  },
  {
    question: "Do I have to move everything at once or can I migrate gradually?",
    answer:
      "Gradual migration is our recommended approach. We start with the least critical workloads, validate the process and scale up. We never expose the business to unnecessary risk.",
  },
  {
    question: "Can you manage our existing infrastructure on AWS?",
    answer:
      "Yes. We audit the current environment, identify improvement opportunities and take over the operation. Onboarding typically takes 2-3 weeks.",
  },
  {
    question: "Do you work only with AWS, or with GCP and Azure too?",
    answer:
      "All three. Our deepest experience and certifications are on AWS, but we have active projects on GCP (especially with Vertex AI and BigQuery) and Azure (with Azure OpenAI). Multi-cloud as well.",
  },
];

export default async function CloudPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const [cms, uiLabels] = await Promise.all([getServicioData("cloud", locale), getAllUiLabels()]);
  const subs = cms ? await getSubserviciosData(cms.id, locale) : [];
  const cmsSubItems = subs.map((s) => ({
    slug: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    icon: s.icon,
  }));
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Request a free audit" : "Solicitar auditoría gratuita",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See a real savings case" : "Ver caso de ahorro real",
      url: "/casos-de-exito",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: "Cloud Computing (AWS, GCP, Azure)",
    description: isEn
      ? "Multi-cloud architecture, migration, DevOps, SRE and cost optimisation with a FinOps approach."
      : "Arquitectura multi-cloud, migración, DevOps, SRE y optimización de costos con enfoque FinOps.",
    url: "/servicios/cloud",
    serviceType: "Cloud Computing Consulting",
  });

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="diagonal"
        badge="Cloud · AWS · GCP · Azure"
        h1={cms?.title || (isEn ? "Cloud with real governance" : "Cloud con gobierno real")}
        // El acento decía «y 40% menos de costos»: una cifra de resultado sin fuente
        // publicada. Se reemplaza por una promesa cualitativa en los dos idiomas.
        // Encadena sin repetir conjunción con el título de BD («Cloud con gobierno y
        // FinOps» / «Cloud with Governance & FinOps»), que es el que se pinta.
        h1Accent={isEn ? "to keep spend under control" : "para mantener el gasto bajo control"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "We design, migrate and operate your cloud infrastructure with the industry's best practices. FinOps from day one."
            : "Diseñamos, migramos y operamos tu infraestructura cloud con las mejores prácticas de la industria. FinOps desde el día uno.")
        }
        bullets={
          isEn
            ? [
                "Lower cloud spend under FinOps governance",
                "Migrations with guaranteed zero downtime",
                "Committed uptime SLA in continuous operation",
              ]
            : [
                "Menos gasto cloud con gobierno FinOps",
                "Migraciones con zero downtime garantizado",
                "SLA de uptime comprometido en operación continua",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={<HeroCalculator type="cloud" accentColor={ACCENT} />}
        dataSection="cloud-hero"
        ariaLabel={
          isEn
            ? "Cloud with real governance — AWS, GCP and Azure with real FinOps to keep spend under control"
            : "Cloud con gobierno real — AWS, GCP y Azure con FinOps real para mantener el gasto bajo control"
        }
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      {/* Sub-services */}
      <CmsSubServicesGrid
        cmsItems={cmsSubItems}
        fallback={(isEn ? SUB_SERVICES_EN : SUB_SERVICES_ES).map((s) => ({
          icon: s.icon,
          title: s.title,
          description: s.description,
          href: s.href,
        }))}
        parentSlug="cloud"
        titleEs="Soluciones especializadas"
        titleEn="Specialised solutions"
        locale={locale}
        iconColor="cyan"
      />

      <ClientLogosBar
        title={isEn ? "Managed cloud for" : "Cloud gestionado para"}
        logos={isEn ? LOGOS_EN : LOGOS_ES}
      />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Beneficios del enfoque Cloud"
        titleEn="Benefits of the Cloud approach"
        locale={locale}
      />

      <ProcessTimeline
        title={isEn ? "FinOps process in 6 weeks" : "Proceso FinOps en 6 semanas"}
        accentColor={ACCENT}
        steps={isEn ? PROCESS_EN : PROCESS_ES}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Cómo lo entregamos"
        titleEn="How we deliver"
        locale={locale}
      />

      <TechStackGrid
        title={isEn ? "Tools we use" : "Herramientas que usamos"}
        categories={isEn ? STACK_EN : STACK_ES}
      />

      <FAQAccordion
        title={uiLabel(uiLabels, "servicio.cloud_faqs_title", locale)}
        schemaEnabled
        faqs={cms?.faqs?.length ? cms.faqs : /* LEGACY FALLBACK */ isEn ? FAQ_EN : FAQ_ES}
      />

      <InlineContactForm
        title={isEn ? "Is your cloud bill growing?" : "¿Tu factura cloud está creciendo?"}
        subtitle={
          isEn
            ? "We analyse your current spend and show you where the savings are."
            : "Analizamos tu gasto actual y te mostramos dónde está el ahorro."
        }
        serviceDefault="cloud"
      />
    </PageWrapper>
  );
}
