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
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("agentes-comerciales", locale);
  return {
    title: cms?.seoTitle || "Agentes Comerciales Inteligentes | IA para Ventas",
    description:
      cms?.seoDescription ||
      "Agentes de IA que califican leads, hacen seguimiento y escalan oportunidades a tu equipo de ventas.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
      languages: {
        es: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
        en: "https://www.nivelics.com/en/services/artificial-intelligence/sales-agents",
        "x-default":
          "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
      },
    },
  };
}

export default async function AgentesComerciales() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("agentes-comerciales", locale);
  const serviceSchema = getServiceSchema({
    name: "Agentes Comerciales Inteligentes",
    description:
      "Agentes de IA que califican leads, hacen seguimiento y escalan oportunidades a tu equipo de ventas.",
    url: "/servicios/inteligencia-artificial/agentes-comerciales",
    serviceType: "AI Sales Agent Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
    {
      name: "Agentes Comerciales",
      url: "/servicios/inteligencia-artificial/agentes-comerciales",
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
        badge="IA · Ventas"
        h1={cms?.title || "Tu equipo comercial"}
        h1Accent="que nunca descansa"
        subtitle={
          cms?.subtitle ||
          "Agentes de IA que califican leads, hacen seguimiento personalizado y escalan oportunidades reales a tu equipo de ventas. Respuesta inmediata, 24/7, en cualquier canal."
        }
        bullets={[
          "Calificación automática con criterios MEDDPICC personalizados",
          "Seguimiento multicanal: email, WhatsApp, chat en vivo",
          "Sync en tiempo real con Odoo, HubSpot y Salesforce",
        ]}
        ctaPrimary={{ text: "Agendar demo", url: "/contacto" }}
        ctaSecondary={{
          text: "Ver todos los servicios IA",
          url: "/servicios/inteligencia-artificial",
        }}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="¿Qué automatizas en ventas?"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "🎯",
                label: "Calificación de leads",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Scoring automático basado en comportamiento e intención",
              },
              {
                icon: "📩",
                label: "Seguimiento automático",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Cadencias personalizadas por email y WhatsApp",
              },
              {
                icon: "📊",
                label: "Pipeline analytics",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Dashboard en tiempo real con forecast predictivo",
              },
              {
                icon: "🤝",
                label: "Escalamiento inteligente",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Transfiere al vendedor con contexto completo",
              },
              {
                icon: "🔗",
                label: "Integración CRM",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Sync automático con tu CRM sin entrada manual",
              },
            ]}
          />
        }
        dataSection="agentes-comerciales-hero"
        ariaLabel="Agentes Comerciales Inteligentes — IA que califica leads y automatiza seguimiento de ventas"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "10x",
                  label: "Más leads procesados",
                  sublabel: "mismo equipo, sin SDRs adicionales",
                },
                {
                  value: "<5s",
                  label: "Tiempo de respuesta",
                  sublabel: "vs. horas o días del proceso manual",
                },
                {
                  value: "24/7",
                  label: "Seguimiento activo",
                  sublabel: "cadencias que nunca se detienen",
                },
                {
                  value: "40%",
                  label: "Más conversiones",
                  sublabel: "promedio por mejor calificación y timing",
                },
              ]
        }
      />

      {/* Comparison */}
      <ComparisonTable
        title="¿Agentes comerciales con IA vs. proceso de ventas manual?"
        alternativeLabel="Proceso manual actual"
        nivelicsLabel="Nivelics Agentes Comerciales"
        rows={[
          {
            criterion: "Calificación de leads",
            alternative: "SDR revisa uno a uno — lento y subjetivo",
            nivelics: "Agente califica automáticamente con criterios MEDDPICC",
          },
          {
            criterion: "Tiempo de respuesta al lead",
            alternative: "Horas o días hábiles",
            nivelics: "Segundos — 24/7/365",
          },
          {
            criterion: "Seguimiento post-contacto",
            alternative: "Depende de la disciplina del vendedor",
            nivelics: "Automatizado con cadencia configurable",
          },
          {
            criterion: "Integración con CRM",
            alternative: "Entrada manual — datos incompletos",
            nivelics: "Sync automático con Odoo, HubSpot, Salesforce",
          },
          {
            criterion: "Personalización del mensaje",
            alternative: "Genérica o requiere mucho tiempo",
            nivelics: "Personalizada con contexto de la empresa del lead",
          },
          {
            criterion: "Escalabilidad",
            alternative: "Requiere más SDRs para más volumen",
            nivelics: "Mismo agente maneja 10x el volumen",
          },
          {
            criterion: "Reportes y analytics",
            alternative: "Hojas de cálculo o CRM básico",
            nivelics: "Dashboard en tiempo real con conversion rates",
          },
        ]}
      />

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre Agentes Comerciales IA"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿El agente comercial reemplaza a mis vendedores?",
                  answer:
                    "No. El agente maneja la calificación inicial, el seguimiento automatizado y la recopilación de contexto. Cuando detecta una oportunidad real, escala al vendedor con toda la información necesaria para cerrar. Tu equipo se enfoca en vender, no en perseguir leads fríos.",
                },
                {
                  question: "¿Cómo se personaliza el scoring de leads?",
                  answer:
                    "Definimos los criterios de calificación junto a tu equipo comercial (industria, cargo, tamaño de empresa, señales de intención, presupuesto). El agente aprende de los cierres exitosos y ajusta el scoring continuamente.",
                },
                {
                  question: "¿Se integra con mi CRM actual?",
                  answer:
                    "Sí. Tenemos conectores pre-construidos para Odoo, HubSpot, Salesforce y Pipedrive. Para otros CRMs, construimos la integración en las primeras semanas del proyecto.",
                },
                {
                  question: "¿Puedo ver qué hace el agente en tiempo real?",
                  answer:
                    "Sí. Tienes un dashboard con cada interacción, scoring aplicado, mensajes enviados y resultados. También configuramos alertas para eventos críticos como leads de alto valor o anomalías.",
                },
                {
                  question: "¿En cuánto tiempo veo resultados?",
                  answer:
                    "El agente está en producción en 6-8 semanas. El impacto en pipeline suele ser visible desde el primer mes, con mejoras incrementales a medida que el modelo de scoring se ajusta con datos reales.",
                },
              ]
        }
      />

      {/* Contact */}
      <InlineContactForm
        title="¿Listo para escalar tu pipeline de ventas?"
        subtitle="Cuéntanos sobre tu proceso comercial y diseñamos el agente ideal."
        serviceDefault="ia"
        accentColor="#8B5CF6"
      />

      <StickyMobileCta text="Hablar con un experto →" url="/contacto" accentColor="#8B5CF6" />
    </PageWrapper>
  );
}
