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

export const homeContentSchema = z.object({
  heroBadgeEs: z.string().optional().default(""),
  heroBadgeEn: z.string().optional().default(""),
  heroTitleEs: z.string().optional().default(""),
  heroTitleEn: z.string().optional().default(""),
  heroSubtitleEs: z.string().optional().default(""),
  heroSubtitleEn: z.string().optional().default(""),
  heroCtaPrimaryEs: z.string().optional().default(""),
  heroCtaPrimaryEn: z.string().optional().default(""),
  heroCtaSecondaryEs: z.string().optional().default(""),
  heroCtaSecondaryEn: z.string().optional().default(""),
  heroImage: z.string().optional().default(""),
  metrics: z.array(metricItemSchema).optional().default([]),
  trustBarLogos: z.array(z.string()).optional().default([]),
  servicesSectionTitleEs: z.string().optional().default(""),
  servicesSectionTitleEn: z.string().optional().default(""),
  casesSectionTitleEs: z.string().optional().default(""),
  casesSectionTitleEn: z.string().optional().default(""),
  faqs: z.array(faqItemSchema).optional().default([]),
  finalCtaTitleEs: z.string().optional().default(""),
  finalCtaTitleEn: z.string().optional().default(""),
  finalCtaCopyEs: z.string().optional().default(""),
  finalCtaCopyEn: z.string().optional().default(""),
});

export type HomeContentInput = z.infer<typeof homeContentSchema>;
