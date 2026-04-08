import type { Metadata } from "next";
import { FileText, Pencil, Workflow } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Gestión de Contenido con IA | SEO y Marketing Automatizado",
  description:
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

const BENEFITS = [
  {
    icon: FileText,
    title: "Generación de contenido SEO",
    description:
      "Creación de artículos, landing pages y descripciones de producto optimizados para motores de búsqueda con IA generativa.",
  },
  {
    icon: Pencil,
    title: "Optimización de copy existente",
    description:
      "Análisis y mejora automática de textos existentes para aumentar legibilidad, engagement y posicionamiento SEO.",
  },
  {
    icon: Workflow,
    title: "Flujos editoriales automatizados",
    description:
      "Pipelines de contenido desde la ideación hasta la publicación con revisiones automáticas, aprobaciones y scheduling.",
  },
];

export default function GestionContenidoPage() {
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
            Gestión de Contenido con IA
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Generación y optimización de contenido a escala con IA. Integración con tu CMS y flujos
            editoriales.
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

      <CTABanner />
    </PageWrapper>
  );
}
