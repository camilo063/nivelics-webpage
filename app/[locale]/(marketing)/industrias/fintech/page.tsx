import type { Metadata } from "next";
import { ShieldCheck, Server, Users } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "IA y Cloud para Fintech | Nivelics",
  description:
    "Soluciones de inteligencia artificial, cloud e ingeniería para empresas fintech. Compliance, escalabilidad y experiencia de usuario.",
  alternates: {
    canonical: "https://www.nivelics.com/industrias/fintech",
    languages: {
      es: "https://www.nivelics.com/industrias/fintech",
      en: "https://www.nivelics.com/en/industries/fintech",
      "x-default": "https://www.nivelics.com/industrias/fintech",
    },
  },
};

const CHALLENGES = [
  {
    icon: ShieldCheck,
    title: "Compliance regulatorio",
    description:
      "Normativas cambiantes y requisitos de cumplimiento que demandan arquitecturas seguras, auditables y adaptables en tiempo récord.",
  },
  {
    icon: Server,
    title: "Escalabilidad de infraestructura",
    description:
      "Picos de transacciones impredecibles que requieren infraestructura elástica sin comprometer latencia ni disponibilidad.",
  },
  {
    icon: Users,
    title: "Experiencia del usuario",
    description:
      "Usuarios digitales que exigen interfaces intuitivas, onboarding sin fricción y respuestas en milisegundos.",
  },
];

const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Fintech",
    description:
      "Modelos de scoring crediticio, detección de fraude en tiempo real y asistentes virtuales que automatizan la atención al cliente.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Fintech",
    description:
      "Arquitecturas serverless y multi-AZ que escalan automáticamente con cada pico de transacciones, cumpliendo estándares PCI-DSS.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Fintech",
    description:
      "Ingenieros senior con experiencia en banca digital y pagos, integrados a tu equipo en menos de 10 días.",
  },
];

export default function FintechPage() {
  const serviceSchema = getServiceSchema({
    name: "Soluciones Tecnológicas para Fintech",
    description:
      "IA, cloud y staffing para empresas fintech que necesitan compliance, escalabilidad y experiencia de usuario excepcional.",
    url: "/industrias/fintech",
    serviceType: "Fintech Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: "Fintech", url: "/industrias/fintech" },
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
            Transformación Digital para Fintech
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Combinamos inteligencia artificial, infraestructura cloud y talento especializado para
            que tu fintech escale con confianza.
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Los 3 retos tech de Fintech</h2>
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

      <CTABanner title="Hablemos de tu proyecto en Fintech" />
    </PageWrapper>
  );
}
