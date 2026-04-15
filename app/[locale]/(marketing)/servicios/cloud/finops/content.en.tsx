import { DollarSign, TrendingDown, PieChart, Eye, BarChart, Settings } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

const PILLARS = [
  {
    icon: "eye",
    title: "Visibility",
    description: "Real-time dashboards of consumption by team, service and environment.",
  },
  {
    icon: "trending-down",
    title: "Optimization",
    description: "Rightsizing, reserved instances, spot fleet and orphaned resource elimination.",
  },
  {
    icon: "pie-chart",
    title: "Cost Allocation",
    description: "Tagging strategy, showback/chargeback and unit economics per product.",
  },
  {
    icon: "bar-chart",
    title: "Forecasting",
    description: "Cost projection with predictive models and anomaly alerts.",
  },
  {
    icon: "settings",
    title: "Governance",
    description: "Automated policies, budgets and expensive resource approval workflows.",
  },
  {
    icon: "dollar-sign",
    title: "FinOps Culture",
    description: "Team training, FinOps ceremonies and efficiency metrics.",
  },
];

export function FinOpsContentEn() {
  const serviceSchema = getServiceSchema({
    name: "FinOps — Cloud Financial Optimization",
    description:
      "Cloud financial governance and optimization. Typical 30-40% savings in cloud spend.",
    url: "/servicios/cloud/finops",
    serviceType: "FinOps Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/servicios" },
    { name: "Cloud", url: "/servicios/cloud" },
    { name: "FinOps", url: "/servicios/cloud/finops" },
  ]);

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: "#3B82F6" }}
        siblings={[
          {
            name: "FinOps",
            nameEn: "FinOps",
            url: "/servicios/cloud/finops",
            urlEn: "/en/services/cloud/finops",
          },
          {
            name: "Migración a AWS",
            nameEn: "AWS Migration",
            url: "/servicios/cloud/migracion-aws",
            urlEn: "/en/services/cloud/aws-migration",
          },
          {
            name: "Infraestructura",
            nameEn: "Infrastructure",
            url: "/servicios/cloud/infraestructura",
            urlEn: "/en/services/cloud/infrastructure",
          },
          {
            name: "Seguridad Cloud",
            nameEn: "Cloud Security",
            url: "/servicios/cloud/seguridad",
            urlEn: "/en/services/cloud/security",
          },
          {
            name: "Serverless",
            nameEn: "Serverless",
            url: "/servicios/cloud/serverless",
            urlEn: "/en/services/cloud/serverless",
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

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-finops/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="finops">FinOps</ServiceBadge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Optimize your cloud investment{" "}
            <span className="bg-gradient-to-r from-finops to-primary bg-clip-text text-transparent">
              by up to 40%
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            We implement FinOps practices so every dollar in the cloud generates measurable value
            for your business.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">FinOps Pillars</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => {
              const iconName = pillar.icon;
              return (
                <div key={pillar.title} className="glass glow-hover rounded-xl p-6">
                  <GeoIconBox name={iconName} size={20} color="cyan" />
                  <h3 className="text-lg font-semibold text-text-100">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Our FinOps process in 6 weeks</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Week 1-2</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Discovery</h3>
              <p className="mt-2 text-sm text-text-70">
                Current spend mapping, waste identification, benchmark against industry best
                practices.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Week 3-4</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Quick Wins</h3>
              <p className="mt-2 text-sm text-text-70">
                First savings implemented: rightsizing, reserved instances, orphaned resource
                elimination.
              </p>
            </div>
            <div className="glass glow-hover rounded-xl p-6 border-t-2 border-finops">
              <span className="font-mono text-sm font-bold text-finops">Week 5-6</span>
              <h3 className="mt-2 text-lg font-semibold text-text-100">Governance</h3>
              <p className="mt-2 text-sm text-text-70">
                Automated policies, anomaly alerts, governance dashboards and handoff to internal
                team.
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-3xl font-bold text-text-100">Typical Results</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "30-40%", label: "Cloud bill reduction" },
              { value: "2-3 wk", label: "Time to first savings" },
              { value: "5x-10x", label: "Project ROI" },
              { value: "15-30%", label: "Orphaned resources eliminated" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">{r.value}</div>
                <p className="mt-2 text-sm text-text-70">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable
        title="Why FinOps with Nivelics vs. no cloud governance?"
        alternativeLabel="Without FinOps"
        nivelicsLabel="Nivelics FinOps"
        rows={[
          {
            criterion: "Spend visibility",
            alternative: "Monthly bill hard to interpret",
            nivelics: "Real-time dashboard by team and project",
          },
          {
            criterion: "Cost reduction",
            alternative: "0% — spend keeps growing",
            nivelics: "30–40% in the first 90 days",
          },
          {
            criterion: "Orphaned architectures",
            alternative: "Frequent — nobody detects them",
            nivelics: "Eliminated in initial audit",
          },
          {
            criterion: "Anomaly alerts",
            alternative: "Manual or nonexistent",
            nivelics: "Automated with configured thresholds",
          },
          {
            criterion: "Resource rightsizing",
            alternative: "Never executed",
            nivelics: "Monthly review included",
          },
          {
            criterion: "Multi-account governance",
            alternative: "No tagging structure or budgets",
            nivelics: "Tagging, policies and budgets configured",
          },
          {
            criterion: "Time to first savings",
            alternative: "N/A",
            nivelics: "Week 2 of the engagement",
          },
          {
            criterion: "Commercial model",
            alternative: "N/A",
            nivelics: "Fixed fee + success fee on real savings",
          },
        ]}
      />

      <CTABanner
        title="How much could you save on cloud?"
        description="We'll do a free assessment of your current spend and show you savings opportunities."
        buttonText="Request assessment"
      />
    </PageWrapper>
  );
}
