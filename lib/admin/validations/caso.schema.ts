import { z } from "zod";

export const casoExitoSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  clientLogo: z.string().optional().default(""),
  clientCountry: z.string().optional().default(""),
  clientSector: z.string().optional().default(""),
  titleEs: z.string().min(1, "El título en español es requerido"),
  titleEn: z.string().optional().default(""),
  challengeEs: z.string().optional().default(""),
  challengeEn: z.string().optional().default(""),
  solutionEs: z.string().optional().default(""),
  solutionEn: z.string().optional().default(""),
  resultsEs: z.string().optional().default(""),
  resultsEn: z.string().optional().default(""),
  metric1Value: z.string().optional().default(""),
  metric1LabelEs: z.string().optional().default(""),
  metric1LabelEn: z.string().optional().default(""),
  metric2Value: z.string().optional().default(""),
  metric2LabelEs: z.string().optional().default(""),
  metric2LabelEn: z.string().optional().default(""),
  metric3Value: z.string().optional().default(""),
  metric3LabelEs: z.string().optional().default(""),
  metric3LabelEn: z.string().optional().default(""),
  testimonialQuoteEs: z.string().optional().default(""),
  testimonialQuoteEn: z.string().optional().default(""),
  testimonialAuthor: z.string().optional().default(""),
  testimonialRole: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  servicesUsed: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitleEs: z.string().optional().default(""),
  seoTitleEn: z.string().optional().default(""),
  seoDescriptionEs: z.string().optional().default(""),
  seoDescriptionEn: z.string().optional().default(""),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  translationStatusEn: z
    .enum(["complete", "partial", "pending", "auto"])
    .optional()
    .default("pending"),
  publishedAt: z.string().datetime().optional().nullable(),
});

export type CasoExitoInput = z.infer<typeof casoExitoSchema>;
