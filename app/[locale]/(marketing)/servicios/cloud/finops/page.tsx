// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
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
  const isEn = locale === "en";
  const cms = await getServicioData("finops", locale);

  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/finops",
    title:
      cms?.seoTitle ||
      (isEn
        ? "FinOps: cloud cost optimization and governance"
        : "FinOps Cloud Colombia | Reduce costos AWS y GCP"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Real-time cloud financial governance: cost visibility per team and service, automated anomaly alerts and an initial audit that quantifies the savings."
        : "Gobernanza y optimización financiera de la nube: visibilidad por equipo y servicio, alertas de anomalías y una auditoría inicial que cuantifica el ahorro."),
  });
}

const PILLARS_ES = [
  {
    icon: "dia-search",
    title: "Visibilidad",
    description: "Dashboards en tiempo real de consumo por equipo, servicio y ambiente.",
  },
  {
    icon: "hex-chart",
    title: "Optimización",
    description: "Rightsizing, reserved instances, spot fleet y eliminación de recursos huérfanos.",
  },
  {
    icon: "dia-trend",
    title: "Asignación de Costos",
    description: "Tagging strategy, showback/chargeback y unit economics por producto.",
  },
  {
    icon: "oct-monitor",
    title: "Forecasting",
    description: "Proyección de costos con modelos predictivos y alertas de anomalías.",
  },
  {
    icon: "dia-flow",
    title: "Gobernanza",
    description: "Políticas automatizadas, budgets y aprobación de recursos costosos.",
  },
  {
    icon: "dia-target",
    title: "Cultura FinOps",
    description: "Capacitación de equipos, ceremonias FinOps y métricas de eficiencia.",
  },
];

const PILLARS_EN = [
  {
    icon: "dia-search",
    title: "Visibility",
    description: "Real-time dashboards of consumption by team, service and environment.",
  },
  {
    icon: "hex-chart",
    title: "Optimization",
    description: "Rightsizing, reserved instances, spot fleet and orphaned resource elimination.",
  },
  {
    icon: "dia-trend",
    title: "Cost Allocation",
    description: "Tagging strategy, showback/chargeback and unit economics per product.",
  },
  {
    icon: "oct-monitor",
    title: "Forecasting",
    description: "Cost projection with predictive models and anomaly alerts.",
  },
  {
    icon: "dia-flow",
    title: "Governance",
    description: "Automated policies, budgets and expensive resource approval workflows.",
  },
  {
    icon: "dia-target",
    title: "FinOps Culture",
    description: "Team training, FinOps ceremonies and efficiency metrics.",
  },
];

export default async function FinOpsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("finops", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Solicitar assessment gratuito", url: "/contacto" },
    fallbackSecondary: { text: "Ver metodología", url: "#pilares" },
  });

  const pillars = isEn ? PILLARS_EN : PILLARS_ES;

  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "FinOps — Cloud Financial Optimization" : "FinOps — Optimización Financiera Cloud",
    description: isEn
      ? "Cloud financial governance and optimization, with savings quantified in the initial audit."
      : "Gobernanza y optimización financiera de la nube, con el ahorro cuantificado en la auditoría inicial.",
    url: "/servicios/cloud/finops",
    serviceType: "FinOps Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(locale, [
    { name: isEn ? "Home" : "Inicio", url: "/" },
    { name: isEn ? "Services" : "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "FinOps", url: "/servicios/cloud/finops" },
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

      {/*
        H1 fijo a propósito: `servicios.title_*` traía «hasta un 35%» / «by up to 35%», una cifra
        sin respaldo público que además chocaba con el acento y se indexaba como «Optimiza tu
        inversión cloud hasta un 35% hasta un 40%». El H1 queda cualitativo, igual que el resto
        donde sí están sustentadas (bullets y MetricsBar).
      */}
      <HeroSplit
        heroEffect="particles"
        badge="Cloud · FinOps"
        h1={isEn ? "Optimize your cloud investment" : "Optimiza tu inversión cloud"}
        h1Accent={isEn ? "with real FinOps" : "con FinOps real"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "We implement FinOps practices so every dollar in the cloud generates measurable value for your business."
            : "Implementamos prácticas FinOps para que cada dólar en la nube genere valor medible para tu negocio.")
        }
        bullets={
          isEn
            ? [
                "Real-time spend dashboards",
                "Automated anomaly alerts",
                "Savings quantified in the initial audit",
              ]
            : [
                "Dashboards de gasto en tiempo real",
                "Alertas automáticas de anomalías",
                "Ahorro cuantificado en la auditoría inicial",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#3B82F6"
        rightPanel={<HeroCalculator type="cloud" accentColor="#3B82F6" />}
      />

      <DesignPrinciples
        locale={locale}
        principles={
          isEn
            ? [
                "Cost visibility per team, service and environment",
                "Anomaly alerts before the bill arrives",
                "Savings quantified in the initial audit, not promised up front",
                "Handoff to your team with the policies documented",
              ]
            : [
                "Visibilidad de costos por equipo, servicio y ambiente",
                "Alertas de anomalías antes de que llegue la factura",
                "Ahorro cuantificado en la auditoría inicial, no prometido de antemano",
                "Handoff a tu equipo con las políticas documentadas",
              ]
        }
      />

      <section id="pilares" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "FinOps Pillars" : "Pilares FinOps"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="glass glow-hover rounded-xl p-6">
                <GeoIconBox name={pillar.icon} size={20} color="cyan" />
                <h3 className="text-lg font-semibold text-text-100">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-70">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#3B82F6"
        titleEs="Por qué elegir FinOps con Nivelics"
        titleEn="Why choose FinOps with Nivelics"
        locale={locale}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Our FinOps process in 6 weeks" : "Nuestro proceso FinOps en 6 semanas"}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">
                {isEn ? "Week 1-2" : "Semana 1-2"}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Discovery</h3>
              <p className="mt-2 text-sm text-text-70">
                {isEn
                  ? "Current spend mapping, waste identification, benchmark against industry best practices."
                  : "Mapa de gasto actual, identificación de desperdicio, benchmark contra mejores prácticas del mercado."}
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">
                {isEn ? "Week 3-4" : "Semana 3-4"}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Quick Wins</h3>
              <p className="mt-2 text-sm text-text-70">
                {isEn
                  ? "First savings implemented: rightsizing, reserved instances, orphaned resource elimination."
                  : "Primeros ahorros implementados: rightsizing, reserved instances, eliminación de recursos huérfanos."}
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">
                {isEn ? "Week 5-6" : "Semana 5-6"}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">
                {isEn ? "Governance" : "Gobierno"}
              </h3>
              <p className="mt-2 text-sm text-text-70">
                {isEn
                  ? "Automated policies, anomaly alerts, governance dashboards and handoff to internal team."
                  : "Políticas automatizadas, alertas de anomalías, dashboards de gobierno y handoff al equipo interno."}
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-3xl font-bold text-text-100">
            {isEn ? "What the engagement covers" : "Qué incluye el servicio"}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(isEn
              ? [
                  "Audit of current spend, account by account",
                  "Quick wins applied in the first weeks",
                  "Dashboards by team and project",
                  "Policies and alerts left running",
                ]
              : [
                  "Auditoría del gasto actual, cuenta por cuenta",
                  "Quick wins aplicados en las primeras semanas",
                  "Dashboards por equipo y proyecto",
                  "Políticas y alertas funcionando al cierre",
                ]
            ).map((item) => (
              <div key={item} className="glass rounded-xl p-6">
                <p className="text-sm leading-relaxed text-text-70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#3B82F6"
        titleEs="Cómo lo implementamos"
        titleEn="How we deliver"
        locale={locale}
      />

      <ComparisonTable
        title={
          isEn
            ? "Why FinOps with Nivelics vs. no cloud governance?"
            : "¿Por qué FinOps con Nivelics vs. seguir sin gobierno cloud?"
        }
        alternativeLabel={isEn ? "Without FinOps" : "Sin FinOps"}
        nivelicsLabel="Nivelics FinOps"
        rows={
          isEn
            ? [
                {
                  criterion: "Spend visibility",
                  alternative: "Monthly bill hard to interpret",
                  nivelics: "Real-time dashboard by team and project",
                },
                {
                  criterion: "Cost reduction",
                  alternative: "None — spend keeps growing",
                  nivelics: "Quantified in the audit and tracked month to month",
                },
                {
                  criterion: "Orphaned architectures",
                  alternative: "Frequent — nobody detects them",
                  nivelics: "Eliminated in initial audit",
                },
                {
                  criterion: "Anomaly alerts",
                  alternative: "Manual or nonexistent",
                  nivelics: "Automated with configured thresholds",
                },
                {
                  criterion: "Resource rightsizing",
                  alternative: "Never executed",
                  nivelics: "Monthly review included",
                },
                {
                  criterion: "Multi-account governance",
                  alternative: "No tagging structure or budgets",
                  nivelics: "Tagging, policies and budgets configured",
                },
                {
                  criterion: "Time to first savings",
                  alternative: "N/A",
                  nivelics: "Week 2 of the engagement",
                },
                {
                  criterion: "Commercial model",
                  alternative: "N/A",
                  nivelics: "Fixed fee + success fee on real savings",
                },
              ]
            : [
                {
                  criterion: "Visibilidad del gasto",
                  alternative: "Factura mensual difícil de interpretar",
                  nivelics: "Dashboard en tiempo real por equipo y proyecto",
                },
                {
                  criterion: "Reducción de costos",
                  alternative: "Ninguna — el gasto sigue creciendo",
                  nivelics: "Cuantificado en la auditoría y medido mes a mes",
                },
                {
                  criterion: "Arquitecturas huérfanas",
                  alternative: "Frecuentes — nadie las detecta",
                  nivelics: "Eliminadas en auditoría inicial",
                },
                {
                  criterion: "Alertas de anomalías",
                  alternative: "Manuales o inexistentes",
                  nivelics: "Automatizadas con umbrales configurados",
                },
                {
                  criterion: "Rightsizing de recursos",
                  alternative: "Nunca se ejecuta",
                  nivelics: "Revisión mes a mes incluida",
                },
                {
                  criterion: "Gobierno multi-cuenta",
                  alternative: "Sin estructura de tagging ni budgets",
                  nivelics: "Tagging, policies y budgets configurados",
                },
                {
                  criterion: "Tiempo hasta primer ahorro",
                  alternative: "N/A",
                  nivelics: "Semana 2 del engagement",
                },
                {
                  criterion: "Modelo comercial",
                  alternative: "N/A",
                  nivelics: "Fee fijo + success fee sobre ahorro real",
                },
              ]
        }
      />

      <CTABanner
        title={isEn ? "How much could you save on cloud?" : "¿Cuánto podrías ahorrar en cloud?"}
        description={
          isEn
            ? "We'll do a free assessment of your current spend and show you savings opportunities."
            : "Te hacemos un assessment gratuito de tu gasto actual y te mostramos oportunidades de ahorro."
        }
        buttonText={isEn ? "Request assessment" : "Solicitar assessment"}
      />

      <StickyMobileCta
        text={isEn ? "Request audit →" : "Solicitar auditoría →"}
        url="/contacto"
        accentColor="#3B82F6"
      />
    </PageWrapper>
  );
}
