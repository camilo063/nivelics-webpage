// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// todo el copy duro de esta página salía en español en /en/services/cloud/security.
import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
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
  const cms = await getServicioData("seguridad", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/seguridad",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Cloud Security | Governance and Identity on AWS and GCP"
        : "Seguridad Cloud | Gobierno e Identidad en AWS y GCP"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Hardening, compliance (SOC2, ISO27001), identity management and end-to-end encryption for your cloud infrastructure."
        : "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud."),
  });
}

/* ── Principios de diseño (reemplazan a MetricsBar) ──────────────────────── */

const PRINCIPLES_ES = [
  "Controles de seguridad desde el primer despliegue",
  "Cifrado en tránsito y en reposo con KMS gestionado",
  "Mínimo privilegio aplicado en toda la infraestructura",
  "Playbook de respuesta probado antes de necesitarlo",
];

const PRINCIPLES_EN = [
  "Security controls from the first deployment",
  "Encryption in transit and at rest with managed KMS",
  "Least privilege enforced across the whole infrastructure",
  "A response playbook tested before you need it",
];

const BENEFITS_ES = [
  {
    icon: "shield",
    title: "Compliance SOC2 e ISO27001",
    description:
      "Implementación de controles y procesos para cumplir con SOC2, ISO27001 y otras normativas regulatorias del sector.",
  },
  {
    icon: "key-round",
    title: "IAM y Zero Trust",
    description:
      "Gestión de identidades con principio de mínimo privilegio, MFA, SSO y arquitectura Zero Trust en toda tu infraestructura.",
  },
  {
    icon: "activity",
    title: "Monitoreo y respuesta a incidentes",
    description:
      "Detección de amenazas en tiempo real, alertas automatizadas y playbooks de respuesta a incidentes de seguridad.",
  },
];

const BENEFITS_EN = [
  {
    icon: "shield",
    title: "SOC2 and ISO27001 compliance",
    description:
      "Controls and processes implemented to meet SOC2, ISO27001 and the other regulations your sector answers to.",
  },
  {
    icon: "key-round",
    title: "IAM and Zero Trust",
    description:
      "Identity management on a least-privilege basis, with MFA, SSO and a Zero Trust architecture across your infrastructure.",
  },
  {
    icon: "activity",
    title: "Monitoring and incident response",
    description:
      "Real-time threat detection, automated alerts and playbooks for responding to security incidents.",
  },
];

const LAYERS_ES = [
  {
    icon: "🛡️",
    label: "Hardening & Baseline",
    url: "/servicios/cloud/seguridad",
    description: "Configuración segura de cuentas, VPCs y servicios base.",
  },
  {
    icon: "🔐",
    label: "IAM & Zero Trust",
    url: "/servicios/cloud/seguridad",
    description: "Mínimo privilegio, MFA, SSO y políticas de acceso.",
  },
  {
    icon: "📋",
    label: "Compliance (SOC2 / ISO)",
    url: "/servicios/cloud/seguridad",
    description: "Roadmap de compliance con hitos y evidencias.",
  },
  {
    icon: "🔒",
    label: "Cifrado End-to-End",
    url: "/servicios/cloud/seguridad",
    description: "Cifrado en tránsito y reposo con KMS gestionado.",
  },
  {
    icon: "🚨",
    label: "Detección & Respuesta",
    url: "/servicios/cloud/seguridad",
    description: "GuardDuty, Security Hub y playbooks de incidentes.",
  },
];

const LAYERS_EN = [
  {
    icon: "🛡️",
    label: "Hardening & Baseline",
    url: "/servicios/cloud/seguridad",
    description: "Secure configuration of accounts, VPCs and base services.",
  },
  {
    icon: "🔐",
    label: "IAM & Zero Trust",
    url: "/servicios/cloud/seguridad",
    description: "Least privilege, MFA, SSO and access policies.",
  },
  {
    icon: "📋",
    label: "Compliance (SOC2 / ISO)",
    url: "/servicios/cloud/seguridad",
    description: "A compliance roadmap with milestones and evidence.",
  },
  {
    icon: "🔒",
    label: "End-to-End Encryption",
    url: "/servicios/cloud/seguridad",
    description: "Encryption in transit and at rest with managed KMS.",
  },
  {
    icon: "🚨",
    label: "Detection & Response",
    url: "/servicios/cloud/seguridad",
    description: "GuardDuty, Security Hub and incident playbooks.",
  },
];

const COMPARISON_ES = [
  {
    criterion: "Visibilidad de vulnerabilidades",
    alternative: "Reactiva — se descubre post-incidente",
    nivelics: "Escaneo continuo automatizado",
  },
  {
    criterion: "Compliance (SOC2, ISO27001)",
    alternative: "Sin mapa claro ni hitos",
    nivelics: "Roadmap con hitos medibles desde semana 1",
  },
  {
    criterion: "Gestión de identidades (IAM)",
    alternative: "Permisiva por defecto — acceso amplio",
    nivelics: "Principio de mínimo privilegio aplicado",
  },
  {
    criterion: "Cifrado en tránsito y reposo",
    alternative: "Parcial o sin configurar",
    nivelics: "End-to-end configurado y auditado",
  },
  {
    criterion: "Detección de amenazas",
    alternative: "No existe",
    nivelics: "GuardDuty / Security Hub activo",
  },
  {
    criterion: "Respuesta a incidentes",
    alternative: "Sin plan — improvisación",
    nivelics: "Playbook probado con tiempos de respuesta",
  },
];

const COMPARISON_EN = [
  {
    criterion: "Vulnerability visibility",
    alternative: "Reactive — found after the incident",
    nivelics: "Continuous automated scanning",
  },
  {
    criterion: "Compliance (SOC2, ISO27001)",
    alternative: "No clear map or milestones",
    nivelics: "Roadmap with measurable milestones from week 1",
  },
  {
    criterion: "Identity management (IAM)",
    alternative: "Permissive by default — broad access",
    nivelics: "Least privilege actually enforced",
  },
  {
    criterion: "Encryption in transit and at rest",
    alternative: "Partial or not configured",
    nivelics: "End-to-end configured and audited",
  },
  {
    criterion: "Threat detection",
    alternative: "Does not exist",
    nivelics: "GuardDuty / Security Hub active",
  },
  {
    criterion: "Incident response",
    alternative: "No plan — improvised",
    nivelics: "Tested playbook with response times",
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
  const isEn = locale === "en";
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: isEn ? "Request an audit" : "Solicitar auditoría", url: "/contacto" },
    fallbackSecondary: {
      text: isEn ? "See the security layers" : "Ver capas de seguridad",
      url: "#capas",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Cloud Security" : "Seguridad Cloud",
    description: isEn
      ? "Hardening, compliance (SOC2, ISO27001), identity management and end-to-end encryption for your cloud infrastructure."
      : "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud.",
    url: "/servicios/cloud/seguridad",
    serviceType: "Cloud Security Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(locale, [
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "Seguridad Cloud", url: "/servicios/cloud/seguridad" },
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
        badge={isEn ? "Cloud · Security" : "Cloud · Seguridad"}
        h1={cms?.title || (isEn ? "Cloud security" : "Seguridad cloud")}
        h1Accent={isEn ? "with no excuses" : "sin excusas"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Hardening, compliance (SOC2, ISO27001), identity management and end-to-end encryption for your cloud infrastructure."
            : "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud.")
        }
        bullets={
          isEn
            ? [
                "SOC2 and ISO27001 compliance from week 1",
                "Zero Trust architecture implemented",
                "Real-time threat detection",
              ]
            : [
                "Compliance SOC2, ISO27001 desde semana 1",
                "Arquitectura Zero Trust implementada",
                "Detección de amenazas en tiempo real",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={
          <HeroSelector
            title={isEn ? "Cloud security layers" : "Capas de seguridad cloud"}
            accentColor={ACCENT}
            options={isEn ? LAYERS_EN : LAYERS_ES}
          />
        }
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      <section id="capas" className="bg-bg-surface py-16 md:py-24">
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

      {/* Enlace cruzado hacia Ethical Hacking. */}
      <section className="pt-4">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <p className="max-w-3xl text-sm leading-relaxed text-text-70">
            {isEn ? (
              <>
                Want to go beyond hardening? We also break into systems on purpose — under a signed
                agreement — to find what an attacker would find first.{" "}
                <Link
                  href="/en/services/cloud/ethical-hacking"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  See Cybersecurity and Ethical Hacking →
                </Link>
              </>
            ) : (
              <>
                ¿Quieres ir más allá del hardening? También entramos a los sistemas a propósito —
                bajo acuerdo firmado — para encontrar lo que un atacante encontraría primero.{" "}
                <Link
                  href="/servicios/cloud/ciberseguridad-ethical-hacking"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Conoce Ciberseguridad y Ethical Hacking →
                </Link>
              </>
            )}
          </p>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué elegir Seguridad Cloud con Nivelics"
        titleEn="Why choose Cloud Security with Nivelics"
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
            ? "Why cloud security with Nivelics instead of no formal programme?"
            : "¿Por qué seguridad cloud con Nivelics vs. sin programa formal?"
        }
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        alternativeLabel={isEn ? "No security programme" : "Sin programa de seguridad"}
        nivelicsLabel="Nivelics Cloud Security"
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
