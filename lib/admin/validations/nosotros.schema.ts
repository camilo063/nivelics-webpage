import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  roleEs: z.string().optional().default(""),
  roleEn: z.string().optional().default(""),
  bioEs: z.string().optional().default(""),
  bioEn: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  isFounder: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional().default("draft"),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export const historiaItemSchema = z.object({
  year: z.number().int().min(1900, "Año inválido"),
  month: z.number().int().min(1).max(12).optional().nullable(),
  titleEs: z.string().min(1, "El título en español es requerido"),
  titleEn: z.string().optional().default(""),
  descriptionEs: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  image: z.string().optional().default(""),
  milestoneType: z
    .enum(["founding", "growth", "award", "expansion", "product"])
    .optional()
    .default("growth"),
  sortOrder: z.number().int().optional().default(0),
});

export type HistoriaItemInput = z.infer<typeof historiaItemSchema>;

export const certificacionSchema = z.object({
  nameEs: z.string().min(1, "El nombre en español es requerido"),
  nameEn: z.string().optional().default(""),
  issuer: z.string().optional().default(""),
  year: z.number().int().optional().nullable(),
  logo: z.string().optional().default(""),
  certificateUrl: z.string().optional().default(""),
  descriptionEs: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  sortOrder: z.number().int().optional().default(0),
});

export type CertificacionInput = z.infer<typeof certificacionSchema>;
