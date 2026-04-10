import type { Metadata } from "next";
import { Award, GitBranch, Container } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("devops-cloud", locale);
  return {
    title: cms?.seoTitle || "DevOps e Infraestructura | Cloud Architects Certificados",
    description:
      cms?.seoDescription ||
      "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/staff-augmentation/devops-cloud",
      languages: {
        es: "https://www.nivelics.com/servicios/staff-augmentation/devops-cloud",
        en: "https://www.nivelics.com/en/services/staff-augmentation/devops-cloud",
        "x-default": "https://www.nivelics.com/servicios/staff-augmentation/devops-cloud",
      },
    },
  };
}

const BENEFITS = [
  {
    icon: Award,
    title: "Certificaciones AWS/GCP/Azure",
    description:
      "Ingenieros con certificaciones oficiales de los principales proveedores cloud, garantizando mejores prácticas en cada proyecto.",
  },
  {
    icon: GitBranch,
    title: "CI/CD y GitOps",
    description:
      "Implementación de pipelines de integración y despliegue continuo con GitHub Actions, GitLab CI, ArgoCD y FluxCD.",
  },
  {
    icon: Container,
    title: "Kubernetes y contenedores",
    description:
      "Orquestación de contenedores con Kubernetes (EKS, GKE, AKS), Docker, Helm y service mesh para microservicios.",
  },
];

const DEVOPS_ROLES = [
  {
    icon: "\u2601\uFE0F",
    label: "Cloud Architect",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "AWS, GCP, Azure, diseño de infraestructura",
  },
  {
    icon: "\u{1F504}",
    label: "DevOps Engineer",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "CI/CD, Terraform, Ansible, automatización",
  },
  {
    icon: "\u2699\uFE0F",
    label: "SRE (Site Reliability)",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "Observabilidad, SLOs, incident management",
  },
  {
    icon: "\u{1F4E6}",
    label: "Platform Engineer",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "Kubernetes, Helm, service mesh, IDP",
  },
];

export default async function DevOpsCloudPage() {
  const locale = (await getLocale()) as Locale;
  const cms = await getServicioData("devops-cloud", locale);
  const serviceSchema = getServiceSchema({
    name: "DevOps e Infraestructura",
    description:
      "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes.",
    url: "/servicios/staff-augmentation/devops-cloud",
    serviceType: "Staff Augmentation",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
    { name: "DevOps e Infraestructura", url: "/servicios/staff-augmentation/devops-cloud" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{
          name: "Staff Augmentation",
          nameEn: "Staff Augmentation",
          accentColor: "#10B981",
        }}
        siblings={[
          {
            name: "Desarrollo de Software",
            nameEn: "Software Development",
            url: "/servicios/staff-augmentation/desarrollo-software",
            urlEn: "/en/services/staff-augmentation/software-development",
          },
          {
            name: "Datos e IA",
            nameEn: "Data & AI",
            url: "/servicios/staff-augmentation/datos-ia",
            urlEn: "/en/services/staff-augmentation/data-ai",
          },
          {
            name: "DevOps & Cloud",
            nameEn: "DevOps & Cloud",
            url: "/servicios/staff-augmentation/devops-cloud",
            urlEn: "/en/services/staff-augmentation/devops-cloud",
          },
          {
            name: "Diseño UX/UI",
            nameEn: "UX/UI Design",
            url: "/servicios/staff-augmentation/diseno-ux-ui",
            urlEn: "/en/services/staff-augmentation/ux-ui-design",
          },
          {
            name: "QA & Seguridad",
            nameEn: "QA & Security",
            url: "/servicios/staff-augmentation/qa-seguridad",
            urlEn: "/en/services/staff-augmentation/qa-security",
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

      <HeroSplit
        badge="Staff Aug · DevOps"
        h1={cms?.title || "DevOps senior"}
        h1Accent="integrado en días"
        subtitle={
          cms?.subtitle ||
          "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes y observabilidad para tu equipo."
        }
        bullets={[
          "Candidatos presentados en 5 días hábiles",
          "Ahorro de hasta 40% vs contratar en USA",
          "Garantía de reemplazo sin costo en 10 días",
        ]}
        ctaPrimary={{ text: "Ver perfiles disponibles", url: "/contacto" }}
        ctaSecondary={{ text: "Conoce el proceso", url: "/servicios/staff-augmentation" }}
        accentColor="#10B981"
        rightPanel={
          <HeroSelector
            title="Selecciona el rol que necesitas"
            options={DEVOPS_ROLES}
            accentColor="#10B981"
          />
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                { value: "5", label: "Días hábiles", sublabel: "Hasta primer candidato" },
                { value: "40%", label: "Ahorro promedio", sublabel: "vs contratar en USA" },
                { value: "10", label: "Días garantía", sublabel: "Reemplazo sin costo" },
                { value: "100%", label: "Bilingüe", sublabel: "Español e inglés" },
              ]
        }
      />

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Beneficios clave</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-staffing/10">
                    <Icon size={24} className="text-staffing" aria-hidden="true" />
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

      <CTABanner />
      <StickyMobileCta text="Ver perfiles →" url="/contacto" accentColor="#10B981" />
    </PageWrapper>
  );
}
