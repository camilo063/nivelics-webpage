import type { Metadata } from "next";
import { Unplug, Video, Database } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Transformación Digital en Salud | Nivelics",
  description:
    "Soluciones de interoperabilidad, telemedicina y gestión de datos clínicos para el sector salud.",
  alternates: {
    canonical: "https://www.nivelics.com/industrias/salud",
    languages: {
      es: "https://www.nivelics.com/industrias/salud",
      en: "https://www.nivelics.com/en/industries/healthcare",
      "x-default": "https://www.nivelics.com/industrias/salud",
    },
  },
};

const CHALLENGES = [
  {
    icon: Unplug,
    title: "Interoperabilidad de sistemas",
    description:
      "Sistemas legacy aislados que no se comunican entre sí, generando duplicación de datos y errores en la atención al paciente.",
  },
  {
    icon: Video,
    title: "Telemedicina",
    description:
      "Necesidad de plataformas de consulta remota seguras, confiables y que cumplan con regulaciones de privacidad de datos de salud.",
  },
  {
    icon: Database,
    title: "Gestión de datos clínicos",
    description:
      "Volúmenes masivos de datos clínicos que requieren almacenamiento seguro, acceso rápido y analítica para mejorar diagnósticos.",
  },
];

const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Salud",
    description:
      "Modelos predictivos para diagnóstico temprano, NLP para historias clínicas y asistentes virtuales para triaje automatizado.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Salud",
    description:
      "Infraestructura HIPAA-compliant con alta disponibilidad, respaldo de datos clínicos y arquitecturas de integración HL7/FHIR.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Salud",
    description:
      "Ingenieros con experiencia en healthtech, integraciones de sistemas clínicos y regulaciones de datos de salud.",
  },
];

export default function SaludPage() {
  const serviceSchema = getServiceSchema({
    name: "Tecnología para el Sector Salud",
    description:
      "IA, cloud y staffing para empresas de salud que necesitan interoperabilidad, telemedicina y gestión de datos clínicos.",
    url: "/industrias/salud",
    serviceType: "Healthcare Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: "Salud", url: "/industrias/salud" },
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

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Tecnología para el Sector Salud
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Conectamos sistemas, habilitamos telemedicina y transformamos datos clínicos en mejores
            resultados para pacientes.
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Los 3 retos tech de Salud</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{ch.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{ch.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Cómo el marco I+C+S resuelve esto</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((sol) => (
              <div key={sol.title} className="glass glow-hover rounded-xl p-6">
                <ServiceBadge variant={sol.badge} className="mb-4">
                  {sol.badge === "ia"
                    ? "IA"
                    : sol.badge.charAt(0).toUpperCase() + sol.badge.slice(1)}
                </ServiceBadge>
                <h3 className="text-lg font-semibold text-text-100">{sol.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-70">{sol.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Hablemos de tu proyecto en Salud" />
    </PageWrapper>
  );
}
