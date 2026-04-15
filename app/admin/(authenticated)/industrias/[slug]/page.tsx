import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getIndustria } from "@/lib/admin/actions/industrias.actions";
import IndustriaForm from "@/components/admin/forms/IndustriaForm";

type PainPointRaw = {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  statEs?: string;
  statEn?: string;
};
type SimpleItem = {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
};
type DiffItem = { titleEs: string; titleEn: string; descEs: string; descEn: string };
type MetricItem = { value: string; labelEs: string; labelEn: string };
type StatItem = { value: string; labelEs: string; labelEn: string; source?: string };
type RegulationItem = {
  code: string;
  nameEs: string;
  nameEn: string;
  descEs?: string;
  descEn?: string;
};
type UseCaseItem = {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  outcomeEs?: string;
  outcomeEn?: string;
};
type PlaybookItem = {
  number: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
};
type FaqItem = { questionEs: string; questionEn: string; answerEs: string; answerEn: string };
type TechItem = {
  label: string;
  category: "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";
};

export default async function EditIndustriaPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const industria = await getIndustria(slug);

  if (!industria) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar industria: {industria.nameEs}</h1>
      <IndustriaForm
        initialData={{
          slugEs: industria.slugEs,
          nameEs: industria.nameEs,
          nameEn: industria.nameEn || "",
          heroTitleEs: industria.heroTitleEs || "",
          heroTitleEn: industria.heroTitleEn || "",
          heroSubtitleEs: industria.heroSubtitleEs || "",
          heroSubtitleEn: industria.heroSubtitleEn || "",
          painPoints: (industria.painPoints as PainPointRaw[]) || [],
          solutions: (industria.solutions as SimpleItem[]) || [],
          casoDestacadoId: industria.casoDestacadoId || "",
          differentiators: (industria.differentiators as DiffItem[]) || [],
          ctaTextEs: industria.ctaTextEs || "",
          ctaTextEn: industria.ctaTextEn || "",
          seoTitleEs: industria.seoTitleEs || "",
          seoTitleEn: industria.seoTitleEn || "",
          seoDescriptionEs: industria.seoDescriptionEs || "",
          seoDescriptionEn: industria.seoDescriptionEn || "",
          accentColor: industria.accentColor as "ia" | "cloud" | "staffing" | "finops" | "dev",
          icon: industria.icon || "",
          translationStatusEn: industria.translationStatusEn as
            | "complete"
            | "partial"
            | "pending"
            | "auto",
          status: industria.status as "draft" | "published" | "scheduled" | "archived",
          // Rich fields
          metrics: (industria.metrics as MetricItem[]) || [],
          statHighlights: (industria.statHighlights as StatItem[]) || [],
          regulations: (industria.regulations as RegulationItem[]) || [],
          useCases: (industria.useCases as UseCaseItem[]) || [],
          playbook: (industria.playbook as PlaybookItem[]) || [],
          industryFaqs: (industria.industryFaqs as FaqItem[]) || [],
          techStack: (industria.techStack as TechItem[]) || [],
          servicesHighlight: (industria.servicesHighlight as string[]) || [],
          relatedCaseSlugs: (industria.relatedCaseSlugs as string[]) || [],
          ctaTitleEs: industria.ctaTitleEs || "",
          ctaTitleEn: industria.ctaTitleEn || "",
          ctaPrimaryTextEs: industria.ctaPrimaryTextEs || "",
          ctaPrimaryTextEn: industria.ctaPrimaryTextEn || "",
          ctaPrimaryUrl: industria.ctaPrimaryUrl || "",
          hubIntroTitleEs: industria.hubIntroTitleEs || "",
          hubIntroTitleEn: industria.hubIntroTitleEn || "",
          hubIntroSubtitleEs: industria.hubIntroSubtitleEs || "",
          hubIntroSubtitleEn: industria.hubIntroSubtitleEn || "",
        }}
      />
    </div>
  );
}
