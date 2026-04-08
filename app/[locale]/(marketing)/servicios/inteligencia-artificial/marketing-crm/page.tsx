import type { Metadata } from "next";
import { Users, Sparkles, LineChart } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "IA para Marketing y CRM | Personalización a Escala",
  description:
    "Segmentación inteligente, personalización de campañas y análisis predictivo integrado con tu CRM.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/marketing-crm",
    languages: {
      es: "https://www.nivelics.com/servicios/inteligencia-artificial/marketing-crm",
      en: "https://www.nivelics.com/en/services/artificial-intelligence/marketing-crm",
      "x-default": "https://www.nivelics.com/servicios/inteligencia-artificial/marketing-crm",
    },
  },
};

const BENEFITS = [
  {
    icon: Users,
    title: "Segmentación predictiva de audiencias",
    description:
      "Modelos de IA que agrupan a tus clientes por comportamiento, intención de compra y valor potencial para campañas más efectivas.",
  },
  {
    icon: Sparkles,
    title: "Personalización de campañas",
    description:
      "Contenido, ofertas y timing personalizados automáticamente para cada segmento, maximizando tasas de apertura y conversión.",
  },
  {
    icon: LineChart,
    title: "Análisis de churn y lifetime value",
    description:
      "Predicción de abandono y cálculo de valor de vida del cliente para priorizar retención y optimizar inversión en adquisición.",
  },
];

export default function MarketingCRMPage() {
  const serviceSchema = getServiceSchema({
    name: "IA para Marketing y CRM",
    description:
      "Segmentación inteligente, personalización de campañas y análisis predictivo integrado con tu CRM.",
    url: "/servicios/inteligencia-artificial/marketing-crm",
    serviceType: "AI Marketing Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
    {
      name: "Marketing y CRM",
      url: "/servicios/inteligencia-artificial/marketing-crm",
    },
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
        <div className="absolute inset-0 bg-gradient-to-br from-ia/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="ia">Inteligencia Artificial</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            IA para Marketing y CRM
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Segmentación inteligente, personalización de campañas y análisis predictivo integrado
            con tu CRM.
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
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ia/10">
                    <Icon size={24} className="text-ia" aria-hidden="true" />
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
        title="¿Marketing con IA vs. operación de marketing tradicional?"
        alternativeLabel="Marketing tradicional"
        nivelicsLabel="Nivelics Marketing + CRM con IA"
        rows={[
          {
            criterion: "Calificación de prospectos",
            alternative: "Manual — criterios subjetivos del equipo",
            nivelics: "Automática — scoring basado en comportamiento real",
          },
          {
            criterion: "Segmentación de audiencias",
            alternative: "Estática — se actualiza cada campaña",
            nivelics: "Dinámica — se recalcula en tiempo real",
          },
          {
            criterion: "Personalización de campañas",
            alternative: "Genérica o semi-personalizada",
            nivelics: "1:1 a escala — cada lead recibe mensaje relevante",
          },
          {
            criterion: "Tiempo de respuesta al comportamiento",
            alternative: "Próximo envío programado",
            nivelics: "Trigger inmediato basado en la acción del usuario",
          },
          {
            criterion: "Integración CRM",
            alternative: "Sincronización manual o batch",
            nivelics: "Sync en tiempo real — Odoo, HubSpot, Salesforce",
          },
          {
            criterion: "Análisis de atribución",
            alternative: "Last-click o modelo básico",
            nivelics: "Multi-touch con IA — qué touchpoint realmente convierte",
          },
          {
            criterion: "Costo por lead calificado",
            alternative: "Alto — mucho volumen, poca calidad",
            nivelics: "Reducido — menos volumen, mayor intención de compra",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
