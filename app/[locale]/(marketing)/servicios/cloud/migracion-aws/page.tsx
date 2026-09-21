// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
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
  const cms = await getServicioData("migracion-aws", locale);
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/migracion-aws",
    title: cms?.seoTitle || "Migración a AWS | Cloud Migration sin Interrupciones",
    description:
      cms?.seoDescription ||
      "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
  });
}

const BENEFITS = [
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

export default async function MigracionAWSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("migracion-aws", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Solicitar assessment", url: "/contacto" },
    fallbackSecondary: { text: "Ver beneficios", url: "#beneficios" },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: "Migración a AWS",
    description:
      "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
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
        badge="Cloud · AWS Migration"
        h1={cms?.title || "Migra a AWS"}
        h1Accent="sin downtime"
        subtitle={
          cms?.subtitle ||
          "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno."
        }
        bullets={[
          "Assessment gratuito de tu infraestructura",
          "Estrategia 6R adaptada a cada workload",
          "Rollback plan probado antes de cada cutover",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#3B82F6"
        rightPanel={
          <HeroSelector
            title="Elige tu estrategia de migración"
            accentColor="#3B82F6"
            options={[
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
                { value: "0", label: "Downtime", sublabel: "Zero interrupciones garantizado" },
                {
                  value: "60%",
                  label: "Más rápido",
                  sublabel: "vs. migración interna",
                },
                { value: "100%", label: "Documentado", sublabel: "IaC + runbooks entregados" },
                { value: "30%", label: "Ahorro desde día 1", sublabel: "FinOps incluido" },
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
        titleEs="Por qué elegir Migración a AWS con Nivelics"
        titleEn="Why choose AWS Migration with Nivelics"
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

      <StickyMobileCta text="Solicitar auditoría →" url="/contacto" accentColor="#3B82F6" />
    </PageWrapper>
  );
}
