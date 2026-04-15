import { connection } from "next/server";
import { getHomeContent } from "@/lib/admin/actions/home.actions";
import HomeForm from "@/components/admin/forms/HomeForm";

export default async function HomePage() {
  await connection();
  const content = await getHomeContent();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <HomeForm
        initialData={
          content
            ? {
                heroBadgeEs: content.heroBadgeEs || "",
                heroBadgeEn: content.heroBadgeEn || "",
                heroTitleEs: content.heroTitleEs || "",
                heroTitleEn: content.heroTitleEn || "",
                heroSubtitleEs: content.heroSubtitleEs || "",
                heroSubtitleEn: content.heroSubtitleEn || "",
                heroCtaPrimaryEs: content.heroCtaPrimaryEs || "",
                heroCtaPrimaryEn: content.heroCtaPrimaryEn || "",
                heroCtaSecondaryEs: content.heroCtaSecondaryEs || "",
                heroCtaSecondaryEn: content.heroCtaSecondaryEn || "",
                heroImage: content.heroImage || "",
                metrics:
                  (content.metrics as Array<{
                    value: string;
                    unit: string;
                    labelEs: string;
                    labelEn: string;
                  }>) || [],
                trustBarLogos: (content.trustBarLogos as string[]) || [],
                servicesSectionTitleEs: content.servicesSectionTitleEs || "",
                servicesSectionTitleEn: content.servicesSectionTitleEn || "",
                casesSectionTitleEs: content.casesSectionTitleEs || "",
                casesSectionTitleEn: content.casesSectionTitleEn || "",
                faqs:
                  (content.faqs as Array<{
                    questionEs: string;
                    questionEn: string;
                    answerEs: string;
                    answerEn: string;
                  }>) || [],
                finalCtaTitleEs: content.finalCtaTitleEs || "",
                finalCtaTitleEn: content.finalCtaTitleEn || "",
                finalCtaCopyEs: content.finalCtaCopyEs || "",
                finalCtaCopyEn: content.finalCtaCopyEn || "",
                processSectionTitleEs: content.processSectionTitleEs || "",
                processSectionTitleEn: content.processSectionTitleEn || "",
                processSectionSubtitleEs: content.processSectionSubtitleEs || "",
                processSectionSubtitleEn: content.processSectionSubtitleEn || "",
                processSteps:
                  (content.processSteps as Array<{
                    number: string;
                    icon: string;
                    titleEs: string;
                    titleEn: string;
                    descEs: string;
                    descEn: string;
                    durationEs: string;
                    durationEn: string;
                  }>) || [],
                industriasHubTitleEs: content.industriasHubTitleEs || "",
                industriasHubTitleEn: content.industriasHubTitleEn || "",
                industriasHubSubtitleEs: content.industriasHubSubtitleEs || "",
                industriasHubSubtitleEn: content.industriasHubSubtitleEn || "",
                industriasHubStatEs: content.industriasHubStatEs || "",
                industriasHubStatEn: content.industriasHubStatEn || "",
                industriasSectionTitleEs: content.industriasSectionTitleEs || "",
                industriasSectionTitleEn: content.industriasSectionTitleEn || "",
                industriasSectionSubtitleEs: content.industriasSectionSubtitleEs || "",
                industriasSectionSubtitleEn: content.industriasSectionSubtitleEn || "",
                industriasSectionMetrics:
                  (content.industriasSectionMetrics as Array<{
                    value: string;
                    labelEs: string;
                    labelEn: string;
                  }>) || [],
              }
            : undefined
        }
      />
    </div>
  );
}
