// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn).
import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { HeroSplit } from "@/components/sections/hero-split";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
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
import { GeoIconBox } from "@/lib/icons/geometric";
import type { Locale } from "@/lib/cms/types";
import { IA_PARENT, IA_SIBLINGS } from "@/lib/content/agentes";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";

const SLUG = "marketing-crm";
const ACCENT = "#8B5CF6";
const PATH_ES = "/servicios/inteligencia-artificial/marketing-crm";
const PATH_EN = "/en/services/artificial-intelligence/marketing-crm";

// Las URLs de CTA del CMS son rutas ES; en /en se traducen a su equivalente.
const EN_URLS: Record<string, string> = {
  "/contacto": "/en/contact",
  "/servicios/inteligencia-artificial": "/en/services/artificial-intelligence",
  [PATH_ES]: PATH_EN,
};
function toEnUrl(url: string): string {
  return EN_URLS[url.replace(/\/$/, "")] ?? url;
}

const TITLE_ES = "IA para Marketing y CRM | Personalización a Escala";
const TITLE_EN = "AI for Marketing and CRM | Personalization at Scale";
const DESCRIPTION_ES =
  "Segmentación inteligente, personalización de campañas y análisis predictivo integrado con tu CRM.";
const DESCRIPTION_EN =
  "Smart segmentation, campaign personalization and predictive analytics integrated with your CRM.";

// Reglas de diseño del servicio, no resultados: sin cifras ni garantías.
const PRINCIPLES_ES = [
  "Campañas con aprobación humana por defecto",
  "Segmentos explicables: sabes por qué cada lead está donde está",
  "Integración sobre tu CRM actual, sin reemplazarlo",
  "Datos de clientes bajo tus políticas de privacidad",
];
const PRINCIPLES_EN = [
  "Campaigns require human approval by default",
  "Explainable segments: you know why each lead is where it is",
  "Built on top of your current CRM, not replacing it",
  "Customer data under your privacy policies",
];

const HERO_ES = {
  badge: "IA · Marketing",
  h1: "Marketing personalizado",
  h1Accent: "a escala real",
  subtitle:
    "Segmentación dinámica, campañas personalizadas 1:1 y análisis predictivo integrado con tu CRM. Cada lead recibe el mensaje correcto en el momento correcto.",
  bullets: [
    "Segmentación predictiva que se recalcula en tiempo real",
    "Personalización 1:1 a escala — no genérica, no manual",
    "Sync en tiempo real con Odoo, HubSpot y Salesforce",
  ],
  ariaLabel:
    "IA para Marketing y CRM — personalización de campañas a escala con segmentación predictiva",
  ctaPrimary: "Agendar demo",
  ctaSecondary: "Ver todos los servicios IA",
};
const HERO_EN = {
  badge: "AI · Marketing",
  h1: "Personalized marketing",
  h1Accent: "at real scale",
  subtitle:
    "Dynamic segmentation, one-to-one personalized campaigns and predictive analytics integrated with your CRM. Every lead gets the right message at the right moment.",
  bullets: [
    "Predictive segmentation that recalculates in real time",
    "One-to-one personalization at scale — not generic, not manual",
    "Real-time sync with Odoo, HubSpot and Salesforce",
  ],
  ariaLabel:
    "AI for Marketing and CRM — campaign personalization at scale with predictive segmentation",
  ctaPrimary: "Book a demo",
  ctaSecondary: "View all AI services",
};

const PANEL_ES = {
  ariaLabel: "Qué optimizas en marketing",
  title: "¿Qué optimizas en marketing?",
  footer: "O cuéntanos tu caso personalizado →",
  items: [
    {
      icon: "dia-target",
      label: "Segmentación predictiva",
      description: "Audiencias dinámicas basadas en comportamiento e intención",
    },
    {
      icon: "arc-broadcast",
      label: "Campañas personalizadas",
      description: "Contenido, ofertas y timing 1:1 para cada segmento",
    },
    {
      icon: "hex-chart",
      label: "Análisis de atribución",
      description: "Multi-touch con IA — qué touchpoint realmente convierte",
    },
    {
      icon: "hex-cycle",
      label: "Churn prediction",
      description: "Anticipa abandono y activa retención automática",
    },
    {
      icon: "dia-trend",
      label: "Lifetime value scoring",
      description: "Prioriza inversión según valor potencial del cliente",
    },
  ],
};
const PANEL_EN = {
  ariaLabel: "What you can optimize in marketing",
  title: "What do you want to optimize in marketing?",
  footer: "Or tell us about your specific case →",
  items: [
    {
      icon: "dia-target",
      label: "Predictive segmentation",
      description: "Dynamic audiences based on behavior and intent",
    },
    {
      icon: "arc-broadcast",
      label: "Personalized campaigns",
      description: "One-to-one content, offers and timing for each segment",
    },
    {
      icon: "hex-chart",
      label: "Attribution analysis",
      description: "AI-driven multi-touch — which touchpoint actually converts",
    },
    {
      icon: "hex-cycle",
      label: "Churn prediction",
      description: "Anticipates churn and triggers retention automatically",
    },
    {
      icon: "dia-trend",
      label: "Lifetime value scoring",
      description: "Prioritizes investment by each customer's potential value",
    },
  ],
};

const COMPARISON_ES = {
  title: "¿Marketing con IA vs. operación de marketing tradicional?",
  alternativeLabel: "Marketing tradicional",
  nivelicsLabel: "Nivelics Marketing + CRM con IA",
  rows: [
    {
      criterion: "Calificación de prospectos",
      alternative: "Manual — criterios subjetivos del equipo",
      nivelics: "Automática — scoring basado en comportamiento real",
    },
    {
      criterion: "Segmentación de audiencias",
      alternative: "Estática — se actualiza cada campaña",
      nivelics: "Dinámica — se recalcula en tiempo real",
    },
    {
      criterion: "Personalización de campañas",
      alternative: "Genérica o semi-personalizada",
      nivelics: "1:1 a escala — cada lead recibe mensaje relevante",
    },
    {
      criterion: "Tiempo de respuesta al comportamiento",
      alternative: "Próximo envío programado",
      nivelics: "Trigger inmediato basado en la acción del usuario",
    },
    {
      criterion: "Integración CRM",
      alternative: "Sincronización manual o batch",
      nivelics: "Sync en tiempo real — Odoo, HubSpot, Salesforce",
    },
    {
      criterion: "Análisis de atribución",
      alternative: "Last-click o modelo básico",
      nivelics: "Multi-touch con IA — qué touchpoint realmente convierte",
    },
    {
      criterion: "Costo por lead calificado",
      alternative: "Alto — mucho volumen, poca calidad",
      nivelics: "Foco en leads con mayor intención de compra",
    },
  ],
};
const COMPARISON_EN = {
  title: "AI-driven marketing vs. traditional marketing operations?",
  alternativeLabel: "Traditional marketing",
  nivelicsLabel: "Nivelics AI Marketing + CRM",
  rows: [
    {
      criterion: "Prospect qualification",
      alternative: "Manual — subjective criteria from the team",
      nivelics: "Automatic — scoring based on real behavior",
    },
    {
      criterion: "Audience segmentation",
      alternative: "Static — updated once per campaign",
      nivelics: "Dynamic — recalculated in real time",
    },
    {
      criterion: "Campaign personalization",
      alternative: "Generic or semi-personalized",
      nivelics: "One-to-one at scale — every lead gets a relevant message",
    },
    {
      criterion: "Response time to behavior",
      alternative: "Next scheduled send",
      nivelics: "Immediate trigger based on the user's action",
    },
    {
      criterion: "CRM integration",
      alternative: "Manual or batch sync",
      nivelics: "Real-time sync — Odoo, HubSpot, Salesforce",
    },
    {
      criterion: "Attribution analysis",
      alternative: "Last-click or a basic model",
      nivelics: "AI-driven multi-touch — which touchpoint actually converts",
    },
    {
      criterion: "Cost per qualified lead",
      alternative: "High — lots of volume, little quality",
      nivelics: "Focus on leads with the strongest buying intent",
    },
  ],
};

const FAQ_TITLE_ES = "Preguntas frecuentes sobre Marketing con IA";
const FAQ_TITLE_EN = "Frequently asked questions about AI Marketing";

const FAQ_ES = [
  {
    question: "¿Cómo funciona la segmentación predictiva?",
    answer:
      "Analizamos el comportamiento histórico de tus clientes (páginas visitadas, emails abiertos, compras anteriores, interacciones con soporte) y creamos modelos que predicen intención de compra, riesgo de churn y valor potencial. Los segmentos se actualizan en tiempo real con cada nueva interacción.",
  },
  {
    question: "¿Se integra con mi CRM y herramientas de marketing?",
    answer:
      "Sí. Tenemos integraciones nativas con Odoo, HubSpot, Salesforce, ActiveCampaign y Mailchimp. Los datos se sincronizan en tiempo real — no batch — para que los triggers y segmentos estén siempre actualizados.",
  },
  {
    question: "¿Cómo se mide el impacto en la conversión?",
    answer:
      "Definimos una línea base con tus datos actuales y comparamos contra ella: tasa de conversión, costo por lead calificado y atribución por touchpoint. El impacto depende de tu volumen actual y de la madurez de tus datos, por eso lo medimos en tu operación y no lo prometemos de antemano.",
  },
  {
    question: "¿Necesito mucho historial de datos para empezar?",
    answer:
      "No necesariamente. En el discovery revisamos el historial de CRM y email marketing que tienes y definimos con qué modelos se puede empezar. Mientras más datos históricos, mejor la predicción.",
  },
  {
    question: "¿La IA envía campañas sin aprobación?",
    answer:
      "Solo si tú lo configuras así. Por defecto, las campañas pasan por un flujo de aprobación antes de enviarse. El nivel de autonomía lo define tu equipo: desde sugerencias que un humano aprueba hasta envíos completamente automatizados con reglas de negocio.",
  },
];
const FAQ_EN = [
  {
    question: "How does predictive segmentation work?",
    answer:
      "We analyze your customers' historical behavior (pages visited, emails opened, past purchases, support interactions) and build models that predict buying intent, churn risk and potential value. Segments update in real time with every new interaction.",
  },
  {
    question: "Does it integrate with my CRM and marketing tools?",
    answer:
      "Yes. We have native integrations with Odoo, HubSpot, Salesforce, ActiveCampaign and Mailchimp. Data syncs in real time — not in batches — so triggers and segments are always up to date.",
  },
  {
    question: "How is the impact on conversion measured?",
    answer:
      "We set a baseline with your current data and compare against it: conversion rate, cost per qualified lead and attribution by touchpoint. The impact depends on your current volume and the maturity of your data, which is why we measure it in your operation instead of promising it up front.",
  },
  {
    question: "Do I need a lot of historical data to get started?",
    answer:
      "Not necessarily. During discovery we review the CRM and email marketing history you have and decide which models you can start with. The more historical data, the better the predictions.",
  },
  {
    question: "Does the AI send campaigns without approval?",
    answer:
      "Only if you configure it that way. By default, campaigns go through an approval workflow before they are sent. Your team defines the level of autonomy: from suggestions a person approves to fully automated sends governed by business rules.",
  },
];

const CONTACT_ES = {
  title: "¿Listo para personalizar tu marketing a escala?",
  subtitle: "Cuéntanos sobre tu operación de marketing y diseñamos la solución ideal.",
  sticky: "Hablar con un experto →",
};
const CONTACT_EN = {
  title: "Ready to personalize your marketing at scale?",
  subtitle: "Tell us about your marketing operation and we will design the right solution for it.",
  sticky: "Talk to an expert →",
};

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData(SLUG, locale);
  return buildPageMetadata({
    locale,
    href: PATH_ES,
    title: cms?.seoTitle || (isEn ? TITLE_EN : TITLE_ES),
    description: cms?.seoDescription || (isEn ? DESCRIPTION_EN : DESCRIPTION_ES),
  });
}

export default async function MarketingCRMPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData(SLUG, locale);

  const hero = isEn ? HERO_EN : HERO_ES;
  const panel = isEn ? PANEL_EN : PANEL_ES;
  const comparison = isEn ? COMPARISON_EN : COMPARISON_ES;
  const contact = isEn ? CONTACT_EN : CONTACT_ES;
  const contactUrl = isEn ? "/en/contact" : "/contacto";

  const resolved = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: hero.ctaPrimary, url: "/contacto" },
    fallbackSecondary: {
      text: hero.ctaSecondary,
      url: "/servicios/inteligencia-artificial",
    },
  });
  const ctaPrimary = isEn
    ? { ...resolved.ctaPrimary, url: toEnUrl(resolved.ctaPrimary.url) }
    : resolved.ctaPrimary;
  const ctaSecondary =
    isEn && resolved.ctaSecondary
      ? { ...resolved.ctaSecondary, url: toEnUrl(resolved.ctaSecondary.url) }
      : resolved.ctaSecondary;

  const serviceSchema = getServiceSchema({
    name: isEn ? "AI for Marketing and CRM" : "IA para Marketing y CRM",
    description: isEn ? DESCRIPTION_EN : DESCRIPTION_ES,
    url: isEn ? PATH_EN : PATH_ES,
    serviceType: "AI Marketing Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Artificial Intelligence", url: "/en/services/artificial-intelligence" },
          { name: "Marketing and CRM", url: PATH_EN },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
          { name: "Marketing y CRM", url: PATH_ES },
        ],
  );

  return (
    <PageWrapper>
      <SiblingServicesNav parentService={IA_PARENT} siblings={IA_SIBLINGS} />
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
        badge={hero.badge}
        h1={hero.h1}
        h1Accent={hero.h1Accent}
        subtitle={cms?.subtitle || hero.subtitle}
        bullets={hero.bullets}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={
          // Panel propio en vez de <HeroSelector>: ese componente lleva su aria-label y su
          // enlace de pie en español duro, y esta página tiene que estar entera en inglés.
          <nav aria-label={panel.ariaLabel} className="glass rounded-xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">
              {panel.title}
            </p>
            <ul className="space-y-1">
              {panel.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3 rounded-lg p-2">
                  <GeoIconBox name={item.icon} size={16} color="violet" />
                  <div>
                    <span className="block text-sm font-semibold text-text-100">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-text-40">{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href={contactUrl}
              className="mt-3 block text-center text-xs font-medium transition-colors hover:brightness-125"
              style={{ color: ACCENT }}
            >
              {panel.footer}
            </Link>
          </nav>
        }
        dataSection="marketing-crm-hero"
        ariaLabel={hero.ariaLabel}
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué elegir Marketing y CRM con Nivelics"
        titleEn="Why choose Marketing & CRM with Nivelics"
        locale={locale}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Proceso de implementación"
        titleEn="Implementation process"
        locale={locale}
      />

      {/* Comparison */}
      <ComparisonTable
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        title={comparison.title}
        alternativeLabel={comparison.alternativeLabel}
        nivelicsLabel={comparison.nivelicsLabel}
        rows={comparison.rows}
      />

      {/* FAQ */}
      <FAQAccordion
        title={isEn ? FAQ_TITLE_EN : FAQ_TITLE_ES}
        schemaEnabled
        faqs={cms?.faqs?.length ? cms.faqs : /* LEGACY FALLBACK */ isEn ? FAQ_EN : FAQ_ES}
      />

      {/* Contact */}
      <InlineContactForm
        title={contact.title}
        subtitle={contact.subtitle}
        serviceDefault="ia"
        accentColor={ACCENT}
      />

      <StickyMobileCta text={contact.sticky} url={contactUrl} accentColor={ACCENT} />
    </PageWrapper>
  );
}
