import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Cloud, Server, Shield, Zap, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "Servicios Cloud AWS · GCP · Azure | Migración y FinOps",
  description:
    "Arquitectura multi-cloud, migración, DevOps y optimización de costos con enfoque FinOps.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios/cloud",
    languages: {
      es: "https://www.nivelics.com/servicios/cloud",
      en: "https://www.nivelics.com/en/services/cloud",
      "x-default": "https://www.nivelics.com/servicios/cloud",
    },
  },
};

const SUB_SERVICES = [
  {
    icon: DollarSign,
    title: "FinOps",
    description:
      "Optimización y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento.",
    href: "/servicios/cloud/finops",
  },
  {
    icon: Cloud,
    title: "Migración a AWS",
    description:
      "Migración de workloads on-premise a la nube con zero downtime y estrategia de rollback.",
    href: "/servicios/cloud/migracion-aws",
  },
  {
    icon: Server,
    title: "Infraestructura Cloud",
    description:
      "Diseño e implementación de arquitecturas en AWS, Azure y GCP con alta disponibilidad.",
    href: "/servicios/cloud/infraestructura",
  },
  {
    icon: Shield,
    title: "Seguridad Cloud",
    description:
      "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end.",
    href: "/servicios/cloud/seguridad",
  },
  {
    icon: Zap,
    title: "Serverless",
    description:
      "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Paga solo por lo que usas.",
    href: "/servicios/cloud/serverless",
  },
];

export default function CloudPage() {
  const serviceSchema = getServiceSchema({
    name: "Cloud Computing (AWS, GCP, Azure)",
    description:
      "Arquitectura multi-cloud, migración, DevOps, SRE y optimización de costos con enfoque FinOps.",
    url: "/servicios/cloud",
    serviceType: "Cloud Computing Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
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
                question: "¿En qué plataformas cloud trabaja Nivelics?",
                answer:
                  "Trabajamos con AWS, Google Cloud Platform (GCP) y Microsoft Azure. Diseñamos arquitecturas multi-cloud y ayudamos a elegir la plataforma ideal según los requerimientos técnicos, de compliance y de costos de cada proyecto.",
              },
              {
                question: "¿Cuánto tarda una migración a la nube?",
                answer:
                  "Depende del tamaño y complejidad de los workloads. Migraciones de aplicaciones individuales pueden completarse en 2-4 semanas. Migraciones empresariales completas suelen tomar entre 3 y 6 meses con estrategia de zero downtime y rollback.",
              },
              {
                question: "¿Qué es FinOps y cómo reduce costos cloud?",
                answer:
                  "FinOps es la práctica de gobernanza financiera del gasto en cloud. Incluye visibilidad del consumo, rightsizing, reserved instances, eliminación de recursos huérfanos y políticas automatizadas. Nuestros clientes logran ahorros típicos del 30-40%.",
              },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <HeroSplit
        badge="Cloud · AWS · GCP · Azure"
        h1="Cloud con gobierno real"
        h1Accent="y 40% menos de costos"
        subtitle="Diseñamos, migramos y operamos tu infraestructura cloud con las mejores prácticas de la industria. FinOps desde el día uno."
        bullets={[
          "30-40% reducción de gasto cloud en 90 días",
          "Migraciones con zero downtime garantizado",
          "SLA de uptime 99.9% en operación continua",
        ]}
        ctaPrimary={{ text: "Solicitar auditoría gratuita", url: "/contacto" }}
        ctaSecondary={{ text: "Ver caso de ahorro real", url: "/casos-de-exito" }}
        accentColor="#3B82F6"
        rightPanel={<HeroCalculator type="cloud" accentColor="#3B82F6" />}
        dataSection="cloud-hero"
        ariaLabel="Cloud con gobierno real — AWS, GCP y Azure con FinOps real, 40% reducción de gasto cloud promedio"
      />

      <MetricsBar
        metrics={[
          {
            value: "40%",
            label: "Reducción gasto cloud",
            sublabel: "promedio en proyectos FinOps",
          },
          { value: "3-6", label: "Meses a migración completa", sublabel: "con zero downtime" },
          { value: "99.9%", label: "SLA de uptime", sublabel: "en operación de infraestructura" },
          {
            value: "0",
            label: "Downtime en migraciones",
            sublabel: "estrategia de rollback siempre activa",
          },
        ]}
      />

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones Cloud especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cloud/10">
                    <Icon size={24} className="text-blue-400" aria-hidden="true" />
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

      <ClientLogosBar
        title="Cloud gestionado para"
        logos={[
          { name: "Televisa / N+", sector: "Medios" },
          { name: "Grupo Bolívar", sector: "Fintech" },
          { name: "Two Maids", sector: "Servicios" },
          { name: "Pulzo", sector: "Medios digitales" },
          { name: "AB InBev-Bavaria", sector: "CPG" },
        ]}
      />

      <ProcessTimeline
        title="Proceso FinOps en 6 semanas"
        accentColor="#3B82F6"
        steps={[
          {
            number: "01",
            title: "Discovery y auditoría",
            description:
              "Analizamos tu factura cloud, identificamos recursos huérfanos y oportunidades de optimización.",
            duration: "Semana 1-2",
            deliverable: "Reporte de auditoría + quick wins identificados",
          },
          {
            number: "02",
            title: "Quick wins",
            description:
              "Eliminamos recursos sin uso, optimizamos instancias y configuramos Reserved Instances.",
            duration: "Semana 3-4",
            deliverable: "Primeros ahorros visibles en factura",
          },
          {
            number: "03",
            title: "Gobierno y automatización",
            description: "Tagging, budgets, alertas automáticas y dashboard en tiempo real.",
            duration: "Semana 5-6",
            deliverable: "Sistema de gobierno operativo",
          },
          {
            number: "04",
            title: "Operación continua",
            description: "Revisión mensual, ajustes proactivos y reporte de ahorro acumulado.",
            duration: "MRR",
            deliverable: "Reporte mensual con ROI documentado",
          },
        ]}
      />

      <TechStackGrid
        title="Herramientas que usamos"
        categories={[
          { name: "IaC", items: ["Terraform", "AWS CDK", "Pulumi", "CloudFormation"] },
          { name: "Observabilidad", items: ["Datadog", "Grafana", "Prometheus", "CloudWatch"] },
          { name: "Seguridad", items: ["GuardDuty", "Security Hub", "Vault", "AWS WAF"] },
          { name: "FinOps", items: ["AWS Cost Explorer", "GCP Cost Management", "Spot.io"] },
          { name: "CI/CD", items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Jenkins"] },
          { name: "Containers", items: ["Kubernetes", "EKS", "GKE", "Docker", "Helm"] },
        ]}
      />

      <FAQAccordion
        title="Preguntas frecuentes sobre Cloud"
        schemaEnabled
        faqs={[
          {
            question: "¿Cuánto puedo ahorrar con FinOps?",
            answer:
              "El promedio en nuestros proyectos es 30-40% de reducción en la factura cloud en los primeros 90 días. El rango varía según el nivel de optimización previo. En la auditoría inicial (gratuita) te damos una proyección concreta basada en tu factura actual.",
          },
          {
            question: "¿Cuánto tiempo toma una migración a AWS?",
            answer:
              "Entre 3 y 6 meses para la mayoría de los proyectos, dependiendo del tamaño del ambiente y las interdependencias. Trabajamos con estrategia de rollback en todas las migraciones para garantizar zero downtime.",
          },
          {
            question: "¿Necesito cambiar todo a la vez o puedo migrar gradualmente?",
            answer:
              "Migración gradual es nuestro enfoque recomendado. Empezamos por las cargas de trabajo menos críticas, validamos el proceso y escalamos. Nunca exponemos el negocio a un riesgo innecesario.",
          },
          {
            question: "¿Pueden gestionar nuestra infraestructura existente en AWS?",
            answer:
              "Sí. Hacemos una auditoría del ambiente actual, identificamos oportunidades de mejora y asumimos la operación. El proceso de onboarding típicamente toma 2-3 semanas.",
          },
          {
            question: "¿Trabajan solo con AWS o también con GCP y Azure?",
            answer:
              "Las tres. Aunque nuestra mayor experiencia y certificaciones son en AWS, tenemos proyectos activos en GCP (especialmente con Vertex AI y BigQuery) y Azure (con Azure OpenAI). Multi-cloud también.",
          },
        ]}
      />

      <InlineContactForm
        title="¿Tu factura cloud está creciendo?"
        subtitle="Analizamos tu gasto actual y te mostramos dónde está el ahorro."
        serviceDefault="cloud"
      />
    </PageWrapper>
  );
}
