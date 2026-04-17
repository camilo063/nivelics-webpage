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
                // Hero
                heroBadgeEs: content.heroBadgeEs || "",
                heroBadgeEn: content.heroBadgeEn || "",
                heroTitleEs: content.heroTitleEs || "",
                heroTitleEn: content.heroTitleEn || "",
                heroSubtitleEs: content.heroSubtitleEs || "",
                heroSubtitleEn: content.heroSubtitleEn || "",
                heroCtaPrimaryEs: content.heroCtaPrimaryEs || "",
                heroCtaPrimaryEn: content.heroCtaPrimaryEn || "",
                heroCtaPrimaryUrl: content.heroCtaPrimaryUrl || "",
                heroCtaSecondaryEs: content.heroCtaSecondaryEs || "",
                heroCtaSecondaryEn: content.heroCtaSecondaryEn || "",
                heroCtaSecondaryUrl: content.heroCtaSecondaryUrl || "",
                heroImage: content.heroImage || "",

                // Metrics
                metrics:
                  (content.metrics as Array<{
                    value: string;
                    unit: string;
                    labelEs: string;
                    labelEn: string;
                  }>) || [],

                // Trust Bar
                trustBarLogos: (content.trustBarLogos as string[]) || [],
                trustBarTitleEs: content.trustBarTitleEs || "",
                trustBarTitleEn: content.trustBarTitleEn || "",

                // Pillars
                servicesSectionTitleEs: content.servicesSectionTitleEs || "",
                servicesSectionTitleEn: content.servicesSectionTitleEn || "",
                pillarsSubtitleEs: content.pillarsSubtitleEs || "",
                pillarsSubtitleEn: content.pillarsSubtitleEn || "",

                // Cases section
                casesSectionTitleEs: content.casesSectionTitleEs || "",
                casesSectionTitleEn: content.casesSectionTitleEn || "",
                casesSectionSubtitleEs: content.casesSectionSubtitleEs || "",
                casesSectionSubtitleEn: content.casesSectionSubtitleEn || "",
                casesSectionFooterEs: content.casesSectionFooterEs || "",
                casesSectionFooterEn: content.casesSectionFooterEn || "",
                casesSectionCtaEs: content.casesSectionCtaEs || "",
                casesSectionCtaEn: content.casesSectionCtaEn || "",

                // Products strip
                productsStripTitleEs: content.productsStripTitleEs || "",
                productsStripTitleEn: content.productsStripTitleEn || "",
                productsStripCtaEs: content.productsStripCtaEs || "",
                productsStripCtaEn: content.productsStripCtaEn || "",

                // Map
                mapTitleEs: content.mapTitleEs || "",
                mapTitleEn: content.mapTitleEn || "",
                mapSubtitleEs: content.mapSubtitleEs || "",
                mapSubtitleEn: content.mapSubtitleEn || "",
                mapMetrics: (
                  (content.mapMetrics as Array<{
                    value: string;
                    labelEs: string;
                    labelEn: string;
                    sublabelEs?: string;
                    sublabelEn?: string;
                  }> | null) || []
                ).map((m) => ({
                  value: m.value ?? "",
                  labelEs: m.labelEs ?? "",
                  labelEn: m.labelEn ?? "",
                  sublabelEs: m.sublabelEs ?? "",
                  sublabelEn: m.sublabelEn ?? "",
                })),

                // Why Us
                whyUsTitleEs: content.whyUsTitleEs || "",
                whyUsTitleEn: content.whyUsTitleEn || "",
                whyUsSubtitleEs: content.whyUsSubtitleEs || "",
                whyUsSubtitleEn: content.whyUsSubtitleEn || "",
                whyUsItems:
                  (content.whyUsItems as Array<{
                    icon: string;
                    color: string;
                    titleEs: string;
                    titleEn: string;
                    copyEs: string;
                    copyEn: string;
                  }>) || [],

                // FAQs
                faqsTitleEs: content.faqsTitleEs || "",
                faqsTitleEn: content.faqsTitleEn || "",
                faqs:
                  (content.faqs as Array<{
                    questionEs: string;
                    questionEn: string;
                    answerEs: string;
                    answerEn: string;
                  }>) || [],

                // Final CTA
                finalCtaTitleEs: content.finalCtaTitleEs || "",
                finalCtaTitleEn: content.finalCtaTitleEn || "",
                finalCtaCopyEs: content.finalCtaCopyEs || "",
                finalCtaCopyEn: content.finalCtaCopyEn || "",
                finalCtaBullets:
                  (content.finalCtaBullets as Array<{ textEs: string; textEn: string }>) || [],
                finalCtaPrimaryEs: content.finalCtaPrimaryEs || "",
                finalCtaPrimaryEn: content.finalCtaPrimaryEn || "",
                finalCtaPrimaryUrl: content.finalCtaPrimaryUrl || "",
                finalCtaSecondaryEs: content.finalCtaSecondaryEs || "",
                finalCtaSecondaryEn: content.finalCtaSecondaryEn || "",
                finalCtaSecondaryUrl: content.finalCtaSecondaryUrl || "",
                finalCtaFinePrintEs: content.finalCtaFinePrintEs || "",
                finalCtaFinePrintEn: content.finalCtaFinePrintEn || "",

                // Process
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

                // Hub Industrias
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
