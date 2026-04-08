import type { Metadata } from "next";
import { Globe, Network, CloudCog } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Plataformas Web | Desarrollo Full-Stack Escalable",
  description:
    "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
    languages: {
      es: "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
      en: "https://www.nivelics.com/en/services/digital-development/web-platforms",
      "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/plataformas-web",
    },
  },
};

const BENEFITS = [
  {
    icon: Globe,
    title: "React y Next.js",
    description:
      "Desarrollo frontend con React y Next.js para aplicaciones web rápidas, SEO-friendly y con excelente experiencia de usuario.",
  },
  {
    icon: Network,
    title: "APIs RESTful y GraphQL",
    description:
      "Backend robusto con APIs RESTful y GraphQL diseñadas para escalabilidad, seguridad y facilidad de integración.",
  },
  {
    icon: CloudCog,
    title: "Arquitectura serverless",
    description:
      "Despliegue en arquitecturas serverless que escalan automáticamente y eliminan la gestión de infraestructura.",
  },
];

export default function PlataformasWebPage() {
  const serviceSchema = getServiceSchema({
    name: "Plataformas Web",
    description:
      "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    url: "/servicios/desarrollo-digital/plataformas-web",
    serviceType: "Web Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    { name: "Plataformas Web", url: "/servicios/desarrollo-digital/plataformas-web" },
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
            Plataformas Web
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y
            escalable.
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
        title="¿Plataforma web a medida vs. WordPress o low-code?"
        alternativeLabel="WordPress / Low-code"
        nivelicsLabel="Plataforma a medida — Nivelics"
        rows={[
          {
            criterion: "Escalabilidad técnica",
            alternative: "Limitada — plugins y templates",
            nivelics: "Arquitectura pensada para crecer desde el diseño",
          },
          {
            criterion: "Performance (Core Web Vitals)",
            alternative: "Mediocre por sobrecarga de plugins",
            nivelics: "LCP < 2s, CLS = 0 — optimizado por diseño",
          },
          {
            criterion: "Seguridad",
            alternative: "Dependiente de plugins de terceros",
            nivelics: "Hardening desde el código base",
          },
          {
            criterion: "Customización real",
            alternative: "Temas y plugins — siempre hay límites",
            nivelics: "Sin límites — código propio",
          },
          {
            criterion: "Integración con sistemas core (ERP, CRM)",
            alternative: "Conectores genéricos de mercado",
            nivelics: "APIs a medida para tus sistemas reales",
          },
          {
            criterion: "Costo de mantenimiento a 3 años",
            alternative: "Creciente — licencias, plugins, parches",
            nivelics: "Estable y predecible",
          },
          {
            criterion: "Vendor lock-in",
            alternative: "Alto — dependencia de la plataforma",
            nivelics: "Cero — código tuyo, stack estándar",
          },
        ]}
      />

      <CTABanner />
    </PageWrapper>
  );
}
