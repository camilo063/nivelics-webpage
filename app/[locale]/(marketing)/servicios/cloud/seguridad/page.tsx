// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import { Shield, KeyRound, Activity } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
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
  const cms = await getServicioData("seguridad", locale);
  return {
    title: cms?.seoTitle || "Seguridad Cloud | Gobierno e Identidad en AWS y GCP",
    description:
      cms?.seoDescription ||
      "Hardening, compliance (SOC2, ISO27001), gesti\u00f3n de identidades y cifrado end-to-end para tu infraestructura cloud.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/cloud/seguridad",
      languages: {
        es: "https://www.nivelics.com/servicios/cloud/seguridad",
        en: "https://www.nivelics.com/en/services/cloud/security",
        "x-default": "https://www.nivelics.com/servicios/cloud/seguridad",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: "shield",
    title: "Compliance SOC2 e ISO27001",
    description:
      "Implementaci\u00f3n de controles y procesos para cumplir con SOC2, ISO27001 y otras normativas regulatorias del sector.",
  },
  {
    icon: "key-round",
    title: "IAM y Zero Trust",
    description:
      "Gesti\u00f3n de identidades con principio de m\u00ednimo privilegio, MFA, SSO y arquitectura Zero Trust en toda tu infraestructura.",
  },
  {
    icon: "activity",
    title: "Monitoreo y respuesta a incidentes",
    description:
      "Detecci\u00f3n de amenazas en tiempo real, alertas automatizadas y playbooks de respuesta a incidentes de seguridad.",
  },
];

export default async function SeguridadCloudPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("seguridad", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: "Solicitar auditoría", url: "/contacto" },
    fallbackSecondary: { text: "Ver capas de seguridad", url: "#capas" },
  });
  const serviceSchema = getServiceSchema({
    name: "Seguridad Cloud",
    description:
      "Hardening, compliance (SOC2, ISO27001), gesti\u00f3n de identidades y cifrado end-to-end para tu infraestructura cloud.",
    url: "/servicios/cloud/seguridad",
    serviceType: "Cloud Security Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Seguridad Cloud", url: "/servicios/cloud/seguridad" },
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
        badge="Cloud \u00b7 Seguridad"
        h1={cms?.title || "Seguridad cloud"}
        h1Accent="sin excusas"
        subtitle={
          cms?.subtitle ||
          "Hardening, compliance (SOC2, ISO27001), gesti\u00f3n de identidades y cifrado end-to-end para tu infraestructura cloud."
        }
        bullets={[
          "Compliance SOC2, ISO27001 desde semana 1",
          "Arquitectura Zero Trust implementada",
          "Detecci\u00f3n de amenazas en tiempo real",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#3B82F6"
        rightPanel={
          <HeroSelector
            title="Capas de seguridad cloud"
            accentColor="#3B82F6"
            options={[
              {
                icon: "\ud83d\udee1\ufe0f",
                label: "Hardening & Baseline",
                url: "/servicios/cloud/seguridad",
                description: "Configuraci\u00f3n segura de cuentas, VPCs y servicios base.",
              },
              {
                icon: "\ud83d\udd10",
                label: "IAM & Zero Trust",
                url: "/servicios/cloud/seguridad",
                description: "M\u00ednimo privilegio, MFA, SSO y pol\u00edticas de acceso.",
              },
              {
                icon: "\ud83d\udccb",
                label: "Compliance (SOC2 / ISO)",
                url: "/servicios/cloud/seguridad",
                description: "Roadmap de compliance con hitos y evidencias.",
              },
              {
                icon: "\ud83d\udd12",
                label: "Cifrado End-to-End",
                url: "/servicios/cloud/seguridad",
                description: "Cifrado en tr\u00e1nsito y reposo con KMS gestionado.",
              },
              {
                icon: "\ud83d\udea8",
                label: "Detecci\u00f3n & Respuesta",
                url: "/servicios/cloud/seguridad",
                description: "GuardDuty, Security Hub y playbooks de incidentes.",
              },
            ]}
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
                { value: "100%", label: "Cifrado", sublabel: "En tr\u00e1nsito y reposo" },
                { value: "0", label: "Brechas", sublabel: "Tolerancia cero a incidentes" },
                { value: "24h", label: "Respuesta", sublabel: "Tiempo m\u00e1ximo a incidentes" },
                {
                  value: "95%",
                  label: "Compliance",
                  sublabel: "Controles cubiertos desde d\u00eda 1",
                },
              ]
        }
      />

      <section id="capas" className="bg-bg-surface py-16 md:py-24">
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

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#3B82F6"
        titleEs="Por qu\u00e9 elegir Seguridad Cloud con Nivelics"
        titleEn="Why choose Cloud Security with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#3B82F6"
        titleEs="C\u00f3mo lo implementamos"
        titleEn="How we deliver"
        locale={locale}
      />

      <ComparisonTable
        title="\u00bfPor qu\u00e9 seguridad cloud con Nivelics vs. sin programa formal?"
        alternativeLabel="Sin programa de seguridad"
        nivelicsLabel="Nivelics Cloud Security"
        rows={[
          {
            criterion: "Visibilidad de vulnerabilidades",
            alternative: "Reactiva \u2014 se descubre post-incidente",
            nivelics: "Escaneo continuo automatizado",
          },
          {
            criterion: "Compliance (SOC2, ISO27001)",
            alternative: "Sin mapa claro ni hitos",
            nivelics: "Roadmap con hitos medibles desde semana 1",
          },
          {
            criterion: "Gesti\u00f3n de identidades (IAM)",
            alternative: "Permisiva por defecto \u2014 acceso amplio",
            nivelics: "Principio de m\u00ednimo privilegio aplicado",
          },
          {
            criterion: "Cifrado en tr\u00e1nsito y reposo",
            alternative: "Parcial o sin configurar",
            nivelics: "End-to-end configurado y auditado",
          },
          {
            criterion: "Detecci\u00f3n de amenazas",
            alternative: "No existe",
            nivelics: "GuardDuty / Security Hub activo",
          },
          {
            criterion: "Respuesta a incidentes",
            alternative: "Sin plan \u2014 improvisaci\u00f3n",
            nivelics: "Playbook probado con tiempos de respuesta",
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
