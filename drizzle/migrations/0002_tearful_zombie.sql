ALTER TABLE "site_config" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "logo_alt_es" text DEFAULT 'Nivelics';--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "logo_alt_en" text DEFAULT 'Nivelics';--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "favicon_url" text;