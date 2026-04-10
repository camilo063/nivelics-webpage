import { z } from "zod";

const blockSchema = z.object({
  type: z.string().min(1),
  order: z.number().int().min(0),
  data: z.record(z.string(), z.unknown()),
});

export const landingPageSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalido"),
  campaignName: z.string().min(1, "El nombre de campana es requerido"),
  serviceType: z.enum(["ia", "cloud", "staffing", "finops", "dev"]).optional().nullable(),
  accentColor: z.enum(["ia", "cloud", "staffing", "finops", "dev"]).optional().default("dev"),
  noindex: z.boolean().optional().default(true),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  blocks: z.array(blockSchema).optional().default([]),
  formDestination: z.string().optional().default(""),
  formWebhookUrl: z.string().optional().default(""),
  whatsappMessage: z.string().optional().default(""),
  utmCampaign: z.string().optional().default(""),
  utmSource: z.string().optional().default(""),
  utmMedium: z.string().optional().default(""),
  pixelFacebook: z.boolean().optional().default(false),
  googleAdsTag: z.string().optional().default(""),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

export type LandingPageInput = z.infer<typeof landingPageSchema>;
