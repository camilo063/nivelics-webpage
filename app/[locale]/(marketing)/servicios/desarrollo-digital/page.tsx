import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Globe, ShoppingCart, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "Desarrollo de Software y Apps | Plataformas Digitales",
  description:
    "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles y arquitectura moderna.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/desarrollo-digital",
    languages: {
      es: "https://www.nivelics.com/servicios/desarrollo-digital",
      en: "https://www.nivelics.com/en/services/digital-development",
      "x-default": "https://www.nivelics.com/servicios/desarrollo-digital",
    },
  },
};

const SUB_SERVICES = [
  {
    icon: Smartphone,
    title: "Apps Móviles",
    description:
      "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
    href: "/servicios/desarrollo-digital/apps-moviles",
  },
  {
    icon: Globe,
    title: "Plataformas Web",
    description:
      "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    href: "/servicios/desarrollo-digital/plataformas-web",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP.",
    href: "/servicios/desarrollo-digital/ecommerce",
  },
];

export default function DesarrolloDigitalPage() {
  const serviceSchema = getServiceSchema({
    name: "Desarrollo Digital",
    description:
      "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles.",
    url: "/servicios/desarrollo-digital",
    serviceType: "Software Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
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
                question: "¿Qué tecnologías usa Nivelics para desarrollo de software?",
                answer:
                  "Usamos React, Next.js y Node.js para aplicaciones web, React Native y Flutter para apps móviles, y arquitecturas serverless y de microservicios con APIs RESTful y GraphQL. Elegimos la stack según las necesidades del proyecto.",
              },
              {
                question: "¿Cuánto tiempo toma desarrollar un MVP?",
                answer:
                  "Un MVP funcional puede estar listo en 6-10 semanas usando metodología lean y sprints ágiles. Esto incluye product discovery, diseño UX, desarrollo, QA y despliegue en producción.",
              },
              {
                question: "¿Nivelics desarrolla aplicaciones móviles nativas?",
                answer:
                  "Sí, desarrollamos apps móviles nativas para iOS (Swift) y Android (Kotlin), así como aplicaciones cross-platform con React Native y Flutter. Recomendamos el enfoque óptimo según el presupuesto, timeline y requerimientos técnicos del proyecto.",
              },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="dev">Desarrollo Digital</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Productos digitales que{" "}
            <span className="bg-gradient-to-r from-dev to-ia bg-clip-text text-transparent">
              generan impacto
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Diseñamos y desarrollamos productos digitales con arquitectura moderna, metodologías
            ágiles y foco en la experiencia del usuario.
          </p>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                    <Icon size={24} className="text-dev" aria-hidden="true" />
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
        title="¿Tienes un proyecto digital en mente?"
        description="Te ayudamos a convertir tu idea en un producto funcional y escalable."
        buttonText="Iniciar proyecto"
      />
    </PageWrapper>
  );
}
