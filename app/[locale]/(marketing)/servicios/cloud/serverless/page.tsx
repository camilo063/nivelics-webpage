import type { Metadata } from "next";
import { Zap, Scaling, DollarSign } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("serverless", locale);
  return {
    title: cms?.seoTitle || "Soluciones Serverless | Escala sin Administrar Servidores",
    description:
      cms?.seoDescription ||
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/cloud/serverless",
      languages: {
        es: "https://www.nivelics.com/servicios/cloud/serverless",
        en: "https://www.nivelics.com/en/services/cloud/serverless",
        "x-default": "https://www.nivelics.com/servicios/cloud/serverless",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "zap",
    title: "Event-driven architecture",
    description:
      "Arquitecturas reactivas que procesan eventos en tiempo real con Lambda, Cloud Functions y Azure Functions.",
  },
  {
    icon: "scaling",
    title: "Auto-scaling nativo",
    description:
      "Escalamiento autom\u00e1tico de cero a millones de requests sin configuraci\u00f3n manual ni gesti\u00f3n de servidores.",
  },
  {
    icon: "dollar-sign",
    title: "Costos basados en uso real",
    description:
      "Paga solo por el tiempo de ejecuci\u00f3n que consumes. Sin servidores idle, sin costos fijos innecesarios.",
  },
];

export default async function ServerlessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("serverless", locale);
  const serviceSchema = getServiceSchema({
    name: "Soluciones Serverless",
    description:
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    url: "/servicios/cloud/serverless",
    serviceType: "Serverless Architecture Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Serverless", url: "/servicios/cloud/serverless" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: "#3B82F6" }}
        siblings={[
          {
            name: "FinOps",
            nameEn: "FinOps",
            url: "/servicios/cloud/finops",
            urlEn: "/en/services/cloud/finops",
          },
          {
            name: "Migración a AWS",
            nameEn: "AWS Migration",
            url: "/servicios/cloud/migracion-aws",
            urlEn: "/en/services/cloud/aws-migration",
          },
          {
            name: "Infraestructura",
            nameEn: "Infrastructure",
            url: "/servicios/cloud/infraestructura",
            urlEn: "/en/services/cloud/infrastructure",
          },
          {
            name: "Seguridad Cloud",
            nameEn: "Cloud Security",
            url: "/servicios/cloud/seguridad",
            urlEn: "/en/services/cloud/security",
          },
          {
            name: "Serverless",
            nameEn: "Serverless",
            url: "/servicios/cloud/serverless",
            urlEn: "/en/services/cloud/serverless",
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

      <HeroSplit
        heroEffect="particles"
        badge="Cloud \u00b7 Serverless"
        h1={cms?.title || "Paga solo lo que usas,"}
        h1Accent="escala sin l\u00edmites"
        subtitle={
          cms?.subtitle ||
          "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Escala de cero a millones sin gestionar servidores."
        }
        bullets={[
          "Auto-scaling de 0 a millones de requests",
          "Pay-per-use real \u2014 sin servidores idle",
          "Cold starts gestionados con warm-up strategies",
        ]}
        ctaPrimary={{ text: "Hablar con un experto", url: "/contacto" }}
        ctaSecondary={{ text: "Ver beneficios", url: "#beneficios" }}
        accentColor="#3B82F6"
        rightPanel={<HeroCalculator type="cloud" accentColor="#3B82F6" />}
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "0",
                  label: "Servidores que gestionar",
                  sublabel: "Infraestructura invisible",
                },
                { value: "70%", label: "Menos costo", sublabel: "vs. servidores dedicados" },
                { value: "100ms", label: "Cold start", sublabel: "Con warm-up strategies" },
                { value: "10x", label: "M\u00e1s r\u00e1pido", sublabel: "Time-to-market" },
              ]
        }
      />

      <section id="beneficios" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <BenefitCard
                key={b.title}
                title={b.title}
                description={b.description}
                icon={b.icon}
                accentColor="#00D4FF"
              />
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="\u00bfServerless con Nivelics vs. arquitectura tradicional?"
        alternativeLabel="Arquitectura tradicional"
        nivelicsLabel="Nivelics Serverless"
        rows={[
          {
            criterion: "Costo de c\u00f3mputo",
            alternative: "Fijo \u2014 pagas aunque no uses los recursos",
            nivelics: "Pay-per-use \u2014 solo lo que consumes",
          },
          {
            criterion: "Escalabilidad",
            alternative: "Manual o semi-autom\u00e1tica",
            nivelics: "Autom\u00e1tica e instant\u00e1nea sin intervenci\u00f3n",
          },
          {
            criterion: "Gesti\u00f3n de servidores",
            alternative: "Tu equipo la absorbe completamente",
            nivelics: "Cero gesti\u00f3n de infraestructura",
          },
          {
            criterion: "Time-to-market",
            alternative: "M\u00e1s lento \u2014 infra previa necesaria",
            nivelics: "M\u00e1s r\u00e1pido \u2014 foco en l\u00f3gica de negocio",
          },
          {
            criterion: "Cold starts",
            alternative: "No aplica",
            nivelics: "Gestionados con warm-up strategies",
          },
          {
            criterion: "Costo a largo plazo",
            alternative: "Predecible pero inflexible",
            nivelics: "Escala con el negocio \u2014 baja en periodos bajos",
          },
        ]}
      />

      <CTABanner />

      <StickyMobileCta
        text="Solicitar auditor\u00eda \u2192"
        url="/contacto"
        accentColor="#3B82F6"
      />
    </PageWrapper>
  );
}
