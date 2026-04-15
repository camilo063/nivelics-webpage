import type { Metadata } from "next";
import Link from "next/link";
import { Bot, BarChart3, Workflow, FileText, Megaphone, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("inteligencia-artificial", locale);
  return {
    title: cms?.seoTitle || "IA Aplicada a Negocios | Agentes, Automatización y RAG",
    description:
      cms?.seoDescription ||
      "Soluciones de IA generativa, MLOps y analítica avanzada para automatizar procesos y generar insights accionables.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/inteligencia-artificial",
      languages: {
        es: "https://www.nivelics.com/servicios/inteligencia-artificial",
        en: "https://www.nivelics.com/en/services/artificial-intelligence",
        "x-default": "https://www.nivelics.com/servicios/inteligencia-artificial",
      },
    },
  };
}

const SUB_SERVICES = [
  {
    icon: "bot",
    title: "Agentes de IA",
    description:
      "Automatización inteligente para ventas, soporte y operaciones. Integración con WhatsApp, CRM y plataformas empresariales.",
    href: "/servicios/inteligencia-artificial/agentes-ia",
  },
  {
    icon: "bar-chart3",
    title: "Agentes Comerciales",
    description:
      "IA que califica leads, hace seguimiento y escala oportunidades a tu equipo de ventas.",
    href: "/servicios/inteligencia-artificial/agentes-comerciales",
  },
  {
    icon: "workflow",
    title: "Automatización de Procesos",
    description:
      "Eficiencia operacional con RPA + IA. Hasta 50% reducción de tiempo operativo en finanzas, RRHH y logística.",
    href: "/servicios/inteligencia-artificial/automatizacion-procesos",
  },
  {
    icon: "file-text",
    title: "Gestión de Contenido",
    description:
      "SEO y marketing automatizado con IA. Generación y optimización de contenido a escala integrado con tu CMS.",
    href: "/servicios/inteligencia-artificial/gestion-contenido",
  },
  {
    icon: "megaphone",
    title: "Marketing y CRM",
    description:
      "Segmentación inteligente, personalización de campañas y análisis predictivo integrado con tu CRM.",
    href: "/servicios/inteligencia-artificial/marketing-crm",
  },
];

export default async function IAPage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("inteligencia-artificial", locale);
  const serviceSchema = getServiceSchema({
    name: "Inteligencia Artificial Aplicada",
    description:
      "Soluciones de IA generativa, agentes, MLOps y analítica avanzada para empresas B2B.",
    url: "/servicios/inteligencia-artificial",
    serviceType: "Artificial Intelligence Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
  ]);

  return (
    <PageWrapper>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getFAQSchema([
              {
                question: "¿Qué tipos de IA implementa Nivelics?",
                answer:
                  "Implementamos IA generativa (chatbots, asistentes virtuales con LLMs), analítica avanzada con modelos predictivos, MLOps para pipelines de machine learning en producción, computer vision, NLP/NLU y consultoría estratégica en IA.",
              },
              {
                question: "¿Cuánto tiempo toma un proyecto de IA?",
                answer:
                  "Un MVP de IA puede estar listo en 4-8 semanas dependiendo de la complejidad. Proyectos de analítica avanzada o MLOps en producción suelen tomar entre 8 y 16 semanas, incluyendo integración y validación con datos reales.",
              },
              {
                question: "¿Necesito datos para implementar IA?",
                answer:
                  "Depende del caso de uso. Para modelos predictivos y analítica avanzada sí se requieren datos históricos. Para soluciones de IA generativa con LLMs, podemos arrancar con RAG sobre documentación existente sin necesidad de datasets de entrenamiento propios.",
              },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="diagonal"
        badge="Inteligencia Artificial Aplicada"
        h1={cms?.title || "Agentes IA que"}
        h1Accent="ejecutan tareas reales"
        subtitle={
          cms?.subtitle ||
          "No chatbots. Agentes autónomos integrados con tus sistemas que trabajan 24/7 y se miden con resultados reales."
        }
        bullets={[
          "50% reducción promedio en costos operativos",
          "Primer agente en producción en 6-8 semanas",
          "Integrado con tu CRM, ERP y flujos existentes",
        ]}
        ctaPrimary={{ text: "Ver casos de uso", url: "#sub-services" }}
        ctaSecondary={{ text: "Calcular mi ROI", url: "/contacto" }}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="¿Qué automatizas primero?"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "📧",
                label: "Calificación de leads",
                url: "/servicios/inteligencia-artificial/agentes-comerciales",
                description: "Agente que califica y puntúa leads automáticamente",
              },
              {
                icon: "📄",
                label: "Procesamiento de documentos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Extrae, clasifica y procesa documentos con IA",
              },
              {
                icon: "💬",
                label: "Atención al cliente 24/7",
                url: "/servicios/inteligencia-artificial/agentes-ia",
                description: "Agente que resuelve consultas sin intervención humana",
              },
              {
                icon: "📊",
                label: "Reportes automáticos",
                url: "/servicios/inteligencia-artificial/automatizacion-procesos",
                description: "Genera reportes ejecutivos desde tus datos",
              },
              {
                icon: "🔍",
                label: "Búsqueda inteligente (RAG)",
                url: "/servicios/inteligencia-artificial/agentes-ia",
                description: "Motor de búsqueda sobre documentos internos",
              },
            ]}
          />
        }
        dataSection="ia-hero"
        ariaLabel="Inteligencia Artificial Aplicada — agentes IA autónomos que ejecutan tareas reales de negocio, integrados con tus sistemas"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "50%",
                  label: "Reducción de costos operativos",
                  sublabel: "promedio en proyectos de automatización",
                },
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
                  value: "100%",
                  label: "Trazabilidad",
                  sublabel: "logging y evals en cada ejecución",
                },
              ]
        }
      />

      {/* Sub-services */}
      <section id="sub-services" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const iconName = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <GeoIconBox name={iconName} size={20} color="violet" />
                  <h3 className="text-lg font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Conocer más <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client logos */}
      <ClientLogosBar
        title="IA en producción para"
        logos={[
          { name: "Televisa / N+", sector: "Medios" },
          { name: "Grupo Bolívar", sector: "Fintech" },
          { name: "Pulzo", sector: "Medios digitales" },
          { name: "Crónica", sector: "Medios" },
          { name: "AB InBev-Bavaria", sector: "CPG" },
        ]}
      />

      {/* Tech stack */}
      <TechStackGrid
        title="Stack de IA que implementamos"
        categories={[
          { name: "LLMs", items: ["GPT-4o", "Claude 3.5", "Gemini Pro", "Llama 3"] },
          { name: "Frameworks", items: ["LangChain", "LangGraph", "CrewAI", "AutoGen"] },
          { name: "RAG y vectores", items: ["Pinecone", "Weaviate", "pgvector", "Chroma"] },
          { name: "Cloud IA", items: ["AWS Bedrock", "Google Vertex AI", "Azure OpenAI"] },
          { name: "Observabilidad", items: ["LangSmith", "Weights & Biases", "custom evals"] },
          { name: "Integraciones", items: ["Odoo", "Salesforce", "HubSpot", "WhatsApp API"] },
        ]}
      />

      {/* Process */}
      <ProcessTimeline
        title="Proceso de implementación de IA"
        accentColor="#8B5CF6"
        steps={[
          {
            number: "01",
            title: "Discovery de procesos",
            description: "Identificamos qué procesos tienen mayor ROI al automatizar.",
            duration: "Semana 1",
            deliverable: "Mapa de oportunidades + priorización",
          },
          {
            number: "02",
            title: "POC funcional",
            description: "Construimos una prueba de concepto en tu entorno real.",
            duration: "Semanas 2-3",
            deliverable: "Agente funcionando en staging",
          },
          {
            number: "03",
            title: "MVP a producción",
            description: "Refinamos, integramos y lanzamos a producción con monitoreo.",
            duration: "Semanas 4-8",
            deliverable: "Agente en producción + dashboard",
          },
          {
            number: "04",
            title: "Operación continua",
            description: "Monitoreamos, evaluamos y evolucionamos el agente.",
            duration: "MRR ongoing",
            deliverable: "Reporte mensual de performance",
          },
        ]}
      />

      {/* Case study */}
      <CaseStudyCard
        client="Pulzo"
        sector="Medios Digitales"
        country="Colombia"
        countryFlag="🇨🇴"
        result="Partnership tecnológico de +10 años con IA integrada"
        metric="Millones de visitas mensuales"
        service="IA + Desarrollo Digital"
        url="/casos-de-exito/pulzo"
      />

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre IA"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿Cuánto cuesta implementar un agente de IA?",
                  answer:
                    "Depende del proceso a automatizar y las integraciones requeridas. Un agente simple parte de $8,000 USD en implementación + MRR de operación. En el discovery de la primera semana definimos el costo exacto con ROI proyectado.",
                },
                {
                  question: "¿En cuánto tiempo veo resultados?",
                  answer:
                    "En 6-8 semanas tienes el primer agente en producción. El ROI medible aparece típicamente en el mes 2-3, cuando el volumen procesado supera el costo de implementación.",
                },
                {
                  question: "¿Mis datos se usan para entrenar los modelos?",
                  answer:
                    "No. Trabajamos con configuraciones que garantizan que tus datos no alimentan el entrenamiento de modelos externos. También ofrecemos opciones on-premise o en tu propia cuenta de AWS Bedrock o Azure OpenAI.",
                },
                {
                  question: "¿Qué pasa si el agente comete errores?",
                  answer:
                    "Implementamos evals automáticas y umbrales de calidad desde el inicio. Si el agente no supera el umbral en una tarea, escala a un humano automáticamente. El monitoreo es continuo.",
                },
                {
                  question: "¿La IA reemplaza a mi equipo?",
                  answer:
                    "No. Los agentes de IA manejan las tareas repetitivas y de alto volumen, liberando a tu equipo para trabajo de mayor valor. En todos nuestros proyectos, los equipos cliente terminan más productivos, no más pequeños.",
                },
              ]
        }
      />

      {/* Contact form */}
      <InlineContactForm
        title="¿Qué proceso quieres automatizar?"
        subtitle="Cuéntanos el caso y calculamos el ROI potencial."
        serviceDefault="ia"
      />
    </PageWrapper>
  );
}
