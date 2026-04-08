import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Cloud, Server, Shield, Zap, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "Servicios Cloud AWS · GCP · Azure | Migración y FinOps",
  description:
    "Arquitectura multi-cloud, migración, DevOps y optimización de costos con enfoque FinOps.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud",
      en: "https://www.nivelics.com/en/services/cloud",
      "x-default": "https://www.nivelics.com/servicios/cloud",
    },
  },
};

const SUB_SERVICES = [
  {
    icon: DollarSign,
    title: "FinOps",
    description:
      "Optimización y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento.",
    href: "/servicios/cloud/finops",
  },
  {
    icon: Cloud,
    title: "Migración a AWS",
    description:
      "Migración de workloads on-premise a la nube con zero downtime y estrategia de rollback.",
    href: "/servicios/cloud/migracion-aws",
  },
  {
    icon: Server,
    title: "Infraestructura Cloud",
    description:
      "Diseño e implementación de arquitecturas en AWS, Azure y GCP con alta disponibilidad.",
    href: "/servicios/cloud/infraestructura",
  },
  {
    icon: Shield,
    title: "Seguridad Cloud",
    description:
      "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end.",
    href: "/servicios/cloud/seguridad",
  },
  {
    icon: Zap,
    title: "Serverless",
    description:
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    href: "/servicios/cloud/serverless",
  },
];

export default function CloudPage() {
  const serviceSchema = getServiceSchema({
    name: "Cloud Computing (AWS, GCP, Azure)",
    description:
      "Arquitectura multi-cloud, migración, DevOps, SRE y optimización de costos con enfoque FinOps.",
    url: "/servicios/cloud",
    serviceType: "Cloud Computing Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
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
                question: "¿En qué plataformas cloud trabaja Nivelics?",
                answer:
                  "Trabajamos con AWS, Google Cloud Platform (GCP) y Microsoft Azure. Diseñamos arquitecturas multi-cloud y ayudamos a elegir la plataforma ideal según los requerimientos técnicos, de compliance y de costos de cada proyecto.",
              },
              {
                question: "¿Cuánto tarda una migración a la nube?",
                answer:
                  "Depende del tamaño y complejidad de los workloads. Migraciones de aplicaciones individuales pueden completarse en 2-4 semanas. Migraciones empresariales completas suelen tomar entre 3 y 6 meses con estrategia de zero downtime y rollback.",
              },
              {
                question: "¿Qué es FinOps y cómo reduce costos cloud?",
                answer:
                  "FinOps es la práctica de gobernanza financiera del gasto en cloud. Incluye visibilidad del consumo, rightsizing, reserved instances, eliminación de recursos huérfanos y políticas automatizadas. Nuestros clientes logran ahorros típicos del 30-40%.",
              },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-cloud/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="cloud">Cloud</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Infraestructura cloud{" "}
            <span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent">
              escalable y segura
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Diseñamos, migramos y operamos tu infraestructura en la nube con las mejores prácticas
            de la industria.
          </p>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones Cloud especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cloud/10">
                    <Icon size={24} className="text-blue-400" aria-hidden="true" />
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
        title="¿Necesitas migrar o optimizar tu cloud?"
        description="Te ayudamos a diseñar la arquitectura ideal para tu negocio."
      />
    </PageWrapper>
  );
}
