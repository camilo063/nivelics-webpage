import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("migracion-aws", locale);
  return {
    title: cms?.seoTitle || "Migraci\u00f3n a AWS | Cloud Migration sin Interrupciones",
    description:
      cms?.seoDescription ||
      "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimizaci\u00f3n de costos desde el d\u00eda uno.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/cloud/migracion-aws",
      languages: {
        es: "https://www.nivelics.com/servicios/cloud/migracion-aws",
        en: "https://www.nivelics.com/en/services/cloud/aws-migration",
        "x-default": "https://www.nivelics.com/servicios/cloud/migracion-aws",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "clipboard-check",
    title: "Assessment y estrategia de migraci\u00f3n",
    description:
      "Evaluamos tu infraestructura actual, definimos la estrategia de migraci\u00f3n (rehost, replatform, refactor) y el roadmap paso a paso.",
  },
  {
    icon: "shield-check",
    title: "Zero downtime con rollback",
    description:
      "Migraci\u00f3n sin interrupciones con plan de rollback probado, validaci\u00f3n continua y cutover controlado para cero impacto en tu operaci\u00f3n.",
  },
  {
    icon: "gauge",
    title: "Optimizaci\u00f3n post-migraci\u00f3n",
    description:
      "Rightsizing, reserved instances y monitoreo de costos desde el primer d\u00eda en AWS para maximizar tu inversi\u00f3n en la nube.",
  },
];

export default async function MigracionAWSPage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("migracion-aws", locale);
  const serviceSchema = getServiceSchema({
    name: "Migraci\u00f3n a AWS",
    description:
      "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimizaci\u00f3n de costos desde el d\u00eda uno.",
    url: "/servicios/cloud/migracion-aws",
    serviceType: "Cloud Migration Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Migraci\u00f3n a AWS", url: "/servicios/cloud/migracion-aws" },
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
        badge="Cloud \u00b7 AWS Migration"
        h1={cms?.title || "Migra a AWS"}
        h1Accent="sin downtime"
        subtitle={
          cms?.subtitle ||
          "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimizaci\u00f3n de costos desde el d\u00eda uno."
        }
        bullets={[
          "Assessment gratuito de tu infraestructura",
          "Estrategia 6R adaptada a cada workload",
          "Rollback plan probado antes de cada cutover",
        ]}
        ctaPrimary={{ text: "Solicitar assessment", url: "/contacto" }}
        ctaSecondary={{ text: "Ver beneficios", url: "#beneficios" }}
        accentColor="#3B82F6"
        rightPanel={
          <HeroSelector
            title="Elige tu estrategia de migraci\u00f3n"
            accentColor="#3B82F6"
            options={[
              {
                icon: "\u2601\ufe0f",
                label: "Rehost (Lift & Shift)",
                url: "/servicios/cloud/migracion-aws",
                description: "Mueve tus servidores tal cual a EC2 con m\u00ednimo cambio.",
              },
              {
                icon: "\u2699\ufe0f",
                label: "Replatform",
                url: "/servicios/cloud/migracion-aws",
                description: "Migra con ajustes para aprovechar servicios managed de AWS.",
              },
              {
                icon: "\ud83d\udee0\ufe0f",
                label: "Refactor",
                url: "/servicios/cloud/migracion-aws",
                description: "Redise\u00f1a tu app para arquitectura cloud-native.",
              },
              {
                icon: "\ud83d\udce6",
                label: "Repurchase",
                url: "/servicios/cloud/migracion-aws",
                description: "Reemplaza software on-premise por SaaS equivalente.",
              },
              {
                icon: "\ud83d\udd12",
                label: "Retain / Retire",
                url: "/servicios/cloud/migracion-aws",
                description: "Decide qu\u00e9 mantener on-prem y qu\u00e9 decomisionar.",
              },
            ]}
          />
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                { value: "0", label: "Downtime", sublabel: "Zero interrupciones garantizado" },
                {
                  value: "60%",
                  label: "M\u00e1s r\u00e1pido",
                  sublabel: "vs. migraci\u00f3n interna",
                },
                { value: "100%", label: "Documentado", sublabel: "IaC + runbooks entregados" },
                { value: "30%", label: "Ahorro desde d\u00eda 1", sublabel: "FinOps incluido" },
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
        title="\u00bfPor qu\u00e9 migrar con Nivelics vs. hacerlo con equipo interno?"
        alternativeLabel="Migraci\u00f3n interna"
        nivelicsLabel="Nivelics Migration"
        rows={[
          {
            criterion: "Tiempo estimado",
            alternative: "12\u201318 meses",
            nivelics: "3\u20136 meses (metodolog\u00eda probada)",
          },
          {
            criterion: "Riesgo de downtime",
            alternative: "Alto \u2014 sin playbook validado",
            nivelics: "M\u00ednimo \u2014 estrategia de rollback siempre activa",
          },
          {
            criterion: "Certificaciones AWS",
            alternative: "No garantizadas",
            nivelics: "Equipo AWS Certified Partner",
          },
          {
            criterion: "Documentaci\u00f3n final",
            alternative: "Incompleta o inexistente",
            nivelics: "IaC + runbooks + arquitectura documentada",
          },
          {
            criterion: "Optimizaci\u00f3n de costos",
            alternative: "Lift-and-shift sin gobierno",
            nivelics: "FinOps incluido desde el dise\u00f1o",
          },
          {
            criterion: "Seguridad desde el inicio",
            alternative: "Reactiva \u2014 se corrige despu\u00e9s",
            nivelics: "Hardening y compliance desde d\u00eda 1",
          },
          {
            criterion: "Soporte post-migraci\u00f3n",
            alternative: "Equipo interno saturado por el proyecto",
            nivelics: "Operaci\u00f3n continua disponible",
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
