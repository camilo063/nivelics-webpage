import { z } from "zod";

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (usar solo letras, números y guiones)"),
  titleEs: z.string().min(1, "El título en español es requerido"),
  titleEn: z.string().optional().default(""),
  excerptEs: z.string().optional().default(""),
  excerptEn: z.string().optional().default(""),
  contentEs: z.string().optional().default(""),
  contentEn: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  coverImageAltEs: z.string().optional().default(""),
  coverImageAltEn: z.string().optional().default(""),
  categoryId: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  seoTitleEs: z.string().optional().default(""),
  seoTitleEn: z.string().optional().default(""),
  seoDescriptionEs: z.string().optional().default(""),
  seoDescriptionEn: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  readingTimeMinutes: z.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  translationStatusEn: z
    .enum(["complete", "partial", "pending", "auto"])
    .optional()
    .default("pending"),
  publishedAt: z.string().datetime().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const blogCategorySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nameEs: z.string().min(1, "El nombre en español es requerido"),
  nameEn: z.string().optional().default(""),
  color: z.string().optional().default(""),
  icon: z.string().optional().default(""),
});
