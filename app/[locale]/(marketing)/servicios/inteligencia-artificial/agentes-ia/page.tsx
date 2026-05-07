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
  const cms = await getServicioData("agentes-ia", locale);
  return {
    title: cms?.seoTitle || "Agentes de IA para Empresas | Automatización Inteligente",
    description:
      cms?.seoDescription ||
      "Diseñamos agentes de IA para ventas, soporte y operaciones. Integración con WhatsApp, CRM y plataformas empresariales.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-ia",
      languages: {
        es: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-ia",
        en: "https://www.nivelics.com/en/services/artificial-intelligence/ai-agents",
        "x-default": "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-ia",
      },
    },
  };
}

export default async function AgentesIAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("agentes-ia", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Agendar discovery", url: "/contacto" },
    fallbackSecondary: {
      text: "Ver todos los servicios IA",
      url: "/servicios/inteligencia-artificial",
    },
  });
  const serviceSchema = getServiceSchema({
    name: "Agentes de IA para Empresas",
    description:
      "Diseñamos agentes de IA para ventas, soporte y operaciones. Integración con WhatsApp, CRM y plataformas empresariales.",
    url: "/servicios/inteligencia-artificial/agentes-ia",
    serviceType: "AI Agent Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
    { name: "Agentes de IA", url: "/servicios/inteligencia-artificial/agentes-ia" },
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
        badge="Inteligencia Artificial · Agentes"
        h1={cms?.title || "Agentes IA que trabajan"}
        h1Accent="mientras tu duermes"
        subtitle={
          cms?.subtitle ||
          "Agentes autónomos que ejecutan tareas complejas de negocio sin intervención humana. Conectados a tus sistemas, con trazabilidad completa y escalamiento inteligente."
        }
        bullets={[
          "Primer agente en producción en 6-8 semanas",
          "Integrado con tu CRM, ERP y canales de comunicación",
          "Trazabilidad completa: logging, evals y alertas en cada ejecución",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="Casos de uso más comunes"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "📧",
                label: "Calificar leads",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Puntúa y prioriza leads automáticamente con criterios MEDDPICC",
              },
              {
                icon: "📄",
                label: "Procesar documentos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Extrae, clasifica y rutea documentos con IA generativa",
              },
              {
                icon: "💬",
                label: "Atención 24/7",
                url: "/servicios/inteligencia-artificial/agentes-ia",
                description: "Resuelve consultas en cualquier canal sin intervención humana",
              },
              {
                icon: "📊",
                label: "Reportes automáticos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Genera reportes ejecutivos desde tus datos en segundos",
              },
              {
                icon: "🔄",
                label: "Flujos de negocio",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Orquesta procesos multi-paso con decisiones inteligentes",
              },
            ]}
          />
        }
        dataSection="agentes-ia-hero"
        ariaLabel="Agentes de IA para empresas — automatización inteligente con trazabilidad completa"
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
                  value: "6-8",
                  label: "Semanas al primer agente",
                  sublabel: "desde discovery hasta producción",
                },
                {
                  value: "24/7",
                  label: "Disponibilidad",
                  sublabel: "los agentes no tienen horario",
                },
                {
                  value: "50%",
                  label: "Reducción de costos",
                  sublabel: "promedio en tareas automatizadas",
                },
                {
                  value: "100%",
                  label: "Trazabilidad",
                  sublabel: "logging y evals en cada ejecución",
                },
              ]
        }
      />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#8B5CF6"
        titleEs="Por qué elegir Agentes IA con Nivelics"
        titleEn="Why choose AI Agents with Nivelics"
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
        title="¿Por qué agentes IA con Nivelics vs. desarrollo interno?"
        alternativeLabel="Desarrollo interno"
        nivelicsLabel="Nivelics Agentes IA"
        rows={[
          {
            criterion: "Tiempo hasta MVP funcional",
            alternative: "4-6 meses mínimo",
            nivelics: "6-8 semanas",
          },
          {
            criterion: "Expertise en LLMs y RAG",
            alternative: "Requiere contratar perfiles escasos y caros",
            nivelics: "Equipo formado con casos reales entregados",
          },
          {
            criterion: "Evaluación y calidad del agente",
            alternative: "Sin framework de evals definido",
            nivelics: "Evals automatizadas desde el día 1",
          },
          {
            criterion: "Costo de experimentación",
            alternative: "Alto — ensayo y error con tu equipo",
            nivelics: "Reducido — metodología probada en proyectos reales",
          },
          {
            criterion: "Integración con sistemas existentes",
            alternative: "Compleja sin experiencia previa",
            nivelics: "Conectores pre-construidos para los stacks comunes",
          },
          {
            criterion: "Observabilidad del agente",
            alternative: "Inexistente o manual",
            nivelics: "Trazabilidad, logging y alertas completas",
          },
          {
            criterion: "Modelo de mantenimiento",
            alternative: "Tu equipo asume evolución y soporte",
            nivelics: "MRR: Nivelics opera, monitorea y evoluciona",
          },
        ]}
      />

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre Agentes de IA"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿Qué es un agente de IA y en qué se diferencia de un chatbot?",
                  answer:
                    "Un chatbot responde preguntas siguiendo scripts predefinidos. Un agente de IA toma decisiones, ejecuta acciones en tus sistemas (CRM, ERP, bases de datos) y puede orquestar flujos multi-paso de forma autónoma, con escalamiento inteligente a humanos cuando es necesario.",
                },
                {
                  question: "¿Con qué sistemas se integran los agentes?",
                  answer:
                    "Integramos con WhatsApp Business, Slack, HubSpot, Salesforce, Odoo, sistemas ERP, bases de datos SQL/NoSQL, APIs REST y servicios cloud (AWS, GCP, Azure). Si tienes un sistema legacy, construimos conectores personalizados.",
                },
                {
                  question: "¿Cuánto cuesta implementar un agente de IA?",
                  answer:
                    "Un agente simple parte de $8,000 USD en implementación + MRR de operación mensual. En el discovery de la primera semana definimos el costo exacto con ROI proyectado para tu caso específico.",
                },
                {
                  question: "¿Qué pasa si el agente comete errores?",
                  answer:
                    "Implementamos evals automáticas y umbrales de calidad desde el inicio. Si el agente no supera el umbral en una tarea, escala a un humano automáticamente con contexto completo. El monitoreo es continuo y recibes alertas en tiempo real.",
                },
                {
                  question: "¿Mis datos están seguros?",
                  answer:
                    "Sí. Trabajamos con configuraciones que garantizan que tus datos no alimentan el entrenamiento de modelos externos. También ofrecemos opciones on-premise o en tu propia cuenta de AWS Bedrock o Azure OpenAI.",
                },
              ]
        }
      />

      {/* Contact */}
      <InlineContactForm
        title="¿Qué proceso quieres automatizar con agentes IA?"
        subtitle="Cuéntanos tu caso y diseñamos el agente ideal para tu operación."
        serviceDefault="ia"
        accentColor="#8B5CF6"
      />

      <StickyMobileCta text="Hablar con un experto →" url="/contacto" accentColor="#8B5CF6" />
    </PageWrapper>
  );
}
