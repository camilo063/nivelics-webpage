ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "industrias_section_title_es" text;--> statement-breakpoint
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "industrias_section_title_en" text;--> statement-breakpoint
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "industrias_section_subtitle_es" text;--> statement-breakpoint
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "industrias_section_subtitle_en" text;--> statement-breakpoint
ALTER TABLE "home_content" ADD COLUMN IF NOT EXISTS "industrias_section_metrics" jsonb;
