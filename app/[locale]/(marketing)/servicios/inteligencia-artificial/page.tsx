import type { Metadata } from "next";
import Link from "next/link";
import { Bot, BarChart3, Workflow, FileText, Megaphone, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "IA Aplicada a Negocios | Agentes, Automatización y RAG",
  description:
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

const SUB_SERVICES = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description:
      "Automatización inteligente para ventas, soporte y operaciones. Integración con WhatsApp, CRM y plataformas empresariales.",
    href: "/servicios/inteligencia-artificial/agentes-ia",
  },
  {
    icon: BarChart3,
    title: "Agentes Comerciales",
    description:
      "IA que califica leads, hace seguimiento y escala oportunidades a tu equipo de ventas.",
    href: "/servicios/inteligencia-artificial/agentes-comerciales",
  },
  {
    icon: Workflow,
    title: "Automatización de Procesos",
    description:
      "Eficiencia operacional con RPA + IA. Hasta 50% reducción de tiempo operativo en finanzas, RRHH y logística.",
    href: "/servicios/inteligencia-artificial/automatizacion-procesos",
  },
  {
    icon: FileText,
    title: "Gestión de Contenido",
    description:
      "SEO y marketing automatizado con IA. Generación y optimización de contenido a escala integrado con tu CMS.",
    href: "/servicios/inteligencia-artificial/gestion-contenido",
  },
  {
    icon: Megaphone,
    title: "Marketing y CRM",
    description:
      "Segmentación inteligente, personalización de campañas y análisis predictivo integrado con tu CRM.",
    href: "/servicios/inteligencia-artificial/marketing-crm",
  },
];

export default function IAPage() {
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
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-ia/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="ia">Inteligencia Artificial</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            IA que transforma operaciones en{" "}
            <span className="bg-gradient-to-r from-ia to-primary bg-clip-text text-transparent">
              ventajas competitivas
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Implementamos soluciones de inteligencia artificial que automatizan procesos, generan
            insights accionables y crean experiencias excepcionales para tus usuarios.
          </p>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ia/10">
                    <Icon size={24} className="text-ia" aria-hidden="true" />
                  </div>
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

      <CTABanner
        title="¿Listo para integrar IA en tu operación?"
        description="Agenda una sesión de descubrimiento y te mostramos cómo la IA puede impactar tu negocio."
      />
    </PageWrapper>
  );
}
