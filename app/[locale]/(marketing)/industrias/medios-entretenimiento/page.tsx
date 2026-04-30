import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { HeroEffect } from "@/components/ui/hero-effect";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { IndustriaRichSections } from "@/components/sections/industria-rich-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getIndustriaWebPageSchema, INDUSTRIAS_SCHEMA_DATA } from "@/lib/schema/industria";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getIndustria, mapIndustria } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("medios-entretenimiento");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return {
    title: ind?.seoTitle || "Tecnología para Medios y Entretenimiento",
    description:
      ind?.seoDescription ||
      "Soluciones de streaming, personalización de contenido y monetización digital para empresas de medios y entretenimiento.",
    alternates: {
      canonical: "https://www.nivelics.com/industrias/medios-entretenimiento",
      languages: {
        es: "https://www.nivelics.com/industrias/medios-entretenimiento",
        en: "https://www.nivelics.com/en/industries/media-entertainment",
        "x-default": "https://www.nivelics.com/industrias/medios-entretenimiento",
      },
    },
  };
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: "tv",
    title: "Streaming a escala",
    description:
      "Entregar contenido en vivo y on-demand a millones de usuarios simultáneos con baja latencia y alta disponibilidad.",
  },
  {
    icon: "sparkles",
    title: "Personalización de contenido",
    description:
      "Recomendar el contenido correcto al usuario correcto en el momento correcto para maximizar engagement y retención.",
  },
  {
    icon: "dollar-sign",
    title: "Monetización digital",
    description:
      "Diversificar fuentes de ingreso entre suscripciones, publicidad programática y modelos freemium sin sacrificar experiencia.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Medios",
    description:
      "Motores de recomendación, clasificación automática de contenido y analítica de audiencia con modelos de machine learning.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Medios",
    description:
      "CDN global, transcodificación elástica y arquitecturas serverless que soportan millones de streams concurrentes.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Medios",
    description:
      "Equipos de desarrollo con experiencia en plataformas editoriales, CMS headless y stacks de video digital.",
  },
];

export default async function MediosEntretenimientoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("medios-entretenimiento");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Tecnología para Medios y Entretenimiento",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para empresas de medios que necesitan streaming a escala, personalización y monetización digital.",
    url: "/industrias/medios-entretenimiento",
    serviceType: "Media Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: ind?.name || "Medios y Entretenimiento", url: "/industrias/medios-entretenimiento" },
  ]);
  const webPageSchema = getIndustriaWebPageSchema(INDUSTRIAS_SCHEMA_DATA["medios-entretenimiento"]);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <HeroEffect kind="hex" opacity={0.9} />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
          style={{ zIndex: 1 }}
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {ind?.heroTitle || "IA \u00B7 Cloud \u00B7 Staffing para Medios y Entretenimiento"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Potenciamos plataformas de contenido digital con tecnología que escala, personaliza y monetiza como Televisa/N+, Pulzo, Univision y Crónica."}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Los 3 retos tech de Medios y Entretenimiento
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const iconName = "icon" in ch && typeof ch.icon === "string" ? ch.icon : undefined;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4">
                    <GeoIconBox name={iconName} size={22} color="red" />
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

      {ind && <IndustriaRichSections industria={ind} locale={locale} />}
      {!ind?.ctaTitle && (
        <CTABanner title={ind?.ctaText || "Hablemos de tu proyecto en Medios y Entretenimiento"} />
      )}
    </PageWrapper>
  );
}
