// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
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
  const cms = await getServicioData("devops-cloud", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/staff-augmentation/devops-cloud",
    title:
      cms?.seoTitle ||
      (isEn
        ? "DevOps & Infrastructure | Certified Cloud Architects"
        : "DevOps e Infraestructura | Cloud Architects Certificados"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Cloud Architects and DevOps Engineers certified on AWS, GCP and Azure. CI/CD, Terraform, Kubernetes."
        : "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes."),
  });
}

const BENEFITS_ES = [
  {
    icon: "award",
    title: "Certificaciones AWS/GCP/Azure",
    description:
      "Ingenieros con certificaciones oficiales de los principales proveedores cloud, garantizando mejores prácticas en cada proyecto.",
  },
  {
    icon: "git-branch",
    title: "CI/CD y GitOps",
    description:
      "Implementación de pipelines de integración y despliegue continuo con GitHub Actions, GitLab CI, ArgoCD y FluxCD.",
  },
  {
    icon: "container",
    title: "Kubernetes y contenedores",
    description:
      "Orquestación de contenedores con Kubernetes (EKS, GKE, AKS), Docker, Helm y service mesh para microservicios.",
  },
];

const BENEFITS_EN = [
  {
    icon: "award",
    title: "AWS/GCP/Azure certifications",
    description:
      "Engineers with official certifications from the leading cloud providers, ensuring best practices on every project.",
  },
  {
    icon: "git-branch",
    title: "CI/CD and GitOps",
    description:
      "Implementation of continuous integration and deployment pipelines with GitHub Actions, GitLab CI, ArgoCD and FluxCD.",
  },
  {
    icon: "container",
    title: "Kubernetes and containers",
    description:
      "Container orchestration with Kubernetes (EKS, GKE, AKS), Docker, Helm and service mesh for microservices.",
  },
];

const DEVOPS_ROLES_ES = [
  {
    icon: "☁️",
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
    icon: "⚙️",
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

const DEVOPS_ROLES_EN = [
  {
    icon: "☁️",
    label: "Cloud Architect",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "AWS, GCP, Azure, infrastructure design",
  },
  {
    icon: "\u{1F504}",
    label: "DevOps Engineer",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "CI/CD, Terraform, Ansible, automation",
  },
  {
    icon: "⚙️",
    label: "SRE (Site Reliability)",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "Observability, SLOs, incident management",
  },
  {
    icon: "\u{1F4E6}",
    label: "Platform Engineer",
    url: "/servicios/staff-augmentation/devops-cloud",
    description: "Kubernetes, Helm, service mesh, IDP",
  },
];

const COMPARISON_ROWS_ES = [
  {
    criterion: "Tiempo hasta primer candidato",
    alternative: "4–8 semanas",
    nivelics: "5 días hábiles",
  },
  {
    criterion: "Costo mensual (perfil senior)",
    alternative: "Salario local + prestaciones + overhead de contratación",
    nivelics: "Tarifa mensual única y predecible",
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
];

const COMPARISON_ROWS_EN = [
  {
    criterion: "Time to first candidate",
    alternative: "4–8 weeks",
    nivelics: "5 business days",
  },
  {
    criterion: "Monthly cost (senior profile)",
    alternative: "Local salary + benefits + hiring overhead",
    nivelics: "A single, predictable monthly rate",
  },
  {
    criterion: "Hiring risk",
    alternative: "High — severance cost, benefits",
    nivelics: "Zero — no direct employment relationship",
  },
  {
    criterion: "Replacement guarantee",
    alternative: "Does not exist",
    nivelics: "Free of charge, in under 10 days",
  },
  {
    criterion: "Intellectual property",
    alternative: "Can be ambiguous",
    nivelics: "100% the client's, always",
  },
  {
    criterion: "Vetted profiles",
    alternative: "The client's own internal process",
    nivelics: "100% vetted by Nivelics",
  },
  {
    criterion: "Bilingual Spanish/English",
    alternative: "Depends on the market",
    nivelics: "Yes, every profile",
  },
  {
    criterion: "Delivery Manager included",
    alternative: "No",
    nivelics: "Yes, at no extra cost",
  },
];

export default async function DevOpsCloudPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("devops-cloud", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "See available profiles" : "Ver perfiles disponibles",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See how the process works" : "Conoce el proceso",
      url: "/servicios/staff-augmentation",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "DevOps and Infrastructure" : "DevOps e Infraestructura",
    description: isEn
      ? "Cloud Architects and DevOps Engineers certified on AWS, GCP and Azure. CI/CD, Terraform, Kubernetes."
      : "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes.",
    url: "/servicios/staff-augmentation/devops-cloud",
    serviceType: "Staff Augmentation",
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/" },
          { name: "Services", url: "/servicios" },
          { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
          {
            name: "DevOps & Infrastructure",
            url: "/servicios/staff-augmentation/devops-cloud",
          },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
          { name: "DevOps e Infraestructura", url: "/servicios/staff-augmentation/devops-cloud" },
        ],
  );

  const benefits = isEn ? BENEFITS_EN : BENEFITS_ES;

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
        heroEffect="particles"
        badge="Staff Aug · DevOps"
        h1={cms?.title || (isEn ? "Senior DevOps" : "DevOps senior")}
        h1Accent={isEn ? "onboarded in days" : "integrado en días"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Cloud Architects and DevOps Engineers certified on AWS, GCP and Azure. CI/CD, Terraform, Kubernetes and observability for your team."
            : "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes y observabilidad para tu equipo.")
        }
        bullets={
          isEn
            ? [
                "Candidates presented within 5 business days",
                "Predictable cost compared with hiring in the USA",
                "Free replacement guarantee within 10 days",
              ]
            : [
                "Candidatos presentados en 5 días hábiles",
                "Costo predecible frente a contratar en USA",
                "Garantía de reemplazo sin costo en 10 días",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#10B981"
        rightPanel={
          <HeroSelector
            title={isEn ? "Choose the role you need" : "Selecciona el rol que necesitas"}
            options={isEn ? DEVOPS_ROLES_EN : DEVOPS_ROLES_ES}
            accentColor="#10B981"
          />
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({
                value: m.value,
                label: m.label,
                sublabel: "",
                unit: m.unit,
              }))
            : /* LEGACY FALLBACK */ isEn
              ? [
                  { value: "5", label: "Business days", sublabel: "To the first candidate" },
                  { value: "10", label: "Days of guarantee", sublabel: "Free replacement" },
                  { value: "100%", label: "Bilingual", sublabel: "Spanish and English" },
                ]
              : [
                  { value: "5", label: "Días hábiles", sublabel: "Hasta primer candidato" },
                  { value: "10", label: "Días garantía", sublabel: "Reemplazo sin costo" },
                  { value: "100%", label: "Bilingüe", sublabel: "Español e inglés" },
                ]
        }
      />

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
                accentColor="#4ade80"
              />
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#10B981"
        titleEs="Por qué elegir DevOps & Cloud con Nivelics"
        titleEn="Why choose DevOps & Cloud with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#10B981"
        titleEs="Cómo te entregamos talento"
        titleEn="How we deliver talent"
        locale={locale}
      />

      <ComparisonTable
        title={
          isEn
            ? "Why Nivelics vs. hiring directly?"
            : "¿Por qué Nivelics vs. contratar directamente?"
        }
        alternativeLabel={
          isEn ? "Hiring directly in the USA/Europe" : "Contratar directo en USA/Europa"
        }
        nivelicsLabel="Nivelics Staff Augmentation"
        criterionLabel={isEn ? "Criterion" : undefined}
        rows={isEn ? COMPARISON_ROWS_EN : COMPARISON_ROWS_ES}
      />

      <CTABanner />
      <StickyMobileCta
        text={isEn ? "See profiles →" : "Ver perfiles →"}
        url="/contacto"
        accentColor="#10B981"
      />
    </PageWrapper>
  );
}
