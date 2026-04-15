import type { Metadata } from "next";
import { Globe, Network, CloudCog } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("plataformas-web", locale);
  return {
    title: cms?.seoTitle || "Plataformas Web | Desarrollo Full-Stack Escalable",
    description:
      cms?.seoDescription ||
      "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
      languages: {
        es: "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
        en: "https://www.nivelics.com/en/services/digital-development/web-platforms",
        "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "globe",
    title: "React y Next.js",
    description:
      "Desarrollo frontend con React y Next.js para aplicaciones web rapidas, SEO-friendly y con excelente experiencia de usuario.",
  },
  {
    icon: "network",
    title: "APIs RESTful y GraphQL",
    description:
      "Backend robusto con APIs RESTful y GraphQL disenadas para escalabilidad, seguridad y facilidad de integracion.",
  },
  {
    icon: "cloud-cog",
    title: "Arquitectura serverless",
    description:
      "Despliegue en arquitecturas serverless que escalan automaticamente y eliminan la gestion de infraestructura.",
  },
];

export default async function PlataformasWebPage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("plataformas-web", locale);
  const serviceSchema = getServiceSchema({
    name: "Plataformas Web",
    description:
      "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    url: "/servicios/desarrollo-digital/plataformas-web",
    serviceType: "Web Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    { name: "Plataformas Web", url: "/servicios/desarrollo-digital/plataformas-web" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{
          name: "Desarrollo Digital",
          nameEn: "Digital Development",
          accentColor: "#06B6D4",
        }}
        siblings={[
          {
            name: "Sitios Agentic-First",
            nameEn: "Agentic-First Websites",
            url: "/servicios/desarrollo-digital/sitios-web-agentic",
            urlEn: "/en/services/digital-development/agentic-web",
          },
          {
            name: "Apps Móviles",
            nameEn: "Mobile Apps",
            url: "/servicios/desarrollo-digital/apps-moviles",
            urlEn: "/en/services/digital-development/mobile-apps",
          },
          {
            name: "E-commerce",
            nameEn: "E-commerce",
            url: "/servicios/desarrollo-digital/ecommerce",
            urlEn: "/en/services/digital-development/ecommerce",
          },
          {
            name: "Plataformas Web",
            nameEn: "Web Platforms",
            url: "/servicios/desarrollo-digital/plataformas-web",
            urlEn: "/en/services/digital-development/web-platforms",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="particles"
        badge="Desarrollo Digital &middot; Plataformas Web"
        h1={cms?.title || "Plataforma web"}
        h1Accent="sin limites de escala"
        subtitle={
          cms?.subtitle ||
          "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna, APIs robustas y despliegue serverless que escala con tu negocio sin limites tecnicos."
        }
        bullets={[
          "SaaS, portales empresariales y dashboards a medida",
          "Integracion real con tus sistemas core (ERP, CRM, APIs)",
          "Codigo tuyo, stack estandar -- cero vendor lock-in",
        ]}
        ctaPrimary={{ text: "Cuentanos tu proyecto", url: "/contacto" }}
        ctaSecondary={{ text: "Ver casos de exito", url: "/casos-de-exito" }}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title="Que tipo de plataforma necesitas?"
            accentColor="#06B6D4"
            options={[
              {
                icon: "\u2601\uFE0F",
                label: "SaaS",
                url: "/servicios/desarrollo-digital/plataformas-web",
                description: "Software como servicio multi-tenant escalable",
              },
              {
                icon: "\uD83C\uDFE2",
                label: "Portal empresarial",
                url: "/servicios/desarrollo-digital/plataformas-web",
                description: "Intranet, extranet o portal de clientes",
              },
              {
                icon: "\uD83D\uDCCA",
                label: "Dashboard/Analytics",
                url: "/servicios/desarrollo-digital/plataformas-web",
                description: "Visualizacion de datos y reportes en tiempo real",
              },
              {
                icon: "\uD83D\uDD17",
                label: "Integracion de sistemas",
                url: "/servicios/desarrollo-digital/plataformas-web",
                description: "Middleware y APIs para conectar tus sistemas",
              },
            ]}
          />
        }
        dataSection="plataformas-web-hero"
        ariaLabel="Plataformas web empresariales -- sin limites de escala, SaaS, portales, dashboards e integraciones"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "50+",
                  label: "Plataformas entregadas",
                  sublabel: "SaaS, portales y dashboards",
                },
                { value: "<2s", label: "Tiempo de carga", sublabel: "Core Web Vitals optimizado" },
                { value: "99.9%", label: "Uptime", sublabel: "arquitectura cloud-native" },
                { value: "0", label: "Vendor lock-in", sublabel: "codigo tuyo, stack estandar" },
              ]
        }
      />

      {/* Benefits */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <BenefitCard
                key={b.title}
                title={b.title}
                description={b.description}
                icon={b.icon}
                accentColor="#fbbf24"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable
        title="Plataforma web a medida vs. WordPress o low-code?"
        alternativeLabel="WordPress / Low-code"
        nivelicsLabel="Plataforma a medida -- Nivelics"
        rows={[
          {
            criterion: "Escalabilidad tecnica",
            alternative: "Limitada -- plugins y templates",
            nivelics: "Arquitectura pensada para crecer desde el diseno",
          },
          {
            criterion: "Performance (Core Web Vitals)",
            alternative: "Mediocre por sobrecarga de plugins",
            nivelics: "LCP < 2s, CLS = 0 -- optimizado por diseno",
          },
          {
            criterion: "Seguridad",
            alternative: "Dependiente de plugins de terceros",
            nivelics: "Hardening desde el codigo base",
          },
          {
            criterion: "Customizacion real",
            alternative: "Temas y plugins -- siempre hay limites",
            nivelics: "Sin limites -- codigo propio",
          },
          {
            criterion: "Integracion con sistemas core (ERP, CRM)",
            alternative: "Conectores genericos de mercado",
            nivelics: "APIs a medida para tus sistemas reales",
          },
          {
            criterion: "Costo de mantenimiento a 3 anos",
            alternative: "Creciente -- licencias, plugins, parches",
            nivelics: "Estable y predecible",
          },
          {
            criterion: "Vendor lock-in",
            alternative: "Alto -- dependencia de la plataforma",
            nivelics: "Cero -- codigo tuyo, stack estandar",
          },
        ]}
      />

      <CTABanner />

      <StickyMobileCta text="Cuentanos tu proyecto \u2192" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
