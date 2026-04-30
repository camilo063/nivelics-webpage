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
  const cms = await getServicioData("gestion-contenido", locale);
  return {
    title: cms?.seoTitle || "Gestión de Contenido con IA | SEO y Marketing Automatizado",
    description:
      cms?.seoDescription ||
      "Generación y optimización de contenido a escala con IA. Integración con tu CMS y flujos editoriales.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/gestion-contenido",
      languages: {
        es: "https://www.nivelics.com/servicios/inteligencia-artificial/gestion-contenido",
        en: "https://www.nivelics.com/en/services/artificial-intelligence/content-management",
        "x-default": "https://www.nivelics.com/servicios/inteligencia-artificial/gestion-contenido",
      },
    },
  };
}

export default async function GestionContenidoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("gestion-contenido", locale);
  const serviceSchema = getServiceSchema({
    name: "Gestión de Contenido con IA",
    description:
      "Generación y optimización de contenido a escala con IA. Integración con tu CMS y flujos editoriales.",
    url: "/servicios/inteligencia-artificial/gestion-contenido",
    serviceType: "AI Content Management",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
    {
      name: "Gestión de Contenido",
      url: "/servicios/inteligencia-artificial/gestion-contenido",
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
        badge="IA · Contenido"
        h1={cms?.title || "10x más contenido,"}
        h1Accent="el mismo equipo"
        subtitle={
          cms?.subtitle ||
          "Pipelines de contenido impulsados por IA generativa: desde la ideación hasta la publicación. SEO optimizado, tono de marca consistente y publicación directa a tu CMS."
        }
        bullets={[
          "Artículos, landing pages y descripciones de producto optimizados para SEO",
          "Variantes automáticas por segmento y audiencia",
          "Publicación directa vía API a tu CMS",
        ]}
        ctaPrimary={{ text: "Agendar demo", url: "/contacto" }}
        ctaSecondary={{
          text: "Ver todos los servicios IA",
          url: "/servicios/inteligencia-artificial",
        }}
        accentColor="#8B5CF6"
        rightPanel={
          <HeroSelector
            title="¿Qué tipo de contenido produces?"
            accentColor="#8B5CF6"
            options={[
              {
                icon: "📝",
                label: "Artículos y blog posts",
                url: "/servicios/inteligencia-artificial/gestion-contenido",
                description: "Contenido SEO de alta calidad generado y optimizado con IA",
              },
              {
                icon: "🛍️",
                label: "Descripciones de producto",
                url: "/servicios/inteligencia-artificial/gestion-contenido",
                description: "Fichas de producto únicas y optimizadas a escala",
              },
              {
                icon: "📧",
                label: "Email marketing",
                url: "/servicios/inteligencia-artificial/marketing-crm",
                description: "Secuencias personalizadas con copy que convierte",
              },
              {
                icon: "📱",
                label: "Contenido para redes",
                url: "/servicios/inteligencia-artificial/gestion-contenido",
                description: "Posts adaptados a cada plataforma y audiencia",
              },
              {
                icon: "🔍",
                label: "Optimización SEO",
                url: "/servicios/inteligencia-artificial/gestion-contenido",
                description: "Mejora de contenido existente para posicionamiento",
              },
            ]}
          />
        }
        dataSection="gestion-contenido-hero"
        ariaLabel="Gestión de Contenido con IA — produce 10x más contenido con el mismo equipo"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "10x",
                  label: "Más volumen de producción",
                  sublabel: "con el mismo equipo editorial",
                },
                {
                  value: "80%",
                  label: "Menos tiempo por pieza",
                  sublabel: "de días a horas por contenido",
                },
                {
                  value: "100%",
                  label: "Consistencia de marca",
                  sublabel: "tono de voz aplicado automáticamente",
                },
                {
                  value: "3x",
                  label: "Mejor posicionamiento SEO",
                  sublabel: "por optimización automática de keywords",
                },
              ]
        }
      />

      {/* Comparison */}
      <ComparisonTable
        title="¿Gestión de contenido con IA vs. equipo editorial tradicional?"
        alternativeLabel="Equipo editorial tradicional"
        nivelicsLabel="Nivelics Gestión de Contenido IA"
        rows={[
          {
            criterion: "Volumen de producción",
            alternative: "Limitado por horas del equipo",
            nivelics: "10x el volumen con el mismo equipo",
          },
          {
            criterion: "Optimización SEO",
            alternative: "Manual — depende del conocimiento del editor",
            nivelics: "Automatizada — keywords, estructura y metadata",
          },
          {
            criterion: "Tiempo de publicación",
            alternative: "Días por pieza",
            nivelics: "Horas — desde brief hasta publicado",
          },
          {
            criterion: "Personalización por audiencia",
            alternative: "Un contenido para todos",
            nivelics: "Variantes automáticas por segmento",
          },
          {
            criterion: "Consistencia de marca",
            alternative: "Variable entre autores",
            nivelics: "Tono de voz aplicado de forma consistente",
          },
          {
            criterion: "Análisis de performance",
            alternative: "Revisión manual periódica",
            nivelics: "Feedback loop automático — el agente aprende",
          },
          {
            criterion: "Integración con CMS",
            alternative: "Carga manual al CMS",
            nivelics: "Publicación directa vía API",
          },
        ]}
      />

      {/* FAQ */}
      <FAQAccordion
        title="Preguntas frecuentes sobre Gestión de Contenido con IA"
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿El contenido generado con IA es detectable?",
                  answer:
                    "No si se hace bien. Nuestro pipeline incluye etapas de humanización, revisión de estilo y verificación de originalidad. El contenido pasa por tu flujo editorial antes de publicarse — la IA acelera la producción, no reemplaza el criterio humano.",
                },
                {
                  question: "¿Se integra con mi CMS actual?",
                  answer:
                    "Sí. Tenemos integraciones con WordPress, Contentful, Strapi, Sanity y otros CMS headless. La publicación puede ser directa vía API o pasar por un flujo de aprobación antes del publish.",
                },
                {
                  question: "¿Cómo se mantiene el tono de marca?",
                  answer:
                    "Configuramos un brand voice profile con ejemplos de tu contenido actual, guías de estilo y restricciones. El agente aplica estas reglas de forma consistente en todo el contenido que produce.",
                },
                {
                  question: "¿Funciona para contenido en múltiples idiomas?",
                  answer:
                    "Sí. El agente puede producir contenido en español, inglés, portugués y otros idiomas, adaptando no solo el idioma sino el estilo y las referencias culturales para cada mercado.",
                },
                {
                  question: "¿Cuánto cuesta la generación de contenido con IA?",
                  answer:
                    "El costo por pieza es una fracción del costo editorial tradicional. El modelo incluye una implementación inicial + un MRR por volumen de producción mensual. En el discovery definimos el precio exacto según tu volumen y necesidades.",
                },
              ]
        }
      />

      {/* Contact */}
      <InlineContactForm
        title="¿Listo para escalar tu producción de contenido?"
        subtitle="Cuéntanos sobre tu flujo editorial y diseñamos el pipeline ideal."
        serviceDefault="ia"
        accentColor="#8B5CF6"
      />

      <StickyMobileCta text="Hablar con un experto →" url="/contacto" accentColor="#8B5CF6" />
    </PageWrapper>
  );
}
