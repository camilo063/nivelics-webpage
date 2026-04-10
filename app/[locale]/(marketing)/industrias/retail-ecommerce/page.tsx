import type { Metadata } from "next";
import { Layers, Sparkles, Truck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getIndustria, mapIndustria } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("retail-ecommerce");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return {
    title: ind?.seoTitle || "Soluciones Tech para Retail y E-commerce | Nivelics",
    description:
      ind?.seoDescription ||
      "Soluciones de omnicanalidad, personalización y logística last-mile para empresas de retail y e-commerce.",
    alternates: {
      canonical: "https://www.nivelics.com/industrias/retail-ecommerce",
      languages: {
        es: "https://www.nivelics.com/industrias/retail-ecommerce",
        en: "https://www.nivelics.com/en/industries/retail-ecommerce",
        "x-default": "https://www.nivelics.com/industrias/retail-ecommerce",
      },
    },
  };
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: Layers,
    title: "Omnicanalidad",
    description:
      "Integrar tiendas físicas, e-commerce, marketplace y apps móviles en una experiencia de compra unificada y sin fricciones.",
  },
  {
    icon: Sparkles,
    title: "Personalización",
    description:
      "Ofrecer recomendaciones de producto, precios dinámicos y experiencias únicas basadas en el comportamiento de cada cliente.",
  },
  {
    icon: Truck,
    title: "Logística last-mile",
    description:
      "Optimizar la última milla de entrega con visibilidad en tiempo real, rutas inteligentes y gestión eficiente de devoluciones.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Retail",
    description:
      "Motores de recomendación, predicción de demanda, pricing dinámico y chatbots de atención al cliente con IA generativa.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Retail",
    description:
      "Arquitecturas elásticas para picos de venta (Black Friday, Hot Sale), CDN para catálogos y microservicios para checkout.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Retail",
    description:
      "Desarrolladores con experiencia en plataformas e-commerce, integraciones ERP/POS y stacks de pagos digitales.",
  },
];

export default async function RetailEcommercePage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("retail-ecommerce");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Soluciones Tech para Retail y E-commerce",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para empresas de retail que necesitan omnicanalidad, personalización y logística last-mile.",
    url: "/industrias/retail-ecommerce",
    serviceType: "Retail Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: ind?.name || "Retail y E-commerce", url: "/industrias/retail-ecommerce" },
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
            {ind?.heroTitle || "IA \u00B7 Cloud \u00B7 Staffing para Retail y E-commerce"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Conectamos cada canal de venta, personalizamos la experiencia de compra y optimizamos la última milla con tecnología."}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Los 3 retos tech de Retail y E-commerce
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const Icon = "icon" in ch && typeof ch.icon !== "string" ? ch.icon : null;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {Icon ? (
                      <Icon size={24} className="text-primary" aria-hidden="true" />
                    ) : (
                      <Layers size={24} className="text-primary" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{ch.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">
                    {"description" in ch ? ch.description : "desc" in ch ? ch.desc : ""}
                  </p>
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
            {solutions.map((sol) => {
              const badge = "badge" in sol ? sol.badge : null;
              return (
                <div key={sol.title} className="glass glow-hover rounded-xl p-6">
                  {badge && (
                    <ServiceBadge variant={badge} className="mb-4">
                      {badge === "ia" ? "IA" : badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </ServiceBadge>
                  )}
                  <h3 className="text-lg font-semibold text-text-100">{sol.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">
                    {"description" in sol ? sol.description : "desc" in sol ? sol.desc : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner title={ind?.ctaText || "Hablemos de tu proyecto en Retail y E-commerce"} />
    </PageWrapper>
  );
}
