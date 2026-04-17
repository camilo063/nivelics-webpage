import { z } from "zod";

export const UI_LABEL_CATEGORIES = [
  "caso",
  "nav",
  "footer",
  "seo",
  "servicio",
  "ui_generic",
  "blog",
  "form",
] as const;

export const uiLabelSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9._-]+$/, "key only allows lowercase letters, digits, '.', '_', '-'"),
  labelEs: z.string().min(1),
  labelEn: z.string().min(1),
  category: z.enum(UI_LABEL_CATEGORIES),
  description: z.string().optional().default(""),
});

export const uiLabelUpdateSchema = uiLabelSchema.partial({ key: true });

export type UiLabelInput = z.infer<typeof uiLabelSchema>;
export type UiLabelUpdateInput = z.infer<typeof uiLabelUpdateSchema>;
