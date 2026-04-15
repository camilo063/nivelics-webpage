import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { FinOpsContentEn } from "./content.en";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const cms = await getServicioData("finops", locale as Locale);

  return {
    title:
      cms?.seoTitle ||
      (isEn
        ? "FinOps | Cloud Cost Optimization up to 40%"
        : "FinOps Cloud Colombia | Reduce costos AWS y GCP"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Real-time cloud financial governance. Automated anomaly alerts and up to 40% savings in 90 days. AWS, GCP and Azure."
        : "Optimizaci\u00f3n y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento."),
    alternates: {
      canonical: "https://www.nivelics.com/servicios/cloud/finops",
      languages: {
        es: "https://www.nivelics.com/servicios/cloud/finops",
        en: "https://www.nivelics.com/en/services/cloud/finops",
        "x-default": "https://www.nivelics.com/servicios/cloud/finops",
      },
    },
  };
}

const PILLARS = [
  {
    icon: "dia-search",
    title: "Visibilidad",
    description: "Dashboards en tiempo real de consumo por equipo, servicio y ambiente.",
  },
  {
    icon: "hex-chart",
    title: "Optimizaci\u00f3n",
    description:
      "Rightsizing, reserved instances, spot fleet y eliminaci\u00f3n de recursos hu\u00e9rfanos.",
  },
  {
    icon: "dia-trend",
    title: "Asignaci\u00f3n de Costos",
    description: "Tagging strategy, showback/chargeback y unit economics por producto.",
  },
  {
    icon: "oct-monitor",
    title: "Forecasting",
    description: "Proyecci\u00f3n de costos con modelos predictivos y alertas de anomal\u00edas.",
  },
  {
    icon: "dia-flow",
    title: "Gobernanza",
    description: "Pol\u00edticas automatizadas, budgets y aprobaci\u00f3n de recursos costosos.",
  },
  {
    icon: "dia-target",
    title: "Cultura FinOps",
    description: "Capacitaci\u00f3n de equipos, ceremonias FinOps y m\u00e9tricas de eficiencia.",
  },
];

export default async function FinOpsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getServicioData("finops", locale as Locale);

  if (locale === "en") {
    return <FinOpsContentEn />;
  }

  const serviceSchema = getServiceSchema({
    name: "FinOps \u2014 Optimizaci\u00f3n Financiera Cloud",
    description:
      "Optimizaci\u00f3n y gobernanza financiera de la nube. Ahorro t\u00edpico 30-40% en gasto cloud.",
    url: "/servicios/cloud/finops",
    serviceType: "FinOps Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
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
        badge="Cloud \u00b7 FinOps"
        h1={cms?.title || "Optimiza tu inversi\u00f3n en cloud"}
        h1Accent="hasta un 40%"
        subtitle={
          cms?.subtitle ||
          "Implementamos pr\u00e1cticas FinOps para que cada d\u00f3lar en la nube genere valor medible para tu negocio."
        }
        bullets={[
          "Dashboards de gasto en tiempo real",
          "Alertas autom\u00e1ticas de anomal\u00edas",
          "Ahorro t\u00edpico del 30-40% en 90 d\u00edas",
        ]}
        ctaPrimary={{ text: "Solicitar assessment gratuito", url: "/contacto" }}
        ctaSecondary={{ text: "Ver metodolog\u00eda", url: "#pilares" }}
        accentColor="#3B82F6"
        rightPanel={<HeroCalculator type="cloud" accentColor="#3B82F6" />}
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "40%",
                  label: "Reducci\u00f3n de factura",
                  sublabel: "Promedio en 90 d\u00edas",
                },
                {
                  value: "5x",
                  label: "ROI del proyecto",
                  sublabel: "Retorno sobre inversi\u00f3n",
                },
                { value: "2", label: "Semanas a primer ahorro", sublabel: "Quick wins inmediatos" },
                {
                  value: "30%",
                  label: "Recursos hu\u00e9rfanos",
                  sublabel: "Eliminados en auditor\u00eda",
                },
              ]
        }
      />

      <section id="pilares" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Pilares FinOps</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => {
              const iconName = pillar.icon;
              return (
                <div key={pillar.title} className="glass glow-hover rounded-xl p-6">
                  <GeoIconBox name={iconName} size={20} color="cyan" />
                  <h3 className="text-lg font-semibold text-text-100">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Nuestro proceso FinOps en 6 semanas</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Semana 1-2</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Discovery</h3>
              <p className="mt-2 text-sm text-text-70">
                Mapa de gasto actual, identificaci\u00f3n de desperdicio, benchmark contra mejores
                pr\u00e1cticas del mercado.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Semana 3-4</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Quick Wins</h3>
              <p className="mt-2 text-sm text-text-70">
                Primeros ahorros implementados: rightsizing, reserved instances, eliminaci\u00f3n de
                recursos hu\u00e9rfanos.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Semana 5-6</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Gobierno</h3>
              <p className="mt-2 text-sm text-text-70">
                Pol\u00edticas automatizadas, alertas de anomal\u00edas, dashboards de gobierno y
                handoff al equipo interno.
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-3xl font-bold text-text-100">Resultados t\u00edpicos</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "30-40%", label: "Reducci\u00f3n de factura cloud" },
              { value: "2-3 sem", label: "Tiempo a primeros ahorros" },
              { value: "5x-10x", label: "ROI del proyecto" },
              { value: "15-30%", label: "Recursos hu\u00e9rfanos eliminados" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">{r.value}</div>
                <p className="mt-2 text-sm text-text-70">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="\u00bfPor qu\u00e9 FinOps con Nivelics vs. seguir sin gobierno cloud?"
        alternativeLabel="Sin FinOps"
        nivelicsLabel="Nivelics FinOps"
        rows={[
          {
            criterion: "Visibilidad del gasto",
            alternative: "Factura mensual dif\u00edcil de interpretar",
            nivelics: "Dashboard en tiempo real por equipo y proyecto",
          },
          {
            criterion: "Reducci\u00f3n de costos",
            alternative: "0% \u2014 el gasto sigue creciendo",
            nivelics: "30\u201340% en los primeros 90 d\u00edas",
          },
          {
            criterion: "Arquitecturas hu\u00e9rfanas",
            alternative: "Frecuentes \u2014 nadie las detecta",
            nivelics: "Eliminadas en auditor\u00eda inicial",
          },
          {
            criterion: "Alertas de anomal\u00edas",
            alternative: "Manuales o inexistentes",
            nivelics: "Automatizadas con umbrales configurados",
          },
          {
            criterion: "Rightsizing de recursos",
            alternative: "Nunca se ejecuta",
            nivelics: "Revisi\u00f3n mes a mes incluida",
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
        ]}
      />

      <CTABanner
        title="\u00bfCu\u00e1nto podr\u00edas ahorrar en cloud?"
        description="Te hacemos un assessment gratuito de tu gasto actual y te mostramos oportunidades de ahorro."
        buttonText="Solicitar assessment"
      />

      <StickyMobileCta
        text="Solicitar auditor\u00eda \u2192"
        url="/contacto"
        accentColor="#3B82F6"
      />
    </PageWrapper>
  );
}
