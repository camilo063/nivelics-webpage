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
  const cms = await getServicioData("automatizacion-procesos", locale);
  return {
    title: cms?.seoTitle || "Automatización de Procesos con IA | Eficiencia Operacional",
    description:
      cms?.seoDescription ||
      "Automatizamos procesos en finanzas, RRHH y logística. Hasta 50% reducción de tiempo operativo.",
    alternates: {
      canonical:
        "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
      languages: {
        es: "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
        en: "https://www.nivelics.com/en/services/artificial-intelligence/process-automation",
        "x-default":
          "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
      },
    },
  };
}

export default async function AutomatizacionProcesosPage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("automatizacion-procesos", locale);
  const serviceSchema = getServiceSchema({
    name: "Automatización de Procesos con IA",
    description:
      "Automatizamos procesos en finanzas, RRHH y logística. Hasta 50% reducción de tiempo operativo.",
    url: "/servicios/inteligencia-artificial/automatizacion-procesos",
    serviceType: "Process Automation Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
    {
      name: "Automatización de Procesos",
      url: "/servicios/inteligencia-artificial/automatizacion-procesos",
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
        badge="IA · Automatización"
        h1={cms?.title || "Procesos que tardaban horas,"}
        h1Accent="ahora en segundos"
        subtitle={
          cms?.subtitle ||
          "Combinamos RPA con IA generativa para automatizar flujos complejos que requieren juicio y contexto. Finanzas, RRHH, logística y operaciones — sin reemplazar tus sistemas actuales."
        }
        bullets={[
          "Hasta 50% reducción de tiempo operativo documentado",
          "Integración con sistemas legacy sin necesidad de reemplazarlos",
          "Log completo de cada ejecución para auditoría y compliance",
        ]}
        ctaPrimary={{ text: "Agendar discovery", url: "/contacto" }}
        ctaSecondary={{
          text: "Ver todos los servicios IA",
          url: "/servicios/inteligencia-artificial",
        }}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="¿Qué proceso automatizas?"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "📄",
                label: "Procesamiento de documentos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Extracción, clasificación y ruteo automático de documentos",
              },
              {
                icon: "💰",
                label: "Conciliaciones financieras",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Cruces automáticos entre sistemas contables y bancarios",
              },
              {
                icon: "👥",
                label: "Flujos de RRHH",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Onboarding, nómina y gestión documental automatizada",
              },
              {
                icon: "📦",
                label: "Logística y supply chain",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Seguimiento, alertas y optimización de inventario",
              },
              {
                icon: "📊",
                label: "Reportes ejecutivos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Generación automática desde múltiples fuentes de datos",
              },
            ]}
          />
        }
        dataSection="automatizacion-hero"
        ariaLabel="Automatización de Procesos con IA — eficiencia operacional para finanzas, RRHH y logística"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "50%",
                  label: "Reducción de tiempo operativo",
                  sublabel: "promedio documentado en proyectos",
                },
                { value: "0", label: "Errores humanos", sublabel: "en procesos automatizados" },
                {
                  value: "24/7",
                  label: "Disponibilidad",
                  sublabel: "sin costo adicional por hora extra",
                },
                {
                  value: "30-50%",
                  label: "Ahorro en costos",
                  sublabel: "reducción de costos operativos promedio",
                },
              ]
        }
      />

      {/* Comparison */}
      <ComparisonTable
        title="¿Automatizar con IA vs. seguir con procesos manuales?"
        alternativeLabel="Proceso manual actual"
        nivelicsLabel="Automatización con IA — Nivelics"
        rows={[
          {
            criterion: "Tiempo de ejecución del proceso",
            alternative: "Horas o días según volumen",
            nivelics: "Minutos o segundos — sin importar el volumen",
          },
          {
            criterion: "Errores humanos",
            alternative: "Frecuentes en tareas repetitivas",
            nivelics: "Eliminados en el proceso automatizado",
          },
          {
            criterion: "Disponibilidad",
            alternative: "Horario laboral únicamente",
            nivelics: "24/7/365 sin costo adicional",
          },
          {
            criterion: "Escalabilidad",
            alternative: "Requiere contratar más personas",
            nivelics: "Escala sin costo marginal por unidad",
          },
          {
            criterion: "Costo a largo plazo",
            alternative: "Crece linealmente con el volumen",
            nivelics: "Fijo o decrece — economías de escala reales",
          },
          {
            criterion: "Trazabilidad del proceso",
            alternative: "Difícil de auditar",
            nivelics: "Log completo de cada ejecución",
          },
          {
            criterion: "ROI documentado",
            alternative: "N/A",
            nivelics: "30-50% reducción de costos operativos promedio",
          },
        ]}
      />

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre Automatización de Procesos"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿Qué procesos se pueden automatizar con IA?",
                  answer:
                    "Cualquier proceso repetitivo que involucre documentos, datos o decisiones basadas en reglas: conciliaciones financieras, procesamiento de facturas, onboarding de empleados, generación de reportes, gestión de inventario, aprobaciones y flujos de trabajo multi-paso.",
                },
                {
                  question: "¿Necesito reemplazar mis sistemas actuales?",
                  answer:
                    "No. Nos integramos con tus sistemas existentes (ERP, CRM, bases de datos, herramientas legacy) sin necesidad de migración. Construimos conectores que extraen el máximo valor de tu infraestructura actual.",
                },
                {
                  question: "¿Cuánto tiempo toma implementar la automatización?",
                  answer:
                    "Un proceso típico se automatiza en 4-8 semanas. En la primera semana hacemos un discovery para mapear el proceso actual, identificar cuellos de botella y definir el alcance del MVP.",
                },
                {
                  question: "¿Cómo se mide el ROI de la automatización?",
                  answer:
                    "Medimos tiempo ahorrado, errores eliminados, volumen procesado y costo por transacción antes y después. Nuestros clientes ven entre 30-50% de reducción en costos operativos promedio.",
                },
                {
                  question: "¿Qué pasa con los empleados que hacían esas tareas?",
                  answer:
                    "La automatización libera a tu equipo de tareas repetitivas para que se enfoquen en trabajo de mayor valor: análisis, estrategia, relaciones con clientes. En nuestra experiencia, los equipos terminan más productivos y satisfechos.",
                },
              ]
        }
      />

      {/* Contact */}
      <InlineContactForm
        title="¿Qué proceso quieres automatizar?"
        subtitle="Cuéntanos el caso y calculamos el ROI potencial de la automatización."
        serviceDefault="ia"
        accentColor="#8B5CF6"
      />

      <StickyMobileCta text="Hablar con un experto →" url="/contacto" accentColor="#8B5CF6" />
    </PageWrapper>
  );
}
