import type { Metadata } from "next";
import { TrendingUp, ShoppingCart, Package, Zap, Link as LinkIcon, BarChart2 } from "lucide-react";
import { LpHero } from "@/components/lp/LpHero";
import { LpNicheSection } from "@/components/lp/LpNicheSection";
import { LpMetrics } from "@/components/lp/LpMetrics";
import { LpCaseStudy } from "@/components/lp/LpCaseStudy";
import { LpValueProps } from "@/components/lp/LpValueProps";
import { LpForm } from "@/components/lp/LpForm";
import { LpFooterMin } from "@/components/lp/LpFooterMin";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

const ACCENT = "#8B5CF6";

export const metadata: Metadata = {
  title: "IA para Retail y E-Commerce | Nivelics | Colombia",
  description:
    "Agentes de IA para personalización, recuperación de carritos e inventario inteligente. Resultados en semanas. Integración con Shopify, Vtex y más.",
  alternates: {
    canonical: "https://nivelics.com/lp/ia-retail",
  },
  openGraph: {
    title: "IA para Retail y E-Commerce | Nivelics",
    description: "IA aplicada a retail: personalización, recuperación de carritos e inventario.",
    images: ["/og/lp-ia-retail.png"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nivelics",
  url: "https://nivelics.com",
  logo: "https://nivelics.com/logo.png",
  foundingDate: "2012",
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "IA para Retail y E-Commerce",
  description: "IA aplicada a retail: personalización, recuperación de carritos e inventario.",
  url: "https://nivelics.com/lp/ia-retail",
  about: {
    "@type": "Service",
    name: "IA Aplicada para Retail y E-Commerce",
    provider: {
      "@type": "Organization",
      name: "Nivelics",
      url: "https://nivelics.com",
      foundingDate: "2012",
      areaServed: ["Colombia", "USA", "México", "Argentina", "Perú"],
    },
  },
  mainEntity: {
    "@type": "ContactPage",
    url: "https://nivelics.com/lp/ia-retail#formulario",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://nivelics.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: "IA para Retail",
        item: "https://nivelics.com/lp/ia-retail",
      },
    ],
  },
};

export default function IaRetailLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <LpHero
        badge="IA Aplicada · Retail & E-Commerce"
        h1="IA para retail que vende más, predice mejor y opera sin fricciones."
        subtitle="Implementamos agentes de IA para personalización, recuperación de carrito y optimización de inventario. Tu equipo se enfoca en el negocio — la IA hace el trabajo repetitivo."
        ctaPrimary={{ text: "Hablar con un especialista en retail →", href: "#formulario" }}
        ctaSecondary={{ text: "Ver casos reales →", href: "#caso" }}
        accentColor={ACCENT}
      />

      <LpNicheSection
        accentColor={ACCENT}
        title="Los retos de retail en 2026 que la IA ya puede resolver"
        items={[
          {
            icon: TrendingUp,
            title: "Personalización a escala imposible para humanos",
            copy: "Tu catálogo tiene 50.000 SKUs. Cada cliente es diferente. La IA de recomendación opera en tiempo real — muestra el producto correcto, en el momento correcto, para cada persona.",
          },
          {
            icon: ShoppingCart,
            title: "Carritos abandonados = dinero sobre la mesa",
            copy: "El 70% de los carritos se abandona. Un agente de IA puede recuperar entre el 10 y el 25% con mensajes personalizados por canal (WhatsApp, email, push) en el momento óptimo.",
          },
          {
            icon: Package,
            title: "Inventario que se gestiona solo",
            copy: "Sobrestock y quiebre de stock cuestan millones. La IA predice la demanda con datos históricos, estacionalidad y señales externas — antes de que el problema ocurra.",
          },
        ]}
      />

      <LpMetrics
        accentColor={ACCENT}
        metrics={[
          { value: "25%", label: "Recuperación de carritos con agente IA" },
          { value: "3x", label: "ROI promedio en proyectos IA retail" },
          { value: "72h", label: "Tiempo al primer prototipo funcional" },
          { value: "0", label: "Reemplazos de personal — la IA aumenta, no reemplaza" },
        ]}
      />

      <div id="caso">
        <LpCaseStudy
          accentColor={ACCENT}
          clientName="Retailer LATAM"
          country="🇲🇽 México"
          sector="Retail / E-commerce"
          resultado="+18% conversión. Sistema de recomendación en 6 semanas."
          extracto="Retailer con 200K SKUs necesitaba personalización sin un equipo de ML propio. Implementamos motor de recomendación sobre su infraestructura AWS existente — sin migrar nada."
        />
      </div>

      <LpValueProps
        accentColor={ACCENT}
        title="¿Por qué Nivelics para IA en retail?"
        items={[
          {
            icon: Zap,
            title: "Implementación rápida, no laboratorio",
            copy: "No somos una consultora de investigación. Entregamos agentes que funcionan en producción — en semanas, no en meses.",
          },
          {
            icon: LinkIcon,
            title: "Integración con tu stack existente",
            copy: "Shopify, Vtex, Magento, plataforma propia. Nos adaptamos a lo que ya tienes — sin migraciones dolorosas.",
          },
          {
            icon: BarChart2,
            title: "ROI medible desde el día 1",
            copy: "Definimos métricas de éxito antes de empezar. Cada agente tiene un KPI asociado. Sabes exactamente cuánto vale.",
          },
        ]}
      />

      <div className="bg-[#0A0A0F] py-20 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <LpForm
            fuente="ia-retail"
            title="Cuéntanos tu reto de retail"
            subtitle="En 24h te respondemos con una propuesta inicial."
            ctaText="Hablar con un especialista →"
            accentColor={ACCENT}
            defaultServicio="IA Aplicada"
          />
        </div>
      </div>

      <LpFooterMin />
      <LpWhatsApp message="Hola, quiero información sobre IA para retail con Nivelics" />
    </>
  );
}
