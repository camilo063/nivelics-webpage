// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
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
  const cms = await getServicioData("datos-ia", locale);
  return {
    title: cms?.seoTitle || "Datos e IA | Data Scientists y ML Engineers",
    description:
      cms?.seoDescription ||
      "Data Scientists, Data Engineers y ML Engineers para proyectos de analítica avanzada y machine learning.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/staff-augmentation/datos-ia",
      languages: {
        es: "https://www.nivelics.com/servicios/staff-augmentation/datos-ia",
        en: "https://www.nivelics.com/en/services/staff-augmentation/data-ai",
        "x-default": "https://www.nivelics.com/servicios/staff-augmentation/datos-ia",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "database",
    title: "Pipelines de datos escalables",
    description:
      "Diseño e implementación de pipelines ETL/ELT con Spark, Airflow, dbt y servicios nativos de la nube para procesamiento a escala.",
  },
  {
    icon: "brain",
    title: "Modelos de ML en producción",
    description:
      "Entrenamiento, despliegue y monitoreo de modelos de machine learning en producción con MLflow, SageMaker y Vertex AI.",
  },
  {
    icon: "bar-chart-3",
    title: "Visualización y BI",
    description:
      "Dashboards interactivos y reportes automatizados con Looker, Power BI, Tableau y herramientas open source.",
  },
];

const DATA_ROLES = [
  {
    icon: "\u{1F4CA}",
    label: "Data Engineer",
    url: "/servicios/staff-augmentation/datos-ia",
    description: "Pipelines ETL/ELT, Spark, Airflow, dbt",
  },
  {
    icon: "\u{1F52C}",
    label: "Data Scientist",
    url: "/servicios/staff-augmentation/datos-ia",
    description: "Modelos predictivos, estadística avanzada, Python",
  },
  {
    icon: "\u{1F916}",
    label: "ML Engineer",
    url: "/servicios/staff-augmentation/datos-ia",
    description: "MLOps, MLflow, SageMaker, despliegue de modelos",
  },
  {
    icon: "\u{1F9E0}",
    label: "AI Engineer",
    url: "/servicios/staff-augmentation/datos-ia",
    description: "LLMs, RAG, agentes, integraciones de IA generativa",
  },
];

export default async function DatosIAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("datos-ia", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Ver perfiles disponibles", url: "/contacto" },
    fallbackSecondary: { text: "Conoce el proceso", url: "/servicios/staff-augmentation" },
  });
  const serviceSchema = getServiceSchema({
    name: "Datos e Inteligencia Artificial",
    description:
      "Data Scientists, Data Engineers y ML Engineers para proyectos de analítica avanzada y machine learning.",
    url: "/servicios/staff-augmentation/datos-ia",
    serviceType: "Staff Augmentation",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
    { name: "Datos e IA", url: "/servicios/staff-augmentation/datos-ia" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{
          name: "Staff Augmentation",
          nameEn: "Staff Augmentation",
          accentColor: "#10B981",
        }}
        siblings={[
          {
            name: "Desarrollo de Software",
            nameEn: "Software Development",
            url: "/servicios/staff-augmentation/desarrollo-software",
            urlEn: "/en/services/staff-augmentation/software-development",
          },
          {
            name: "Datos e IA",
            nameEn: "Data & AI",
            url: "/servicios/staff-augmentation/datos-ia",
            urlEn: "/en/services/staff-augmentation/data-ai",
          },
          {
            name: "DevOps & Cloud",
            nameEn: "DevOps & Cloud",
            url: "/servicios/staff-augmentation/devops-cloud",
            urlEn: "/en/services/staff-augmentation/devops-cloud",
          },
          {
            name: "Diseño UX/UI",
            nameEn: "UX/UI Design",
            url: "/servicios/staff-augmentation/diseno-ux-ui",
            urlEn: "/en/services/staff-augmentation/ux-ui-design",
          },
          {
            name: "QA & Seguridad",
            nameEn: "QA & Security",
            url: "/servicios/staff-augmentation/qa-seguridad",
            urlEn: "/en/services/staff-augmentation/qa-security",
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
        badge="Staff Aug · Datos e IA"
        h1={cms?.title || "Expertos en datos e IA"}
        h1Accent="cuando los necesitas"
        subtitle={
          cms?.subtitle ||
          "Data Scientists, Data Engineers, ML Engineers y AI Engineers senior listos para potenciar tus proyectos de analítica avanzada y machine learning."
        }
        bullets={[
          "Candidatos presentados en 5 días hábiles",
          "Ahorro de hasta 40% vs contratar en USA",
          "Garantía de reemplazo sin costo en 10 días",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#10B981"
        rightPanel={
          <HeroSelector
            title="Selecciona el rol que necesitas"
            options={DATA_ROLES}
            accentColor="#10B981"
          />
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({
                value: m.value,
                label: m.label,
                sublabel: "",
                unit: m.unit,
              }))
            : /* LEGACY FALLBACK */ [
                { value: "5", label: "Días hábiles", sublabel: "Hasta primer candidato" },
                { value: "40%", label: "Ahorro promedio", sublabel: "vs contratar en USA" },
                { value: "10", label: "Días garantía", sublabel: "Reemplazo sin costo" },
                { value: "100%", label: "Bilingüe", sublabel: "Español e inglés" },
              ]
        }
      />

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
                accentColor="#4ade80"
              />
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#10B981"
        titleEs="Por qué elegir Datos e IA con Nivelics"
        titleEn="Why choose Data & AI with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#10B981"
        titleEs="Cómo te entregamos talento"
        titleEn="How we deliver talent"
        locale={locale}
      />

      <ComparisonTable
        title="¿Por qué Nivelics vs. contratar directamente?"
        alternativeLabel="Contratar directo en USA/Europa"
        nivelicsLabel="Nivelics Staff Augmentation"
        rows={[
          {
            criterion: "Tiempo hasta primer candidato",
            alternative: "4–8 semanas",
            nivelics: "5 días hábiles",
          },
          {
            criterion: "Costo mensual (perfil senior)",
            alternative: "$12,000–$18,000 USD",
            nivelics: "Hasta 40% menos",
          },
          {
            criterion: "Riesgo de contratación",
            alternative: "Alto — costo de despido, beneficios",
            nivelics: "Cero — sin relación laboral directa",
          },
          {
            criterion: "Garantía de reemplazo",
            alternative: "No existe",
            nivelics: "Sin costo, en menos de 10 días",
          },
          {
            criterion: "Propiedad intelectual",
            alternative: "Puede ser ambigua",
            nivelics: "100% del cliente, siempre",
          },
          {
            criterion: "Perfiles validados",
            alternative: "Proceso interno del cliente",
            nivelics: "100% validados por Nivelics",
          },
          {
            criterion: "Bilingüe español/inglés",
            alternative: "Depende del mercado",
            nivelics: "Sí, todos los perfiles",
          },
          {
            criterion: "Delivery Manager incluido",
            alternative: "No",
            nivelics: "Sí, sin costo adicional",
          },
        ]}
      />

      <CTABanner />
      <StickyMobileCta text="Ver perfiles →" url="/contacto" accentColor="#10B981" />
    </PageWrapper>
  );
}
