import type { Metadata } from "next";
import { MessageSquare, Plug, UserCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Agentes de IA para Empresas | Automatización Inteligente",
  description:
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

const BENEFITS = [
  {
    icon: MessageSquare,
    title: "Agentes conversacionales 24/7",
    description:
      "Agentes de IA que atienden consultas, resuelven problemas y generan oportunidades las 24 horas del día, los 7 días de la semana.",
  },
  {
    icon: Plug,
    title: "Integración con CRM y WhatsApp",
    description:
      "Conectamos tus agentes con WhatsApp Business, HubSpot, Salesforce y las herramientas que ya usas.",
  },
  {
    icon: UserCheck,
    title: "Escalamiento inteligente a humanos",
    description:
      "El agente detecta cuándo escalar a un humano, transfiriendo contexto completo para una resolución rápida.",
  },
];

export default function AgentesIAPage() {
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
            Agentes de IA para Empresas
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Diseñamos agentes de IA para ventas, soporte y operaciones. Integración con WhatsApp,
            CRM y plataformas empresariales.
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
        title="¿Por qué agentes IA con Nivelics vs. desarrollo interno?"
        alternativeLabel="Desarrollo interno"
        nivelicsLabel="Nivelics Agentes IA"
        rows={[
          {
            criterion: "Tiempo hasta MVP funcional",
            alternative: "4–6 meses mínimo",
            nivelics: "6–8 semanas",
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

      <CTABanner />
    </PageWrapper>
  );
}
