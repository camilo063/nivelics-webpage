import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Palette, Cloud, Brain, ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "Staff Augmentation Premium Colombia | Talento Tech LATAM",
  description:
    "Equipos de ingeniería on-demand con talento senior verificado. Integración en 6 días hábiles. Ahorro hasta 40% vs. USA/Europa.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/staff-augmentation",
    languages: {
      es: "https://www.nivelics.com/servicios/staff-augmentation",
      en: "https://www.nivelics.com/en/services/staff-augmentation",
      "x-default": "https://www.nivelics.com/servicios/staff-augmentation",
    },
  },
};

const SUB_SERVICES = [
  {
    icon: Code2,
    title: "Desarrollo de Software",
    description:
      "Backend, Frontend y Full-Stack engineers senior con React, Node.js, Python, Java y Go.",
    href: "/servicios/staff-augmentation/desarrollo-software",
  },
  {
    icon: Brain,
    title: "Datos e IA",
    description:
      "Data Scientists, Data Engineers y ML Engineers para analítica avanzada y machine learning.",
    href: "/servicios/staff-augmentation/datos-ia",
  },
  {
    icon: Cloud,
    title: "DevOps y Cloud",
    description: "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure.",
    href: "/servicios/staff-augmentation/devops-cloud",
  },
  {
    icon: Palette,
    title: "Diseño UX/UI",
    description:
      "Product designers senior con experiencia en design systems, research y prototipado.",
    href: "/servicios/staff-augmentation/diseno-ux-ui",
  },
  {
    icon: ShieldCheck,
    title: "QA y Ciberseguridad",
    description:
      "QA Engineers, SDET y especialistas en ciberseguridad. Calidad garantizada en cada sprint.",
    href: "/servicios/staff-augmentation/qa-seguridad",
  },
];

export default function StaffAugmentationPage() {
  const serviceSchema = getServiceSchema({
    name: "Staff Augmentation Premium",
    description:
      "Talento tech colombiano bilingüe senior. Integración en 6 días hábiles. Ahorro hasta 40% vs. USA/Europa.",
    url: "/servicios/staff-augmentation",
    serviceType: "Staff Augmentation",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getFAQSchema([
              {
                question: "¿Cuánto tarda Nivelics en presentar candidatos de Staff Augmentation?",
                answer:
                  "Presentamos candidatos calificados en 5 días hábiles. Cada perfil pasa por pruebas técnicas y validación de soft skills antes de ser presentado. La integración completa al equipo del cliente se logra en 6 días hábiles.",
              },
              {
                question: "¿Qué garantía ofrece Nivelics si el candidato no funciona?",
                answer:
                  "Ofrecemos garantía de reemplazo sin costo en menos de 10 días. Además, asignamos un Delivery Manager dedicado que acompaña al profesional durante todo el engagement para asegurar calidad y alineación.",
              },
              {
                question: "¿Qué roles tech ofrece Nivelics en Staff Augmentation?",
                answer:
                  "Ofrecemos Frontend y Backend Engineers, Mobile Developers, DevOps y Cloud Engineers, Data y ML Engineers, QA Engineers, Tech Leads, Architects, Product Managers y Scrum Masters, todos con seniority verificado.",
              },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-staffing/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="staffing">Staff Augmentation</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Talento tech{" "}
            <span className="bg-gradient-to-r from-staffing to-primary bg-clip-text text-transparent">
              on-demand y verificado
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Escalá tu capacidad de engineering con profesionales senior que se integran a tu cultura
            y procesos desde el día uno.
          </p>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Perfiles especializados</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-staffing/10">
                    <Icon size={24} className="text-staffing" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Conocer más <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="¿Por qué Nivelics vs. contratar directamente?"
        alternativeLabel="Contratar directo en USA/Europa"
        nivelicsLabel="Nivelics Staff Augmentation"
        rows={[
          {
            criterion: "Tiempo hasta primer candidato",
            alternative: "4–8 semanas",
            nivelics: "5 días hábiles",
          },
          {
            criterion: "Costo mensual (perfil senior)",
            alternative: "$12,000–$18,000 USD",
            nivelics: "Hasta 40% menos",
          },
          {
            criterion: "Riesgo de contratación",
            alternative: "Alto — costo de despido, beneficios",
            nivelics: "Cero — sin relación laboral directa",
          },
          {
            criterion: "Garantía de reemplazo",
            alternative: "No existe",
            nivelics: "Sin costo, en menos de 10 días",
          },
          {
            criterion: "Propiedad intelectual",
            alternative: "Puede ser ambigua",
            nivelics: "100% del cliente, siempre",
          },
          {
            criterion: "Perfiles validados",
            alternative: "Proceso interno del cliente",
            nivelics: "100% validados por Nivelics",
          },
          {
            criterion: "Bilingüe español/inglés",
            alternative: "Depende del mercado",
            nivelics: "Sí, todos los perfiles",
          },
          {
            criterion: "Delivery Manager incluido",
            alternative: "No",
            nivelics: "Sí, sin costo adicional",
          },
        ]}
      />

      <CTABanner
        title="¿Necesitas ampliar tu equipo tech?"
        description="Cuéntanos tu necesidad y en 48 horas te presentamos candidatos verificados."
        buttonText="Solicitar talento"
      />
    </PageWrapper>
  );
}
