import type { Metadata } from "next";
import { Smartphone, Repeat, MonitorSmartphone } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Desarrollo de Apps Móviles | iOS, Android y React Native",
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
      "Desarrollo nativo con Swift y Kotlin para apps que aprovechan al máximo las capacidades de cada plataforma.",
  },
  {
    icon: Repeat,
    title: "Cross-platform con React Native/Flutter",
    description:
      "Una sola base de código para iOS y Android con React Native o Flutter, reduciendo tiempos y costos de desarrollo.",
  },
  {
    icon: MonitorSmartphone,
    title: "UX mobile-first",
    description:
      "Diseño centrado en la experiencia móvil con gestos nativos, animaciones fluidas y rendimiento optimizado.",
  },
];

export default function AppsMovilesPage() {
  const serviceSchema = getServiceSchema({
    name: "Desarrollo de Apps Móviles",
    description:
      "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
    url: "/servicios/desarrollo-digital/apps-moviles",
    serviceType: "Mobile App Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    { name: "Apps Móviles", url: "/servicios/desarrollo-digital/apps-moviles" },
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
            Desarrollo de Apps Móviles
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al
            App Store.
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
        title="¿Por qué desarrollar tu app con Nivelics?"
        alternativeLabel="Agencia de diseño"
        extraLabel="Freelancers"
        nivelicsLabel="Nivelics"
        rows={[
          {
            criterion: "Ingeniería nativa + cross-platform",
            alternative: "Raro — foco en diseño",
            extra: "Variable — depende del perfil",
            nivelics: "React Native, Flutter, iOS, Android nativo",
          },
          {
            criterion: "QA integrado en el proceso",
            alternative: "Casi nunca incluido",
            extra: "No — el cliente testea",
            nivelics: "Sí — en cada sprint",
          },
          {
            criterion: "Entrega en sprints medibles",
            alternative: "Poco común",
            extra: "No estructurado",
            nivelics: "Demo quincenal con cliente",
          },
          {
            criterion: "Mantenimiento post-lanzamiento",
            alternative: "Costo separado y alto",
            extra: "Sin garantía real",
            nivelics: "Incluible en modelo MRR",
          },
          {
            criterion: "Propiedad del código",
            alternative: "Depende del contrato",
            extra: "Ambigua sin contrato claro",
            nivelics: "100% del cliente — siempre",
          },
          {
            criterion: "Integración backend + API",
            alternative: "Fuera de alcance generalmente",
            extra: "Limitada",
            nivelics: "Full-stack incluido",
          },
          {
            criterion: "Delivery Manager asignado",
            alternative: "No",
            extra: "No",
            nivelics: "Sí — punto de contacto único",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
