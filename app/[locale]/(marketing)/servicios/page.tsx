import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { ServicesGrid } from "@/components/sections";
import { ServiciosHubExtras } from "@/components/sections/servicios-hub-extras";
import { CTABanner } from "@/components/shared";
import { HeroEffect } from "@/components/ui/hero-effect";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale, MappedServicio } from "@/lib/cms/types";

// Fallbacks used only when the DB record is missing or a field is empty.
// The source of truth is the `servicios` row with slug_es='servicios'.
const FALLBACK_HUB_METRICS: MappedServicio["hubMetrics"] = [
  { value: "19+", label: "Soluciones especializadas" },
  { value: "13+", label: "Años de experiencia" },
  { value: "7", label: "Países con proyectos activos" },
  { value: "40%", label: "Reducción de costos cloud" },
];

const FALLBACK_FRAMEWORK_PILLARS: MappedServicio["frameworkPillars"] = [
  {
    letter: "I",
    colorClass: "text-ia",
    borderClass: "border-violet-500/20",
    title: "Inteligencia Artificial",
    desc: "Agentes, automatización y analítica avanzada que miden su propio ROI. No chatbots — producción real.",
  },
  {
    letter: "C",
    colorClass: "text-cloud",
    borderClass: "border-blue-500/20",
    title: "Cloud",
    desc: "Infraestructura multi-cloud con gobierno, seguridad y FinOps desde el día 1. AWS, GCP y Azure certificados.",
  },
  {
    letter: "S",
    colorClass: "text-primary",
    borderClass: "border-cyan-500/20",
    title: "Staffing Premium",
    desc: "Perfiles senior bilingües validados, integrados en 5 días.",
  },
];

const FALLBACK_SECTORS: MappedServicio["sectors"] = [
  { slug: "fintech", icon: "💳", label: "Fintech" },
  { slug: "medios-entretenimiento", icon: "▶", label: "Medios y Entretenimiento" },
  { slug: "salud", icon: "♥", label: "Salud" },
  { slug: "retail-ecommerce", icon: "🛒", label: "Retail y E-commerce" },
  { slug: "logistica", icon: "🚚", label: "Logística" },
  { slug: "manufactura", icon: "⚙", label: "Manufactura" },
];

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const hub = await getServicioData("servicios", locale);

  return {
    title: hub?.seoTitle || "Servicios de Transformación Digital | IA · Cloud · Staffing",
    description:
      hub?.seoDescription ||
      "Descubre nuestras soluciones de Inteligencia Artificial, Cloud, Staff Augmentation y Desarrollo Digital.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios",
      languages: {
        es: "https://www.nivelics.com/servicios",
        en: "https://www.nivelics.com/en/services",
        "x-default": "https://www.nivelics.com/servicios",
      },
    },
  };
}

export default async function ServiciosPage() {
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const hub = await getServicioData("servicios", locale);

  const breadcrumb = getBreadcrumbSchema([
    { name: isEn ? "Home" : "Inicio", url: "/" },
    { name: isEn ? "Services" : "Servicios", url: "/servicios" },
  ]);

  const hubMetrics = hub?.hubMetrics.length ? hub.hubMetrics : FALLBACK_HUB_METRICS;
  const frameworkPillars = hub?.frameworkPillars.length
    ? hub.frameworkPillars
    : FALLBACK_FRAMEWORK_PILLARS;
  const sectors = hub?.sectors.length ? hub.sectors : FALLBACK_SECTORS;

  const frameworkTitle =
    hub?.frameworkTitle ||
    (isEn ? "Why the I+C+S framework works" : "Por qué el marco I+C+S funciona");
  const frameworkSubtitle =
    hub?.frameworkSubtitle ||
    (isEn
      ? "Most companies hire AI, Cloud and Talent separately. We integrate them into a single accountable partner."
      : "La mayoría contrata IA, Cloud y Talento por separado. Nosotros los integramos en un solo aliado con responsabilidad end-to-end.");
  const sectorsTitle =
    hub?.sectorsTitle ||
    (isEn ? "Sectors where we deliver results" : "Sectores donde entregamos resultados");

  const h1 = hub?.title || (isEn ? "Our Services" : "Nuestros Servicios");
  const intro =
    hub?.description ||
    (isEn
      ? "Strategic I+C+S framework: we combine Artificial Intelligence, Cloud and Premium Staffing to drive your digital transformation."
      : "Marco estratégico I+C+S: combinamos Inteligencia Artificial, Cloud y Staffing Premium para impulsar tu transformación digital.");

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section className="relative overflow-hidden py-16 md:py-24">
        <HeroEffect kind="radar" opacity={0.9} />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">{h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">{intro}</p>
        </div>
      </section>
      <ServicesGrid />
      <ServiciosHubExtras
        hubMetrics={hubMetrics}
        frameworkTitle={frameworkTitle}
        frameworkSubtitle={frameworkSubtitle}
        frameworkPillars={frameworkPillars}
        sectorsTitle={sectorsTitle}
        sectors={sectors}
      />
      <CTABanner />
    </PageWrapper>
  );
}
