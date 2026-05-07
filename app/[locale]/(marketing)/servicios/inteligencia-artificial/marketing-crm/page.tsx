// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
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
  const cms = await getServicioData("marketing-crm", locale);
  return {
    title: cms?.seoTitle || "IA para Marketing y CRM | Personalización a Escala",
    description:
      cms?.seoDescription ||
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
}

export default async function MarketingCRMPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("marketing-crm", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Agendar demo", url: "/contacto" },
    fallbackSecondary: {
      text: "Ver todos los servicios IA",
      url: "/servicios/inteligencia-artificial",
    },
  });
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
      <SiblingServicesNav
        parentService={{
          name: "Inteligencia Artificial",
          nameEn: "Artificial Intelligence",
          accentColor: "#8B5CF6",
        }}
        siblings={[
          {
            name: "Agentes IA",
            nameEn: "AI Agents",
            url: "/servicios/inteligencia-artificial/agentes-ia",
            urlEn: "/en/services/artificial-intelligence/ai-agents",
          },
          {
            name: "Agentes Comerciales",
            nameEn: "Sales Agents",
            url: "/servicios/inteligencia-artificial/agentes-comerciales",
            urlEn: "/en/services/artificial-intelligence/sales-agents",
          },
          {
            name: "Automatización",
            nameEn: "Automation",
            url: "/servicios/inteligencia-artificial/automatizacion-procesos",
            urlEn: "/en/services/artificial-intelligence/process-automation",
          },
          {
            name: "Gestión de Contenido",
            nameEn: "Content Management",
            url: "/servicios/inteligencia-artificial/gestion-contenido",
            urlEn: "/en/services/artificial-intelligence/content-management",
          },
          {
            name: "Marketing y CRM",
            nameEn: "Marketing & CRM",
            url: "/servicios/inteligencia-artificial/marketing-crm",
            urlEn: "/en/services/artificial-intelligence/marketing-crm",
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

      {/* Hero */}
      <HeroSplit
        heroEffect="particles"
        badge="IA · Marketing"
        h1={cms?.title || "Marketing personalizado"}
        h1Accent="a escala real"
        subtitle={
          cms?.subtitle ||
          "Segmentación dinámica, campañas personalizadas 1:1 y análisis predictivo integrado con tu CRM. Cada lead recibe el mensaje correcto en el momento correcto."
        }
        bullets={[
          "Segmentación predictiva que se recalcula en tiempo real",
          "Personalización 1:1 a escala — no genérica, no manual",
          "Sync en tiempo real con Odoo, HubSpot y Salesforce",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="¿Qué optimizas en marketing?"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "🎯",
                label: "Segmentación predictiva",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Audiencias dinámicas basadas en comportamiento e intención",
              },
              {
                icon: "✉️",
                label: "Campañas personalizadas",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Contenido, ofertas y timing 1:1 para cada segmento",
              },
              {
                icon: "📊",
                label: "Análisis de atribución",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Multi-touch con IA — qué touchpoint realmente convierte",
              },
              {
                icon: "🔄",
                label: "Churn prediction",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Anticipa abandono y activa retención automática",
              },
              {
                icon: "💎",
                label: "Lifetime value scoring",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Prioriza inversión según valor potencial del cliente",
              },
            ]}
          />
        }
        dataSection="marketing-crm-hero"
        ariaLabel="IA para Marketing y CRM — personalización de campañas a escala con segmentación predictiva"
      />

      {/* Metrics */}
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
                {
                  value: "3x",
                  label: "Mejor tasa de conversión",
                  sublabel: "por personalización 1:1 a escala",
                },
                {
                  value: "40%",
                  label: "Reducción en costo por lead",
                  sublabel: "menos volumen, mayor intención",
                },
                {
                  value: "24/7",
                  label: "Triggers en tiempo real",
                  sublabel: "respuesta inmediata al comportamiento",
                },
                {
                  value: "100%",
                  label: "Sync con CRM",
                  sublabel: "datos actualizados en tiempo real",
                },
              ]
        }
      />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#8B5CF6"
        titleEs="Por qué elegir Marketing y CRM con Nivelics"
        titleEn="Why choose Marketing & CRM with Nivelics"
        locale={locale}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#8B5CF6"
        titleEs="Proceso de implementación"
        titleEn="Implementation process"
        locale={locale}
      />

      {/* Comparison */}
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

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre Marketing con IA"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿Cómo funciona la segmentación predictiva?",
                  answer:
                    "Analizamos el comportamiento histórico de tus clientes (páginas visitadas, emails abiertos, compras anteriores, interacciones con soporte) y creamos modelos que predicen intención de compra, riesgo de churn y valor potencial. Los segmentos se actualizan en tiempo real con cada nueva interacción.",
                },
                {
                  question: "¿Se integra con mi CRM y herramientas de marketing?",
                  answer:
                    "Sí. Tenemos integraciones nativas con Odoo, HubSpot, Salesforce, ActiveCampaign y Mailchimp. Los datos se sincronizan en tiempo real — no batch — para que los triggers y segmentos estén siempre actualizados.",
                },
                {
                  question: "¿Cuánto mejora la conversión realmente?",
                  answer:
                    "Nuestros clientes ven entre 2x y 4x mejora en tasas de conversión por la combinación de mejor segmentación, personalización 1:1 y timing optimizado. El impacto exacto depende de tu volumen actual y madurez de datos.",
                },
                {
                  question: "¿Necesito mucho historial de datos para empezar?",
                  answer:
                    "Con 3-6 meses de datos de CRM y email marketing ya podemos entrenar los primeros modelos. Mientras más datos históricos, mejor la predicción, pero no necesitas esperar años para ver resultados.",
                },
                {
                  question: "¿La IA envía campañas sin aprobación?",
                  answer:
                    "Solo si tu lo configuras así. Por defecto, las campañas pasan por un flujo de aprobación antes de enviarse. El nivel de autonomía lo defines tu equipo: desde sugerencias que un humano aprueba hasta envíos completamente automatizados con reglas de negocio.",
                },
              ]
        }
      />

      {/* Contact */}
      <InlineContactForm
        title="¿Listo para personalizar tu marketing a escala?"
        subtitle="Cuéntanos sobre tu operación de marketing y diseñamos la solución ideal."
        serviceDefault="ia"
        accentColor="#8B5CF6"
      />

      <StickyMobileCta text="Hablar con un experto →" url="/contacto" accentColor="#8B5CF6" />
    </PageWrapper>
  );
}
