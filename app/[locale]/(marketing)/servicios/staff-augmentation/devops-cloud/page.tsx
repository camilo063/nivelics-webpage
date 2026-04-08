import type { Metadata } from "next";
import { Award, GitBranch, Container } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "DevOps e Infraestructura | Cloud Architects Certificados",
  description:
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

export default function DevOpsCloudPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-staffing/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="staffing">Staff Augmentation</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            DevOps e Infraestructura
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform,
            Kubernetes.
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
    </PageWrapper>
  );
}
