// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// todo el copy duro de esta página salía en español en /en/services/cloud/aws-migration.
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
  const cms = await getServicioData("migracion-aws", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/migracion-aws",
    title:
      cms?.seoTitle ||
      (isEn
        ? "AWS Migration | Cloud Migration Without Interruptions"
        : "Migración a AWS | Cloud Migration sin Interrupciones"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "We migrate your workloads to AWS with a zero-downtime strategy, a planned rollback and cost optimisation from day one."
        : "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno."),
  });
}

/* ── Principios de diseño (reemplazan a MetricsBar) ──────────────────────── */

const PRINCIPLES_ES = [
  "Migración sin downtime con plan de rollback probado",
  "Estrategia 6R definida workload por workload",
  "IaC y runbooks entregados al cierre del proyecto",
  "FinOps incluido desde el diseño de la migración",
];

const PRINCIPLES_EN = [
  "Migration with no downtime and a tested rollback plan",
  "A 6R strategy defined workload by workload",
  "IaC and runbooks handed over when the project closes",
  "FinOps built in from the migration design",
];

const BENEFITS_ES = [
  {
    icon: "clipboard-check",
    title: "Assessment y estrategia de migración",
    description:
      "Evaluamos tu infraestructura actual, definimos la estrategia de migración (rehost, replatform, refactor) y el roadmap paso a paso.",
  },
  {
    icon: "shield-check",
    title: "Zero downtime con rollback",
    description:
      "Migración sin interrupciones con plan de rollback probado, validación continua y cutover controlado para cero impacto en tu operación.",
  },
  {
    icon: "gauge",
    title: "Optimización post-migración",
    description:
      "Rightsizing, reserved instances y monitoreo de costos desde el primer día en AWS para maximizar tu inversión en la nube.",
  },
];

const BENEFITS_EN = [
  {
    icon: "clipboard-check",
    title: "Assessment and migration strategy",
    description:
      "We evaluate your current infrastructure, define the migration strategy (rehost, replatform, refactor) and the step-by-step roadmap.",
  },
  {
    icon: "shield-check",
    title: "Zero downtime with rollback",
    description:
      "Migration without interruptions, with a tested rollback plan, continuous validation and a controlled cutover so your operation is never affected.",
  },
  {
    icon: "gauge",
    title: "Post-migration optimisation",
    description:
      "Rightsizing, reserved instances and cost monitoring from your first day on AWS, so the cloud investment pays off.",
  },
];

const STRATEGIES_ES = [
  {
    icon: "☁️",
    label: "Rehost (Lift & Shift)",
    url: "/servicios/cloud/migracion-aws",
    description: "Mueve tus servidores tal cual a EC2 con mínimo cambio.",
  },
  {
    icon: "⚙️",
    label: "Replatform",
    url: "/servicios/cloud/migracion-aws",
    description: "Migra con ajustes para aprovechar servicios managed de AWS.",
  },
  {
    icon: "🛠️",
    label: "Refactor",
    url: "/servicios/cloud/migracion-aws",
    description: "Rediseña tu app para arquitectura cloud-native.",
  },
  {
    icon: "📦",
    label: "Repurchase",
    url: "/servicios/cloud/migracion-aws",
    description: "Reemplaza software on-premise por SaaS equivalente.",
  },
  {
    icon: "🔒",
    label: "Retain / Retire",
    url: "/servicios/cloud/migracion-aws",
    description: "Decide qué mantener on-prem y qué decomisionar.",
  },
];

const STRATEGIES_EN = [
  {
    icon: "☁️",
    label: "Rehost (Lift & Shift)",
    url: "/servicios/cloud/migracion-aws",
    description: "Move your servers to EC2 as they are, with minimal change.",
  },
  {
    icon: "⚙️",
    label: "Replatform",
    url: "/servicios/cloud/migracion-aws",
    description: "Migrate with tweaks that take advantage of AWS managed services.",
  },
  {
    icon: "🛠️",
    label: "Refactor",
    url: "/servicios/cloud/migracion-aws",
    description: "Redesign your app for a cloud-native architecture.",
  },
  {
    icon: "📦",
    label: "Repurchase",
    url: "/servicios/cloud/migracion-aws",
    description: "Replace on-premise software with an equivalent SaaS.",
  },
  {
    icon: "🔒",
    label: "Retain / Retire",
    url: "/servicios/cloud/migracion-aws",
    description: "Decide what stays on-prem and what gets decommissioned.",
  },
];

const COMPARISON_ES = [
  {
    criterion: "Tiempo estimado",
    alternative: "Plazos largos y difíciles de estimar",
    nivelics: "Plazo acotado con metodología probada",
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
];

const COMPARISON_EN = [
  {
    criterion: "Estimated time",
    alternative: "Long timelines, hard to estimate",
    nivelics: "A bounded timeline with a proven methodology",
  },
  {
    criterion: "Downtime risk",
    alternative: "High — no validated playbook",
    nivelics: "Minimal — rollback strategy always active",
  },
  {
    criterion: "AWS certifications",
    alternative: "Not guaranteed",
    nivelics: "AWS Certified Partner team",
  },
  {
    criterion: "Final documentation",
    alternative: "Incomplete or missing",
    nivelics: "IaC + runbooks + documented architecture",
  },
  {
    criterion: "Cost optimisation",
    alternative: "Lift-and-shift with no governance",
    nivelics: "FinOps built into the design",
  },
  {
    criterion: "Security from the start",
    alternative: "Reactive — fixed afterwards",
    nivelics: "Hardening and compliance from day 1",
  },
  {
    criterion: "Post-migration support",
    alternative: "In-house team drained by the project",
    nivelics: "Ongoing operation available",
  },
];

export default async function MigracionAWSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("migracion-aws", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Request an assessment" : "Solicitar assessment",
      url: "/contacto",
    },
    fallbackSecondary: { text: isEn ? "See the benefits" : "Ver beneficios", url: "#beneficios" },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "AWS Migration" : "Migración a AWS",
    description: isEn
      ? "We migrate your workloads to AWS with a zero-downtime strategy, a planned rollback and cost optimisation from day one."
      : "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
    url: "/servicios/cloud/migracion-aws",
    serviceType: "Cloud Migration Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(locale, [
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Migración a AWS", url: "/servicios/cloud/migracion-aws" },
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
        badge="Cloud · AWS Migration"
        h1={cms?.title || (isEn ? "Move to AWS" : "Migra a AWS")}
        h1Accent={isEn ? "with zero downtime" : "sin downtime"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "We migrate your workloads to AWS with a zero-downtime strategy, a planned rollback and cost optimisation from day one."
            : "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.")
        }
        bullets={
          isEn
            ? [
                "Free assessment of your current infrastructure",
                "6R strategy adapted to each workload",
                "Rollback plan tested before every cutover",
              ]
            : [
                "Assessment gratuito de tu infraestructura",
                "Estrategia 6R adaptada a cada workload",
                "Rollback plan probado antes de cada cutover",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={
          <HeroSelector
            title={isEn ? "Choose your migration strategy" : "Elige tu estrategia de migración"}
            accentColor={ACCENT}
            options={isEn ? STRATEGIES_EN : STRATEGIES_ES}
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
        titleEs="Por qué elegir Migración a AWS con Nivelics"
        titleEn="Why choose AWS Migration with Nivelics"
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
            ? "Why migrate with Nivelics instead of doing it with an in-house team?"
            : "¿Por qué migrar con Nivelics vs. hacerlo con equipo interno?"
        }
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        alternativeLabel={isEn ? "In-house migration" : "Migración interna"}
        nivelicsLabel="Nivelics Migration"
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
