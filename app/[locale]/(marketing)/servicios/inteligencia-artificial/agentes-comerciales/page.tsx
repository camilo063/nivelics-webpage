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

const SLUG = "agentes-comerciales";
const ACCENT = "#8B5CF6";
const PATH_ES = "/servicios/inteligencia-artificial/agentes-comerciales";
const PATH_EN = "/en/services/artificial-intelligence/sales-agents";

// Las URLs de CTA del CMS son rutas ES; en /en se traducen a su equivalente.
const EN_URLS: Record<string, string> = {
  "/contacto": "/en/contact",
  "/servicios/inteligencia-artificial": "/en/services/artificial-intelligence",
  [PATH_ES]: PATH_EN,
};
function toEnUrl(url: string): string {
  return EN_URLS[url.replace(/\/$/, "")] ?? url;
}

const TITLE_ES = "Agentes Comerciales Inteligentes | IA para Ventas";
const TITLE_EN = "Intelligent Sales Agents | AI for Sales";
const DESCRIPTION_ES =
  "Agentes de IA que califican leads, hacen seguimiento y escalan oportunidades a tu equipo de ventas.";
const DESCRIPTION_EN =
  "AI agents that qualify leads, follow up and escalate opportunities to your sales team.";

// Reglas de diseño del servicio, no resultados: sin cifras ni garantías.
const PRINCIPLES_ES = [
  "Criterios de calificación definidos con tu equipo comercial",
  "Escalamiento al vendedor con el contexto completo de la conversación",
  "Cada interacción queda registrada en tu CRM",
  "Tú decides qué puede hacer el agente sin aprobación humana",
];
const PRINCIPLES_EN = [
  "Qualification criteria defined with your sales team",
  "Handoff to a salesperson with the full conversation context",
  "Every interaction is logged in your CRM",
  "You decide what the agent can do without human approval",
];

const HERO_ES = {
  badge: "IA · Ventas",
  h1: "Tu equipo comercial,",
  h1Accent: "con un agente a su lado",
  subtitle:
    "Agentes de IA que califican leads, hacen seguimiento personalizado y escalan oportunidades reales a tu equipo de ventas. Respuesta inmediata en cualquier canal, a cualquier hora.",
  bullets: [
    "Calificación automática con criterios MEDDPICC personalizados",
    "Seguimiento multicanal: email, WhatsApp, chat en vivo",
    "Sync en tiempo real con Odoo, HubSpot y Salesforce",
  ],
  ariaLabel:
    "Agentes Comerciales Inteligentes — IA que califica leads y automatiza seguimiento de ventas",
  ctaPrimary: "Agendar demo",
  ctaSecondary: "Ver todos los servicios IA",
};
const HERO_EN = {
  badge: "AI · Sales",
  h1: "Your sales team,",
  h1Accent: "with an agent at its side",
  subtitle:
    "AI agents that qualify leads, run personalized follow-up and escalate real opportunities to your sales team. Immediate responses on any channel, at any hour.",
  bullets: [
    "Automatic qualification with custom MEDDPICC criteria",
    "Multichannel follow-up: email, WhatsApp, live chat",
    "Real-time sync with Odoo, HubSpot and Salesforce",
  ],
  ariaLabel: "Intelligent Sales Agents — AI that qualifies leads and automates sales follow-up",
  ctaPrimary: "Book a demo",
  ctaSecondary: "View all AI services",
};

const PANEL_ES = {
  ariaLabel: "Qué automatizas en ventas",
  title: "¿Qué automatizas en ventas?",
  footer: "O cuéntanos tu caso personalizado →",
  items: [
    {
      icon: "dia-target",
      label: "Calificación de leads",
      description: "Scoring automático basado en comportamiento e intención",
    },
    {
      icon: "arc-broadcast",
      label: "Seguimiento automático",
      description: "Cadencias personalizadas por email y WhatsApp",
    },
    {
      icon: "hex-chart",
      label: "Pipeline analytics",
      description: "Dashboard en tiempo real con forecast predictivo",
    },
    {
      icon: "arc-person",
      label: "Escalamiento inteligente",
      description: "Transfiere al vendedor con contexto completo",
    },
    {
      icon: "git-merge",
      label: "Integración CRM",
      description: "Sync automático con tu CRM sin entrada manual",
    },
  ],
};
const PANEL_EN = {
  ariaLabel: "What you can automate in sales",
  title: "What do you want to automate in sales?",
  footer: "Or tell us about your specific case →",
  items: [
    {
      icon: "dia-target",
      label: "Lead qualification",
      description: "Automatic scoring based on behavior and intent",
    },
    {
      icon: "arc-broadcast",
      label: "Automated follow-up",
      description: "Personalized cadences over email and WhatsApp",
    },
    {
      icon: "hex-chart",
      label: "Pipeline analytics",
      description: "Real-time dashboard with predictive forecasting",
    },
    {
      icon: "arc-person",
      label: "Smart escalation",
      description: "Hands off to the salesperson with full context",
    },
    {
      icon: "git-merge",
      label: "CRM integration",
      description: "Automatic sync with your CRM, no manual data entry",
    },
  ],
};

const COMPARISON_ES = {
  title: "¿Agentes comerciales con IA vs. proceso de ventas manual?",
  alternativeLabel: "Proceso manual actual",
  nivelicsLabel: "Nivelics Agentes Comerciales",
  rows: [
    {
      criterion: "Calificación de leads",
      alternative: "SDR revisa uno a uno — lento y subjetivo",
      nivelics: "Agente califica automáticamente con criterios MEDDPICC",
    },
    {
      criterion: "Tiempo de respuesta al lead",
      alternative: "Horas o días hábiles",
      nivelics: "Inmediata en cualquier canal, a cualquier hora",
    },
    {
      criterion: "Seguimiento post-contacto",
      alternative: "Depende de la disciplina del vendedor",
      nivelics: "Automatizado con cadencia configurable",
    },
    {
      criterion: "Integración con CRM",
      alternative: "Entrada manual — datos incompletos",
      nivelics: "Sync automático con Odoo, HubSpot, Salesforce",
    },
    {
      criterion: "Personalización del mensaje",
      alternative: "Genérica o requiere mucho tiempo",
      nivelics: "Personalizada con contexto de la empresa del lead",
    },
    {
      criterion: "Escalabilidad",
      alternative: "Requiere más SDRs para más volumen",
      nivelics: "Absorbe más volumen sin sumar personas al primer contacto",
    },
    {
      criterion: "Reportes y analytics",
      alternative: "Hojas de cálculo o CRM básico",
      nivelics: "Dashboard en tiempo real con conversion rates",
    },
  ],
};
const COMPARISON_EN = {
  title: "AI sales agents vs. a manual sales process?",
  alternativeLabel: "Current manual process",
  nivelicsLabel: "Nivelics Sales Agents",
  rows: [
    {
      criterion: "Lead qualification",
      alternative: "SDRs review leads one by one — slow and subjective",
      nivelics: "The agent qualifies automatically using MEDDPICC criteria",
    },
    {
      criterion: "Lead response time",
      alternative: "Hours or business days",
      nivelics: "Immediate on any channel, at any hour",
    },
    {
      criterion: "Post-contact follow-up",
      alternative: "Depends on each salesperson's discipline",
      nivelics: "Automated with a configurable cadence",
    },
    {
      criterion: "CRM integration",
      alternative: "Manual entry — incomplete data",
      nivelics: "Automatic sync with Odoo, HubSpot, Salesforce",
    },
    {
      criterion: "Message personalization",
      alternative: "Generic, or very time-consuming",
      nivelics: "Personalized with context about the lead's company",
    },
    {
      criterion: "Scalability",
      alternative: "More volume requires more SDRs",
      nivelics: "Absorbs more volume without adding people to first contact",
    },
    {
      criterion: "Reporting and analytics",
      alternative: "Spreadsheets or a basic CRM",
      nivelics: "Real-time dashboard with conversion rates",
    },
  ],
};

const FAQ_TITLE_ES = "Preguntas frecuentes sobre Agentes Comerciales IA";
const FAQ_TITLE_EN = "Frequently asked questions about AI Sales Agents";

const FAQ_ES = [
  {
    question: "¿El agente comercial reemplaza a mis vendedores?",
    answer:
      "No. El agente maneja la calificación inicial, el seguimiento automatizado y la recopilación de contexto. Cuando detecta una oportunidad real, escala al vendedor con toda la información necesaria para cerrar. Tu equipo se enfoca en vender, no en perseguir leads fríos.",
  },
  {
    question: "¿Cómo se personaliza el scoring de leads?",
    answer:
      "Definimos los criterios de calificación junto a tu equipo comercial (industria, cargo, tamaño de empresa, señales de intención, presupuesto). El agente aprende de los cierres exitosos y ajusta el scoring continuamente.",
  },
  {
    question: "¿Se integra con mi CRM actual?",
    answer:
      "Sí. Tenemos conectores pre-construidos para Odoo, HubSpot, Salesforce y Pipedrive. Para otros CRMs, construimos la integración como parte del proyecto.",
  },
  {
    question: "¿Puedo ver qué hace el agente en tiempo real?",
    answer:
      "Sí. Tienes un dashboard con cada interacción, scoring aplicado, mensajes enviados y resultados. También configuramos alertas para eventos críticos como leads de alto valor o anomalías.",
  },
  {
    question: "¿Cuándo empiezo a ver resultados?",
    answer:
      "El plazo se define en el discovery, según tus canales, tu CRM y el alcance del piloto. Una vez en producción, medimos el impacto en tu pipeline con tus propios datos y ajustamos el scoring a medida que llegan casos reales.",
  },
];
const FAQ_EN = [
  {
    question: "Does the sales agent replace my salespeople?",
    answer:
      "No. The agent handles initial qualification, automated follow-up and context gathering. When it detects a real opportunity, it escalates to a salesperson with everything they need to close. Your team focuses on selling, not on chasing cold leads.",
  },
  {
    question: "How is lead scoring customized?",
    answer:
      "We define the qualification criteria together with your sales team (industry, role, company size, intent signals, budget). The agent learns from won deals and keeps refining the scoring.",
  },
  {
    question: "Does it integrate with my current CRM?",
    answer:
      "Yes. We have pre-built connectors for Odoo, HubSpot, Salesforce and Pipedrive. For other CRMs, we build the integration as part of the project.",
  },
  {
    question: "Can I see what the agent is doing in real time?",
    answer:
      "Yes. You get a dashboard with every interaction, the scoring applied, messages sent and outcomes. We also set up alerts for critical events such as high-value leads or anomalies.",
  },
  {
    question: "When will I start seeing results?",
    answer:
      "The timeline is set during discovery, based on your channels, your CRM and the scope of the pilot. Once in production, we measure the impact on your pipeline with your own data and tune the scoring as real cases come in.",
  },
];

const CONTACT_ES = {
  title: "¿Listo para escalar tu pipeline de ventas?",
  subtitle: "Cuéntanos sobre tu proceso comercial y diseñamos el agente ideal.",
  sticky: "Hablar con un experto →",
};
const CONTACT_EN = {
  title: "Ready to scale your sales pipeline?",
  subtitle: "Tell us about your sales process and we will design the right agent for it.",
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

export default async function AgentesComerciales({
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
    name: isEn ? "Intelligent Sales Agents" : "Agentes Comerciales Inteligentes",
    description: isEn ? DESCRIPTION_EN : DESCRIPTION_ES,
    url: isEn ? PATH_EN : PATH_ES,
    serviceType: "AI Sales Agent Development",
  });
  const breadcrumb = getBreadcrumbSchema(
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Artificial Intelligence", url: "/en/services/artificial-intelligence" },
          { name: "Sales Agents", url: PATH_EN },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
          { name: "Agentes Comerciales", url: PATH_ES },
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
        dataSection="agentes-comerciales-hero"
        ariaLabel={hero.ariaLabel}
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué elegir Agentes Comerciales con Nivelics"
        titleEn="Why choose Sales Agents with Nivelics"
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
