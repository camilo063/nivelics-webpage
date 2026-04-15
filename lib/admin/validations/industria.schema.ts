import { z } from "zod";

const painPointItemSchema = z.object({
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
  statEs: z.string().optional(),
  statEn: z.string().optional(),
});

const solutionItemSchema = z.object({
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
});

const differentiatorItemSchema = z.object({
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
});

const metricItemSchema = z.object({
  value: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
});

const statHighlightSchema = z.object({
  value: z.string().optional().default(""),
  labelEs: z.string().optional().default(""),
  labelEn: z.string().optional().default(""),
  source: z.string().optional(),
});

const regulationSchema = z.object({
  code: z.string().optional().default(""),
  nameEs: z.string().optional().default(""),
  nameEn: z.string().optional().default(""),
  descEs: z.string().optional(),
  descEn: z.string().optional(),
});

const useCaseSchema = z.object({
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
  outcomeEs: z.string().optional(),
  outcomeEn: z.string().optional(),
});

const playbookStepSchema = z.object({
  number: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
});

const industryFaqSchema = z.object({
  questionEs: z.string().optional().default(""),
  questionEn: z.string().optional().default(""),
  answerEs: z.string().optional().default(""),
  answerEn: z.string().optional().default(""),
});

const techTagSchema = z.object({
  label: z.string().optional().default(""),
  category: z
    .enum(["cloud", "data", "ai", "frontend", "backend", "security", "other"])
    .optional()
    .default("other"),
});

export const industriaSchema = z.object({
  nameEs: z.string().min(1, "El nombre en español es requerido"),
  nameEn: z.string().optional().default(""),
  heroTitleEs: z.string().optional().default(""),
  heroTitleEn: z.string().optional().default(""),
  heroSubtitleEs: z.string().optional().default(""),
  heroSubtitleEn: z.string().optional().default(""),
  painPoints: z.array(painPointItemSchema).optional().default([]),
  solutions: z.array(solutionItemSchema).optional().default([]),
  casoDestacadoId: z.string().uuid().optional().nullable(),
  differentiators: z.array(differentiatorItemSchema).optional().default([]),
  ctaTextEs: z.string().optional().default(""),
  ctaTextEn: z.string().optional().default(""),
  seoTitleEs: z.string().optional().default(""),
  seoTitleEn: z.string().optional().default(""),
  seoDescriptionEs: z.string().optional().default(""),
  seoDescriptionEn: z.string().optional().default(""),
  accentColor: z.enum(["ia", "cloud", "staffing", "finops", "dev"]).optional().default("dev"),
  icon: z.string().optional().default(""),
  translationStatusEn: z
    .enum(["complete", "partial", "pending", "auto"])
    .optional()
    .default("pending"),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional().default("draft"),
  // ─── RICH FIELDS ───
  metrics: z.array(metricItemSchema).optional().default([]),
  statHighlights: z.array(statHighlightSchema).optional().default([]),
  regulations: z.array(regulationSchema).optional().default([]),
  useCases: z.array(useCaseSchema).optional().default([]),
  playbook: z.array(playbookStepSchema).optional().default([]),
  industryFaqs: z.array(industryFaqSchema).optional().default([]),
  techStack: z.array(techTagSchema).optional().default([]),
  servicesHighlight: z.array(z.string()).optional().default([]),
  relatedCaseSlugs: z.array(z.string()).optional().default([]),
  ctaTitleEs: z.string().optional().default(""),
  ctaTitleEn: z.string().optional().default(""),
  ctaPrimaryTextEs: z.string().optional().default(""),
  ctaPrimaryTextEn: z.string().optional().default(""),
  ctaPrimaryUrl: z.string().optional().default(""),
  hubIntroTitleEs: z.string().optional().default(""),
  hubIntroTitleEn: z.string().optional().default(""),
  hubIntroSubtitleEs: z.string().optional().default(""),
  hubIntroSubtitleEn: z.string().optional().default(""),
});

export type IndustriaInput = z.infer<typeof industriaSchema>;
