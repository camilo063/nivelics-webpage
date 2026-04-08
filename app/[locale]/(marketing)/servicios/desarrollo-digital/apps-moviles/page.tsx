import type { Metadata } from "next";
import { Smartphone, Repeat, MonitorSmartphone } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Desarrollo de Apps Moviles | iOS, Android y React Native",
  description:
    "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/desarrollo-digital/apps-moviles",
    languages: {
      es: "https://www.nivelics.com/servicios/desarrollo-digital/apps-moviles",
      en: "https://www.nivelics.com/en/services/digital-development/mobile-apps",
      "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/apps-moviles",
    },
  },
};

const BENEFITS = [
  {
    icon: Smartphone,
    title: "iOS y Android nativo",
    description:
      "Desarrollo nativo con Swift y Kotlin para apps que aprovechan al maximo las capacidades de cada plataforma.",
  },
  {
    icon: Repeat,
    title: "Cross-platform con React Native/Flutter",
    description:
      "Una sola base de codigo para iOS y Android con React Native o Flutter, reduciendo tiempos y costos de desarrollo.",
  },
  {
    icon: MonitorSmartphone,
    title: "UX mobile-first",
    description:
      "Diseno centrado en la experiencia movil con gestos nativos, animaciones fluidas y rendimiento optimizado.",
  },
];

export default function AppsMovilesPage() {
  const serviceSchema = getServiceSchema({
    name: "Desarrollo de Apps Moviles",
    description:
      "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
    url: "/servicios/desarrollo-digital/apps-moviles",
    serviceType: "Mobile App Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    { name: "Apps Moviles", url: "/servicios/desarrollo-digital/apps-moviles" },
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
        badge="Desarrollo Digital &middot; Mobile"
        h1="Tu app movil,"
        h1Accent="del concepto al store"
        subtitle="iOS, Android, Flutter y React Native. Construimos apps nativas y cross-platform con entregas quincenales, QA integrado y codigo 100% tuyo desde el primer sprint."
        bullets={[
          "Demo cada 2 semanas -- siempre ves avance real",
          "100% propiedad del codigo -- tuyo desde el dia uno",
          "QA integrado en cada sprint -- no al final del proyecto",
        ]}
        ctaPrimary={{ text: "Cuentanos tu proyecto", url: "/contacto" }}
        ctaSecondary={{ text: "Ver casos de exito", url: "/casos-de-exito" }}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title="Que tipo de app necesitas?"
            accentColor="#06B6D4"
            options={[
              {
                icon: "\uD83C\uDF4E",
                label: "iOS nativo",
                url: "/servicios/desarrollo-digital/apps-moviles",
                description: "Swift y SwiftUI para maximo rendimiento Apple",
              },
              {
                icon: "\uD83E\uDD16",
                label: "Android nativo",
                url: "/servicios/desarrollo-digital/apps-moviles",
                description: "Kotlin y Jetpack Compose para el ecosistema Google",
              },
              {
                icon: "\uD83E\uDD8B",
                label: "Flutter cross-platform",
                url: "/servicios/desarrollo-digital/apps-moviles",
                description: "Una base de codigo, iOS + Android con Flutter",
              },
              {
                icon: "\u269B\uFE0F",
                label: "React Native",
                url: "/servicios/desarrollo-digital/apps-moviles",
                description: "JavaScript/TypeScript para iOS y Android",
              },
            ]}
          />
        }
        dataSection="apps-moviles-hero"
        ariaLabel="Desarrollo de apps moviles -- del concepto al store, iOS, Android, Flutter y React Native"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={[
          { value: "50+", label: "Apps entregadas", sublabel: "iOS, Android y cross-platform" },
          { value: "2", label: "Semanas por sprint", sublabel: "demo quincenal con cliente" },
          { value: "100%", label: "Propiedad del codigo", sublabel: "siempre del cliente" },
          { value: "4.8", label: "Rating promedio en stores", sublabel: "App Store y Google Play" },
        ]}
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
        title="Por que desarrollar tu app con Nivelics?"
        alternativeLabel="Agencia de diseno"
        extraLabel="Freelancers"
        nivelicsLabel="Nivelics"
        rows={[
          {
            criterion: "Ingenieria nativa + cross-platform",
            alternative: "Raro -- foco en diseno",
            extra: "Variable -- depende del perfil",
            nivelics: "React Native, Flutter, iOS, Android nativo",
          },
          {
            criterion: "QA integrado en el proceso",
            alternative: "Casi nunca incluido",
            extra: "No -- el cliente testea",
            nivelics: "Si -- en cada sprint",
          },
          {
            criterion: "Entrega en sprints medibles",
            alternative: "Poco comun",
            extra: "No estructurado",
            nivelics: "Demo quincenal con cliente",
          },
          {
            criterion: "Mantenimiento post-lanzamiento",
            alternative: "Costo separado y alto",
            extra: "Sin garantia real",
            nivelics: "Incluible en modelo MRR",
          },
          {
            criterion: "Propiedad del codigo",
            alternative: "Depende del contrato",
            extra: "Ambigua sin contrato claro",
            nivelics: "100% del cliente -- siempre",
          },
          {
            criterion: "Integracion backend + API",
            alternative: "Fuera de alcance generalmente",
            extra: "Limitada",
            nivelics: "Full-stack incluido",
          },
          {
            criterion: "Delivery Manager asignado",
            alternative: "No",
            extra: "No",
            nivelics: "Si -- punto de contacto unico",
          },
        ]}
      />

      <CTABanner />

      <StickyMobileCta text="Cuentanos tu proyecto \u2192" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
