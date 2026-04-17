import { z } from "zod";

const metricItemSchema = z.object({
  value: z.string().optional().default(""),
  unit: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
});

const faqItemSchema = z.object({
  questionEs: z.string().optional().default(""),
  questionEn: z.string().optional().default(""),
  answerEs: z.string().optional().default(""),
  answerEn: z.string().optional().default(""),
});

const industriasSectionMetricSchema = z.object({
  value: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
});

const processStepSchema = z.object({
  number: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
  durationEs: z.string().optional().default(""),
  durationEn: z.string().optional().default(""),
});

// New schemas for bilingual items added in migration 0006
const mapMetricSchema = z.object({
  value: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
  sublabelEs: z.string().optional().default(""),
  sublabelEn: z.string().optional().default(""),
});

const whyUsItemSchema = z.object({
  icon: z.string().optional().default(""),
  color: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  copyEs: z.string().optional().default(""),
  copyEn: z.string().optional().default(""),
});

const finalCtaBulletSchema = z.object({
  textEs: z.string().optional().default(""),
  textEn: z.string().optional().default(""),
});

export const homeContentSchema = z.object({
  // ─── Hero ───
  heroBadgeEs: z.string().optional().default(""),
  heroBadgeEn: z.string().optional().default(""),
  heroTitleEs: z.string().optional().default(""),
  heroTitleEn: z.string().optional().default(""),
  heroSubtitleEs: z.string().optional().default(""),
  heroSubtitleEn: z.string().optional().default(""),
  heroCtaPrimaryEs: z.string().optional().default(""),
  heroCtaPrimaryEn: z.string().optional().default(""),
  heroCtaPrimaryUrl: z.string().optional().default(""),
  heroCtaSecondaryEs: z.string().optional().default(""),
  heroCtaSecondaryEn: z.string().optional().default(""),
  heroCtaSecondaryUrl: z.string().optional().default(""),
  heroImage: z.string().optional().default(""),

  // ─── Métricas globales ───
  metrics: z.array(metricItemSchema).optional().default([]),

  // ─── Trust bar ───
  trustBarLogos: z.array(z.string()).optional().default([]),
  trustBarTitleEs: z.string().optional().default(""),
  trustBarTitleEn: z.string().optional().default(""),

  // ─── Pillars ───
  servicesSectionTitleEs: z.string().optional().default(""),
  servicesSectionTitleEn: z.string().optional().default(""),
  pillarsSubtitleEs: z.string().optional().default(""),
  pillarsSubtitleEn: z.string().optional().default(""),

  // ─── Casos section ───
  casesSectionTitleEs: z.string().optional().default(""),
  casesSectionTitleEn: z.string().optional().default(""),
  casesSectionSubtitleEs: z.string().optional().default(""),
  casesSectionSubtitleEn: z.string().optional().default(""),
  casesSectionFooterEs: z.string().optional().default(""),
  casesSectionFooterEn: z.string().optional().default(""),
  casesSectionCtaEs: z.string().optional().default(""),
  casesSectionCtaEn: z.string().optional().default(""),

  // ─── Products strip ───
  productsStripTitleEs: z.string().optional().default(""),
  productsStripTitleEn: z.string().optional().default(""),
  productsStripCtaEs: z.string().optional().default(""),
  productsStripCtaEn: z.string().optional().default(""),

  // ─── Map section ───
  mapTitleEs: z.string().optional().default(""),
  mapTitleEn: z.string().optional().default(""),
  mapSubtitleEs: z.string().optional().default(""),
  mapSubtitleEn: z.string().optional().default(""),
  mapMetrics: z.array(mapMetricSchema).optional().default([]),

  // ─── Why Us ───
  whyUsTitleEs: z.string().optional().default(""),
  whyUsTitleEn: z.string().optional().default(""),
  whyUsSubtitleEs: z.string().optional().default(""),
  whyUsSubtitleEn: z.string().optional().default(""),
  whyUsItems: z.array(whyUsItemSchema).optional().default([]),

  // ─── FAQs ───
  faqsTitleEs: z.string().optional().default(""),
  faqsTitleEn: z.string().optional().default(""),
  faqs: z.array(faqItemSchema).optional().default([]),

  // ─── Final CTA ───
  finalCtaTitleEs: z.string().optional().default(""),
  finalCtaTitleEn: z.string().optional().default(""),
  finalCtaCopyEs: z.string().optional().default(""),
  finalCtaCopyEn: z.string().optional().default(""),
  finalCtaBullets: z.array(finalCtaBulletSchema).optional().default([]),
  finalCtaPrimaryEs: z.string().optional().default(""),
  finalCtaPrimaryEn: z.string().optional().default(""),
  finalCtaPrimaryUrl: z.string().optional().default(""),
  finalCtaSecondaryEs: z.string().optional().default(""),
  finalCtaSecondaryEn: z.string().optional().default(""),
  finalCtaSecondaryUrl: z.string().optional().default(""),
  finalCtaFinePrintEs: z.string().optional().default(""),
  finalCtaFinePrintEn: z.string().optional().default(""),

  // ─── Process ───
  processSectionTitleEs: z.string().optional().default(""),
  processSectionTitleEn: z.string().optional().default(""),
  processSectionSubtitleEs: z.string().optional().default(""),
  processSectionSubtitleEn: z.string().optional().default(""),
  processSteps: z.array(processStepSchema).optional().default([]),

  // ─── Hub Industrias (página /industrias) ───
  industriasHubTitleEs: z.string().optional().default(""),
  industriasHubTitleEn: z.string().optional().default(""),
  industriasHubSubtitleEs: z.string().optional().default(""),
  industriasHubSubtitleEn: z.string().optional().default(""),
  industriasHubStatEs: z.string().optional().default(""),
  industriasHubStatEn: z.string().optional().default(""),
  industriasSectionTitleEs: z.string().optional().default(""),
  industriasSectionTitleEn: z.string().optional().default(""),
  industriasSectionSubtitleEs: z.string().optional().default(""),
  industriasSectionSubtitleEn: z.string().optional().default(""),
  industriasSectionMetrics: z.array(industriasSectionMetricSchema).optional().default([]),
});

export type HomeContentInput = z.infer<typeof homeContentSchema>;
