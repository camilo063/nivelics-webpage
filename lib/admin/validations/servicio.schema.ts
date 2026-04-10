import { z } from "zod";

const benefitSchema = z.object({
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  copyEs: z.string().optional().default(""),
  copyEn: z.string().optional().default(""),
});

const processStepSchema = z.object({
  number: z.number().int().min(1),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
  duration: z.string().optional().default(""),
});

const metricSchema = z.object({
  value: z.string().optional().default(""),
  unit: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
});

const faqSchema = z.object({
  questionEs: z.string().optional().default(""),
  questionEn: z.string().optional().default(""),
  answerEs: z.string().optional().default(""),
  answerEn: z.string().optional().default(""),
});

export const servicioSchema = z.object({
  titleEs: z.string().min(1, "El título en español es requerido"),
  titleEn: z.string().optional().default(""),
  subtitleEs: z.string().optional().default(""),
  subtitleEn: z.string().optional().default(""),
  descriptionEs: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  accentColor: z.enum(["ia", "cloud", "staffing", "finops", "dev"]).optional().default("dev"),
  icon: z.string().optional().default(""),
  benefits: z.array(benefitSchema).optional().default([]),
  processSteps: z.array(processStepSchema).optional().default([]),
  metrics: z.array(metricSchema).optional().default([]),
  faqs: z.array(faqSchema).optional().default([]),
  ctaPrimaryTextEs: z.string().optional().default(""),
  ctaPrimaryTextEn: z.string().optional().default(""),
  ctaPrimaryUrl: z.string().optional().default(""),
  ctaSecondaryTextEs: z.string().optional().default(""),
  ctaSecondaryTextEn: z.string().optional().default(""),
  ctaSecondaryUrl: z.string().optional().default(""),
  seoTitleEs: z.string().optional().default(""),
  seoTitleEn: z.string().optional().default(""),
  seoDescriptionEs: z.string().optional().default(""),
  seoDescriptionEn: z.string().optional().default(""),
  translationStatusEn: z
    .enum(["complete", "partial", "pending", "auto"])
    .optional()
    .default("pending"),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional().default("published"),
});

export type ServicioInput = z.infer<typeof servicioSchema>;
