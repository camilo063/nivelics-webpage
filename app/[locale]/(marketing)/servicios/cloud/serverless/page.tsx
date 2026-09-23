// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// todo el copy duro de esta página salía en español en /en/services/cloud/serverless.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";
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
import { buildPageMetadata } from "@/lib/seo/page-meta";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

const ACCENT = "#3B82F6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("serverless", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/serverless",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Serverless Solutions | Scale Without Managing Servers"
        : "Soluciones Serverless | Escala sin Administrar Servidores"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Event-driven architectures with Lambda, Cloud Functions and Azure Functions. Pay only for what you use."
        : "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas."),
  });
}

/* ── Principios de diseño (reemplazan a MetricsBar) ──────────────────────── */

const PRINCIPLES_ES = [
  "Pagas por ejecución, no por servidores encendidos",
  "Escalamiento automático sin intervención manual",
  "Sin servidores que aprovisionar ni parchear",
  "Cold starts gestionados con warm-up strategies",
];

const PRINCIPLES_EN = [
  "You pay per execution, not for servers left running",
  "Automatic scaling with no manual intervention",
  "No servers to provision or patch",
  "Cold starts handled with warm-up strategies",
];

const BENEFITS_ES = [
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
      "Escalamiento automático de cero a millones de requests sin configuración manual ni gestión de servidores.",
  },
  {
    icon: "dollar-sign",
    title: "Costos basados en uso real",
    description:
      "Paga solo por el tiempo de ejecución que consumes. Sin servidores idle, sin costos fijos innecesarios.",
  },
];

const BENEFITS_EN = [
  {
    icon: "zap",
    title: "Event-driven architecture",
    description:
      "Reactive architectures that process events in real time with Lambda, Cloud Functions and Azure Functions.",
  },
  {
    icon: "scaling",
    title: "Native auto-scaling",
    description:
      "Automatic scaling from zero to millions of requests, with no manual configuration and no servers to manage.",
  },
  {
    icon: "dollar-sign",
    title: "Costs based on actual usage",
    description:
      "You pay only for the execution time you consume. No idle servers, no fixed costs you do not need.",
  },
];

const COMPARISON_ES = [
  {
    criterion: "Costo de cómputo",
    alternative: "Fijo — pagas aunque no uses los recursos",
    nivelics: "Pay-per-use — solo lo que consumes",
  },
  {
    criterion: "Escalabilidad",
    alternative: "Manual o semi-automática",
    nivelics: "Automática e instantánea sin intervención",
  },
  {
    criterion: "Gestión de servidores",
    alternative: "Tu equipo la absorbe completamente",
    nivelics: "Cero gestión de infraestructura",
  },
  {
    criterion: "Time-to-market",
    alternative: "Más lento — infra previa necesaria",
    nivelics: "Más rápido — foco en lógica de negocio",
  },
  {
    criterion: "Cold starts",
    alternative: "No aplica",
    nivelics: "Gestionados con warm-up strategies",
  },
  {
    criterion: "Costo a largo plazo",
    alternative: "Predecible pero inflexible",
    nivelics: "Escala con el negocio — baja en periodos bajos",
  },
];

const COMPARISON_EN = [
  {
    criterion: "Compute cost",
    alternative: "Fixed — you pay even when the resources sit idle",
    nivelics: "Pay-per-use — only what you consume",
  },
  {
    criterion: "Scalability",
    alternative: "Manual or semi-automatic",
    nivelics: "Automatic and instant, with no intervention",
  },
  {
    criterion: "Server management",
    alternative: "Your team absorbs all of it",
    nivelics: "Zero infrastructure management",
  },
  {
    criterion: "Time-to-market",
    alternative: "Slower — infrastructure has to come first",
    nivelics: "Faster — focus on business logic",
  },
  {
    criterion: "Cold starts",
    alternative: "Not applicable",
    nivelics: "Handled with warm-up strategies",
  },
  {
    criterion: "Long-term cost",
    alternative: "Predictable but inflexible",
    nivelics: "Scales with the business — drops in quiet periods",
  },
];

export default async function ServerlessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("serverless", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Talk to an expert" : "Hablar con un experto",
      url: "/contacto",
    },
    fallbackSecondary: { text: isEn ? "See the benefits" : "Ver beneficios", url: "#beneficios" },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Serverless Solutions" : "Soluciones Serverless",
    description: isEn
      ? "Event-driven architectures with Lambda, Cloud Functions and Azure Functions. Pay only for what you use."
      : "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    url: "/servicios/cloud/serverless",
    serviceType: "Serverless Architecture Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(locale, [
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Serverless", url: "/servicios/cloud/serverless" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: ACCENT }}
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
          {
            name: "Ciberseguridad y Ethical Hacking",
            nameEn: "Cybersecurity & Ethical Hacking",
            url: "/servicios/cloud/ciberseguridad-ethical-hacking",
            urlEn: "/en/services/cloud/ethical-hacking",
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
        badge="Cloud · Serverless"
        h1={cms?.title || (isEn ? "Pay only for what you use," : "Paga solo lo que usas,")}
        // En EN el título de BD es solo «Serverless», así que el acento va en participio:
        // «Serverless scaling without limits» y no «Serverless scale without limits».
        h1Accent={isEn ? "scaling without limits" : "escala sin límites"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Event-driven architectures with Lambda, Cloud Functions and Azure Functions. Scale from zero to millions without managing servers."
            : "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Escala de cero a millones sin gestionar servidores.")
        }
        bullets={
          isEn
            ? [
                "Auto-scaling from 0 to millions of requests",
                "Real pay-per-use — no idle servers",
                "Cold starts handled with warm-up strategies",
              ]
            : [
                "Auto-scaling de 0 a millones de requests",
                "Pay-per-use real — sin servidores idle",
                "Cold starts gestionados con warm-up strategies",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={<HeroCalculator type="cloud" accentColor={ACCENT} />}
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      <section id="beneficios" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Key benefits" : "Beneficios clave"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {(isEn ? BENEFITS_EN : BENEFITS_ES).map((b) => (
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
        accentColor={ACCENT}
        titleEs="Por qué elegir Serverless con Nivelics"
        titleEn="Why choose Serverless with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Cómo lo implementamos"
        titleEn="How we deliver"
        locale={locale}
      />

      <ComparisonTable
        title={
          isEn
            ? "Serverless with Nivelics vs. a traditional architecture?"
            : "¿Serverless con Nivelics vs. arquitectura tradicional?"
        }
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        alternativeLabel={isEn ? "Traditional architecture" : "Arquitectura tradicional"}
        nivelicsLabel="Nivelics Serverless"
        rows={isEn ? COMPARISON_EN : COMPARISON_ES}
      />

      <CTABanner locale={locale} />

      <StickyMobileCta
        text={isEn ? "Request an audit →" : "Solicitar auditoría →"}
        url="/contacto"
        accentColor={ACCENT}
      />
    </PageWrapper>
  );
}
