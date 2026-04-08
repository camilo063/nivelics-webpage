import type { Metadata } from "next";
import { ShoppingCart, CreditCard, PackageCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Desarrollo E-commerce | Tiendas Digitales que Venden",
  description:
    "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
    languages: {
      es: "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
      en: "https://www.nivelics.com/en/services/digital-development/ecommerce",
      "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/ecommerce",
    },
  },
};

const BENEFITS = [
  {
    icon: ShoppingCart,
    title: "Catálogo y pricing dinámico",
    description:
      "Gestión avanzada de catálogo con variantes, precios por segmento, descuentos programados y reglas de pricing dinámico.",
  },
  {
    icon: CreditCard,
    title: "Pasarelas de pago integradas",
    description:
      "Integración con Stripe, MercadoPago, PayU y pasarelas locales para pagos seguros con múltiples métodos de pago.",
  },
  {
    icon: PackageCheck,
    title: "Integración ERP y logística",
    description:
      "Conexión con SAP, Oracle, Odoo y sistemas de logística para sincronización de inventario, órdenes y fulfillment.",
  },
];

export default function EcommercePage() {
  const serviceSchema = getServiceSchema({
    name: "Desarrollo E-commerce",
    description:
      "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="dev">Desarrollo Digital</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Desarrollo E-commerce
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e
            integración ERP.
          </p>
        </div>
      </section>

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

      <ComparisonTable
        title="¿Shopify / WooCommerce vs. e-commerce propio con Nivelics?"
        alternativeLabel="Shopify / WooCommerce"
        nivelicsLabel="E-commerce propio — Nivelics"
        rows={[
          {
            criterion: "Comisiones por transacción",
            alternative: "0.5–2% por transacción (para siempre)",
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
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
