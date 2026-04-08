import type { Metadata } from "next";
import { Target, Clock, TrendingUp } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Agentes Comerciales Inteligentes | IA para Ventas",
  description:
    "Agentes de IA que califican leads, hacen seguimiento y escalan oportunidades a tu equipo de ventas.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
    languages: {
      es: "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
      en: "https://www.nivelics.com/en/services/artificial-intelligence/sales-agents",
      "x-default": "https://www.nivelics.com/servicios/inteligencia-artificial/agentes-comerciales",
    },
  },
};

const BENEFITS = [
  {
    icon: Target,
    title: "Calificación automática de leads",
    description:
      "El agente evalúa y puntúa cada lead según criterios personalizados, priorizando las oportunidades con mayor potencial de cierre.",
  },
  {
    icon: Clock,
    title: "Seguimiento personalizado 24/7",
    description:
      "Seguimiento automático con mensajes contextuales por email, WhatsApp y chat, sin dejar ningún lead sin atender.",
  },
  {
    icon: TrendingUp,
    title: "Analytics de pipeline en tiempo real",
    description:
      "Visibilidad completa del embudo de ventas con métricas de conversión, velocidad de cierre y forecast predictivo.",
  },
];

export default function AgentesComerciales() {
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
            Agentes Comerciales Inteligentes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Agentes de IA que califican leads, hacen seguimiento y escalan oportunidades a tu equipo
            de ventas.
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

      <CTABanner />
    </PageWrapper>
  );
}
