import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DollarSign, TrendingDown, PieChart, Eye, BarChart, Settings } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { FinOpsContentEn } from "./content.en";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "FinOps | Cloud Cost Optimization up to 40%"
      : "FinOps Cloud Colombia | Reduce costos AWS y GCP",
    description: isEn
      ? "Real-time cloud financial governance. Automated anomaly alerts and up to 40% savings in 90 days. AWS, GCP and Azure."
      : "Optimización y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento.",
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
    icon: Eye,
    title: "Visibilidad",
    description: "Dashboards en tiempo real de consumo por equipo, servicio y ambiente.",
  },
  {
    icon: TrendingDown,
    title: "Optimización",
    description: "Rightsizing, reserved instances, spot fleet y eliminación de recursos huérfanos.",
  },
  {
    icon: PieChart,
    title: "Asignación de Costos",
    description: "Tagging strategy, showback/chargeback y unit economics por producto.",
  },
  {
    icon: BarChart,
    title: "Forecasting",
    description: "Proyección de costos con modelos predictivos y alertas de anomalías.",
  },
  {
    icon: Settings,
    title: "Gobernanza",
    description: "Políticas automatizadas, budgets y aprobación de recursos costosos.",
  },
  {
    icon: DollarSign,
    title: "Cultura FinOps",
    description: "Capacitación de equipos, ceremonias FinOps y métricas de eficiencia.",
  },
];

export default async function FinOpsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") {
    return <FinOpsContentEn />;
  }

  const serviceSchema = getServiceSchema({
    name: "FinOps — Optimización Financiera Cloud",
    description:
      "Optimización y gobernanza financiera de la nube. Ahorro típico 30-40% en gasto cloud.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-finops/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="finops">FinOps</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Optimiza tu inversión en{" "}
            <span className="bg-gradient-to-r from-finops to-primary bg-clip-text text-transparent">
              cloud hasta un 40%
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Implementamos prácticas FinOps para que cada dólar en la nube genere valor medible para
            tu negocio.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Pilares FinOps</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-finops/10">
                    <Icon size={24} className="text-finops" aria-hidden="true" />
                  </div>
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
                Mapa de gasto actual, identificación de desperdicio, benchmark contra mejores
                prácticas del mercado.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Semana 3-4</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Quick Wins</h3>
              <p className="mt-2 text-sm text-text-70">
                Primeros ahorros implementados: rightsizing, reserved instances, eliminación de
                recursos huérfanos.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Semana 5-6</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Gobierno</h3>
              <p className="mt-2 text-sm text-text-70">
                Políticas automatizadas, alertas de anomalías, dashboards de gobierno y handoff al
                equipo interno.
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-3xl font-bold text-text-100">Resultados típicos</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "30-40%", label: "Reducción de factura cloud" },
              { value: "2-3 sem", label: "Tiempo a primeros ahorros" },
              { value: "5x-10x", label: "ROI del proyecto" },
              { value: "15-30%", label: "Recursos huérfanos eliminados" },
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
        title="¿Por qué FinOps con Nivelics vs. seguir sin gobierno cloud?"
        alternativeLabel="Sin FinOps"
        nivelicsLabel="Nivelics FinOps"
        rows={[
          {
            criterion: "Visibilidad del gasto",
            alternative: "Factura mensual difícil de interpretar",
            nivelics: "Dashboard en tiempo real por equipo y proyecto",
          },
          {
            criterion: "Reducción de costos",
            alternative: "0% — el gasto sigue creciendo",
            nivelics: "30–40% en los primeros 90 días",
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
        ]}
      />

      <CTABanner
        title="¿Cuánto podrías ahorrar en cloud?"
        description="Te hacemos un assessment gratuito de tu gasto actual y te mostramos oportunidades de ahorro."
        buttonText="Solicitar assessment"
      />
    </PageWrapper>
  );
}
