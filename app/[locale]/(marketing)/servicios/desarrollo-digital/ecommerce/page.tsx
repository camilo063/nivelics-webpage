import type { Metadata } from "next";
import { ShoppingCart, CreditCard, PackageCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
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
  const cms = await getServicioData("ecommerce", locale);
  return {
    title: cms?.seoTitle || "Desarrollo E-commerce | Tiendas Digitales que Venden",
    description:
      cms?.seoDescription ||
      "Tiendas digitales B2B y B2C con catalogo, pricing dinamico, pasarelas de pago e integracion ERP.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
      languages: {
        es: "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
        en: "https://www.nivelics.com/en/services/digital-development/ecommerce",
        "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: ShoppingCart,
    title: "Catalogo y pricing dinamico",
    description:
      "Gestion avanzada de catalogo con variantes, precios por segmento, descuentos programados y reglas de pricing dinamico.",
  },
  {
    icon: CreditCard,
    title: "Pasarelas de pago integradas",
    description:
      "Integracion con Stripe, MercadoPago, PayU y pasarelas locales para pagos seguros con multiples metodos de pago.",
  },
  {
    icon: PackageCheck,
    title: "Integracion ERP y logistica",
    description:
      "Conexion con SAP, Oracle, Odoo y sistemas de logistica para sincronizacion de inventario, ordenes y fulfillment.",
  },
];

export default async function EcommercePage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("ecommerce", locale);
  const serviceSchema = getServiceSchema({
    name: "Desarrollo E-commerce",
    description:
      "Tiendas digitales B2B y B2C con catalogo, pricing dinamico, pasarelas de pago e integracion ERP.",
    url: "/servicios/desarrollo-digital/ecommerce",
    serviceType: "E-commerce Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    { name: "E-commerce", url: "/servicios/desarrollo-digital/ecommerce" },
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
        badge="Desarrollo Digital &middot; E-commerce"
        h1={cms?.title || "Tu tienda online"}
        h1Accent="sin comisiones"
        subtitle={
          cms?.subtitle ||
          "E-commerce a medida con cero comisiones por transaccion. Catalogo inteligente, pricing dinamico, pasarelas de pago y conexion real con tu ERP. Cada venta es 100% tuya."
        }
        bullets={[
          "Cero comisiones por venta -- a diferencia de Shopify o WooCommerce",
          "Integracion real con tu ERP, WMS y CRM",
          "Arquitectura preparada para picos de trafico (Black Friday ready)",
        ]}
        ctaPrimary={{ text: "Cuentanos tu proyecto", url: "/contacto" }}
        ctaSecondary={{ text: "Ver casos de exito", url: "/casos-de-exito" }}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title="Que tipo de e-commerce necesitas?"
            accentColor="#06B6D4"
            options={[
              {
                icon: "\uD83D\uDED2",
                label: "B2C Tienda",
                url: "/servicios/desarrollo-digital/ecommerce",
                description: "Tienda directa al consumidor con checkout optimizado",
              },
              {
                icon: "\uD83C\uDFE2",
                label: "B2B Portal",
                url: "/servicios/desarrollo-digital/ecommerce",
                description: "Portal mayorista con precios por cliente y credito",
              },
              {
                icon: "\uD83C\uDFEA",
                label: "Marketplace",
                url: "/servicios/desarrollo-digital/ecommerce",
                description: "Multi-vendedor con comisiones y panel de sellers",
              },
              {
                icon: "\u26A1",
                label: "Headless commerce",
                url: "/servicios/desarrollo-digital/ecommerce",
                description: "API-first para frontend custom o multi-canal",
              },
            ]}
          />
        }
        dataSection="ecommerce-hero"
        ariaLabel="E-commerce a medida -- tu tienda online sin comisiones, B2C, B2B, marketplace y headless"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                { value: "0%", label: "Comisiones por venta", sublabel: "cada venta es 100% tuya" },
                {
                  value: "99.9%",
                  label: "Uptime garantizado",
                  sublabel: "incluso en Black Friday",
                },
                {
                  value: "100%",
                  label: "Datos del cliente tuyos",
                  sublabel: "en tu infraestructura",
                },
                { value: "<2s", label: "Tiempo de carga", sublabel: "checkout optimizado" },
              ]
        }
      />

      {/* Benefits */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                    <Icon size={24} className="text-dev" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable
        title="Shopify / WooCommerce vs. e-commerce propio con Nivelics?"
        alternativeLabel="Shopify / WooCommerce"
        nivelicsLabel="E-commerce propio -- Nivelics"
        rows={[
          {
            criterion: "Comisiones por transaccion",
            alternative: "0.5-2% por transaccion (para siempre)",
            nivelics: "Cero comisiones -- 100% de cada venta es tuya",
          },
          {
            criterion: "Personalizacion del checkout",
            alternative: "Muy limitada por la plataforma",
            nivelics: "Total -- flujo de compra disenado para tu negocio",
          },
          {
            criterion: "Integraciones ERP / WMS / CRM",
            alternative: "Conectores genericos con limitaciones",
            nivelics: "Integracion real con tus sistemas actuales",
          },
          {
            criterion: "Control de datos del cliente",
            alternative: "Limitado -- la plataforma tiene acceso",
            nivelics: "100% tuyo -- en tu infraestructura",
          },
          {
            criterion: "Escalabilidad a alto volumen",
            alternative: "Costosa -- plan enterprise muy caro",
            nivelics: "Auto-scaling configurado desde el inicio",
          },
          {
            criterion: "Performance en picos (Black Friday)",
            alternative: "Variable segun plan contratado",
            nivelics: "Arquitectura preparada para picos de trafico",
          },
          {
            criterion: "Tiempo de lanzamiento inicial",
            alternative: "Rapido (semanas)",
            nivelics: "Mas largo (meses) -- pero sin deuda tecnica",
          },
        ]}
      />

      <CTABanner />

      <StickyMobileCta text="Cuentanos tu proyecto \u2192" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
