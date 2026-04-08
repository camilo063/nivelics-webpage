import type { Metadata } from "next";
import { Cog, Server, BarChart3 } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Automatización de Procesos con IA | Eficiencia Operacional",
  description:
    "Automatizamos procesos en finanzas, RRHH y logística. Hasta 50% reducción de tiempo operativo.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
    languages: {
      es: "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
      en: "https://www.nivelics.com/en/services/artificial-intelligence/process-automation",
      "x-default":
        "https://www.nivelics.com/servicios/inteligencia-artificial/automatizacion-procesos",
    },
  },
};

const BENEFITS = [
  {
    icon: Cog,
    title: "RPA + IA para procesos complejos",
    description:
      "Combinamos robotic process automation con inteligencia artificial para automatizar flujos que requieren juicio y contexto.",
  },
  {
    icon: Server,
    title: "Integración con sistemas legacy",
    description:
      "Conectamos tus sistemas existentes sin necesidad de reemplazarlos, extrayendo el máximo valor de tu infraestructura actual.",
  },
  {
    icon: BarChart3,
    title: "Métricas de eficiencia en tiempo real",
    description:
      "Dashboards con KPIs de productividad, tiempos de proceso y tasas de error para medir el impacto real de la automatización.",
  },
];

export default function AutomatizacionProcesosPage() {
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
            Automatización de Procesos con IA
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Automatizamos procesos en finanzas, RRHH y logística. Hasta 50% reducción de tiempo
            operativo.
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
            nivelics: "30–50% reducción de costos operativos promedio",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
