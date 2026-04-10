import { z } from "zod";

const painPointItemSchema = z.object({
  icon: z.string().optional().default(""),
  titleEs: z.string().optional().default(""),
  titleEn: z.string().optional().default(""),
  descEs: z.string().optional().default(""),
  descEn: z.string().optional().default(""),
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
});

export type IndustriaInput = z.infer<typeof industriaSchema>;
