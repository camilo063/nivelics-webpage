// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
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
  const isEn = locale === "en";
  const cms = await getServicioData("ecommerce", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/desarrollo-digital/ecommerce",
    title:
      cms?.seoTitle ||
      (isEn
        ? "E-commerce Development | Digital Stores That Sell"
        : "Desarrollo E-commerce | Tiendas Digitales que Venden"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "B2B and B2C digital stores with catalogue, dynamic pricing, payment gateways and ERP integration."
        : "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP."),
  });
}

const BENEFITS_ES = [
  {
    icon: "shopping-cart",
    title: "Catálogo y pricing dinámico",
    description:
      "Gestión avanzada de catálogo con variantes, precios por segmento, descuentos programados y reglas de pricing dinámico.",
  },
  {
    icon: "credit-card",
    title: "Pasarelas de pago integradas",
    description:
      "Integración con Stripe, MercadoPago, PayU y pasarelas locales para pagos seguros con múltiples métodos de pago.",
  },
  {
    icon: "package-check",
    title: "Integración ERP y logística",
    description:
      "Conexión con SAP, Oracle, Odoo y sistemas de logística para sincronización de inventario, órdenes y fulfillment.",
  },
];

const BENEFITS_EN = [
  {
    icon: "shopping-cart",
    title: "Catalogue and dynamic pricing",
    description:
      "Advanced catalogue management with variants, segment-based prices, scheduled discounts and dynamic pricing rules.",
  },
  {
    icon: "credit-card",
    title: "Integrated payment gateways",
    description:
      "Integration with Stripe, MercadoPago, PayU and local gateways for secure payments with multiple payment methods.",
  },
  {
    icon: "package-check",
    title: "ERP and logistics integration",
    description:
      "Connection to SAP, Oracle, Odoo and logistics systems to keep inventory, orders and fulfilment in sync.",
  },
];

const HERO_OPTIONS_ES = [
  {
    icon: "🛒",
    label: "B2C Tienda",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Tienda directa al consumidor con checkout optimizado",
  },
  {
    icon: "🏢",
    label: "B2B Portal",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Portal mayorista con precios por cliente y crédito",
  },
  {
    icon: "🏪",
    label: "Marketplace",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Multi-vendedor con comisiones y panel de sellers",
  },
  {
    icon: "⚡",
    label: "Headless commerce",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "API-first para frontend custom o multi-canal",
  },
];

const HERO_OPTIONS_EN = [
  {
    icon: "🛒",
    label: "B2C store",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Direct-to-consumer store with an optimised checkout",
  },
  {
    icon: "🏢",
    label: "B2B portal",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Wholesale portal with per-customer pricing and credit",
  },
  {
    icon: "🏪",
    label: "Marketplace",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Multi-vendor with commissions and a seller panel",
  },
  {
    icon: "⚡",
    label: "Headless commerce",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "API-first for a custom or multi-channel frontend",
  },
];

const COMPARISON_ROWS_ES = [
  {
    criterion: "Comisiones por transacción",
    alternative: "0.5-2% por transacción (para siempre)",
    nivelics: "Cero comisiones — 100% de cada venta es tuya",
  },
  {
    criterion: "Personalización del checkout",
    alternative: "Muy limitada por la plataforma",
    nivelics: "Total — flujo de compra diseñado para tu negocio",
  },
  {
    criterion: "Integraciones ERP / WMS / CRM",
    alternative: "Conectores genéricos con limitaciones",
    nivelics: "Integración real con tus sistemas actuales",
  },
  {
    criterion: "Control de datos del cliente",
    alternative: "Limitado — la plataforma tiene acceso",
    nivelics: "100% tuyo — en tu infraestructura",
  },
  {
    criterion: "Escalabilidad a alto volumen",
    alternative: "Costosa — plan enterprise muy caro",
    nivelics: "Auto-scaling configurado desde el inicio",
  },
  {
    criterion: "Performance en picos (Black Friday)",
    alternative: "Variable según plan contratado",
    nivelics: "Arquitectura preparada para picos de tráfico",
  },
  {
    criterion: "Tiempo de lanzamiento inicial",
    alternative: "Rápido (semanas)",
    nivelics: "Más largo (meses) — pero sin deuda técnica",
  },
];

const COMPARISON_ROWS_EN = [
  {
    criterion: "Transaction commissions",
    alternative: "0.5-2% per transaction (forever)",
    nivelics: "Zero commissions — 100% of every sale is yours",
  },
  {
    criterion: "Checkout customisation",
    alternative: "Very limited by the platform",
    nivelics: "Total — a purchase flow designed for your business",
  },
  {
    criterion: "ERP / WMS / CRM integrations",
    alternative: "Generic connectors with limitations",
    nivelics: "Real integration with the systems you run today",
  },
  {
    criterion: "Control of customer data",
    alternative: "Limited — the platform has access",
    nivelics: "100% yours — on your infrastructure",
  },
  {
    criterion: "Scaling to high volume",
    alternative: "Expensive — enterprise plans cost a lot",
    nivelics: "Auto-scaling configured from day one",
  },
  {
    criterion: "Performance at peaks (Black Friday)",
    alternative: "Varies with the plan you pay for",
    nivelics: "Architecture ready for traffic peaks",
  },
  {
    criterion: "Initial launch time",
    alternative: "Fast (weeks)",
    nivelics: "Longer (months) — but with no technical debt",
  },
];

// Señales cualitativas del servicio: reemplazan la banda numérica de respaldo.
// Las cifras de uptime y de tiempo de carga que vivían en esta banda no tenían
// respaldo (no hay SLA firmado), así que el mismo mensaje va en cualitativo.
const HIGHLIGHTS_ES = [
  "Cero comisiones por venta — cada venta es 100% tuya",
  "Datos de tus clientes en tu propia infraestructura",
  "Alta disponibilidad por diseño, también en Black Friday",
  "Checkout optimizado para carga rápida en móvil",
];

const HIGHLIGHTS_EN = [
  "Zero commission per sale — every sale is 100% yours",
  "Your customers' data on your own infrastructure",
  "High availability by design, Black Friday included",
  "Checkout optimised for fast loading on mobile",
];

export default async function EcommercePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("ecommerce", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Tell us about your project" : "Cuéntanos tu proyecto",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See success stories" : "Ver casos de éxito",
      url: "/casos-de-exito",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "E-commerce Development" : "Desarrollo E-commerce",
    description: isEn
      ? "B2B and B2C digital stores with catalogue, dynamic pricing, payment gateways and ERP integration."
      : "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP.",
    url: "/servicios/desarrollo-digital/ecommerce",
    serviceType: "E-commerce Development",
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/" },
          { name: "Services", url: "/servicios" },
          { name: "Digital Development", url: "/servicios/desarrollo-digital" },
          { name: "E-commerce", url: "/servicios/desarrollo-digital/ecommerce" },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
          { name: "E-commerce", url: "/servicios/desarrollo-digital/ecommerce" },
        ],
  );

  const benefits = isEn ? BENEFITS_EN : BENEFITS_ES;

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
        badge={isEn ? "Digital Development · E-commerce" : "Desarrollo Digital · E-commerce"}
        h1={cms?.title || (isEn ? "Your online store" : "Tu tienda online")}
        h1Accent={isEn ? "with no commissions" : "sin comisiones"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Custom e-commerce with zero transaction commissions. Smart catalogue, dynamic pricing, payment gateways and a real connection to your ERP. Every sale is 100% yours."
            : "E-commerce a medida con cero comisiones por transacción. Catálogo inteligente, pricing dinámico, pasarelas de pago y conexión real con tu ERP. Cada venta es 100% tuya.")
        }
        bullets={
          isEn
            ? [
                "Zero commission per sale — unlike Shopify or WooCommerce",
                "Real integration with your ERP, WMS and CRM",
                "Architecture ready for traffic peaks (Black Friday ready)",
              ]
            : [
                "Cero comisiones por venta — a diferencia de Shopify o WooCommerce",
                "Integración real con tu ERP, WMS y CRM",
                "Arquitectura preparada para picos de tráfico (Black Friday ready)",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title={
              isEn ? "What kind of e-commerce do you need?" : "¿Qué tipo de e-commerce necesitas?"
            }
            accentColor="#06B6D4"
            options={isEn ? HERO_OPTIONS_EN : HERO_OPTIONS_ES}
          />
        }
        dataSection="ecommerce-hero"
        ariaLabel={
          isEn
            ? "Custom e-commerce — your online store with no commissions, B2C, B2B, marketplace and headless"
            : "E-commerce a medida — tu tienda online sin comisiones, B2C, B2B, marketplace y headless"
        }
      />

      {/* Métricas del CMS si las hay; si no, señales cualitativas (ver HIGHLIGHTS_*). */}
      {cms?.metrics?.length ? (
        <MetricsBar
          metrics={cms.metrics.map((m) => ({
            value: m.value,
            label: m.label,
            sublabel: "",
            unit: m.unit,
          }))}
        />
      ) : (
        <section
          aria-labelledby="ecommerce-highlights-title"
          className="border-y border-white/[0.06] py-10 md:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2
              id="ecommerce-highlights-title"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-40"
            >
              {isEn ? "What it includes" : "Lo que incluye"}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(isEn ? HIGHLIGHTS_EN : HIGHLIGHTS_ES).map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <GeoIconBox name="dia-check" size={16} color="cyan" />
                  <span className="text-sm font-medium leading-snug text-text-100">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Key benefits" : "Beneficios clave"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
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

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#06B6D4"
        titleEs="Por qué E-commerce con Nivelics"
        titleEn="Why E-commerce with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#06B6D4"
        titleEs="Cómo lo construimos"
        titleEn="How we build it"
        locale={locale}
      />

      {/* Comparison Table */}
      <ComparisonTable
        title={
          isEn
            ? "Shopify / WooCommerce vs. your own e-commerce with Nivelics?"
            : "Shopify / WooCommerce vs. e-commerce propio con Nivelics?"
        }
        alternativeLabel="Shopify / WooCommerce"
        nivelicsLabel={isEn ? "Your own e-commerce — Nivelics" : "E-commerce propio — Nivelics"}
        criterionLabel={isEn ? "Criterion" : undefined}
        rows={isEn ? COMPARISON_ROWS_EN : COMPARISON_ROWS_ES}
      />

      <CTABanner />

      <StickyMobileCta
        text={isEn ? "Tell us about your project →" : "Cuéntanos tu proyecto →"}
        url="/contacto"
        accentColor="#06B6D4"
      />
    </PageWrapper>
  );
}
